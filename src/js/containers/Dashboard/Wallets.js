import React from "react"
import { connect } from "react-redux"

import { WalletItem } from "../../components/Wallet"
import { accountName } from "../../utils/store"
import { openModal } from "../../actions/utilActions"
import { addNameModifyWallet } from "../../actions/modifyWalletActions"
import { selectAccount, specifyRecipient, specifyStep } from "../../actions/exchangeFormActions"

import { addDeleteWallet } from "../../actions/walletActions"


const quickFormID = "quick-exchange"
const quickSendFormID = "quick-send"
const confirmModalId = "confirm_delete_wallet_modal"
const modifyWalletModalId = "modify_wallet_modal"

@connect((store) => {
  return {
    wallets: store.wallets.wallets,
  }
})

export default class Wallets extends React.Component {
  deleteWallet = (event, address) => {
    this.props.dispatch(addDeleteWallet(address))
    this.props.dispatch(openModal(confirmModalId))
    this.closeSetting(event)
  }

  openModifyModal = (event, address, name) => {
    this.props.dispatch(addNameModifyWallet(address, name))
    this.props.dispatch(openModal(modifyWalletModalId))
    this.closeSetting(event)
  }

  toggleWallet = (event) => {
    var target = event.currentTarget
    var parent = target.parentElement
    var classParent = parent.className
    if (classParent === "control-btn") {
      classParent = "control-btn show"
    } else {
      classParent = "control-btn"
    }
    parent.className = classParent
  }

  closeSetting = (event) => {
    var target = event.currentTarget
    var parent = target.parentElement.parentElement.parentElement.parentElement
    parent.className = "control-btn"
  }

  openQuickExchange = (event, address) => {
    this.props.dispatch(selectAccount(
      quickFormID, address
    ))
    this.props.dispatch(specifyRecipient(
      quickFormID, address))
    this.props.dispatch(specifyStep(
      quickFormID, 2))
  }

  openQuickSend = (event, address) => {
    this.props.dispatch(selectAccount(
      quickSendFormID, address
    ))
  }

  render() {
    var wallets = this.props.wallets
    var walletDetails = Object.keys(wallets).map((addr) => {
      return (
        <div key={addr} >
          <WalletItem 
          	key={addr} 
          	address={addr} 
          	wallet={wallets[addr]} 
          	toggleWallet = {this.toggleWallet}
          	deleteWallet = {this.deleteWallet}
          	openModifyModal = {this.openModifyModal}        	
          	openQuickExchange = {this.openQuickExchange}
          	openQuickSend = {this.openQuickSend}
           />
          <br/>
        </div>
      )
    })
    return (
      <div>
        <div id="wallet-list">
          {walletDetails}
        </div>
      </div>
    )
  }
}
