import { config } from '@system/eslint/react'

export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'public/**'],
  },
  ...config,
  {
    files: ['src/**/*.{ts,tsx}']
  },
]
