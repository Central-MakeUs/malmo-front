import pluginReact from 'eslint-plugin-react'
import globals from 'globals'

import { config as baseConfig } from './base.js'

export const config = [
  {
    ...pluginReact.configs.flat.recommended,
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.node,
      },
    },
  },
  ...baseConfig,
]
