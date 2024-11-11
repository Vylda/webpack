import webpack from 'webpack';
import { merge } from 'webpack-merge';
import common from './webpack.config.common.mjs';
import ESLintPlugin from 'eslint-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const { DefinePlugin } = webpack;

const prodConfig = merge(common, {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.(css|less)$/u,
        use: [
          MiniCssExtractPlugin.loader,
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
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  'postcss-preset-env',
                  'autoprefixer',
                ],
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
      PRODUCTION: JSON.stringify(true),
    }),
    new ESLintPlugin({
      configType: 'flat',
      eslintPath: 'eslint/use-at-your-own-risk',
      extensions: ['js', 'mjs'],
      overrideConfigFile: './eslint.config.prod.mjs',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
  ],
});

export default prodConfig;
