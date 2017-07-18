import React from "react"
import { connect } from "react-redux"

//import ImportKeystore from "./ImportKeystore"
import ImportKeystoreModal from "./ImportKeystoreModal"
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
    var modalIsOpen = false
    var app
    if (Object.keys(accounts).length == 0 ) {
      app = (
        <div>
          You don't have any Ethereum addresses yet. Please import one.
          <ImportKeystoreModal modalIsOpen={this.state.modalNoAccountIsOpen} onClose={this.onClose}/>
          <div class="import-wallet">
            <button id="import" title="import new account from JSON keystore file" onClick={this.openModal}>
              +
            </button>
          </div>
        </div>
      )
    } else {
      app = (
        <div>
          <Accounts />
          <ImportKeystoreModal modalIsOpen={this.state.modalIsOpen} onClose={this.onClose}/>
          <div class="import-wallet">
            <button id="import" title="import new account from JSON keystore file" onClick={this.openModal}>
              +
            </button>
          </div>
        </div>
      )
    }
    return app
  }
}
