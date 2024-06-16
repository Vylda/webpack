import { merge } from 'webpack-merge';
import common from './webpack.config.common.mjs';

const devConfig = merge(common, {
  mode: 'development',
});

export default devConfig;
