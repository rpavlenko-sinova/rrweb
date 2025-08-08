import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

export default [
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node, browser: 'readonly', chrome: 'readonly' } },
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
      import: importPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
      tailwindcss: {
        callees: ['cn'],
      },
    },
    rules: {
      'no-console': ['warn', { allow: ['info', 'warn', 'error'] }],
      'max-params': ['error', 3],
      curly: ['error', 'all'],
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'no-void': 'off',

      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          ignoreRestSiblings: true,
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-exports': 'error',
      '@typescript-eslint/method-signature-style': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
      '@typescript-eslint/consistent-indexed-object-style': ['error', 'index-signature'],
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: {
            attributes: false,
          },
        },
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'variable', format: ['camelCase', 'PascalCase', 'UPPER_CASE'] },
        { selector: 'function', format: ['camelCase', 'PascalCase'] },
        { selector: 'typeLike', format: ['PascalCase'] },
        {
          selector: 'variable',
          types: ['boolean'],
          format: ['PascalCase'],
          prefix: ['is', 'should', 'has', 'can', 'was', 'did', 'will', 'use', 'with', 'disable'],
        },
        { selector: 'typeAlias', format: ['PascalCase'], prefix: ['T'] },
        { selector: 'interface', format: ['PascalCase'], prefix: ['I'] },
      ],

      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/display-name': 'warn',
      'react/function-component-definition': [
        'warn',
        { namedComponents: 'arrow-function', unnamedComponents: 'arrow-function' },
      ],
      'react/require-default-props': ['error', { functions: 'defaultArguments' }],
      'react/jsx-sort-props': ['error', { reservedFirst: true, noSortAlphabetically: true }],
      'react/jsx-handler-names': ['error', { eventHandlerPrefix: 'on' }],
      'react/no-multi-comp': 'error',
      'react/jsx-filename-extension': ['error', { allow: 'as-needed', extensions: ['.tsx'] }],
      'react/jsx-curly-spacing': [
        'error',
        {
          when: 'never',
          children: { when: 'never', allowMultiline: false },
        },
      ],
      'react/jsx-no-leaked-render': ['error', { validStrategies: ['coerce'] }],
      'react/jsx-max-depth': ['error', { max: 5 }],
      'react/jsx-key': [
        'error',
        {
          checkFragmentShorthand: true,
          checkKeyMustBeforeSpread: true,
          warnOnDuplicates: true,
        },
      ],
      'react/no-array-index-key': 'off',
      'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],
      'react/jsx-props-no-spreading': 'off',

      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      'react-refresh/only-export-components': ['warn', { allowExportNames: ['metadata'], allowConstantExport: true }],

      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['.*'], message: 'Relative imports are not allowed.' },
            { group: ['@mui/*/*/*'], message: 'Please import from @mui in a right way' },
            { group: ['lodash'], message: 'Please install only needed part from lodash.* package.' },
          ],
        },
      ],
      'import/consistent-type-specifier-style': ['error', 'prefer-inline'],
      'import/no-duplicates': ['error', { 'prefer-inline': true }],
      'import/prefer-default-export': 'off',
    },
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
  {
    // Disable rules that conflict with shadcn/ui components
    files: ['**/ui/**/*.{ts,tsx}'],
    rules: {
      'react/function-component-definition': 'off',
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    ignores: ['.output/', 'node_modules/', '*.config.js', '*.config.mjs', '.wxt/', '.husky/'],
  },
];
