import React from "react"
import { connect } from "react-redux"

import ImportKeystore from "./ImportKeystore"
import Accounts from "./Accounts"


@connect((store) => {
  return {
    accounts: store.accounts.accounts,
    wallets: store.wallets.wallets,
    ethereumNode: store.connection.ethereum,
    currentBlock: store.global.currentBlock,
    connected: store.global.connected,
  }
})
export default class Dashboard extends React.Component {

  render() {
    var accounts = this.props.accounts
    var app
    if (Object.keys(accounts).length == 0 ) {
      app = (
        <div>
          You don't have any Ethereum addresses yet. Please use following form to import one.
          <ImportKeystore />
        </div>
      )
    } else {
      app = (
        <div>
          <Accounts />
        </div>
      )
    }
    return app
  }
}
