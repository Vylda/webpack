import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import StylelintPlugin from 'stylelint-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export const directoryName = dirname(fileURLToPath(import.meta.url));

const config = {
  entry: './src/index.mjs',
  output: {
    clean: true,
    filename: 'main.js',
    path: resolve(directoryName, 'dist'),
  },
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
      {
        test: /\.(webp|png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './templates/index.html',
      title: 'První Webpack aplikace',
    }),
    new StylelintPlugin({
      extensions: ['less', 'css'],
    }),
  ],
  resolve: {
    alias: {
      Images: resolve(directoryName, 'src/images/'),
    },
    extensions: ['.js', '.mjs', '.webp'],
  },
};

export default config;
