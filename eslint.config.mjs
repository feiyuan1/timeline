import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'
import pluginReactHook from 'eslint-plugin-react-hooks'
import PluginPrettier from 'eslint-plugin-prettier/recommended'

export default [
  {
    files: ['src/**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    plugins: {
      'react-hooks': pluginReactHook
    },
    rules: pluginReactHook.configs.recommended.rules
  },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat['jsx-runtime'],
  {
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      'no-console': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_'
        }
      ]
    }
  },
  PluginPrettier
]
