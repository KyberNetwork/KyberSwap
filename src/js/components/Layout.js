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
    ethereumNode: store.connection.ethereum,
    currentBlock: store.global.currentBlock,
    connected: store.global.connected,
    termOfServiceAccepted: store.global.termOfServiceAccepted,
  }
})
export default class Layout extends React.Component {

  componentWillMount() {
    this.props.ethereumNode.watch();
  }

  render() {
    var app
    if (this.props.termOfServiceAccepted) {
      app = (
        <div class="k-body">
          <div class="k-header">
            <div class="k-header-logo">
              <img src="assets/logo_icon.png" />
            </div>
            <div class="k-header-menu" id="menu">
              <ul class="tabs vertical" data-tabs>
                <li class="tabs-title is-active">
                  <Link to="/" aria-selected={true} >
                    <i class="k-icon k-icon-account"></i> Dashboard
                  </Link>
                </li>
                <li class="tabs-title">
                  <Link to="/exchange">
                    <i class="k-icon k-icon-exchange"></i> Exchange
                  </Link>
                </li>
                <li class="tabs-title">
                  <Link to="/transactions">
                    <i class="k-icon k-icon-transaction"></i> Transactions
                  </Link>
                </li>
                <li class="tabs-title">
                  <Link to="/payment">
                    <i class="k-icon k-icon-node"></i> Payment
                  </Link>
                </li>
              </ul>
            </div>
            <div class="k-header-footer">
                KyberWallet - Official ethereum wallet from KybetNetwork
            </div>
          </div>
          <div class="k-contenter">
            <div id="content" class="k-content">
              <Route exact path="/" component={Dashboard}/>
              <Route exact path="/transactions" component={Transactions}/>
              <Route exact path="/exchange" component={Exchange}/>
              <Route exact path="/payment" component={Payment}/>
            </div>
          </div>
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
