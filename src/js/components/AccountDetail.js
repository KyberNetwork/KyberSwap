import React from "react"
import { connect } from "react-redux"
import QRCode from "qrcode.react"

import NameAndDesc from "./Account/NameAndDesc"
import ModalButton from "./Elements/ModalButton"
import { Balance, Token, Nonce } from "./Account/Balance"
import { toT } from "../utils/converter"
import { deleteAccount} from "../actions/accountActions"
import { selectAccount, specifyRecipient } from "../actions/exchangeFormActions"

const modalID = "quick-exchange-modal"
const sendModalID = "quick-send-modal"
const quickFormID = "quick-exchange"
const quickSendFormID = "quick-send"

@connect((store, props) => {
  var acc = store.accounts.accounts[props.address];
  return {
    name: acc.name,
    balance: acc.balance.toString(10),
    nonce: acc.nonce,
    desc: acc.description,
    joined: acc.joined,
    wallet: acc.wallet,
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
    event.preventDefault()
    this.props.dispatch(deleteAccount(address))
  }
  toggleAccount = (event) =>{
    var target = event.currentTarget
    var parent = target.parentElement
    console.log(parent)
    console.log(parent.class)
    var classParent = parent.className
    if (classParent === "control-btn"){
      classParent = "control-btn show"
    }else{
      classParent = "control-btn"
    }
    parent.className = classParent

  }
  openQuickExchange = (event) => {
    this.props.dispatch(selectAccount(
      quickFormID, this.props.address
    ))
    this.props.dispatch(specifyRecipient(
      quickFormID, this.props.address))
  }

  openQuickSend = (event) => {
    this.props.dispatch(selectAccount(
      quickSendFormID, this.props.address
    ))
  }

  render() {
    var account = this.props.account;
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
                <a class="modiy">
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
              <label>Ether</label>
              <span title={toT(this.props.balance)}>{toT(this.props.balance, 8)}</span>
            </div>
            <div class="address">
              <label>Address</label>
              <span>{this.props.address}</span>
              <div class="account-action">
                <div>
                  <ModalButton preOpenHandler={this.openQuickExchange} modalID={modalID} title="Quick exchange between tokens">
                    <i class="k-icon k-icon-exchange-green"></i>
                  </ModalButton>
                </div>
                <div>
                  <ModalButton preOpenHandler={this.openQuickSend} modalID={sendModalID} title="Quick send ethers and tokens">
                    <i class="k-icon k-icon-send-green"></i>
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
