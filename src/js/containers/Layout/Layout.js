import React from "react"
import { connect } from "react-redux"
import { Route } from 'react-router'
import { ConnectedRouter } from 'react-router-redux'

import {Transactions} from "../../containers/Transactions"

import {Dashboard} from "../../containers/Dashboard"

import {InfoKyber} from "../../containers/InfoKyber"

import TermOfService from "../../components/TermOfService"

import {SideBar} from "../../containers/SideBar"
import {RateInfo} from "../../containers/RateInfo"

import {GlobalControl} from "../../containers/GlobalControl"

import { loadAccounts } from "../../actions/accountActions"
import history from "../../history"


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
          <Route component={SideBar}/>          
          <div class="k-contenter">
            <div id="content" class="k-content">
              <Route exact path="/" component={Dashboard}/>              
              <Route exact path="/transactions" component={Transactions}/>              
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
