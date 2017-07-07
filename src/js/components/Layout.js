import React from "react"
import { connect } from "react-redux"

import Footer from "./Footer"
import Header from "./Header"
import AccountDetail from "./AccountDetail"
import ImportKeystore from "./ImportKeystore"
import ExchangeForm from "./ExchangeForm"
import Transactions from "./Transactions"
import ExchangeRates from "./ExchangeRates"

import { loadAccounts } from "../actions/accountActions"

@connect((store) => {
  return {
    accounts: store.accounts.accounts,
    ethereumNode: store.global.ethereum,
    currentBlock: store.global.currentBlock,
    connected: store.global.connected,
  }
})
export default class Layout extends React.Component {

  componentWillMount() {
    this.props.ethereumNode.watch();
  }

  render() {
    var accounts = this.props.accounts
    var accDetails = Object.keys(accounts).map((addr) => {
      return (
        <div key={addr} >
          <AccountDetail address={addr} />
          <br/>
        </div>
      )
    })
    return (
      <div>
        <Header/>
        <div class="grid-x">
          <div class="account medium-4 cell">
            <h2>Import Keystore</h2>
            <ImportKeystore />
            <h2>Accounts</h2>
            {accDetails}
            <h2>Exchange Rates</h2>
            <ExchangeRates />
          </div>
          <div class="form medium-4 cell">
            <h2>Exchange</h2>
            <ExchangeForm />
          </div>
          <div class="txs medium-4 cell">
            <h2>Transactions</h2>
            <Transactions />
          </div>
        </div>
        <Footer block={this.props.currentBlock} connected={this.props.connected}/>
      </div>
    )
  }
}
