module.exports = {
  root: true,
  extends: ['airbnb-base', 'plugin:prettier/recommended', 'plugin:jest/recommended'],
  parser: 'babel-eslint',
  env: {
    node: true,
    'jest/globals': true,
  },
  plugins: ['jest', 'prettier'],
  rules: {},
  overrides: [
    {
      files: ['**/test.js', '**/*.test.js'],
      rules: {
        'global-require': 'off',
        'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
      },
    },
  ],
};
