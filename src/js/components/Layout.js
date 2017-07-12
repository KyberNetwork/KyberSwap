import React from "react"
import { connect } from "react-redux"
import { Route } from 'react-router'
import { Link } from 'react-router-dom'
import { ConnectedRouter } from 'react-router-redux'

import Footer from "./Footer"
import Header from "./Header"

import Transactions from "../components/Transactions"
import Dashboard from "../components/Dashboard"
import Exchange from "../components/Exchange"
import Payment from "../components/Payment"
import TermOfService from "../components/TermOfService"

import { loadAccounts } from "../actions/accountActions"
import history from "../history"


@connect((store) => {
  return {
    accounts: store.accounts.accounts,
    wallets: store.wallets.wallets,
    ethereumNode: store.connection.ethereum,
    currentBlock: store.global.currentBlock,
    connected: store.global.connected,
    termOfServiceAccepted: store.global.termOfServiceAccepted,
  }
})
export default class Layout extends React.Component {

  componentWillMount() {
    this.props.ethereumNode.watch()
  }

  render() {
    var app
    if (this.props.termOfServiceAccepted) {
      app = (
        <div>
          <Header/>
          <Link to="/">Dashboard</Link>
          <Link to="/transactions">Transactions</Link>
          <Link to="/exchange">Exchange</Link>
          <Link to="/payment">Payment</Link>
          <Route exact path="/" component={Dashboard}/>
          <Route exact path="/transactions" component={Transactions}/>
          <Route exact path="/exchange" component={Exchange}/>
          <Route exact path="/payment" component={Payment}/>
          <Footer block={this.props.currentBlock} connected={this.props.connected}/>
        </div>
      )
    } else {
      app = (
        <TermOfService />
      )
    }
    return (
      <ConnectedRouter history={history}>
        <div>
          {app}
        </div>
      </ConnectedRouter>
    )
  }
}
