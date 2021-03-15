/* eslint-disable */
module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'airbnb-base',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
    },
    plugins: [
        '@typescript-eslint',
    ],
    rules: {
        "indent": ["error", 4],
        "import/prefer-default-export": 0,
        "class-methods-use-this": 0,
        "no-return-await": 0, // NodeJS best practice to return await
        "no-unused-vars": 0, // @TODO: resolve type => on Entities
    },
};
