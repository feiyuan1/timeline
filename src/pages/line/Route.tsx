import { Route, Routes } from 'react-router-dom'
import Line from './Line'
import LineGroup from './LineGroup'

export default function Index() {
  return (
    <Routes>
      <Route path="/line/:id" Component={Line} />
      <Route path="/line-group/:id" Component={LineGroup} />
    </Routes>
  )
}
