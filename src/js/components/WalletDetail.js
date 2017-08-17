import React from "react"
import { connect } from "react-redux"
import QRCode from "qrcode.react"
import { addDeleteWallet } from "../actions/walletActions"
import { Token } from "./Account/Balance"
import ModalButton from "./Elements/ModalButton"
import { selectAccount, specifyRecipient, specifyStep } from "../actions/exchangeFormActions"
import { toT } from "../utils/converter"
import { accountName } from "../utils/store"
import { openModal } from "../actions/utilActions"
import {addNameModifyWallet} from "../actions/modifyWalletActions"

const modalID = "quick-exchange-modal"
const sendModalID = "quick-send-modal"
const quickFormID = "quick-exchange"
const quickSendFormID = "quick-send"
const confirmModalId = "confirm_delete_wallet_modal"
const modifyWalletModalId = "modify_wallet_modal"

@connect((store, props) => {
  var wallet = store.wallets.wallets[props.address];
  return {
    name: wallet.name,
    balance: wallet.balance.toString(10),
    desc: wallet.description,
    owner: wallet.ownerAddress,
    ownerName: accountName(store, wallet.ownerAddress),
    address: wallet.address,
    tokens: Object.keys(wallet.tokens).map((key) => {
      return {
        name: wallet.tokens[key].name,
        balance: wallet.tokens[key].balance.toString(10),
        icon: wallet.tokens[key].icon,
      }
    })
  }
})
export default class WalletDetail extends React.Component {
  deleteWallet = (event, address) => {
    this.props.dispatch(addDeleteWallet(address))
    this.props.dispatch(openModal(confirmModalId))
    this.closeSetting(event)
  }

  openModifyModal = (event, address, name) =>{
    this.props.dispatch(addNameModifyWallet(address, name))
    this.props.dispatch(openModal(modifyWalletModalId))
    this.closeSetting(event)
  }

  toggleWallet = (event) =>{
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
  }

  openQuickSend = (event) => {
    this.props.dispatch(selectAccount(
      quickSendFormID, this.props.address
    ))
  }
  
  render() {
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
          <span><span class="account-name">{this.props.name}</span> - KyberWallet for {this.props.ownerName}</span>
          <div class="control-btn">
            <button onClick={(e) => this.toggleWallet(e)}>
              <i class="k-icon k-icon-setting"></i>
            </button>
            <div className="control-menu">
              <ul>
                <li>
                  <a class="delete" onClick={(e) => this.deleteWallet(e, this.props.address)}>
                    <i class="k-icon k-icon-delete-green"></i> Delete...
                  </a>
                </li>
                <li>
                  <a class="modiy" onClick={(e) => this.openModifyModal(e, this.props.address, this.props.name)}>
                    <i class="k-icon k-icon-modify-green"></i> Modify...
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
