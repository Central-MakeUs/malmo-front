import { config } from '@system/eslint/storybook'

export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'public/**'],
  },
  ...config,
  {
    files: ['src/**/*.{ts,tsx}'],
  },
]
