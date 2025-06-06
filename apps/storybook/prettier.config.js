import config from '../../prettier.config.js'

export default {
  ...config,
  tailwindStylesheet: '.storybook/preview.css',
  plugins: ['prettier-plugin-tailwindcss'],
}
