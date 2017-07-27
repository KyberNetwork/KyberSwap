import React from "react"
import { connect } from "react-redux"

import ImportKeystoreModal from "./ImportKeystoreModal"
import ModalButton from "./Elements/ModalButton"
import ExchangeModal from "./ExchangeModal"
import Accounts from "./Accounts"
import Wallets from "./Wallets"
import JoinPaymentForm from "./Payment/JoinPaymentForm"

@connect((store) => {
  return {
    accounts: store.accounts.accounts,
    wallets: store.wallets.wallets,
    ethereumNode: store.connection.ethereum,
    currentBlock: store.global.currentBlock,
    connected: store.global.connected,
    newAccountAdding: store.accounts.newAccountAdding,
    newWalletAdding: store.wallets.newWalletAdding,
    modalID: "new_account_modal",
    modalWalletID : "new_wallet_modal"
  }
})
export default class Dashboard extends React.Component {

  render() {
    var accounts = this.props.accounts
    var app
    if (Object.keys(accounts).length == 0 ) {
      app =  (
        <div class="no-account">
          You don't have any imported Ethereum addresses. Please import one.
          <ImportKeystoreModal modalID={this.props.modalID} />
        </div>)
    } else {
      app = (
        <div>
          <Accounts />
          <ImportKeystoreModal modalID={this.props.modalID} />
        </div>)
    }

    var wallets = this.props.wallets
    var appWallet
    if (Object.keys(wallets).length == 0 ) {
      appWallet =  (
        <div class="no-wallet">
         <JoinPaymentForm passphraseID="payment-passphrase" modalID={this.props.modalWalletID}/>
        </div>)
    } else {
      appWallet = (
        <div>
          <Wallets />
          <JoinPaymentForm passphraseID="payment-passphrase" modalID={this.props.modalWalletID}/>
        </div>)
    }

    var importingAccount
    if (this.props.newAccountAdding) {
      importingAccount = <p>New account is being imported...</p>
    } else {
      importingAccount = ""
    }
    var importingWallet
    if (this.props.newWalletAdding) {
      importingWallet = <p>New wallet is being imported...</p>
    } else {
      importingWallet = ""
    }
    return (
      <div>
        <div  class="k-page">
          <div  class="k-page-account">
            {importingAccount}
            {app}
            <div class="import-wallet button-green">
              <ModalButton class="import" modalID={this.props.modalID} title="import new account from JSON keystore file" />
            </div>
          </div>
          <div  class="k-page-wallet">
            {importingWallet}
            {appWallet}
            <div class="import-wallet button-gradient">
              <ModalButton class="import" modalID={this.props.modalWalletID} title="Deploy new Kyber Wallet" />
            </div>
          </div>
          <div class="modals">
            <ExchangeModal modalID="quick-exchange-modal" label="Exchange" />
          </div>
        </div>
      </div>)
  }
}
