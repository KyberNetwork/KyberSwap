import React from "react"
import { connect } from "react-redux"
import * as ethUtil from 'ethereumjs-util'

import { throwError, emptyForm } from "../../actions/exchangeFormActions"
import { updateAccount } from "../../actions/accountActions"
import { addTx } from "../../actions/txActions"
import { verifyAccount, verifyToken, verifyAmount, verifyNonce, verifyNumber } from "../../utils/validators"
import constants from "../../services/constants"
import { etherToOthers, tokenToOthers } from "../../services/exchange"
import Tx from "../../services/tx"


@connect((state) => {
  var address = state.exchangeForm.selectedAccount
  var account = state.accounts.accounts[address]
  var sourceBalance
  var sourceToken = state.exchangeForm.sourceToken
  if ( sourceToken == constants.ETHER_ADDRESS) {
    sourceBalance = (account == undefined ? "0" : account.balance.toString(10))
  } else {
    sourceBalance = (account == undefined ? "0" : account.tokens[sourceToken].balance.toString(10))
  }

  return {
    nonce: (account == undefined ? 0 : account.getUsableNonce()),
    account: account,
    ethereum: state.global.ethereum,
    sourceBalance: sourceBalance,
    keystring: (account == undefined ? "" : account.key),
    selectedAccount: state.exchangeForm.selectedAccount,
    sourceToken: sourceToken,
    sourceAmount: state.exchangeForm.sourceAmount,
    destToken: state.exchangeForm.destToken,
    minConversionRate: state.exchangeForm.minConversionRate,
    destAddress: state.exchangeForm.destAddress,
    maxDestAmount: state.exchangeForm.maxDestAmount,
    throwOnFailure: state.exchangeForm.throwOnFailure,
    gas: state.exchangeForm.gas,
    gasPrice: state.exchangeForm.gasPrice,
    error: state.exchangeForm.error,
  }
})
export default class PostExchange extends React.Component {

  verify = () => {
    var selectedAccount = verifyAccount(this.props.selectedAccount)
    var sourceToken = verifyToken(this.props.sourceToken)
    var sourceAmount = verifyAmount(this.props.sourceAmount, this.props.sourceBalance)
    var destToken = verifyToken(this.props.destToken)
    if (sourceToken == destToken) {
      throw new Error("Exchange between the same currencies")
    }
    var minConversionRate = verifyAmount(this.props.minConversionRate)
    var destAddress = verifyAccount(this.props.destAddress)
    var maxDestAmount = verifyAmount(this.props.maxDestAmount)
    var throwOnFailure = this.props.throwOnFailure
    var error = this.props.error
    var nonce = verifyNonce(this.props.nonce)
    // should use estimated gas
    var gas = verifyNumber(this.props.gas)
    // should have better strategy to determine gas price
    var gasPrice = verifyNumber(this.props.gasPrice)
    var password = document.getElementById("passphrase").value
    if (password == undefined || password == "") {
      throw new Error("Empty password")
    }
    var keystring = this.props.keystring
    if (keystring == undefined || keystring == "") {
      throw new Error("Keystore is not loaded")
    }
    return {
      selectedAccount, sourceToken, sourceAmount, destToken,
      minConversionRate, destAddress, maxDestAmount,
      throwOnFailure, error, nonce, gas, gasPrice,
      password, keystring
    }
  }

  postExchange = (event) => {
    event.preventDefault()
    try {
      var ethereum = this.props.ethereum
      const params = this.verify()
      // sending by wei
      var ex
      if (params.sourceToken == constants.ETHER_ADDRESS) {
        ex = etherToOthers(
          ethereum, params.selectedAccount, params.sourceToken,
          params.sourceAmount, params.destToken, params.destAddress,
          params.maxDestAmount, params.minConversionRate,
          params.throwOnFailure, params.nonce, params.gas,
          params.gasPrice, params.keystring, params.password)
      } else {
        ex = tokenToOthers(
          ethereum, params.selectedAccount, params.sourceToken,
          params.sourceAmount, params.destToken, params.destAddress,
          params.maxDestAmount, params.minConversionRate,
          params.throwOnFailure, params.nonce, params.gas,
          params.gasPrice, params.keystring, params.password)
      }
      const tx = new Tx(
        ex, params.selectedAccount, params.gas, params.gasPrice,
        params.nonce, "pending", params.sourceToken, params.sourceAmount, params.destToken,
        params.minConversionRate, params.destAddress, params.maxDestAmount)
      this.props.dispatch(updateAccount(ethereum, this.props.account))
      this.props.dispatch(emptyForm())
      this.props.dispatch(addTx(tx))
    } catch (e) {
      console.log(e)
      this.props.dispatch(throwError(e.message))
    }
  }

  render() {
    var errorDiv
    if (this.props.error != "") {
      errorDiv = (
        <div data-alert class="alert-box alert radius">
          {this.props.error}
        </div>
      )
    } else {
      errorDiv = ""
    }
    return (
      <div>
        {errorDiv}
        <button class="button" onClick={this.postExchange}>Send</button>
      </div>
    )
  }
}
