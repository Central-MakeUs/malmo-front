import config from '../../prettier.config.js'

export default {
  ...config,
  tailwindStylesheet: './src/main.css',
  plugins: ['prettier-plugin-tailwindcss'],
}
