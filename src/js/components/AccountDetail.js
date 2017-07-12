import React from "react";
import { connect } from "react-redux";

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
      <div class="acc-item active expand">
        <div class="acc-title">
          {this.props.name}
          <span class="acc-title-expand">
            <i class="k-icon"></i>
          </span>
        </div>
        <div class="acc-body">
          <div class="acc-body-common">
            <div class="acc-body-des">
              {this.props.desc}
            </div>
            <div class="acc-address">
              <i class="k-icon k-icon-key"></i>
              <span>Address</span>
              <span class="acc-address-content">{this.props.address}</span>
            </div>
            <div class="acc-balance">
              {this.props.balance} wei
            </div>
          </div>
          <div class="acc-body-token">
            {tokens}
          </div>
        </div>
        {/*
        <Balance balance={this.props.balance} />
        <Nonce nonce={this.props.nonce} />
        <p>Joined kyber wallet: {this.props.joined.toString()}</p>
        <p>Wallet address: {this.props.wallet}</p>
        */}
      </div>
    )
  }
}
