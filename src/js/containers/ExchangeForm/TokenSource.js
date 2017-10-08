import React from "react"
import { connect } from "react-redux"

import {selectSourceToken, specifySourceAmount, suggestRate} from "../../actions/exchangeFormActions"
import {toT, toTWei} from "../../utils/converter"
import constants from "../../services/constants"
import {getSourceAccount} from "../../utils/store"


@connect((store, props) => {
  var exchangeForm = store.exchangeForm[props.exchangeFormID]
  exchangeForm = exchangeForm || {...constants.INIT_EXCHANGE_FORM_STATE}
  var selectedAccount = exchangeForm.selectedAccount
  var account = getSourceAccount(store, selectedAccount)
  if (account) {
    var selectedToken = exchangeForm.sourceToken
    var selectedTokenBalance
    if (selectedToken == constants.ETHER_ADDRESS) {
      selectedTokenBalance = account.balance.toString(10)
    } else {
      selectedTokenBalance = account.tokens[selectedToken].balance.toString(10)
    }
    return {
      tokens: Object.keys(account.tokens).map((addr) => {
        return {
          name: account.tokens[addr].name,
          icon: account.tokens[addr].icon,
          symbol: account.tokens[addr].symbol,
          address: account.tokens[addr].address,
          balance: account.tokens[addr].balance.toString(10),
        }
      }),
      balance: account.balance.toString(10),
      selectedToken: selectedToken,
      selectedTokenBalance: selectedTokenBalance,
      specifiedAmount: exchangeForm.sourceAmount,
      destToken: exchangeForm.destToken,
      error: exchangeForm.errors["sourceAmountError"],
      sourceTokenError: exchangeForm.errors["sourceTokenError"],
    }
  } else {
    return {
      tokens: [],
      balance: 0,
      selectedToken: exchangeForm.sourceToken,
      specifiedAmount: exchangeForm.sourceAmount,
      destToken: exchangeForm.destToken,
      selectedTokenBalance: 0,
      error: "",
      sourceTokenError: "",
    }
  }
})
export default class TokenSource extends React.Component {

  selectToken(event) {
    this.props.dispatch(
      selectSourceToken(this.props.exchangeFormID, event.target.value))
    if (event.target.value != "" && this.props.destToken) {
      this.props.dispatch(suggestRate(
        this.props.exchangeFormID, constants.RATE_EPSILON))
    }
  }

  specifyAmount(event) {
    var valueString = event.target.value == "" ? "0" : event.target.value
    this.props.dispatch(specifySourceAmount(
      this.props.exchangeFormID,
      toTWei(valueString)))
  }

  render() {
    var tokenOptions = this.props.tokens.map((token) => {
      return <option key={token.address} value={token.address}>{token.symbol}</option>
    })
    var error = ""
    if (this.props.error && this.props.error != "") {
      error = (<div class="error source">
        <i class="k-icon k-icon-error"></i>
        Specified amount is {this.props.error}
      </div>)
    }
    var sourceTokenError = ""
    if (this.props.sourceTokenError && this.props.sourceTokenError != "") {
      sourceTokenError = (<div class="error">
        <i class="k-icon k-icon-error"></i>
        {this.props.sourceTokenError}
      </div>)
    }
    return (
      <li>
        <div>
          <label>{ this.props.exchangeFormID == "quick-exchange" ? "Exchange" : "Send"}</label>
          <select onChange={this.selectToken.bind(this)} value={this.props.selectedToken}>
            <option key={constants.ETHER_ADDRESS} value={constants.ETHER_ADDRESS}>ETH</option>
            {tokenOptions}
          </select>
          <input name='token_source' onKeyPress={this.props.onKeyPress} type="number" min="0" step="any" placeholder="Amount to exchange" onChange={this.specifyAmount.bind(this)}/>
        </div>
        <div class="helper">
          Your balance: {toT(this.props.selectedTokenBalance, 8)}
        </div>
        { error }
        { sourceTokenError }
      </li>
    )
  }
}
