module.exports = {
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'plugin:promise/recommended',
    'plugin:compat/recommended',
    'plugin:prettier/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    createDefaultProgram: true
  },
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    'comma-dangle': 'off',
    'import/extensions': 'off',
    '@typescript-eslint/comma-dangle': 'off',
    'linebreak-style': ['error', 'unix'],
    'prettier/prettier': 'off',
    'func-names': 'off',
    'react/function-component-definition': 'off',
    'no-underscore-dangle': 'off',
    'react/require-default-props': 'off',
    'react/react-in-jsx-scope': 'off',
    'compat/compat': 'off'
  },
  env: {
    browser: true
  }
};
