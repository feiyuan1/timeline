import { hydrateRoot } from 'react-dom/client'
import App from './App'

export default function initReact() {
  const root = document.getElementById('root') as HTMLDivElement

  hydrateRoot(root, <App />)
}

initReact()
