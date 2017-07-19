import React from "react"
import { connect } from "react-redux"

import JoinPaymentForm from "./Payment/JoinPaymentForm"
import Wallets from "./Wallets"


@connect((store) => {
  return {
    accounts: store.accounts.accounts,
    wallets: store.wallets.wallets,
    ethereumNode: store.connection.ethereum,
    currentBlock: store.global.currentBlock,
    connected: store.global.connected,
  }
})
export default class DashboardWallet extends React.Component {
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
    var wallets = this.props.wallets
    var app
    if (Object.keys(wallets).length == 0 ) {
      app = (
        <div class="no-account">
          You don't have any Kyber wallets yet. Please create one to use Kyber instant payment.
          <JoinPaymentForm passphraseID="payment-passphrase" modalIsOpen={this.state.modalNoAccountIsOpen} onClose={this.onClose}/>
        </div>)
    } else {
      app = (
        <div>
          <Wallets />
          <JoinPaymentForm passphraseID="payment-passphrase" modalIsOpen={this.state.modalIsOpen} onClose={this.onClose}/>
        </div>)
    }
    return (
      <div class="k-page k-page-wallet">
        {app}
        <div class="import-wallet button-gradient">
          <button id="import" title="import new wallet from JSON keystore file" onClick={this.openModal}>
            +
          </button>
        </div>
      </div>)
  }
}
