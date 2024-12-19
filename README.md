# Custom Webpack konfigurace

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
const prodConfig = merge(common, {

…

  output: {
    filename: '[name][contenthash].js',
  },

…

});
```

Od této chvíle máme všechny soubory s názvem, který se mění podle obsahu souboru a tím pádem se nebudou cachovat (s výjimkou HTML souborů).

## Rozdělení do více souborů (chunků)

[Dokumentace k rozdělení do více souborů](https://webpack.js.org/guides/code-splitting/)

Rozdělení do více souborů (chunků) je způsob, jak rozdělit kód do více souborů, aby se zrychlilo načítání stránky (zejména, pokud používáme HTTP/2). To je důležité zejména pro velké aplikace, kde je kód rozsáhlý a načítání všeho kódu v jednom souboru by trvalo dlouho.

- [Více o HTTP/2](https://developer.mozilla.org/en-US/docs/Glossary/HTTP_2)
- [Více o HTTP/2 česky](https://www.vzhurudolu.cz/prirucka/http-2)

Kód se dá rozděli několika způsoby:
1. Rozdělení kódu podle vstupních bodů (entry points) - to již máme vytvořeno v předchozích krocích.
2. Zabránění duplikacím: přes [vstupní závislosti](https://webpack.js.org/configuration/entry-context/#dependencies) anebo přes [splitChunks](https://webpack.js.org/plugins/split-chunks-plugin/#optimizationsplitchunks).
3. Dynamický import: rozdělení kódu pomocí inline funkcí v modulech (viz [dokumentace](https://webpack.js.org/guides/code-splitting/#dynamic-imports)).

Budeme se zabývat bodem 2. pomocí `splitChunks`. Přidáme tedy tento klíč do sekce `optimization` v `webpack.config.common.mjs`:

```javascript
optimization: {

…

  splitChunks: { },

…

},
```

### Co se rozděluje

V základu jsou rozdělovány pouze asynchronní chunky. Protože chceme rozdělovat veškerý kód, přidáme nastavení `chunks: 'all'`:

```javascript
splitChunks: {
  chunks: 'all',
},
```

### Node_modules chunky

Pojďme přidat do obou `js` souborů následující kód:

```javascript
import isEqual from 'lodash/isEqual';

const array1 = [1, 2, 3];
const array2 = [1, 2, 3];

const arraysIsSame = isEqual(array1, array2);

const info = document.createElement('p');
info.textContent = `Pole ${arraysIsSame ? 'jsou' : 'nejsou'} stejná.`;
app.appendChild(info);

```

Po spuštění buildu se vytvoří nový chunk, ve kterém je pouze kód pro funkci `isEqual`. Pokud bychom importovali pomocí

```javascript
import { isEqual } from 'lodash';
```

tak by se vytvořil chunk, ve kterém by byl kód pro všechny funkce z `lodash` a byl by zbytečně velký (protože by obsahoval i nepoužívané funkce).

Naimstalujme balíčedk `date-fns`:

```bash
npm install date-fns
```

a do obou souborů přidejme následující kód:

```javascript
import { format } from 'date-fns';

const date = new Date();
const formattedDate = format(date, 'dd. MM. yyyy');

const dateInfo = document.createElement('p');
dateInfo.textContent = `Dnešní datum je ${formattedDate}.`;
app.appendChild(dateInfo);
```

Po spuštění buildu se chunk obohatí o kód pro funkci `format`.

Pokud bychom chtěli, aby se vytvořil samostatný chunk pro všechny použité balíčky z `node_modules` s vlastním názbem **nodemodules**, můžeme přidat následující nastavení:

```javascript
splitChunks: {

  …

  cacheGroups: {
    nodemodules: {
      test: /[\\/]node_modules[\\/]/,
      name: 'nodemodules',
      chunks: 'all',
    },
  },
},
```

Pokud chci, aby se pro každý balíček vytvořil vlastní chunk, lze použít následující nastavení (v tomto případě pro balíček `date-fns` a `lodash`):

```javascript
cacheGroups: {
  datesfns: {
    test: /[\\/]node_modules[\\/]date-fns[\\/]/,
    name: 'datesfns',
    chunks: 'all',
  },
  lodash: {
    test: /[\\/]node_modules[\\/]lodash[\\/]/,
    name: 'lodash',
    chunks: 'all',
  },
},
```

### Chunky z JS modulů

Jednotlivé JS moduly jsou v základu rozděleny do chunků podle `entry` pointů v `webpack.config.common.mjs` (každý vybuilděný soubor spojuje do sebe importované moduly). Pokud chceme, aby se pro každý modul vytvořil samostatný chunk, můžeme použít následující nastavení:

```javascript
splitChunks: {
  …

  minChunks: 2,
},
```

Nicméně stále je tu dvakrát ten samý chunk pro modul `createImage`. To je způsobeno tím, že se tento modul importuje v obou souborech. Pokud bychom chtěli, aby se pro každý modul vytvořil samostatný chunk, ale aby se duplikace odstranily, můžeme použít následující nastavení:

```javascript
splitChunks: {
  …

  minChunks: 2,
  minSize: 0,
},
```

### Velikost chunku

Možnost `maxSize` je určena pro použití s ​​HTTP/2 a pro dlouhodobé ukládáním do cache. Může být také použit ke zmenšení velikosti souboru pro rychlejší rebuild aplikace. Maximální velikost chunku je v bytech. Pokud je chunk větší, než je tato hodnota, bude rozdělen do menších chunků.

```javascript
splitChunks: {
  …

  maxSize: 1024 * 1024 ,
},
```

Hodnota `maxSize` lze použít i v nastavení `cacheGroups`.

### Shrnutí

Nastavení `splitChunks` je velmi mocné a umožňuje nám velkou flexibilitu v tom, jak se nám kód rozdělí do více souborů. Většinou se používá v kombinaci s `cacheGroups`, kde se dá nastavit, jak se mají jednotlivé chunky pojmenovat a jak se mají vytvářet.

Nastavení zde udedené vytvoří produkční velmi malé chunky:

- kód specifický pro stránku: cca 2,7 kB
- kód pro `lodash`: cca 15 kB
- kód pro `date-fns`: cca 19 kB
- kód pro jednotlivé moduly: cca 600 B

Pravdou je, že náš projekt není příliš rozsáhlý.

## Změna cest k vygenerovaným souborům

### Javascript

V souboru `webpack.config.common.mjs` a v `webpack.config.prod.mjs` je třeba v sekci `output` změnit cesty k souborům:

```javascript
filename: 'js/[name].js',
```

```javascript
filename: 'js/[name][contenthash].js',
```

### CSS

V souboru `webpack.config.prod.mjs` je třeba v sekci `plugins` změnit cestu k CSS souborům:

```javascript
new MiniCssExtractPlugin({
  filename: 'css/[name].[contenthash].css',
}),
```

### Obrázky

V souboru `webpack.config.common.mjs` a v `webpack.config.prod.mjs` je třeba do sekce `output` přidat konfiguraci pro cesty k obrázkům:

```javascript
assetModuleFilename: 'images/[name][ext]',
```

```javascript
assetModuleFilename: 'assets/[name][contenthash][ext]',
```

## Převod px na rem - PostCSS

Instalace balíku pro převod `px` na `rem`:

```bash
npm install postcss-pxtorem --save-dev
```

V souboru `webpack.config.prod.mjs` je třeba do sekce `postcssOptions` přidat konfiguraci pro převod `px` na `rem`:

```javascript
postcssOptions: {
  plugins: [
    [

    …

      'postcss-pxtorem',
      {
        propList: ['*'],
        rootValue: 16,
      },
    ],
  ],
},
```

Výše uvedená vlastnost `propList` říká, že se mají převádět všechny vlastnosti z `px` na `rem`. Pokud byste chtěli převádět jen některé vlastnosti, můžete použít následující konfiguraci:

```javascript
propList: ['font-size', 'margin', 'padding'],
```

V souboru `headers.module.less` upravte třídu `.headerOne`:

```less
.headerOne {
  font-size: 40px;
  margin: 20px 0;
  line-height: 60px;
  color: lighten(@color-blue, 25%);
  appearance: value;

  .webpack {
    color: @color-blue;
  }
}
```

a proveďte build aplikace.

Pokud nechcete převádět pixely na `rem` v některé třídě (např. v třídě `image`), můžete přidat následující řádek do konfigurace pluginu `postcss-pxtorem` v souboru `webpack.config.prod.mjs`:

```javascript
selectorBlackList: ['image'],
```

nebo

```javascript
selectorBlackList: ['.image'],
```

nebo

```javascript
selectorBlackList: [/^\.image$/],
```

Více v dokumentaci [postcss-pxtorem](https://github.com/cuth/postcss-pxtorem#readme).

## Generování jen CSS souborů (nebo obrázků atp.)

Webpack je určen pro generování všech souborů, které jsou importovány v JS souborech. Protože naše CSS je importováno v JS souborech, je generováno vše. Tedy je nemožné generovat pouze CSS soubory (nebo assety, jako jsou obrázky atp.). Je tedy nutné vždy vygenerovat vše a následně smazat nepotřebné soubory.

### Smazání nepotřebných souborů

Ke smazání nepotřebných souborů použijeme plug`remove-files-webpack-plugin`:

```bash
npm i -D remove-files-webpack-plugin
```

Následně vytvoříme nový soubor `webpack.config.css.mjs`, který bude vycházet z `webpack.config.prod.mjs`:

```javascript
import { merge } from 'webpack-merge';
import prod from './webpack.config.prod.mjs';

const cssConfig = merge(prod, { });

export default cssConfig;
```

Potřebujeme použít nový plugim, ale nechceme, aby se nám nepoužily pluginy z produkce. proto nejdříve do souboru `webpack.config.css.mjs` přidáme pluginy z produkce :

```javascript
import { merge } from 'webpack-merge';
import prod from './webpack.config.prod.mjs';

const cssConfig = merge(prod, {
  plugins: [
    ...prod.plugins,
  ],
});

export default cssConfig;
```

Následně přidáme nový plugin:

```javascript
import { merge } from 'webpack-merge';
import RemovePlugin from 'remove-files-webpack-plugin';
import prod from './webpack.config.prod.mjs';

const cssConfig = merge(prod, {
  plugins: [
    ...prod.plugins,
    new RemovePlugin({
      after: {
        root: prod.output.path,
        include: ['./js', './assets'],
        test: [
          {
            folder: '.',
            method: (filePath) => /\.html$/.test(filePath),
          },
        ],
      },
    }),
  ],
});

export default cssConfig;
```

#### Konfigurace pluginu

- `after`: určuje, kdy se má plugin spustit (po buildu)
- `root`: kořenová složka, ve které se má plugin spustit
- `include`: složky, které se mají smazat
- `test`: testovací funkce, která určuje, které soubory se mají smazat (v tomto případě všechny HTML soubory v root složce)

Více v [dokumentaci](https://github.com/Amaimersion/remove-files-webpack-plugin/blob/master/README.md).

### Spuštění CSS buildu

Do souboru `package.json` do sekce `scripts` přidejte nový příkaz:

```json
"scripts": {
    …
    "css": "webpack --config webpack.config.css.mjs",
    …
  },
```

A následně spustě tento build:

```bash
npm run css
```

### Poznámka

Osobně mi toto nedává moc smysl, protože když změním CSS, změní se i jeho hash. Proto je lepší i při změně CSS souboru znovu vybuildit celou aplikaci.
