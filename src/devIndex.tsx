import { createRoot } from 'react-dom/client'
import App from './App'
import Router from './Router'

export default function initReact() {
  const root = document.getElementById('root') as HTMLDivElement

  createRoot(root).render(
    <App>
      <Router />
    </App>
  )
}

initReact()
