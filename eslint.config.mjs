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
    }
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat['jsx-runtime'],
  {
    files: [
      'src/**/*.{js,mjs,cjs,ts,jsx,tsx}',
      '__tests__/**/*.test.{ts,js,tsx}',
      'backend/**/**',
      'public/**/**',
      'server/**/**',
      'types/**/**',
      'scripts/**/**'
    ],
    rules: {
      ...tseslint.configs.recommendedTypeChecked.rules,
      '@typescript-eslint/no-require-imports': 'off',
      'no-console': 'error',
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
    },
    languageOptions: {
      parserOptions: {
        projectService: true
      }
    }
  },
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
