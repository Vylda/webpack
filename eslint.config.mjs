/** @type {import('eslint').Linter.FlatConfig[]} */

// import airbnb from 'eslint-config-airbnb-base';
import compat from './flatCompatibility.mjs';

const config = [
  // airbnb,
  ...compat.extends('airbnb-base'),
  {
    // ignorePatterns: [],
    // env: {
    //   browser: true,
    //   es2021: true,
    //   node: true,
    // },
    rules: {
      'brace-style': [
        'error',
        '1tbs',
      ],
      curly: [
        'error',
        'all',
      ],
      'import/order': [
        'error',
        {
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
          groups: [
            'builtin',
            'external',
            'internal',
            [
              'parent',
              'sibling',
            ],
          ],
          'newlines-between': 'never',
          pathGroups: [],
        },
      ],
      'import/extensions': [
        'error',
        'never',
        {
          mjs: 'always'
        },
      ],
      'no-await-in-loop': 'off',
      'no-console': [
        'warn',
        {
          allow: [
            'warn',
            'error',
          ],
        },
      ],
      'no-continue': 'off',
      'no-debugger': 'warn',
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              message: 'Please use lodash/module instead.',
              name: 'lodash'
            },
          ],
        },
      ],
      'no-restricted-syntax': 'off'
    },
    // overrides: [
    //   {
    //     files: ["./src/*.mjs"],
    //   },
    // ],
  }
];

export default config;
