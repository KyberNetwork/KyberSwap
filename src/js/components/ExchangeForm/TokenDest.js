import React from "react"
import { connect } from "react-redux"
import BigNumber from 'bignumber.js'

import TOKENS from "../../services/supported_tokens"
import { selectDestToken, suggestRate, specifyMinAmount } from "../../actions/exchangeFormActions"
import { toTWei, toT } from "../../utils/converter"

import constants from "../../services/constants"


@connect((store) => {
  return {
    destToken: store.exchangeForm.destToken,
    sourceToken: store.exchangeForm.sourceToken,
    minConversionRate: store.exchangeForm.minConversionRate,
    specifiedMinAmount: store.exchangeForm.minDestAmount,
    error: store.exchangeForm.errors["minDestAmountError"],
    destTokenError: store.exchangeForm.errors["destTokenError"],
  }
})

export default class TokenDest extends React.Component {

  selectToken(event) {
    this.props.dispatch(selectDestToken(event.target.value))
    if (this.props.sourceToken != "" && event.target.value) {
      this.props.dispatch(suggestRate(
        this.props.sourceToken,
        event.target.value
      ))
    }
  }

  specifyMinAmount = (event) => {
    var valueString = event.target.value == "" ? "0" : event.target.value
    this.props.dispatch(
      specifyMinAmount(toTWei(valueString)))
  }

  render() {
    var tokenOptions = TOKENS.map((tok) => {
      return <option key={tok.address} value={tok.address}>{tok.symbol}</option>
    })
    var error = ""
    if (this.props.error && this.props.error != "") {
      error = (<div class="error">
        <i class="k-icon k-icon-error"></i>
        Specified amount is {this.props.error}
      </div>)
    }
    var destTokenError = ""
    if (this.props.destTokenError && this.props.destTokenError != "") {
      destTokenError = (<div class="error">
        <i class="k-icon k-icon-error"></i>
        {this.props.destTokenError}
      </div>)
    }
    return (
    <div class="input-group-item label-text">
      <div>
        <div class="exchange-account">
          <input value={toT(this.props.specifiedMinAmount)} type="number" min="0" step="any" placeholder="Exchange for at least" onChange={this.specifyMinAmount}/>
          <select class="selectric" value={this.props.destToken} onChange={this.selectToken.bind(this)}>
            <option key={constants.ETHER_ADDRESS} value={constants.ETHER_ADDRESS}>ETH</option>
            {tokenOptions}
          </select>
        </div>
        <div class="usd-convert">
          <label>Your min conversion rate: </label>
          <span>{toT(this.props.minConversionRate)}</span>
        </div>
      </div>
      { error }
      { destTokenError }
    </div>)
  }
}
