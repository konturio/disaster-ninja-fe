import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import _import from 'eslint-plugin-import';
import i18nChecker from 'eslint-plugin-i18n-checker';
import i18nJson from 'eslint-plugin-i18n-json';
import { fixupPluginRules } from '@eslint/compat';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: [
      '**/postcss.config.ts',
      '**/vite.config.ts',
      '**/vite.proxy.ts',
      '**/cosmos.decorator.tsx',
      '**/template.config.js',
      '**/.helpers',
      '**/scripts',
      '**/jest.config.js',
      '**/jest.setup.js',
      '**/appconfig.js',
      'configs/*',
      '**/__test__',
      '**/*.test.tsx',
      './**/*.fixture.tsx',
      './**/fixture/*.*',
      '**/*.fixture.\\{ts,tsx}',
      '**/__fixtures__',
      '**/__mocks__',
    ],
  },
  ...compat.extends('plugin:@typescript-eslint/recommended', 'plugin:react/recommended'),
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
      react,
      'react-hooks': fixupPluginRules(reactHooks),
      import: fixupPluginRules(_import),
      'i18n-checker': i18nChecker,
      'i18n-json': i18nJson,
    },

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2020,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },

    settings: {
      react: {
        version: 'detect',
      },

      'import/resolver': {
        typescript: {
          project: 'tsconfig.json',
        },
      },
    },

    rules: {
      'import/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],

          'newlines-between': 'never',
        },
      ],

      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
      'react/react-in-jsx-scope': 'off',

      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrors: 'none',
        },
      ],

      'no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-expressions': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      'react/jsx-filename-extension': [
        'warn',
        {
          extensions: ['.jsx', '.tsx'],
        },
      ],

      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      'i18n-checker/key-must-be-literal': [
        2,
        {
          functionNames: ['i18n.t'],
        },
      ],

      'i18n-checker/json-key-exists': [
        2,
        {
          functionNames: ['i18n.t'],
          localesPath: 'src/core/localization/translations/en',
        },
      ],
    },
  },
];
