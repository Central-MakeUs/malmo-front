import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import svgr from 'vite-plugin-svgr'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    build: {
      terserOptions: {
        compress: {
          drop_console: true
        }
      }
    },
    plugins: [
      TanStackRouterVite({
        target: 'react',
        autoCodeSplitting: true,
        routesDirectory: 'src/app',
        indexToken: 'page',
        routeToken: 'layout'
      }),
      react(),
      tailwindcss(),
      svgr({
        svgrOptions: {
          icon: true,
          titleProp: true
        },
        include: '**/*.svg'
      })
    ],
    resolve: {
      alias: [
        {
          find: '@ui/admin',
          replacement: path.resolve(__dirname, '../../packages/ui/admin/src')
        },
        {
          find: '@/',
          replacement: `${path.resolve(__dirname, 'src')}/`
        }
      ]
    },
    server: {
      port: 3002,
      proxy: {
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          cookieDomainRewrite: {
            '*': 'localhost'
          },
          cookiePathRewrite: {
            '*': '/'
          },
          configure: (proxy) => {
            proxy.on('proxyRes', (proxyRes) => {
              const setCookieHeaders = proxyRes.headers['set-cookie']
              if (setCookieHeaders) {
                proxyRes.headers['set-cookie'] = setCookieHeaders.map(
                  (cookie) => cookie.replace(/;\s*Secure/gi, '') // Secure 옵션 제거
                )
              }
            })
          }
        }
      }
    }
  }
})
