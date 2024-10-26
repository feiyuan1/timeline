import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
// import pluginReact from 'eslint-plugin-react'
import PluginPrettier from 'eslint-plugin-prettier/recommended'

export default [
  { files: ['./src/**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  // pluginReact.configs.flat.recommended,
  {
    '@typescript-eslint/no-require-imports': 'off'
  },
  PluginPrettier
]
