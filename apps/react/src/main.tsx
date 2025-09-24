import ReactDOM from 'react-dom/client'

import { initSentry } from '@/shared/analytics'

import { App } from './app'
import './main.css'

// Sentry 초기화
initSentry()

const rootElement = document.getElementById('app')!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(<App />)
}
