import { Route } from 'react-router-dom'
import Main from './Main'
import { Fragment } from 'react'

const Index = (
  <Fragment key="main">
    <Route path="/" index Component={Main} />
  </Fragment>
)

export default Index
