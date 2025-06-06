import { config } from '@system/eslint/node'

export default [
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  ...config,
  {
    files: ['src/**/*.ts'],
  },
]
