import React from "react"
import { connect } from "react-redux"

import ImportKeystoreModal from "./ImportKeystoreModal"
import ModalButton from "./Elements/ModalButton"
import ModalLink from "./Elements/ModalLink"
import ToggleButton from "./Elements/ToggleButton"

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
    newWalletAdding: store.accounts.newWalletAdding,
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

    var wallets = this.props.wallets
    var appWallet
    if (Object.keys(wallets).length == 0 ) {
      appWallet =  (
        <div class="no-wallet">
          You don't have any Ethereum wallet yet. Please import one.
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

    var linkAccount = (
      <div class="link">
        <span><i class="k-icon k-icon-import"></i></span>
        <label>Import Account</label>
      </div>      
    )
    var linkWallet = (
      <div class="link">
        <span><i class="k-icon k-icon-import"></i></span>
        <label>Import Wallet</label>
      </div>      
    )
    var className=this.props.utils.showControl?"control-account":"control-account hide"
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

          <div class="import-wallet button-green">
            <ToggleButton />           
          </div>
          <div className={className}>
            <ul>
              <li>
                <ModalLink  modalID={this.props.modalID} content={linkAccount}/>                
              </li>
              <li>
                <ModalLink  modalID={this.props.modalWalletID} content={linkWallet}/>                
              </li>
              <li>
                <ModalLink  modalID={this.props.modalID} content={linkAccount}/>                
              </li>
            </ul>
          </div>
        </div>
      </div>)
  }
}
