import React from "react"
import BigNumber from 'bignumber.js';
import { connect } from "react-redux"
import * as ethUtil from 'ethereumjs-util'

import { throwError, emptyForm } from "../../actions/paymentFormActions"
import { updateAccount } from "../../actions/accountActions"
import { addTx } from "../../actions/txActions"
import { verifyAccount, verifyToken, verifyAmount, verifyNonce, verifyNumber } from "../../utils/validators"
import constants from "../../services/constants"
import { payByEther, payByToken } from "../../services/payment"
import Tx from "../../services/tx"


@connect((state) => {
  var address = state.paymentForm.selectedWallet
  var wallet = state.wallets.wallets[address]
  var account
  if (wallet) {
    account = state.accounts.accounts[wallet.ownerAddress]
  }
  var sourceBalance
  var sourceToken = state.paymentForm.sourceToken
  var destToken = state.exchangeForm.destToken
  if (sourceToken == constants.ETHER_ADDRESS) {
    sourceBalance = (wallet == undefined ? "0" : wallet.balance.toString(10))
  } else {
    sourceBalance = (wallet == undefined ? "0" : wallet.tokens[sourceToken].balance.toString(10))
  }

  return {
    nonce: (account == undefined ? 0 : account.getUsableNonce()),
    account: account,
    wallet: wallet,
    ethereum: state.connection.ethereum,
    sourceBalance: sourceBalance,
    keystring: (account == undefined ? "" : account.key),
    selectedWallet: state.paymentForm.selectedWallet,
    sourceToken: sourceToken,
    sourceAmount: state.paymentForm.sourceAmount,
    destToken: state.paymentForm.destToken,
    minConversionRate: state.paymentForm.minConversionRate,
    rate: state.global.rates[sourceToken + "-" + destToken],
    destAddress: state.paymentForm.destAddress,
    maxDestAmount: state.paymentForm.maxDestAmount,
    throwOnFailure: state.paymentForm.throwOnFailure,
    onlyApproveToken: state.paymentForm.onlyApproveToken,
    gas: state.paymentForm.gas,
    gasPrice: state.paymentForm.gasPrice,
    error: state.paymentForm.error,
  }
})
export default class Postpayment extends React.Component {

  verify = () => {
    var selectedWallet = verifyAccount(this.props.selectedWallet)
    var sourceToken = verifyToken(this.props.sourceToken)
    var sourceAmount = verifyAmount(this.props.sourceAmount, this.props.sourceBalance)
    var expectedDestAmount = (
      new BigNumber(this.props.sourceAmount))
      .times("1000000000000000000")
      .div(this.props.minConversionRate)
    verifyAmount(
      expectedDestAmount.toString(10),
      this.props.rate.balance)
    var destToken = verifyToken(this.props.destToken)
    if (sourceToken == destToken) {
      throw new Error("payment between the same currencies")
    }
    var minConversionRate = verifyAmount(this.props.minConversionRate)
    var destAddress = verifyAccount(this.props.destAddress)
    var maxDestAmount = verifyAmount(this.props.maxDestAmount)
    var throwOnFailure = this.props.throwOnFailure
    var onlyApproveToken = this.props.onlyApproveToken
    var error = this.props.error
    var nonce = verifyNonce(this.props.nonce)
    // should use estimated gas
    var gas = verifyNumber(this.props.gas)
    // should have better strategy to determine gas price
    var gasPrice = verifyNumber(this.props.gasPrice)
    var password = document.getElementById(this.props.passphraseID).value
    if (password == undefined || password == "") {
      throw new Error("Empty password")
    }
    var keystring = this.props.keystring
    if (keystring == undefined || keystring == "") {
      throw new Error("Keystore is not loaded")
    }
    return {
      selectedWallet, sourceToken, sourceAmount, destToken,
      minConversionRate, destAddress, maxDestAmount,
      throwOnFailure, onlyApproveToken, error, nonce, gas, gasPrice,
      password, keystring
    }
  }

  postPayment = (event) => {
    event.preventDefault()
    try {
      var ethereum = this.props.ethereum
      const params = this.verify()
      // sending by wei
      var ex
      if (params.sourceToken == constants.ETHER_ADDRESS) {
        ex = payByEther(
          ethereum, this.props.wallet, this.props.account,
          params.sourceToken, params.sourceAmount,
          params.destToken, params.destAddress,
          params.maxDestAmount, params.minConversionRate,
          params.throwOnFailure, params.onlyApproveToken,
          "", params.nonce, params.gas, params.gasPrice,
          params.keystring, params.password)
      } else {
        ex = payByToken(
          ethereum, this.props.wallet, this.props.account,
          params.sourceToken, params.sourceAmount,
          params.destToken, params.destAddress,
          params.maxDestAmount, params.minConversionRate,
          params.throwOnFailure, params.onlyApproveToken,
          "", params.nonce, params.gas, params.gasPrice,
          params.keystring, params.password)
      }
      const tx = new Tx(
        ex, params.selectedWallet, params.gas, params.gasPrice,
        params.nonce, "pending", "payment", {
          sourceToken: params.sourceToken,
          sourceAmount: params.sourceAmount,
          destToken: params.destToken,
          minConversionRate: params.minConversionRate,
          destAddress: params.destAddress,
          maxDestAmount: params.maxDestAmount,
          onlyApproveToken: params.onlyApproveToken,
        })
      this.props.dispatch(updateAccount(ethereum, this.props.account))
      this.props.dispatch(addTx(tx))
      document.getElementById(this.props.passphraseID).value = ''
      this.props.dispatch(emptyForm())
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
        <button class="button" onClick={this.postPayment}>Send</button>
      </div>
    )
  }
}
