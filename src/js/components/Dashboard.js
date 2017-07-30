import React from "react"
import { connect } from "react-redux"

import ImportKeystoreModal from "./ImportKeystoreModal"
import ModalButton from "./Elements/ModalButton"
import ModalLink from "./Elements/ModalLink"

import SendModal from "./SendModal"

import Accounts from "./Accounts"
import Wallets from "./Wallets"
import JoinPaymentForm from "./Payment/JoinPaymentForm"

const quickSendModalID = "quick-send-modal"
const importModalId = "new_account_modal"

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
    modalWalletID : "new_wallet_modal",
    utils:store.utils
  }
})
export default class Dashboard extends React.Component {

  render() {
    var accounts = this.props.accounts
    var app
    if (Object.keys(accounts).length == 0 ) {
      var linkImport = (
        <button>import</button>
      )
      app =  (
        <div class="no-account">
          You don’t have any accounts yet. Please  <ModalLink  modalID={importModalId} content={linkImport}/> one.
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
      importingAccount = <p class="loading">New account is being imported...</p>
    } else {
      importingAccount = ""
    }
    var importingWallet
    if (this.props.newWalletAdding) {
      importingWallet = <p class="loading">New wallet is being imported...</p>
    } else {
      importingWallet = ""
    }
    return (
      <div>
        <div  class="k-page">
          <div  class="k-page-account">
            {importingAccount}
            {app}
          </div>
          <div  class="k-page-wallet">
            {importingWallet}
            {appWallet}
          </div>

          <div class="modals">
            <SendModal exchangeFormID="quick-send" modalID={quickSendModalID} label="Quick Send" />
          </div>
        </div>
      </div>)
  }
}
