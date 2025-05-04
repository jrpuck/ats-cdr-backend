module.exports = {
    root: true,
    env: { node: true, es2021: true, jest: true },
    parser: '@typescript-eslint/parser',
    parserOptions: { ecmaVersion: 12, sourceType: 'module', project: './tsconfig.json' },
    plugins: ['@typescript-eslint', 'prettier'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended'
    ],
    rules: {
        'no-console': 'warn',
        'no-debugger': 'error',
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        'prettier/prettier': 'error'
    }
};
