import React from "react"
import { connect } from "react-redux"
import QRCode from "qrcode.react"

import NameAndDesc from "./Account/NameAndDesc"
import ModalButton from "./Elements/ModalButton"
import { openModal } from "../actions/utilActions"
import { Balance, Token, Nonce } from "./Account/Balance"
import { toT } from "../utils/converter"
import { addDeleteAccount} from "../actions/accountActions"
import constants from "../services/constants"
import { addNameModifyAccount } from "../actions/modifyAccountActions"
import { selectAccount, specifyRecipient, specifyStep, suggestRate, selectDestToken } from "../actions/exchangeFormActions"

const modalID = "quick-exchange-modal"
const sendModalID = "quick-send-modal"
const quickFormID = "quick-exchange"
const quickSendFormID = "quick-send"
const confirmModalId = "confirm_delete_account_modal"
const modifyModalId = "modify_account_modal"

@connect((store, props) => {
  var acc = store.accounts.accounts[props.address];
  return {
    name: acc.name,
    balance: acc.balance.toString(10),
    nonce: acc.nonce,
    desc: acc.description,
    joined: acc.joined,
    wallet: acc.wallet,
    keystore: acc.key,
    tokens: Object.keys(acc.tokens).map((key) => {
      return {
        name: acc.tokens[key].name,
        balance: acc.tokens[key].balance.toString(10),
        icon: acc.tokens[key].icon,
      }
    })
  }
})
export default class AccountDetail extends React.Component {

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

  openModifyModal = (event, address, name) =>{
    this.props.dispatch(addNameModifyAccount(address, name))
    this.props.dispatch(openModal(modifyModalId))
    this.closeSetting(event)
  }

  toggleAccount = (event) =>{
    var target = event.currentTarget
    var parent = target.parentElement
    var classParent = parent.className
    if (classParent === "control-btn"){
      classParent = "control-btn show"
    }else{
      classParent = "control-btn"
    }
    parent.className = classParent

  }

  closeSetting = (event) => {
    var target = event.currentTarget
    var parent = target.parentElement.parentElement.parentElement.parentElement
    parent.className = "control-btn"
  }

  openQuickExchange = (event) => {
    this.props.dispatch(selectAccount(
      quickFormID, this.props.address
    ))
    this.props.dispatch(specifyRecipient(
      quickFormID, this.props.address))
    this.props.dispatch(specifyStep(
      quickFormID, 2))
    this.props.dispatch(suggestRate(
      quickFormID, constants.RATE_EPSILON))
  }

  openQuickSend = (event) => {
    this.props.dispatch(selectAccount(
      quickSendFormID, this.props.address
    ))
    this.props.dispatch(selectDestToken(
      quickSendFormID, constants.ETHER_ADDRESS))
  }
  
  render() {
    var account = this.props.account
    var tokens = this.props.tokens.map((tok, index) => {
      return <Token key={index} name={tok.name} balance={tok.balance} icon={tok.icon} />
    })

    var tokenRow  = [];
    var rowCountItem = 3;
    var numRow = Math.round(this.props.tokens.length / rowCountItem);

    for(var i = 0; i < numRow ; i ++){
      var row = [];
      for(var j=0;j<rowCountItem;j++){
        if (tokens[rowCountItem*i + j]) row.push(tokens[rowCountItem*i + j]);  
      }
      tokenRow.push(row)
    }

    var tokenRowrender = tokenRow.map((row, index) => {
      return <div key={index} className='row'>{row}</div>
    })
    return (
    <div class="wallet-item">
      <div class="title">
        <span>{this.props.name}</span>
        <div class="control-btn">
          <button onClick={(e) => this.toggleAccount(e)}>
            <i class="k-icon k-icon-setting"></i>
          </button>
          <div className="control-menu">
            <ul>
              <li>
                <a class="delete" onClick={(e) => this.deleteAccount(e, this.props.address)}>
                  <i class="k-icon k-icon-delete-green"></i> Delete...
                </a>
              </li>
              <li>
                <a class="modiy" onClick={(e) => this.openModifyModal(e, this.props.address, this.props.name)}>
                  <i class="k-icon k-icon-modify-green"></i> Modify...
                </a>
              </li>
              <li>
                <a class="download" onClick={(e) => this.downloadKey(e, this.props.keystore, this.props.address)}>
                  <i class="k-icon k-icon-download"></i> Download Key...
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="wallet-content">
        <div class="wallet-left">
          <div class="content">
            <div class="balance">
              <label>Address</label>
              <span>{this.props.address}</span>
            </div>
            <div class="address">
              <label>Ether balance</label>
              <span title={toT(this.props.balance)}>{toT(this.props.balance, 8)}</span>
              <div class="account-action">
                <div>
                  <ModalButton preOpenHandler={this.openQuickExchange} modalID={modalID} title="Quick exchange between tokens">
                    <i class="k-icon k-icon-exchange-green"></i>
                    <p>Exchange</p>
                  </ModalButton>
                </div>
                <div>
                  <ModalButton preOpenHandler={this.openQuickSend} modalID={sendModalID} title="Quick send ethers and tokens">
                    <i class="k-icon k-icon-send-green"></i>
                    <p>Send</p>
                  </ModalButton>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="wallet-center">
          {tokenRowrender}
        </div>
      </div>
    </div>
    )
  }
}
