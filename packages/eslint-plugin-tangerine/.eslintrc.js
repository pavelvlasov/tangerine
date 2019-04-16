module.exports = {
    root: true,
    extends: ['airbnb-base', 'prettier', 'plugin:jest/recommended'],
    parser: 'babel-eslint',
    env: {
        node: true,
        'jest/globals': true
    },
    plugins: ['jest', 'prettier'],
    rules: {
        'prefer-destructuring': 'off',
        'prettier/prettier': 'error',
        'import/extensions': ['error', 'never'],
        'import/default': ['error', 'never'],
        'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
        'jest/no-disabled-tests': 'error',
        'jest/prefer-to-have-length': 'error',
        'import/prefer-default-export': 'off',
        'import/named': 'error',
        'import/no-named-as-default': 'off'
    },
    overrides: [
        {
            files: ['**/test.js', '**/*.test.js'],
            rules: {
                'global-require': 'off'
            }
        }
    ]
};
