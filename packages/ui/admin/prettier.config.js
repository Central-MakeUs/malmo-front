import config from '../../../prettier.config.js'

export default {
  ...config,
  tailwindStylesheet: './src/styles/globals.css',
  plugins: ['prettier-plugin-tailwindcss'],
}
