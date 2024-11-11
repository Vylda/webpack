/** @type {import('stylelint').Config} */

const config = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended-less',
  ],

  rules: {
    'selector-class-pattern': [
      '^([a-z][a-z0-9])([a-zA-Z0-9]+)*$',
      {
        message: (selector) => `Expected class selector "${selector}" to be camellCase`,
      },
    ],
  },
};

export default config;
