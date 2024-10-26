import { Route, Routes } from 'react-router-dom'
import Main from './Main'

export default function Index() {
  return (
    <Routes>
      <Route path="/" Component={Main} />
    </Routes>
  )
}
