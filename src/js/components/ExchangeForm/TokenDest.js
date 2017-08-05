import React from "react"
import { connect } from "react-redux"
import BigNumber from 'bignumber.js'
import ReactTooltip from 'react-tooltip'

import TOKENS from "../../services/supported_tokens"
import { selectDestToken, suggestRate, specifyMinAmount } from "../../actions/exchangeFormActions"
import { toTWei, toT, calculateDest } from "../../utils/converter"
import { currencies } from "../../utils/store"

import constants from "../../services/constants"


@connect((store, props) => {
  var exchangeForm = store.exchangeForm[props.exchangeFormID]
  exchangeForm = exchangeForm || {...constants.INIT_EXCHANGE_FORM_STATE}
  var sourceToken = exchangeForm.sourceToken
  var destToken = exchangeForm.destToken
  var rate = store.global.rates[sourceToken + "-" + destToken]
  return {
    destToken: destToken,
    sourceToken: sourceToken,
    rate: rate,
    sourceAmount: exchangeForm.sourceAmount,
    minConversionRate: exchangeForm.minConversionRate,
    specifiedMinAmount: exchangeForm.minDestAmount,
    error: exchangeForm.errors["minDestAmountError"],
    destTokenError: exchangeForm.errors["destTokenError"],
    isCrossSend: sourceToken != destToken,
    advanced: exchangeForm.advanced,
  }
})
export default class TokenDest extends React.Component {

  selectToken(event) {
    this.props.dispatch(
      selectDestToken(this.props.exchangeFormID, event.target.value))
    if (this.props.sourceToken != "" && event.target.value) {
      this.props.dispatch(suggestRate(
        this.props.exchangeFormID, constants.RATE_EPSILON))
    }
  }

  specifyMinAmount = (event) => {
    var valueString = event.target.value == "" ? "0" : event.target.value
    this.props.dispatch(
      specifyMinAmount(this.props.exchangeFormID, toTWei(valueString)))
  }

  label = () => {
    if (this.props.expectedAmount) {
      return this.props.exchangeFormID == "quick-exchange" ? "Expected to receive" : "Expected amount"
    } else {
      return this.props.exchangeFormID == "quick-exchange" ? "Exchange for at least" : "Send as at least"
    }
  }

  expectedAmount = () => {
    if (this.props.rate) {
      return toT(calculateDest(this.props.sourceAmount, this.props.rate.rate), 12)
    } else {
      return "This pair of token is not supported"
    }
  }

  render() {
    var tokenOptions = currencies().map((tok) => {
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
    var destTokenApp = null
    if (this.props.isCrossSend || !this.props.allowDirectSend) {
      destTokenApp = (
        <div>
          <div>
            <label>
              { this.label() }
              { this.props.disableMinAmount ?
                "" :
                <span data-tip data-for='min-amount-tooltip'>
                  <i class="k-icon k-icon-question"></i>
                </span>
              }
            </label>

            <ReactTooltip id='min-amount-tooltip' effect="solid" place="right" offset={{'left': -15}} className="k-tooltip">
              <span>Minimum receiving amount:</span> 
              <ul>
                <li>You will likely receive the expected amount.</li>
                <li>In case the rate changes when your transaction is included in a block, this indicates the minimum amount that you want to receive.</li>
              </ul>
            </ReactTooltip>
            { this.props.disableTokenSelect ?
              "" : <select class="selectric" value={this.props.destToken} onChange={this.selectToken.bind(this)}>
                {tokenOptions}
              </select>
            }
            { this.props.disableMinAmount ?
              "" : <input name='token_des' onKeyPress={this.props.onKeyPress} value={toT(this.props.specifiedMinAmount)} type="number" min="0" step="any" placeholder="Exchange for at least" onChange={this.specifyMinAmount}/>
            }
            { this.props.expectedAmount ?
              <span class="expected-amount">{ this.expectedAmount() }</span> : ""
            }
          </div>
          { this.props.disableMinAmount ?
            "" : error
          }
          { destTokenError }
        </div>)
    }
    return destTokenApp
  }
}
