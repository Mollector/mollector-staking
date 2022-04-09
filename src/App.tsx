import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import AuthRoute from 'utils/AuthRoute'
import Staking from 'pages/staking'

BigNumber.set({
  EXPONENTIAL_AT: 25,
})

function App() {
  return <Staking />
}

export default App
