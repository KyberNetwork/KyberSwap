import React from "react"
import { connect } from "react-redux"

import AccountDetail from "./AccountDetail"
import WalletDetail from "./WalletDetail"
import ImportKeystore from "./ImportKeystore"


@connect((store) => {
  return {
    accounts: store.accounts.accounts,
    wallets: store.wallets.wallets,
    ethereumNode: store.global.ethereum,
    currentBlock: store.global.currentBlock,
    connected: store.global.connected,
  }
})
export default class Dashboard extends React.Component {

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
    var wallets = this.props.wallets
    var walletDetails = Object.keys(wallets).map((addr) => {
      return (
        <div key={addr} >
          <WalletDetail address={addr} />
          <br/>
        </div>
      )
    })
    return (
      <div>
        <h2>Import Keystore</h2>
        <ImportKeystore />
        <h2>Wallets</h2>
        {walletDetails}
        <h2>Accounts</h2>
        {accDetails}
      </div>
    )
  }
}
