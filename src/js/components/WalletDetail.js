import React from "react"
import { connect } from "react-redux"

import { Token } from "./Account/Balance"

@connect((store, props) => {
  var wallet = store.wallets.wallets[props.address];
  return {
    name: wallet.name,
    balance: wallet.balance.toString(10),
    desc: wallet.description,
    owner: wallet.ownerAddress,
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
  render() {
    var tokens = this.props.tokens.map((tok, index) => {
      return <Token key={index} name={tok.name} balance={tok.balance} icon={tok.icon} />
    })
    return (
      <div>
        <div class="wallet-item">
          <div>
            <div class="wallet-left">
              <div class="title">
                <span>{this.props.name}</span>
              </div>
              <div class="content">
                <div class="balance">
                  <label>Ether</label>
                  <span class="text-gradient">{this.props.balance}</span>
                </div>
                <div class="address">
                  <label>Address</label>
                  <span>{this.props.address}</span>
                  <div>
                    <img src="assets/qr_code.png" />
                  </div>
                </div>
                <div class="created text-gradient">
                  Created by: {this.props.owner}
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
      </div>
    )
  }
}
