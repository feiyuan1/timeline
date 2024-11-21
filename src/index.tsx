import { hydrateRoot } from 'react-dom/client'
import App from './App'
import Router from './Router'

export default function initReact() {
  const root = document.getElementById('root') as HTMLDivElement

  hydrateRoot(
    root,
    <App>
      <Router />
    </App>
  )
}

initReact()
