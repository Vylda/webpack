import webpack from 'webpack';
import { merge } from 'webpack-merge';
import { resolve } from 'node:path';
import common, { directoryName } from './webpack.config.common.mjs';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';

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
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin(),
      new CssMinimizerPlugin(),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.sharpMinify,
          options: {
            encodeOptions: {
              jpeg: {
                quality: 100,
              },
              webp: {
                lossless: true,
              },
              avif: {
                lossless: true,
              },
              png: {
                quality: 100,
              },
              gif: {},
            },
          },
        },
      }),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.svgoMinify,
          options: {
            encodeOptions: {
              multipass: true,
              plugins: [
                "preset-default",
              ],
            },
          },
        },
      }),
    ],
    splitChunks: {
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
      chunks: 'all',
      minChunks: 2,
      minSize: 0,
      maxSize: 1024 * 1024,
    },
  },
  output: {
    clean: true,
    filename: '[name][contenthash].js',
    path: resolve(directoryName, 'dist'),
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
