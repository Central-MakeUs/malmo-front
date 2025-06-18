import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  build: {
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  },
  plugins: [
    TanStackRouterVite({
      target: 'react',
      autoCodeSplitting: true,
      routesDirectory: 'src/app',
      indexToken: 'page',
      routeToken: 'layout',
    }),
    react(),
    tailwindcss(),
    svgr({
      svgrOptions: {
        icon: true,
        titleProp: true,
      },
      include: '**/*.svg',
    }),
  ],
  resolve: {
    alias: [
      {
        find: '@ui/common',
        replacement: path.resolve(__dirname, '../../packages/ui/common/src'),
      },
      {
        find: '@/',
        replacement: `${path.resolve(__dirname, 'src')}/`,
      },
      {
        find: '@/types',
        replacement: `${path.resolve(__dirname, 'src/shared/types')}/`,
      },
      {
        find: '@/constants',
        replacement: `${path.resolve(__dirname, 'src/shared/constants')}/`,
      },
      {
        find: '@/utils',
        replacement: `${path.resolve(__dirname, 'src/shared/utils')}/`,
      },
      {
        find: '@/hooks',
        replacement: `${path.resolve(__dirname, 'src/shared/hooks')}/`,
      },
      {
        find: '@/libs',
        replacement: `${path.resolve(__dirname, 'src/shared/libs')}/`,
      },
    ],
  },
  server: {
    port: 3001,
    proxy: {
      '/api': {
        target: 'https://example.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        cookieDomainRewrite: {
          '*': 'localhost',
        },
        cookiePathRewrite: {
          '*': '/',
        },
      },
    },
  },
})
