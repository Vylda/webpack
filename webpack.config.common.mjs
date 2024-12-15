import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import StylelintPlugin from 'stylelint-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export const directoryName = dirname(fileURLToPath(import.meta.url));

const config = {
  entry: {
    main: './src/index.mjs',
    page: './src/page.mjs',
  },
  output: {
    clean: true,
    filename: 'js/[name].js',
    path: resolve(directoryName, 'dist'),
    assetModuleFilename: 'assets/[name][ext]',
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
