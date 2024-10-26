import { BrowserRouter as Router } from 'react-router-dom'
import { getMultModule } from './utils/requireContext'

export default function Routes() {
  const routes = getMultModule(require.context('./pages', true, /Route.tsx$/))

  return (
    <Router>
      {routes.map(({ default: Routes }, index) => (
        <Routes key={index} />
      ))}
    </Router>
  )
}
