import { join } from 'node:path';
import webpack from 'webpack';
import { merge } from 'webpack-merge';
import common, { directoryName } from './webpack.config.common.mjs';
import ESLintPlugin from 'eslint-webpack-plugin';

const { DefinePlugin } = webpack;

const devConfig = merge(common, {
  mode: 'development',
  devServer: {
    historyApiFallback: true,
    open: true,
    port: 9000,
    static: [
      {
        directory: join(directoryName, './dist/'),
        publicPath: '/', // nepovinné; defaultně je totiž '/'
      },
    ],
  },
  devtool: 'eval-cheap-source-map',
  module: {
    rules: [
      {
        test: /\.(css|less)$/u,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                localIdentName: '[name]_[local]_[hash:base64:5]',
                namedExport: false,
              },
            },
          },
          'less-loader',
        ],
      },
    ],
  },
  plugins: [
    new DefinePlugin({
      PRODUCTION: JSON.stringify(false),
    }),
    new ESLintPlugin({
      configType: 'flat',
      eslintPath: 'eslint/use-at-your-own-risk',
      extensions: ['js', 'mjs'],
   }),
  ],
});

export default devConfig;
