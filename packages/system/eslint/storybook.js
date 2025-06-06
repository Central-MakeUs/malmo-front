import pluginStorybook from 'eslint-plugin-storybook'
import pluginReact from 'eslint-plugin-react'
import globals from 'globals'
import pluginReactHooks from 'eslint-plugin-react-hooks'

import { config as reactConfig } from './react.js'

export const config = [
  {
    ignores: ['dist/**', '**/node_modules/'],
  },
  {
    ...pluginReact.configs.flat.recommended,
    ...pluginStorybook.configs.recommended.rules,
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
      },
    },
  },
  {
    plugins: {
      'react-hooks': pluginReactHooks,
      storybook: pluginStorybook,
    },
    settings: { react: { version: 'detect' } },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      ...pluginStorybook.configs.recommended.rules,
      'react/react-in-jsx-scope': 0,
      'react/prop-types': 0,
    },
  },
  ...reactConfig,
]
