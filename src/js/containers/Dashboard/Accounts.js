import React from "react"
import { connect } from "react-redux"

import { AccountItem } from "../../components/Account"
import { openModal } from "../../actions/utilActions"
import { addDeleteAccount } from "../../actions/accountActions"
import constants from "../../services/constants"
import { addNameModifyAccount } from "../../actions/modifyAccountActions"
import { selectAccount, specifyRecipient, specifyStep, suggestRate, selectDestToken } from "../../actions/exchangeFormActions"

const modalID = "quick-exchange-modal"
const sendModalID = "quick-send-modal"
const quickFormID = "quick-exchange"
const quickSendFormID = "quick-send"
const confirmModalId = "confirm_delete_account_modal"
const modifyModalId = "modify_account_modal"

@connect((store) => {
  return {
    accounts: store.accounts.accounts,
  }
})

export default class Accounts extends React.Component {
  deleteAccount = (event, address) => {
    this.props.dispatch(addDeleteAccount(address))
    this.props.dispatch(openModal(confirmModalId))
    this.closeSetting(event)
  }

  downloadKey = (event, keystore, address) => {
    event.preventDefault()
    var element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(keystore))
    element.setAttribute('download', address)

    element.style.display = 'none'
    document.body.appendChild(element)

    element.click()

    document.body.removeChild(element)
    this.closeSetting(event)
  }

  openModifyModal = (event, address, name) => {
    this.props.dispatch(addNameModifyAccount(address, name))
    this.props.dispatch(openModal(modifyModalId))
    this.closeSetting(event)
  }

  toggleAccount = (event) => {
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
    this.props.dispatch(suggestRate(
      quickFormID, constants.RATE_EPSILON))
  }

  openQuickSend = (event, address) => {
    this.props.dispatch(selectAccount(
      quickSendFormID, address
    ))
    this.props.dispatch(selectDestToken(
      quickSendFormID, constants.ETHER_ADDRESS))
  }

  render() {
    var accounts = this.props.accounts
    var accountDetails = Object.keys(accounts).map((addr) => {
      return (
        <div key={addr} >
          <AccountItem 
            key={addr} 
          address={addr} 
          account={accounts[addr]} 
          toggleAccount = {this.toggleAccount}
          deleteAccount = {this.deleteAccount}
          openModifyModal = {this.openModifyModal}          
          openQuickExchange = {this.openQuickExchange}
          openQuickSend = {this.openQuickSend}
          downloadKey = {this.downloadKey} />          
        </div>
      )
    })
    return (
      <div>
        <div id="wallet-list">
          {accountDetails}
        </div>
      </div>
    )
  }
}
