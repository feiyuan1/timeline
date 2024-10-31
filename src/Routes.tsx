import { BrowserRouter as Router, Routes } from 'react-router-dom'
import { getMultModule } from './utils/requireContext'

export default function AppRoutes() {
  const routes = getMultModule(require.context('./pages', true, /Route.tsx$/))

  return (
    <Router>
      <Routes>{routes.map(({ default: PageRoutes }) => PageRoutes)}</Routes>
    </Router>
  )
}
