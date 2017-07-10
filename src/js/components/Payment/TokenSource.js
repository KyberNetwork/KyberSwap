import React from "react";
import { connect } from "react-redux";

import {selectSourceToken, specifySourceAmount, suggestRate} from "../../actions/paymentFormActions";
import constants from "../../services/constants";


@connect((store) => {
  var selectedWallet = store.paymentForm.selectedWallet;
  var wallet = store.wallets.wallets[selectedWallet];
  if (wallet) {
    return {
      tokens: Object.keys(wallet.tokens).map((addr) => {
        return {
          name: wallet.tokens[addr].name,
          icon: wallet.tokens[addr].icon,
          address: wallet.tokens[addr].address,
          balance: wallet.tokens[addr].balance.toString(10),
        }
      }),
      balance: wallet.balance.toString(10),
      selectedToken: store.paymentForm.sourceToken,
      specifiedAmount: store.paymentForm.sourceAmount,
      destToken: store.paymentForm.destToken,
    }
  } else {
    return {
      tokens: [],
      balance: 0,
      selectedToken: store.paymentForm.sourceToken,
      specifiedAmount: store.paymentForm.sourceAmount,
      destToken: store.paymentForm.destToken,
    }
  }
})
export default class TokenSource extends React.Component {

  selectToken = (event) => {
    this.props.dispatch(selectSourceToken(event.target.value));
    if (event.target.value != "" && this.props.destToken) {
      this.props.dispatch(suggestRate(
        event.target.value,
        this.props.destToken
      ))
    }
  }

  specifyAmount = (event) => {
    this.props.dispatch(specifySourceAmount(event.target.value))
  }

  render() {
    var tokenOptions = this.props.tokens.map((token) => {
      return <option key={token.address} value={token.address}>{token.name} - {token.icon} - {token.balance}</option>
    })
    return (
      <div>
        <label>
          Select token to send:
          <select onChange={this.selectToken} value={this.props.selectedToken}>
            <option key={constants.ETHER_ADDRESS} value={constants.ETHER_ADDRESS}>Ether - {this.props.balance} wei</option>
            {tokenOptions}
          </select>
          Selected: {this.props.selectedToken}
        </label>
        <label>
          Amount to send:
          <input value={this.props.specifiedAmount} type="number" min="0" step="any" placeholder="Amount to send" onChange={this.specifyAmount}/>
          Specified amount: {this.props.specifiedAmount}
        </label>
      </div>
    )
  }
}
