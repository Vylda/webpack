import { merge } from 'webpack-merge';
import common from './webpack.config.common.mjs';

const prodConfig = merge(common, {
  mode: 'production',
});

export default prodConfig;
