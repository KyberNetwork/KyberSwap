import React from "react"
import { connect } from "react-redux"
import { Route } from 'react-router'
import { ConnectedRouter } from 'react-router-redux'

import {InfoKyber} from "../../containers/InfoKyber"

import {Exchange} from "../../containers/Exchange"

import {Transfer} from "../../containers/Transfer"

import {Header} from "../../containers/Header"

import {ImportAccount} from "../ImportAccount"

import history from "../../history"


@connect((store) => {
  return {
    ethereumNode: store.connection.ethereum,
    currentBlock: store.global.currentBlock,
    connected: store.global.connected,
  }
})
export default class Layout extends React.Component {

  componentWillMount() {
    this.props.ethereumNode.watch()
  }

  render() {
    var app = (
        <div>
          <Route component={Header}/>    
          <section id="content">
              <Route exact path="/" component={ImportAccount}/>              
              <Route exact path="/info" component={InfoKyber}/>                                          
              <Route exact path="/exchange" component={Exchange}/>
              <Route exact path="/transfer" component={Transfer}/>
          </section>
        </div>
      )
   
    return (
      <ConnectedRouter history={history}>
        <div>
          {app}
        </div>
      </ConnectedRouter>
    )
  }
}
