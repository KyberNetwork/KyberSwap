import React from "react"
import BigNumber from 'bignumber.js'
import { connect } from "react-redux"
import * as ethUtil from 'ethereumjs-util'

import { throwError, emptyForm, nextStep, previousStep, resetStep } from "../../actions/exchangeFormActions"
import { updateAccount, incManualNonceAccount } from "../../actions/accountActions"
import { addTx } from "../../actions/txActions"
import { verifyAccount, verifyToken, verifyAmount, verifyNonce, verifyNumber, anyErrors } from "../../utils/validators"
import { numberToHex, gweiToWei, weiToGwei } from "../../utils/converter"
import constants from "../../services/constants"
import { etherToOthersFromAccount, tokenToOthersFromAccount, sendEtherFromAccount, sendTokenFromAccount, exchangeFromWallet, sendEtherFromWallet, sendTokenFromWallet } from "../../services/exchange"
import Tx from "../../services/tx"


@connect((store, props) => {
  var exchangeForm = store.exchangeForm[props.exchangeFormID]
  exchangeForm = exchangeForm || {...constants.INIT_EXCHANGE_FORM_STATE}
  var address = exchangeForm.selectedAccount
  var account = store.accounts.accounts[address]
  var wallet
  if (!account) {
    wallet = store.wallets.wallets[address]
    if (wallet) {
      account = store.accounts.accounts[wallet.ownerAddress]
    }
  }
  var sourceBalance
  var sourceToken = exchangeForm.sourceToken
  var destToken = exchangeForm.destToken
  var sourceAccount = wallet || account
  if (sourceToken == constants.ETHER_ADDRESS) {
    sourceBalance = (sourceAccount == undefined ? "0" : sourceAccount.balance.toString(10))
  } else {
    sourceBalance = (sourceAccount == undefined ? "0" : sourceAccount.tokens[sourceToken].balance.toString(10))
  }

  return {
    nonce: (account == undefined ? 0 : account.getUsableNonce()),
    account: account,
    wallet: wallet,
    ethereum: store.connection.ethereum,
    sourceBalance: sourceBalance,
    keystring: (account == undefined ? "" : account.key),
    selectedAccount: exchangeForm.selectedAccount,
    sourceToken: sourceToken,
    sourceAmount: exchangeForm.sourceAmount,
    destToken: destToken,
    minConversionRate: exchangeForm.minConversionRate,
    rate: store.global.rates[sourceToken + "-" + destToken],
    destAddress: exchangeForm.destAddress,
    maxDestAmount: exchangeForm.maxDestAmount,
    minDestAmount: exchangeForm.minDestAmount,
    throwOnFailure: exchangeForm.throwOnFailure,
    gas: exchangeForm.gas,
    gasPrice: gweiToWei(exchangeForm.gasPrice),
    step: exchangeForm.step,
    offeredRateBalance: exchangeForm.offeredRateBalance,
    isCrossSend: sourceToken != destToken,
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
    errors["destAddressError"] = verifyAccount(this.props.destAddress)
    return errors
  }

  stepTwo = () => {
    var errors = {}
    if (this.props.isCrossSend || !this.props.allowDirectSend) {
      errors["destTokenError"] = verifyToken(this.props.destToken)
      errors["minDestAmountError"] = verifyAmount(this.props.minDestAmount, this.props.offeredRateBalance)
      if (this.props.sourceToken == this.props.destToken) {
        errors["destTokenError"] = "Exchange between the same currencies"
      }
    }
    errors["sourceTokenError"] = verifyToken(this.props.sourceToken)
    errors["sourceAmountError"] = verifyAmount(this.props.sourceAmount, this.props.sourceBalance)
    return errors
  }

  doCrossSend = (keystring, password, ethereum, errors) => {
    try {
      const params = this.formParams()
      // sending by wei
      var account = this.props.account
      var wallet = this.props.wallet
      var call
      if (wallet) {
        call = exchangeFromWallet
      } else {
        call = params.sourceToken == constants.ETHER_ADDRESS ? etherToOthersFromAccount : tokenToOthersFromAccount
      }
      var dispatch = this.props.dispatch
      var sourceAccount = wallet || account
      call(
        this.props.exchangeFormID, ethereum, account.address, params.sourceToken,
        params.sourceAmount, params.destToken, params.destAddress,
        params.maxDestAmount, params.minConversionRate,
        params.throwOnFailure, params.nonce, params.gas,
        params.gasPrice, keystring, password, (ex, trans) => {
          const tx = new Tx(
            ex, sourceAccount.address, ethUtil.bufferToInt(trans.gas),
            weiToGwei(ethUtil.bufferToInt(trans.gasPrice)),
            ethUtil.bufferToInt(trans.nonce), "pending", "exchange", {
              sourceToken: params.sourceToken,
              sourceAmount: params.sourceAmount,
              destToken: params.destToken,
              minConversionRate: params.minConversionRate,
              destAddress: params.destAddress,
              maxDestAmount: params.maxDestAmount,
            })
          dispatch(incManualNonceAccount(account.address))
          dispatch(updateAccount(ethereum, account))
          dispatch(addTx(tx))
        }, wallet)
      document.getElementById(this.props.passphraseID).value = ''
    } catch (e) {
      console.log(e)
      errors["passwordError"] = e.message
    }
    return errors
  }

  doDirectSend = (keystring, password, ethereum, errors) => {
    try {
      const params = this.formParams()
      var account = this.props.account
      var wallet = this.props.wallet
      var call
      // sending from a wallet
      if (wallet) {
        call = params.sourceToken == constants.ETHER_ADDRESS ? sendEtherFromWallet : sendTokenFromWallet
      } else {
      // sending from a normal account
        call = params.sourceToken == constants.ETHER_ADDRESS ? sendEtherFromAccount : sendTokenFromAccount
      }
      var dispatch = this.props.dispatch
      var sourceAccount = wallet || account
      call(
        this.props.exchangeFormID, ethereum, account.address,
        params.sourceToken, params.sourceAmount,
        params.destAddress, params.nonce, params.gas,
        params.gasPrice, keystring, password, (ex, trans) => {
          const tx = new Tx(
            ex, sourceAccount.address, ethUtil.bufferToInt(trans.gas),
            weiToGwei(ethUtil.bufferToInt(trans.gasPrice)),
            ethUtil.bufferToInt(trans.nonce), "pending", "send", {
              sourceToken: params.sourceToken,
              sourceAmount: params.sourceAmount,
              destAddress: params.destAddress,
            })
          dispatch(incManualNonceAccount(account.address))
          dispatch(updateAccount(ethereum, account))
          dispatch(addTx(tx))
        }, wallet)
      document.getElementById(this.props.passphraseID).value = ''
    } catch (e) {
      console.log(e)
      errors["passwordError"] = e.message
    }
    return errors
  }

  stepAdvance = () => {
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
    if (this.props.isCrossSend || this.props.exchangeFormID == "quick-exchange") {
      return this.doCrossSend(keystring, password, ethereum, errors)
    } else {
      return this.doDirectSend(keystring, password, ethereum, errors)
    }
  }

  postExchange = (event) => {
    event.preventDefault()
    switch (this.props.step) {
      case 1: {
        var errors = this.stepOne()
        if (anyErrors(errors)) {
          this.props.dispatch(throwError(this.props.exchangeFormID, errors))
        } else {
          this.props.dispatch(nextStep(this.props.exchangeFormID))
        }
        return
      }
      case 2: {
        var errors = this.stepTwo()
        if (anyErrors(errors)) {
          this.props.dispatch(throwError(this.props.exchangeFormID, errors))
        } else {
          this.props.dispatch(nextStep(this.props.exchangeFormID))
        }
        return
      }
      case "advance": {
        var errors = this.stepAdvance()
        if (anyErrors(errors)) {
          this.props.dispatch(throwError(this.props.exchangeFormID, errors))
        } else {
          this.props.dispatch(nextStep(this.props.exchangeFormID))
        }
        return
      }
      case 3: {
        var errors = this.stepThree()
        if (anyErrors(errors)) {
          this.props.dispatch(throwError(this.props.exchangeFormID, errors))
        } else {
          this.props.dispatch(nextStep(this.props.exchangeFormID))
          this.props.dispatch(emptyForm(this.props.exchangeFormID))
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
    this.props.dispatch(previousStep(this.props.exchangeFormID))
  }

  onClose = (event) => {
    event.preventDefault()
    this.props.postExchangeHandler(event)
    this.props.dispatch(emptyForm(this.props.exchangeFormID))
    this.props.dispatch(resetStep(this.props.exchangeFormID))
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
        <div>
          <button
            onClick={this.back}
            className={this.props.step == 1 || this.props.step == 4 || (this.props.step == 2 && this.props.exchangeFormID == "quick-exchange")? "hide" : ""}>
            <i class="k-icon k-icon-back"></i><span>Back</span></button>
          { this.props.step == 4 ?
            <button class="button done" onClick={this.onClose}>
              Done
            </button> :
            <button onClick={this.postExchange} id="next-exchange"> 
              <span>Next</span><i class="k-icon k-icon-next"></i>
            </button>
          }
        </div>
      </div>
    )
  }
}
