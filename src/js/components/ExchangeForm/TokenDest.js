import React from "react"
import { connect } from "react-redux"
import BigNumber from 'bignumber.js'

import TOKENS from "../../services/supported_tokens"
import { selectDestToken, suggestRate, specifyMinAmount, selectCrossSend, deselectCrossSend } from "../../actions/exchangeFormActions"
import { toTWei, toT } from "../../utils/converter"

import constants from "../../services/constants"


@connect((store, props) => {
  var exchangeForm = store.exchangeForm[props.exchangeFormID]
  exchangeForm = exchangeForm || {...constants.INIT_EXCHANGE_FORM_STATE}
  return {
    destToken: exchangeForm.destToken,
    sourceToken: exchangeForm.sourceToken,
    minConversionRate: exchangeForm.minConversionRate,
    specifiedMinAmount: exchangeForm.minDestAmount,
    error: exchangeForm.errors["minDestAmountError"],
    destTokenError: exchangeForm.errors["destTokenError"],
    isCrossSend: exchangeForm.isCrossSend,
  }
})

export default class TokenDest extends React.Component {

  selectToken(event) {
    this.props.dispatch(
      selectDestToken(this.props.exchangeFormID, event.target.value))
    if (this.props.sourceToken != "" && event.target.value) {
      this.props.dispatch(suggestRate(
        this.props.exchangeFormID,
        this.props.sourceToken,
        event.target.value
      ))
    }
  }

  specifyMinAmount = (event) => {
    var valueString = event.target.value == "" ? "0" : event.target.value
    this.props.dispatch(
      specifyMinAmount(this.props.exchangeFormID, toTWei(valueString)))
  }

  toggleCrossSend = (event) => {
    if (event.target.checked) {
      this.props.dispatch(selectCrossSend(this.props.exchangeFormID))
    } else {
      this.props.dispatch(deselectCrossSend(this.props.exchangeFormID))
    }
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
    var destTokenApp = ""
    if (this.props.isCrossSend || !this.props.allowDirectSend) {
      destTokenApp = (
        <div class="input-group-item">
          <label>For at least</label>
          <div class="input-item input-amount">
            <input value={toT(this.props.specifiedMinAmount)} type="number" min="0" step="any" placeholder="Exchange for at least" onChange={this.specifyMinAmount}/>
            <select class="selectric" value={this.props.destToken} onChange={this.selectToken.bind(this)}>
              <option key={constants.ETHER_ADDRESS} value={constants.ETHER_ADDRESS}>ETH</option>
              {tokenOptions}
            </select>
          </div>
          <div class="extra-info">
            Your min conversion rate: {toT(this.props.minConversionRate)}
          </div>
          { error }
          { destTokenError }
        </div>)
    }
    return (
      <div>
        {this.props.allowDirectSend ?
          <div class="input-group-item">
            <div>
              <input name="cross-send" type="checkbox"
                checked={this.props.isCrossSend}
                onChange={this.toggleCrossSend} />
              <label for="cross-send">Cross send</label>
            </div>
          </div> : ""
        }
        {destTokenApp}
      </div>
      )
  }
}
