import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'
import pluginReactHook from 'eslint-plugin-react-hooks'
import PluginPrettier from 'eslint-plugin-prettier/recommended'
import pluginJest from 'eslint-plugin-jest'
import pluginTestingLibrary from 'eslint-plugin-testing-library'

export default [
  {
    ignores: ['**/*.debug*']
  },
  {
    files: [
      'src/**/*.{js,mjs,cjs,ts,jsx,tsx}',
      '__tests__/**/*.test.{ts,js,tsx}'
    ],
    plugins: {
      'react-hooks': pluginReactHook
    },
    rules: pluginReactHook.configs.recommended.rules
  },
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node }
    },
    rules: {
      'no-console': 'error',
      'max-lines-per-function': ['error', { max: 200, skipComments: true }]
    }
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat['jsx-runtime'],
  ...tseslint.config({
    files: [
      'src/**/*.{js,mjs,cjs,ts,jsx,tsx}',
      '__tests__/**/*.test.{ts,js,tsx}',
      'backend/**/**',
      'public/**/**',
      'server/**/**',
      'types/**/**',
      'scripts/**/**'
    ],
    extends: [tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true
      }
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_'
        }
      ],
      '@typescript-eslint/no-this-alias': [
        'error',
        {
          allowedNames: ['ctx']
        }
      ]
    }
  }),
  PluginPrettier,
  {
    files: ['__tests__/**/*.test.{ts,js,tsx}', 'jest-setup.js'],
    plugins: { jest: pluginJest, 'testing-library': pluginTestingLibrary },
    languageOptions: {
      globals: pluginJest.environments.globals.globals
    },
    rules: {
      ...pluginJest.configs['flat/recommended'].rules,
      'jest/no-mocks-import': 'off',
      'jest/no-commented-out-tests': 'off',
      ...pluginTestingLibrary.configs['flat/react'].rules,
      'testing-library/no-container': 'warn',
      'testing-library/no-node-access': 'warn'
    }
  }
]
