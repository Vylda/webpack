import { join } from 'node:path';
import { merge } from 'webpack-merge';
import common, { __dirname } from './webpack.config.common.mjs';

const devConfig = merge(common, {
  mode: 'development',
  devServer: {
    historyApiFallback: true,
    open: true,
    port: 9000,
    static: [
      {
        directory: join(__dirname, "./dist/"),
        publicPath: '/', // nepovinné; defaultně je totiž '/'
      },
    ],
  },
});

export default devConfig;
