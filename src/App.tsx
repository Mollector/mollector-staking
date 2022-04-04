import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import AuthRoute from 'utils/AuthRoute'
import Vesting from 'pages/vesting'
import Staking from 'pages/staking/Staking'
import StakingNewUI from 'pages/staking-new-ui'
import Home from 'pages/home'

// Config for big number
BigNumber.set({
  EXPONENTIAL_AT: 25,
})

function App() {
  return (
    <Switch>
      <Route path="/vesting/:address">
        <AuthRoute component={Vesting} />
      </Route>
      <Route path="/staking">
        <AuthRoute component={Staking} />
      </Route>
      <Route path="/staking-new-ui">
        <AuthRoute component={StakingNewUI} />
      </Route>
      <Route path="/">
        <Route component={Home} />
      </Route>
    <Redirect to="/" />
    </Switch>
  )
}

export default App
