import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import globals from 'globals';

export default [
  {
    ignores: ['dist', 'node_modules', 'tsconfig.json', 'allure-report', 'allure-results', 'test-results'],
  },

  js.configs.recommended,

  ...tseslint.configs.recommended,

  {
    files: ['**/*.{ts,tsx}'],

    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
      globals: globals.node,
    },

    plugins: {
      prettier,
    },

    rules: {
      '@typescript-eslint/default-param-last': 'error',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'error',

      'prettier/prettier': [
        'error',
        {
          printWidth: 130,
          tabWidth: 2,
          useTabs: false,
          semi: true,
          singleQuote: true,
          quoteProps: 'as-needed',
          jsxSingleQuote: false,
          trailingComma: 'all',
          bracketSpacing: true,
          bracketSameLine: false,
          arrowParens: 'always',
          proseWrap: 'preserve',
          htmlWhitespaceSensitivity: 'css',
          vueIndentScriptAndStyle: false,
          endOfLine: 'lf',
        },
      ],

      eqeqeq: ['error', 'always'],
      semi: ['error', 'always'],
      indent: ['error', 2],
    },
  },
];
