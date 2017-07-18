import React from "react"
import BigNumber from 'bignumber.js'
import { connect } from "react-redux"
import * as ethUtil from 'ethereumjs-util'

import { throwError, emptyForm, nextStep, previousStep } from "../../actions/exchangeFormActions"
import { updateAccount } from "../../actions/accountActions"
import { addTx } from "../../actions/txActions"
import { verifyAccount, verifyToken, verifyAmount, verifyNonce, verifyNumber, anyErrors } from "../../utils/validators"
import { numberToHex } from "../../utils/converter"
import constants from "../../services/constants"
import { etherToOthers, tokenToOthers } from "../../services/exchange"
import Tx from "../../services/tx"


@connect((state) => {
  var address = state.exchangeForm.selectedAccount
  var account = state.accounts.accounts[address]
  var sourceBalance
  var sourceToken = state.exchangeForm.sourceToken
  var destToken = state.exchangeForm.destToken
  if ( sourceToken == constants.ETHER_ADDRESS) {
    sourceBalance = (account == undefined ? "0" : account.balance.toString(10))
  } else {
    sourceBalance = (account == undefined ? "0" : account.tokens[sourceToken].balance.toString(10))
  }

  return {
    nonce: (account == undefined ? 0 : account.getUsableNonce()),
    account: account,
    ethereum: state.connection.ethereum,
    sourceBalance: sourceBalance,
    keystring: (account == undefined ? "" : account.key),
    selectedAccount: state.exchangeForm.selectedAccount,
    sourceToken: sourceToken,
    sourceAmount: state.exchangeForm.sourceAmount,
    destToken: destToken,
    minConversionRate: state.exchangeForm.minConversionRate,
    rate: state.global.rates[sourceToken + "-" + destToken],
    destAddress: state.exchangeForm.destAddress,
    maxDestAmount: state.exchangeForm.maxDestAmount,
    minDestAmount: state.exchangeForm.minDestAmount,
    throwOnFailure: state.exchangeForm.throwOnFailure,
    gas: state.exchangeForm.gas,
    gasPrice: state.exchangeForm.gasPrice,
    step: state.exchangeForm.step,
    offeredRateBalance: state.exchangeForm.offeredRateBalance,
  }
})
export default class PostExchange extends React.Component {

  formParams = () => {
    var selectedAccount = this.props.selectedAccount
    var sourceToken = this.props.sourceToken
    var sourceAmount = numberToHex(this.props.sourceAmount)
    var destToken = this.props.destToken
    var minConversionRate = numberToHex(this.props.minConversionRate)
    var destAddress = this.props.destAddress
    var maxDestAmount = numberToHex(this.props.maxDestAmount)
    var throwOnFailure = this.props.throwOnFailure
    var nonce = verifyNonce(this.props.nonce)
    // should use estimated gas
    var gas = numberToHex(this.props.gas)
    // should have better strategy to determine gas price
    var gasPrice = numberToHex(this.props.gasPrice)
    return {
      selectedAccount, sourceToken, sourceAmount, destToken,
      minConversionRate, destAddress, maxDestAmount,
      throwOnFailure, nonce, gas, gasPrice
    }
  }

  stepOne = () => {
    var errors = {}
    errors["selectedAccountError"] = verifyAccount(this.props.selectedAccount)
    errors["sourceTokenError"] = verifyToken(this.props.sourceToken)
    errors["sourceAmountError"] = verifyAmount(this.props.sourceAmount, this.props.sourceBalance)
    errors["destAddressError"] = verifyAccount(this.props.destAddress)
    if (this.props.sourceToken == this.props.destToken) {
      errors["destTokenError"] = "Exchange between the same currencies"
    }
    errors["minDestAmountError"] = verifyAmount(this.props.minDestAmount, this.props.offeredRateBalance)
    return errors
  }

  stepTwo = () => {
    var errors = {}
    errors["gasError"] = verifyNumber(this.props.gas)
    errors["gasPriceError"] = verifyNumber(this.props.gasPrice)
    return errors
  }

  stepThree = () => {
    var errors = {}
    var password = document.getElementById(this.props.passphraseID).value
    if (password == undefined || password == "") {
      errors["passwordError"] = "Empty password"
    }
    var keystring = this.props.keystring
    if (keystring == undefined || keystring == "") {
      errors["keystringError"] = "Keystore is not loaded"
    }
    var ethereum = this.props.ethereum
    try {
      const params = this.formParams()
      // sending by wei
      var ex
      if (params.sourceToken == constants.ETHER_ADDRESS) {
        ex = etherToOthers(
          ethereum, params.selectedAccount, params.sourceToken,
          params.sourceAmount, params.destToken, params.destAddress,
          params.maxDestAmount, params.minConversionRate,
          params.throwOnFailure, params.nonce, params.gas,
          params.gasPrice, keystring, password)
      } else {
        ex = tokenToOthers(
          ethereum, params.selectedAccount, params.sourceToken,
          params.sourceAmount, params.destToken, params.destAddress,
          params.maxDestAmount, params.minConversionRate,
          params.throwOnFailure, params.nonce, params.gas,
          params.gasPrice, keystring, password)
      }
      const tx = new Tx(
        ex, params.selectedAccount, params.gas, params.gasPrice,
        params.nonce, "pending", "exchange", {
          sourceToken: params.sourceToken,
          sourceAmount: params.sourceAmount,
          destToken: params.destToken,
          minConversionRate: params.minConversionRate,
          destAddress: params.destAddress,
          maxDestAmount: params.maxDestAmount,
        })
      this.props.dispatch(updateAccount(ethereum, this.props.account))
      this.props.dispatch(addTx(tx))
      document.getElementById(this.props.passphraseID).value = ''
    } catch (e) {
      console.log(e)
      errors["passwordError"] = "incorrect"
    }
    return errors
  }

  postExchange = (event) => {
    event.preventDefault()
    switch (this.props.step) {
      case 1: {
        var errors = this.stepOne()
        if (anyErrors(errors)) {
          this.props.dispatch(throwError(errors))
        } else {
          this.props.dispatch(nextStep())
        }
        return
      }
      case 2: {
        var errors = this.stepTwo()
        if (anyErrors(errors)) {
          this.props.dispatch(throwError(errors))
        } else {
          this.props.dispatch(nextStep())
        }
        return
      }
      case 3: {
        var errors = this.stepThree()
        if (anyErrors(errors)) {
          this.props.dispatch(throwError(errors))
        } else {
          this.props.dispatch(nextStep())
          this.props.dispatch(emptyForm())
        }
        return
      }
      case 4: {
        return
      }
    }
  }

  back = (event) => {
    event.preventDefault()
    this.props.dispatch(previousStep())
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
      <div class="navigation-btn">
        {errorDiv}
        { this.props.step != 1 ? <button class="button" onClick={this.back}>Back</button> : "" }
        &nbsp;
        <button class="button" onClick={this.postExchange}>
          Next
        </button>
      </div>
    )
  }
}
