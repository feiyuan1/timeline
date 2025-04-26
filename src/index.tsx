import { hydrateRoot } from 'react-dom/client'
import { matchRoutes } from 'react-router'
import App from './App'
import Router, { routes } from './Router'
import './index.css'

export default async function initReact() {
  const root = document.getElementById('root') as HTMLDivElement

  const lazyMatches = matchRoutes(routes, window.location)?.filter(
    (m) => m.route.lazy
  )

  if (lazyMatches && lazyMatches?.length > 0) {
    await Promise.all(
      lazyMatches.map(async (m) => {
        const routeModule = await m.route.lazy!()
        Object.assign(m.route, { ...routeModule, lazy: undefined })
      })
    )
  }

  hydrateRoot(
    root,
    <App>
      <Router />
    </App>
  )
}

void initReact()
