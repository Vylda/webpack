# Problémy

## Nefunkční import lodashe

Problém spočívá v tom, že definujeme v package.json, že budeme používat ES6 moduly `.mjs`, ale lodash je napsaný v CommonJS a mají tedy koncovku `.js`.

To, že používáme moduly `.mjs` definujeme v `package.json`:

```json
"type": "module",
```

Takže buď budeme dělat import takto:

```javascript
import isEqual from 'lodash/isEqual.js';
```

nebo koncovku uvádět nebudeme a Webpack si ji doplní.

```javascript
import isEqual from 'lodash/isEqual';
```

V tom případě je potřeba přidat do `webpack.config.mjs`:

```javascript
module: {
  rules: [
    {
      test: /\.mjs$/i,
      resolve: {
        byDependency: {
          esm: {
            fullySpecified: false,
          },
        },
      },
    },
  ],
},
```

Tímto říkáme, že soubory `.mjs` se mají resolvit podle závislosti; zde podle `esm` (ES6 <https://webpack.js.org/configuration/resolve/#resolvebydependency>). Dále říkáme, že soubory `.mjs` nemusí být plně specifikované (tedy včetně koncovky, viz <https://webpack.js.org/configuration/resolve/#resolvefullyspecified>).

## Update balíčků
Balíčky jsou verzovány (viz [Sémantické verzování 2.0.0](https://semver.org/lang/cs/)). Dále u všech těchto příkazů je třeba, aby balíčky již byly nainstalovány (tedy aby byly v `dependencies` nebo v `devDependencies` a byl spuštěn příkaz `npm install`).

Pokud chcete provést update balíčků, můžete použít následující příkaz:

```bash
npm update
```

Tento příkaz změní verze všech balíčků v `package-lock.json` a nainstaluje nové verze všech balíčků. Nicméně obvykle se jedná o update jen minoritní verze (desetinky ve verzi, jde o poslední update v aktuální majoritní verzi).

Pokud chci takto provést update konkrétného balíčku, mohu použít následující příkaz:

```bash
npm update lodash
```

Pokud je potřeba provést update na majoritní verzi (první číslo ve verzi), je třeba zvolit jiný přístup. Nejdříve se podívám, které balíčky jsou zastaralé:

```bash
npm outdated
```

Výstup může vypadat například takhle:

```text
Package  Current  Wanted   Latest  Location             Depended by
lodash    3.10.1  3.10.1  4.17.21  node_modules/lodash  webpack
```

Je vidět, že balíček `lodash` má aktuální verzi `3.10.1`, ale je dostupná verze `4.17.21`. Pokud chci provést update na nejnovější majoritní verzi, je třeba použít následující příkaz:

```bash
npm install lodash@latest
```

Tento příkaz změní verzi balíčku uvedenou jak v `package.json`, tak v `package-lock.json` na nejnovější majoritní verzi.

Nicméně pozor, pokud je balíček závislý na jiných balíčcích, může se stát, že po upgradu na majoritní verzi se něco rozbije. Majoritní verze mohou být totiž zpětně nekompatibilní. Proto je dobré mít napsané testy a provést je po updatu balíčků.

Pokud je třeba nainstalovat balíček v konkrétní verzi (zde například `3.10.1`), je třeba použít následující příkaz:

```bash
npm install lodash@3.10.1
```

I tento příkaz mění verzi balíčku uvedenou jak v `package.json`, tak v `package-lock.json` na zadanou verzi.

## Různé obsahy
V prvé řadě je potřeby vyrobit nový JS soubor, například `src/page.mjs`:

```javascript
import Logo from 'Images/webpack.svg';
import createImage from './createImage.mjs';
import './css/index.less';
import style from './css/headers.module.less';
import imageStyle from './css/image.module.less';

const header = document.createElement('h1');
header.className = style.headerOne;

header.appendChild(document.createTextNode('Another Webpack file'));

const app = document.querySelector('#app');
app.appendChild(header);
app.appendChild(createImage(Logo, imageStyle.withPadding));

const para = document.createElement('p');
para.textContent = `${PRODUCTION ? 'Jde' : 'Nejde'} o produkční kód.`;
app.appendChild(para);
```

Dále je potřeba upravit `webpack.config.common.mjs`, aby uměl zpracovat více `mjs` souborů do tzv. chunků:

```javascript
entry: {
  main: './src/index.mjs',
  page: './src/page.mjs',
},
output: {
  clean: true,
  filename: '[name].js',
  path: resolve(directoryName, 'dist'),
},
```

Následně je třeba vytvořit novou template stránku `src/another.html`:

```html
<!DOCTYPE html>
<html lang="cs">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>
    <%= htmlWebpackPlugin.options.title %>
  </title>
</head>

<body>
  <div id="app"></div>
</body>

</html>
```

Nyní stačí říct webpacku, že má použít tuto novou stránku a jaký chunk má pro jednotlivé stránky použít:

Upraví se sekce `plugins` v `webpack.config.common.mjs`:

```javascript
new HtmlWebpackPlugin({
  filename: 'index.html',
  template: './templates/index.html',
  title: 'První Webpack aplikace',
  chunks: ['main'],
}),
new HtmlWebpackPlugin({
  filename: 'page.html',
  template: './templates/page.html',
  title: 'Druhá Webpack aplikace',
  chunks: ['page'],
}),
```

Přidala se nová instance `HtmlWebpackPlugin` pro novou stránku `page.html` a nastavily se pro pro obě instance správné chunky a názvy vygenerovaných souborů.

## Zabránění cachování

Standardně se u klienta (případně na serveru) cachuje obsah souborů, aby se šetřila data a zrychlila se odezva. To je většinou výhodné, ale pokud se soubory mění, může být problém, že se neaktualizují, protože ivalidaci cache způsobí zejména změna jména souboru.

Naše CSS soubory se generují s názvem souboru, který je odvozen od obsahu souboru. Pokud se obsah souboru nezmění, název souboru se nezmění a prohlížeč bude stále používat starý soubor. Za to může následující nastavení v `webpack.config.prod.mjs`:

```javascript
new MiniCssExtractPlugin({
  filename: '[name].[contenthash].css',
}),
```

kde právě `[contenthash]` zajišťuje, že se název souboru změní, pokud se změní obsah souboru. Toto je tedy způsob, jak zabránit cachování souborů.

Abychom zabránili cachování i u JS souborů, můžeme přidat následující nastavení v `webpack.config.prod.mjs`:

```javascript
import { resolve } from 'node:path';
import common, { directoryName } from './webpack.config.common.mjs';

…

const prodConfig = merge(common, {

…

  output: {
    clean: true,
    filename: '[name][contenthash].js',
    path: resolve(directoryName, 'dist'),
  },

…

});
```
Od této chvíle máme všechny soubory s názvem, který se mění podle obsahu souboru a tím pádem se nebudou cachovat (s výjimkou HTML souborů).
