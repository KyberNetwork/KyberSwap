import React from "react"
import { connect } from "react-redux"

import { ImportKeystoreModal, SendModal, ExchangeModal } from "../../containers/GlobalControl"

import {ModalButton, ModalLink, ConfirmModal} from "../../containers/CommonElements"
//import ModalLink from "../../components/Elements/ModalLink"
//import ConfirmModal from "../../components/Elements/ConfirmModal"

import { ModifyAccountModal, ModifyWalletModal } from "../Dashboard"
import { Accounts, Wallets } from "../Dashboard"

import { deleteAccount, sortAccount } from "../../actions/accountActions"
import { deleteWallet, sortWallet } from "../../actions/walletActions"

const quickExchangeModalID = "quick-exchange-modal"
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
    utils: store.utils
  }
})
export default class Dashboard extends React.Component {  
  deleteAccount = (event) => {
    this.props.dispatch(deleteAccount(this.props.deleteAccount))
  }

  deleteWallet = (event) => {
    this.props.dispatch(deleteWallet(this.props.deleteWallet))
  }

  toggleActive = (event) => {
    var parent = event.currentTarget.parentNode
    if (parent.classList.contains("active")) {
      parent.classList.remove("active")
    } else {
      parent.classList.add("active")
    }
  }

  searchAccount(e) {
    var value = e.target.value
    var accounts = document.getElementsByClassName("wallet-item");
    var name = ''
    for (var i = 0; i < accounts.length; i++) {
      if (accounts[i].getElementsByClassName("account-name").length === 1) {
        name = accounts[i].getElementsByClassName("account-name")[0].innerHTML
        if (name.indexOf(value) === -1) {
          accounts[i].className = "wallet-item hide"
        } else {
          accounts[i].className = "wallet-item"
        }
      }
    }
  }

  sortAccount = (event, field) => {
    var order = event.target.getAttribute("sort_order")
    if (order === "ASC") {
      this.props.dispatch(sortAccount("ASC", field))
      this.props.dispatch(sortWallet("ASC", field))
      event.target.setAttribute("sort_order", "DESC")
    } else {
      this.props.dispatch(sortAccount("DESC", field))
      this.props.dispatch(sortWallet("DESC", field))
      event.target.setAttribute("sort_order", "ASC")
    }
    //close sort menu
    event.target.parentNode.parentNode.parentNode.parentNode.className = "sort"
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
          <div class="account-sort">
            <ul>
              <li class="sort">
                <a onClick={e => this.toggleActive(e)} title="Sort">
                  <i class="k-icon k-icon-sort"></i>
                </a>
                <div class="sort-menu">
                  <ul>
                    <li>
                      <a onClick={(e) => this.sortAccount(e,"name")}>Sort by name</a>
                    </li>
                    <li>
                      <a onClick={(e) => this.sortAccount(e,"createdTime")}>Sort by creation time</a>
                    </li>
                    <li>
                      <a onClick={(e) => this.sortAccount(e,"balance")}>Sort by ether balance</a>
                    </li>
                  </ul>
                </div>
              </li>
              <li class="search">
                <a onClick={e => this.toggleActive(e)} title="Search">
                  <i class="k-icon k-icon-search"></i>
                </a>                          
                <input  placeholder="type account or wallet name..." onChange={e => this.searchAccount(e)}/>
              </li>
            </ul>                    
          </div>
          <div  class="k-page-account">
            {importingAccount}
            {app}
          </div>
          <div  class="k-page-wallet">
            {importingWallet}
            {appWallet}
          </div>

          <div class="modals">
            <ExchangeModal exchangeFormID="quick-exchange" modalID={quickExchangeModalID} label="Quick Exchange" />
            <SendModal exchangeFormID="quick-send" modalID={quickSendModalID} label="Quick Send" />
            <ConfirmModal modalID={confirmAccountModalId} action={this.deleteAccount} header="Confirm delete" message="Do you want to delete your account?"/>
            <ConfirmModal modalID={confirmWalletModalId} action={this.deleteWallet} header="Confirm delete" message="Do you want to delete your wallet?"/>
            <ModifyAccountModal modalID={modifyModalId} name={this.props.modifyAccount.name} address={this.props.modifyAccount.address}/>
            <ModifyWalletModal modalID={modifyWalletModalId} name={this.props.modifyWallet.name} address={this.props.modifyWallet.address}/>
          </div>
        </div>
      </div>)
  }
}
