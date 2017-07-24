import React from "react"
import { connect } from "react-redux"

import ImportKeystoreModal from "./ImportKeystoreModal"
import Accounts from "./Accounts"


@connect((store) => {
  return {
    accounts: store.accounts.accounts,
    wallets: store.wallets.wallets,
    ethereumNode: store.connection.ethereum,
    currentBlock: store.global.currentBlock,
    connected: store.global.connected,
    newAccountAdding: store.accounts.newAccountAdding,
  }
})
export default class Dashboard extends React.Component {
  constructor() {
    super()
    this.state = {
        modalNoAccountIsOpen : true,
        modalIsOpen: false,
    }
    this.openModal = this.openModal.bind(this)
    this.onClose = this.onClose.bind(this)
  }

  openModal = () => {
    this.setState({
        modalIsOpen: true,
        modalNoAccountIsOpen : true
    })
  }

  onClose = () => {
     this.setState({
        modalIsOpen: false,
        modalNoAccountIsOpen :false
    })
  }

  render() {
    var accounts = this.props.accounts
    var app
    if (Object.keys(accounts).length == 0 ) {
      app =  (
        <div class="no-account">
          You don't have any Ethereum addresses yet. Please import one.
          <ImportKeystoreModal modalIsOpen={this.state.modalNoAccountIsOpen} onClose={this.onClose}/>             
        </div>)
    } else {
      app = (
        <div>
          <Accounts />
          <ImportKeystoreModal modalIsOpen={this.state.modalIsOpen} onClose={this.onClose}/>              
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
            <button id="import" title="import new account from JSON keystore file" onClick={this.openModal}>
              +
            </button>
          </div>
        </div>
      </div>)
  }
}
