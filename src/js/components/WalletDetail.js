import React from "react";
import { connect } from "react-redux";

import NameAndDesc from "./Account/NameAndDesc";
import { Balance, Token } from "./Account/Balance";

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
export default class AccountDetail extends React.Component {
  render() {
    var tokens = this.props.tokens.map((tok, index) => {
      return <Token key={index} name={tok.name} balance={tok.balance} icon={tok.icon} />
    })
    return (
      <div>
        <NameAndDesc name={this.props.name} description={this.props.desc} />
        <Balance balance={this.props.balance} />
        <p>Created by: {this.props.owner}</p>
        <p>Wallet address: {this.props.address}</p>
        {tokens}
      </div>
    )
  }
}
