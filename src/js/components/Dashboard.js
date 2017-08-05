import React from "react"
import { connect } from "react-redux"

import ImportKeystoreModal from "./ImportKeystoreModal"
import ModalButton from "./Elements/ModalButton"
import ModalLink from "./Elements/ModalLink"
import ConfirmModal from "./Elements/ConfirmModal"
import ModifyAccountForm from "./Account/ModifyAccountForm"
import ModifyWalletForm from "./Wallet/ModifyWalletForm"

import SendModal from "./SendModal"

import Accounts from "./Accounts"
import Wallets from "./Wallets"
import JoinPaymentForm from "./Payment/JoinPaymentForm"
import { deleteAccount} from "../actions/accountActions"
import { deleteWallet} from "../actions/walletActions"

const quickSendModalID = "quick-send-modal"
const importModalId = "new_account_modal"
const createModalId = "new_account_create_modal"
const confirmAccountModalId = "confirm_delete_account_modal"
const confirmWalletModalId = "confirm_delete_wallet_modal"
const modifyModalId = "modify_account_modal"
const modifyWalletModalId = "modify_wallet_modal"
@connect((store) => {
  return {

    accounts: store.accounts.accounts,
    wallets: store.wallets.wallets,
    ethereumNode: store.connection.ethereum,
    currentBlock: store.global.currentBlock,
    connected: store.global.connected,
    newAccountAdding: store.accounts.newAccountAdding,
    newAccountCreating: store.accounts.newAccountCreating,
    deleteAccount: store.accounts.deleteAccount,
    deleteWallet: store.wallets.deleteWallet,
    modifyAccount: store.modifyAccount,
    modifyWallet: store.modifyWallet,

    newWalletAdding: store.wallets.newWalletAdding,
    utils:store.utils
  }
})
export default class Dashboard extends React.Component {

  deleteAccount = (event) => {   
    this.props.dispatch(deleteAccount(this.props.deleteAccount))
  }
  deleteWallet = (event) => {
    this.props.dispatch(deleteWallet(this.props.deleteWallet))
  }
  render() {
    var accounts = this.props.accounts
    var app
    if (Object.keys(accounts).length == 0 ) {
      var linkImport = (
        <button>import</button>
      )
      var linkCreate = (
        <button>create</button>
      )
      app =  (
        <div class="no-account">
          You don’t have any accounts yet. Please <ModalLink  modalID={createModalId} content={linkCreate}/> or <ModalLink  modalID={importModalId} content={linkImport}/> one.
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
        </div>)
    } else {
      appWallet = (
        <div>
          <Wallets />
        </div>)
    }

    var importingAccount
    console.log(this.props.newAccountAdding || this.props.newAccountCreating)
    if (this.props.newAccountAdding || this.props.newAccountCreating) {
      importingAccount = <p class="loading">New account is being added...</p>
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
            <ConfirmModal modalID={confirmAccountModalId} action={this.deleteAccount} header="Confirm delete" message="Do you want to delete your account?"/>
            <ConfirmModal modalID={confirmWalletModalId} action={this.deleteWallet} header="Confirm delete" message="Do you want to delete your wallet?"/>
            <ModifyAccountForm modalID={modifyModalId} name={this.props.modifyAccount.name} address={this.props.modifyAccount.address}/>
            <ModifyWalletForm modalID={modifyWalletModalId} name={this.props.modifyWallet.name} address={this.props.modifyWallet.address}/>
          </div>
        </div>
      </div>)
  }
}
