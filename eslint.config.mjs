import path from 'node:path';
import { fileURLToPath } from 'node:url';

import eslintReact from '@eslint-react/eslint-plugin';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname
});

export default [
  {
    ignores: [
      'logs/**',
      '*.log',
      'pids/**',
      '*.pid',
      '*.seed',
      'coverage/**',
      '.eslintcache',
      'node_modules/**',
      '.DS_Store',
      'release/app/dist/**',
      'release/build/**',
      '.erb/dll/**',
      '.idea/**',
      'npm-debug.log.*',
      '*.css.d.ts',
      '*.sass.d.ts',
      '*.scss.d.ts',
      '.erb/**',
      'global.d.ts',
      'src/service-worker.ts',
      'src/serviceWorkerRegistration.ts',
      'vite-env.d.ts',
      'vite.config.ts',
      'jest.config.js',
      'eslint.config.mjs',
      'dist/**'
    ]
  },
  ...compat.config({
    env: {
      browser: true,
      es2021: true,
      jest: true
    },
    extends: [
      'plugin:@typescript-eslint/recommended',
      'prettier',
      'plugin:import-x/recommended',
      'plugin:import-x/typescript'
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaFeatures: {
        jsx: true
      },
      project: './tsconfig.json',
      ecmaVersion: 2020,
      sourceType: 'module'
    },
    plugins: ['@typescript-eslint', 'import-x', 'react-hooks'],
    settings: {
      'import-x/resolver': {
        typescript: true
      }
    },
    rules: {
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': ['error', {}],
      '@typescript-eslint/explicit-function-return-type': 'off',
      'import-x/prefer-default-export': 'off',
      'default-case': 'off',
      'no-dupe-class-members': 'off',
      'no-undef': 'off',
      '@typescript-eslint/consistent-type-assertions': 'warn',
      'no-array-constructor': 'off',
      '@typescript-eslint/no-array-constructor': 'warn',
      'no-redeclare': 'off',
      '@typescript-eslint/no-redeclare': 'warn',
      'no-use-before-define': 'off',
      '@typescript-eslint/no-use-before-define': 'warn',
      'no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTernary: true,
          allowTaggedTemplates: true
        }
      ],
      'no-unused-vars': 'off',
      'no-useless-constructor': 'off',
      '@typescript-eslint/no-useless-constructor': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true
        }
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      'comma-dangle': 'off',
      'import-x/extensions': 'off',
      '@typescript-eslint/comma-dangle': 'off',
      'linebreak-style': ['error', 'unix'],
      'func-names': 'off',
      'no-underscore-dangle': 'off',
      'import-x/no-duplicates': 'off'
    }
  }),
  eslintReact.configs['recommended-typescript']
];
