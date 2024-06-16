import common from './eslint.config.mjs';

const config = [
  ...common,
  {
    rules: {
      'no-console': [
        'error',
        {
          allow: [
            'warn',
            'error',
          ],
        },
      ],
      'no-debugger': 'error'
    },
  },
];

export default config;
