import { createRoot } from 'react-dom/client'
import App from './App'

export default function initReact() {
  const root = document.getElementById('root')

  createRoot(root).render(<App />)
}

initReact()
