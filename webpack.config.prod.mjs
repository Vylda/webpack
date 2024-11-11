import webpack from 'webpack';
import { merge } from 'webpack-merge';
import common from './webpack.config.common.mjs';
import ESLintPlugin from 'eslint-webpack-plugin';

const { DefinePlugin } = webpack;

const prodConfig = merge(common, {
  mode: 'production',
  plugins: [
    new DefinePlugin({
      PRODUCTION: JSON.stringify(true),
    }),
    new ESLintPlugin({
      configType: 'flat',
      eslintPath: 'eslint/use-at-your-own-risk',
      extensions: ['js', 'mjs'],
      overrideConfigFile: './eslint.config.prod.mjs',
   }),
  ],
});

export default prodConfig;
