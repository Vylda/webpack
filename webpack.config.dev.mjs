import { join } from 'node:path';
import { merge } from 'webpack-merge';
import common, { directoryName } from './webpack.config.common.mjs';

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
});

export default devConfig;
