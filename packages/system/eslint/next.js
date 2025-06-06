import pluginNext from '@next/eslint-plugin-next'
import pluginReact from 'eslint-plugin-react'
import globals from 'globals'

import { config as reactConfig } from './react.js'

export const config = [
  {
    ...pluginReact.configs.flat.recommended,
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
        ...globals.node,
      },
    },
  },
  {
    plugins: {
      '@next/next': pluginNext,
    },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs['core-web-vitals'].rules,
    },
  },
  ...reactConfig,
  {
    rules: {
      '@next/next/no-img-element': 0,
    },
  },
]
