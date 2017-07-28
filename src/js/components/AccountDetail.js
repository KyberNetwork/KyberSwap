import React from "react"
import { connect } from "react-redux"
import QRCode from "qrcode.react"

import NameAndDesc from "./Account/NameAndDesc"
import ModalButton from "./Elements/ModalButton"
import { Balance, Token, Nonce } from "./Account/Balance"
import { toT } from "../utils/converter"
import { deleteAccount } from "../actions/accountActions"
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
           <button class="delete" title="Delete" onClick={(e) => this.deleteAccount(e, this.props.address)}>
              <i class="k-icon k-icon-delete-green"></i>
            </button>
            <button class="modiy" title="Modify">
              <i class="k-icon k-icon-modify-green"></i>
            </button>
        </div>
      </div>
      <div class="wallet-content">
        <div class="wallet-left">          
          <div class="content">
            <div class="balance">
              <label>Ether</label>
              <span>{toT(this.props.balance)}</span>
            </div>
            <div class="address">
              <label>Address</label>
              <span>{this.props.address}</span>
              <div class="account-action">
                <span><i class="k-icon k-icon-lr-arrow"></i></span>
                <span><i class="k-icon k-icon-l-arrow"></i></span>
                <span><i class="k-icon k-icon-duplicate"></i></span>
              </div>
            </div>
          </div>
          <ModalButton preOpenHandler={this.openQuickExchange} class="button" modalID={modalID} title="Quick exchange between tokens">
            Exchange
          </ModalButton>
          <ModalButton preOpenHandler={this.openQuickSend} class="button" modalID={sendModalID} title="Quick send ethers and tokens">
            Send
          </ModalButton>
        </div>
        <div class="wallet-center">
          {tokenRowrender}
        </div>
      </div>
    </div>
    )
  }
}
