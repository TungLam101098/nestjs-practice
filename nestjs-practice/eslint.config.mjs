// @ts-check
import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import * as importPlugin from 'eslint-plugin-import';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: 5,
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      'import/order': [
        'error',
        {
          'groups': [
            ['builtin', 'external'],  // First above lib (Node.js & npm)
            ['internal', 'parent', 'sibling', 'index'],  // Absolute paths and relative paths in the same group
          ],
          'newlines-between': 'always',  // Line breaks between groups
          'pathGroups': [
            // Put absolute paths (@/...) before relative paths
            {
              'pattern': '@/**',
              'group': 'internal',
              'position': 'before'
            },
            // Common modules in absolute paths
            {
              'pattern': '@/constants/**',
              'group': 'internal',
              'position': 'before'
            },
            {
              'pattern': '@/enums/**',
              'group': 'internal',
              'position': 'before'
            },
            {
              'pattern': '@/utils/**',
              'group': 'internal',
              'position': 'before'
            },
            // Specific modules in absolute paths
            {
              'pattern': '@/**/dtos/**',
              'group': 'internal',
              'position': 'after'
            },
            {
              'pattern': '@/**/entities/**',
              'group': 'internal',
              'position': 'after'
            }
          ],
          'alphabetize': {
            'order': 'asc',
            'caseInsensitive': true
          },
          'pathGroupsExcludedImportTypes': ['builtin'],
        }
      ]
    },
  },
);
