import React from "react";
import { connect } from "react-redux";
import QRCode from "qrcode.react"

import NameAndDesc from "./Account/NameAndDesc";
import { Balance, Token, Nonce } from "./Account/Balance";

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
  render() {
    var account = this.props.account;
    var tokens = this.props.tokens.map((tok, index) => {
      return <Token key={index} name={tok.name} balance={tok.balance} icon={tok.icon} />
    })
    return (
      <div class="wallet-item">
        <div>
          <div class="wallet-left">
            <div class="title">
              <span>{this.props.name}</span>
            </div>
            <div class="content">
              <div class="balance">
                <label>Ether</label>
                <span>
                  {this.props.balance}
                </span>
              </div>
              <div class="address">
                <label>Address</label>
                <span>{this.props.address}</span>
                <div>
                  <QRCode value={this.props.address} />
                </div>
              </div>
            </div>
          </div>
          <div class="wallet-center">
            <div class="row">
              {tokens}
            </div>
          </div>
          <div class="wallet-right">
            <button class="k-tooltip delete">
              <i class="k-icon k-icon-delete"></i>
              <span class="k-tooltip-content down-arrow">Delete</span>
            </button>
            <button class="k-tooltip modiy">
              <i class="k-icon k-icon-modify"></i>
              <span class="k-tooltip-content down-arrow">Modify</span>
            </button>
          </div>
        </div>
      </div>
    )
  }
}
