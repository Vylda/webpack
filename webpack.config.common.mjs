import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const __dirname = dirname(fileURLToPath(import.meta.url));

const config = {
  entry: './src/index.mjs',
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'main.js'
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
            }
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
  resolve: {
    alias: {
      Images: resolve(__dirname, 'src/images/'),
    },
  },
};

export default config;
