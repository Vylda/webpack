import { merge } from 'webpack-merge';
import RemovePlugin from 'remove-files-webpack-plugin';
import prod from './webpack.config.prod.mjs';

const cssConfig = merge(prod, {
  plugins: [
    ...prod.plugins,
    new RemovePlugin({
      after: {
        root: prod.output.path,
        include: ['./js', './assets'],
        test: [
          {
            folder: '.',
            method: (filePath) => /\.html$/.test(filePath),
          },
        ],
      },
    }),
  ],
});

export default cssConfig;
