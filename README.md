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
