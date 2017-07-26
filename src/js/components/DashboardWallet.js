import React from "react"
import { connect } from "react-redux"

import JoinPaymentForm from "./Payment/JoinPaymentForm"
import Wallets from "./Wallets"
import ModalButton from "./Elements/ModalButton"

@connect((store) => {
  return {
    accounts: store.accounts.accounts,
    wallets: store.wallets.wallets,
    ethereumNode: store.connection.ethereum,
    currentBlock: store.global.currentBlock,
    connected: store.global.connected,
    modalWalletID :"new_wallet_modal"
  }
})
export default class DashboardWallet extends React.Component {

  render() {
    var wallets = this.props.wallets
    var app
    if (Object.keys(wallets).length == 0 ) {
      app = (
        <div class="no-account">
          You don't have any Kyber wallets yet. Please create one to use Kyber instant payment.
          <JoinPaymentForm passphraseID="payment-passphrase" modalID={this.props.modalWalletID} />
        </div>)
    } else {
      app = (
        <div>
          <Wallets />
          <JoinPaymentForm passphraseID="payment-passphrase" modalID={this.props.modalWalletID} />
        </div>)
    }
    return (
      <div class="k-page k-page-wallet">
        {app}
        <div class="import-wallet button-gradient">
          <ModalButton modalID={this.props.modalWalletID} title="import new wallet" />
        </div>
      </div>)
  }
}
