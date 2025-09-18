import fs from 'fs'
import path from 'path'

import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react-swc'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import svgr from 'vite-plugin-svgr'

// HTML 변환 플러그인
function htmlPlugin(mode: string, amplitudeKey: string | undefined): Plugin {
  return {
    name: 'html-transform',
    transformIndexHtml(html) {
      return html.replace(
        '<!-- AMPLITUDE_SCRIPT -->',
        mode === 'production' && amplitudeKey
          ? `
          <script src="https://cdn.amplitude.com/script/${amplitudeKey}.js"></script>
          <script>
            window.amplitude.add(window.sessionReplay.plugin({sampleRate: 1}));
            window.amplitude.init('${amplitudeKey}', {
              "fetchRemoteConfig": false,
              "autocapture": false
            });
          </script>
          `
          : '<!-- Amplitude disabled in development -->'
      )
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    build: {
      terserOptions: {
        compress: {
          drop_console: true,
        },
      },
    },
    plugins: [
      htmlPlugin(mode, env.VITE_AMPLITUDE_API_KEY),
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
        { find: '@ui/common', replacement: path.resolve(__dirname, '../../packages/ui/common/src') },
        { find: '@mobile/bridge', replacement: path.resolve(__dirname, '../mobile/app/bridge') },
        { find: '@/', replacement: `${path.resolve(__dirname, 'src')}/` },
        { find: '@/types', replacement: `${path.resolve(__dirname, 'src/shared/types')}/` },
        { find: '@/constants', replacement: `${path.resolve(__dirname, 'src/shared/constants')}/` },
        { find: '@/utils', replacement: `${path.resolve(__dirname, 'src/shared/utils')}/` },
        { find: '@/hooks', replacement: `${path.resolve(__dirname, 'src/shared/hooks')}/` },
        { find: '@/libs', replacement: `${path.resolve(__dirname, 'src/shared/libs')}/` },
      ],
    },
    server: {
      port: 3001,
      host: env.VITE_HOST_URL,
      allowedHosts: [env.VITE_HOST_URL || 'localhost'],
      https:
        env.VITE_SSL_KEY_PATH && env.VITE_SSL_CERT_PATH
          ? {
              key: fs.readFileSync(path.resolve(__dirname, env.VITE_SSL_KEY_PATH)),
              cert: fs.readFileSync(path.resolve(__dirname, env.VITE_SSL_CERT_PATH)),
            }
          : undefined,
      proxy: {
        '/api': {
          target: env.VITE_API_URL,
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
  }
})
