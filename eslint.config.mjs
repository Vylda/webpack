/* eslint-disable import/no-extraneous-dependencies */
/** @type {import('eslint').Linter.Config[]} */
import globals from 'globals';
import compat from './flatCompatibility.mjs';

const config = [
  ...compat.extends('airbnb-base'),
  {
    ignores: [],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    files: [
      '**/*.mjs',
    ],
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
            order: 'asc',
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
          mjs: 'always',
        },
      ],
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
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
              name: 'lodash',
            },
          ],
        },
      ],
      'no-restricted-syntax': 'off',
    },
  },
];

export default config;
