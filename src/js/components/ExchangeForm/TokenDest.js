import React from "react";
import { connect } from "react-redux";

import TOKENS from "../../services/supported_tokens";
import { selectDestToken, suggestRate } from "../../actions/exchangeFormActions";
import constants from "../../services/constants";


@connect((store) => {
  return {
    destToken: store.exchangeForm.destToken,
    sourceToken: store.exchangeForm.sourceToken,
  }
})
export default class TokenDest extends React.Component {
  selectToken(event) {
    this.props.dispatch(selectDestToken(event.target.value));
    if (this.props.sourceToken != "" && event.target.value) {
      this.props.dispatch(suggestRate(
        this.props.sourceToken,
        event.target.value
      ))
    }
  }

  render() {
    var tokenOptions = TOKENS.map((tok) => {
      return <option key={tok.address} value={tok.address}>{tok.name}</option>
    })
    return (
    <label>
      Select destination token:
      <select value={this.props.destToken} onChange={this.selectToken.bind(this)}>
        <option key={constants.ETHER_ADDRESS} value={constants.ETHER_ADDRESS}>Ether</option>
        {tokenOptions}
      </select>
      Selected dest token: {this.props.destToken}
    </label>)
  }
}
