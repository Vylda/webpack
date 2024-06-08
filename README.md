# Problémy

## Nefunkční import lodashe

Problém spočívá v tom, že definujeme v package.json, že budeme používat ES6 moduly `.mjs`, ale lodash je napsaný v CommonJS a mají tedy koncovku `.js`.

```json
{
  "type": "module",
}
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
