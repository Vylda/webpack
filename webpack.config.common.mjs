import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import StylelintPlugin from 'stylelint-webpack-plugin';

export const directoryName = dirname(fileURLToPath(import.meta.url));

const config = {
  entry: './src/index.mjs',
  output: {
    path: resolve(directoryName, 'dist'),
    filename: 'main.js',
  },
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
