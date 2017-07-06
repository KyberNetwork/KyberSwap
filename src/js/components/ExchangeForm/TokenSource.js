import React from "react";
import { connect } from "react-redux";

import {selectSourceToken, specifySourceAmount, suggestRate} from "../../actions/exchangeFormActions";
import constants from "../../services/constants";


@connect((store) => {
  var selectedAccount = store.exchangeForm.selectedAccount;
  var account = store.accounts.accounts[selectedAccount];
  if (account) {
    return {
      tokens: Object.keys(account.tokens).map((addr) => {
        return {
          name: account.tokens[addr].name,
          icon: account.tokens[addr].icon,
          address: account.tokens[addr].address,
          balance: account.tokens[addr].balance.toString(10),
        }
      }),
      balance: account.balance.toString(10),
      selectedToken: store.exchangeForm.sourceToken,
      specifiedAmount: store.exchangeForm.sourceAmount,
      destToken: store.exchangeForm.destToken,
    }
  } else {
    return {
      tokens: [],
      balance: 0,
      selectedToken: store.exchangeForm.sourceToken,
      specifiedAmount: store.exchangeForm.sourceAmount,
      destToken: store.exchangeForm.destToken,
    }
  }
})
export default class TokenSource extends React.Component {

  selectToken(event) {
    this.props.dispatch(selectSourceToken(event.target.value));
    if (event.target.value != "" && this.props.destToken) {
      this.props.dispatch(suggestRate(
        event.target.value,
        this.props.destToken
      ))
    }
  }

  specifyAmount(event) {
    this.props.dispatch(specifySourceAmount(event.target.value));
  }

  render() {
    var tokenOptions = this.props.tokens.map((token) => {
      return <option key={token.address} value={token.address}>{token.name} - {token.icon} - {token.balance}</option>
    })
    return (
      <div>
        <label>
          Select token to send:
          <select onChange={this.selectToken.bind(this)} value={this.props.selectedToken}>
            <option key={constants.ETHER_ADDRESS} value={constants.ETHER_ADDRESS}>Ether - {this.props.balance} wei</option>
            {tokenOptions}
          </select>
          Selected: {this.props.selectedToken}
        </label>
        <label>
          Amount to send:
          <input value={this.props.specifiedAmount} type="number" min="0" step="any" placeholder="Amount to send" onChange={this.specifyAmount.bind(this)}/>
          Specified amount: {this.props.specifiedAmount}
        </label>
      </div>
    )
  }
}
