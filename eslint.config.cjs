const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat({
  baseDirectory: __dirname
});

module.exports = [
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
      'eslint.config.cjs',
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
      'plugin:prettier/recommended',
      'plugin:import/recommended'
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
    plugins: ['@typescript-eslint', 'import', 'jsx-a11y', 'react-hooks'],
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx']
      },
      'import/resolver': {
        typescript: {}
      }
    },
    rules: {
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': ['error', {}],
      '@typescript-eslint/explicit-function-return-type': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'import/prefer-default-export': 'off',
      'react/prop-types': 'off',
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
      'import/extensions': 'off',
      '@typescript-eslint/comma-dangle': 'off',
      'linebreak-style': ['error', 'unix'],
      'prettier/prettier': 'off',
      'func-names': 'off',
      'react/function-component-definition': 'off',
      'no-underscore-dangle': 'off',
      'react/require-default-props': 'off',
      'react/react-in-jsx-scope': 'off',
      'compat/compat': 'off',
      'import/no-duplicates': 'off'
    }
  })
];
