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
      <div>
        <NameAndDesc name={this.props.name} description={this.props.desc} />
        <Balance balance={this.props.balance} />
        <Nonce nonce={this.props.nonce} />
        {tokens}
      </div>
    )
  }
}
