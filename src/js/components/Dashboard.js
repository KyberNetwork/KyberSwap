import React from "react"
import { connect } from "react-redux"

import ImportKeystoreModal from "./ImportKeystoreModal"
import ModalButton from "./Elements/ModalButton"
import Accounts from "./Accounts"


@connect((store) => {
  return {
    accounts: store.accounts.accounts,
    wallets: store.wallets.wallets,
    ethereumNode: store.connection.ethereum,
    currentBlock: store.global.currentBlock,
    connected: store.global.connected,
    newAccountAdding: store.accounts.newAccountAdding,
    modalID: "new_account_modal"
  }
})
export default class Dashboard extends React.Component {

  render() {
    var accounts = this.props.accounts
    var app
    if (Object.keys(accounts).length == 0 ) {
      app =  (
        <div class="no-account">
          You don't have any Ethereum addresses yet. Please import one.
          <ImportKeystoreModal modalID={this.props.modalID} />
        </div>)
    } else {
      app = (
        <div>
          <Accounts />
          <ImportKeystoreModal modalID={this.props.modalID} />
        </div>)
    }
    var importingAccount
    if (this.props.newAccountAdding) {
      importingAccount = <p>New account is being imported...</p>
    } else {
      importingAccount = ""
    }
    return (
      <div>
        {importingAccount}
        <div  class="k-page k-page-account">
          {app}
          <div class="import-wallet button-green">
            <ModalButton modalID={this.props.modalID} title="import new account from JSON keystore file" />
          </div>
        </div>
      </div>)
  }
}
