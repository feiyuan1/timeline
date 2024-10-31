import { Route } from 'react-router-dom'
import Line from './Line'
import LineGroup from './LineGroup'
import { Fragment } from 'react'

const Index = (
  <Fragment key="line">
    <Route path="/line/:id" Component={Line} />
    <Route path="/line-group/:id" Component={LineGroup} />
  </Fragment>
)

export default Index
