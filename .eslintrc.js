module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: 'airbnb-base',
  rules: {
    'linebreak-style': 0,
    'func-names': 'off',
    'global-require': 'off',
    'no-param-reassign': 'off',
    'no-shadow': 'off',
    'dot-notation': 'off',
    'no-underscore-dangle': 'off',
    'class-methods-use-this': 'off',
    'no-labels': 'off',
    'no-restricted-syntax': 'off',
    'array-callback-return': 'off', // -> Francisco
    'consistent-return': 'off', // -> Francisco
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'max-len': [
      'error', {
        code: 400,
      },
    ],
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  globals: {
    'Error': true,
    'isNaN': true,
    'use': true,
    '__basedir': true,
  },
};
