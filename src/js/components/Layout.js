import React from "react"
import { connect } from "react-redux"
import { Route } from 'react-router'
import { ConnectedRouter } from 'react-router-redux'

import Footer from "./Footer"
import Header from "./Header"

import Transactions from "../components/Transactions"
import Dashboard from "../components/Dashboard"
import Exchange from "../components/Exchange"
import DashboardWallet from "../components/DashboardWallet"
import Payment from "../components/Payment"
import InfoKyber from "../components/InfoKyber"

import TermOfService from "../components/TermOfService"
import SideBar from "../components/SideBar"
import RateInfo from "../components/RateInfo"
import GlobalControl from "../components/GlobalControl"

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
    this.props.ethereumNode.watch()
  }

  render() {
    var app
    if (this.props.termOfServiceAccepted) {
      app = (
        <div class="k-body">
          <SideBar />
          <div class="k-contenter">
            <div id="content" class="k-content">
              <Route exact path="/" component={Dashboard}/>
              <Route exact path="/wallets" component={DashboardWallet}/>
              <Route exact path="/transactions" component={Transactions}/>
              <Route exact path="/exchange" component={Exchange}/>
              <Route exact path="/payment" component={Payment}/>
              <Route exact path="/info" component={InfoKyber}/>
            </div>
          </div>
          <RateInfo />          
          <GlobalControl />  
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
