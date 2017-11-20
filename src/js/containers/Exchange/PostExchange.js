import React from "react"
import { connect } from "react-redux"

import * as ethUtil from 'ethereumjs-util'

import * as validators from "../../utils/validators"
import * as converters from "../../utils/converter"

import * as exchangeActions from "../../actions/exchangeActions"

import { Modal } from "../../components/CommonElement"
import { PassphraseModal, ConfirmTransferModal, ApproveModal, PostExchangeBtn } from "../../components/Transaction"

@connect((store, props) => {
  var sourceTokenSymbol = store.exchange.sourceTokenSymbol
  var tokens = store.tokens.tokens
  var sourceBalance = 0
  var sourceDecimal = 18
  if (tokens[sourceTokenSymbol]) {
    sourceBalance = tokens[sourceTokenSymbol].balance
    sourceDecimal = tokens[sourceTokenSymbol].decimal
  }

  var destTokenSymbol = store.exchange.destTokenSymbol
  var destDecimal = 18
  if (tokens[destTokenSymbol]) {
    destDecimal = tokens[destTokenSymbol].decimal
  }

  return {
    form: { ...store.exchange, sourceBalance, sourceDecimal, destDecimal },
    account: store.account.account,
    ethereum: store.connection.ethereum,
    keyService: props.keyService
  }
})

export default class PostExchange extends React.Component {
  clickExchange = () => {
    if (this.props.form.step == 1) {
      if (!validators.anyErrors(this.props.form.errors)) {
        this.props.dispatch(exchangeActions.goToStep(2))
      }
    } else if (this.props.form.step == 2) {
      if (this.validateExchange()) {
        //check account type
        switch (this.props.account.type) {
          case "keystore":
            this.props.dispatch(exchangeActions.openPassphrase())
            break
          case "privateKey":
            this.props.dispatch(exchangeActions.showConfirm())
            break
          case "trezor":
          case "ledger":
            if (this.props.form.sourceTokenSymbol === "ETH") {
              this.props.dispatch(exchangeActions.showConfirm())
            } else {
              this.checkTokenBalanceOfColdWallet()
            }
            break
        }
      }
    }
  }
  validateExchange = () => {
    //check source amount
    var check = true
    var validateAmount = validators.verifyAmount(this.props.form.sourceAmount,
      this.props.form.sourceBalance,
      this.props.form.sourceTokenSymbol,
      this.props.form.sourceDecimal,
      this.props.form.minConversionRate,
      this.props.form.destDecimal,
      this.props.form.offeredRateBalance)
    if (validateAmount !== null) {
      this.props.dispatch(exchangeActions.thowErrorSourceAmount("Source amount is " + validateAmount))
      check = false
    }
    var testGasPrice = parseFloat(this.props.form.gasPrice)
    if (isNaN(testGasPrice)) {
      this.props.dispatch(exchangeActions.thowErrorGasPrice("Gas price is not number"))
      check = false
    }
    return check
  }



  createRecap = () => {
    var sourceAmount = this.props.form.sourceAmount.toString();
    var destAmount = this.getDesAmount().toString();
    var sourceTokenSymbol = this.props.form.sourceTokenSymbol;
    var destTokenSymbol = this.props.form.destTokenSymbol
    var recap = `exchange ${this.props.form.sourceAmount.toString().slice(0, 7)}${this.props.form.sourceAmount.toString().length > 7 ? '...' : ''} ${this.props.form.sourceTokenSymbol} for ${this.getDesAmount().toString().slice(0, 7)}${this.getDesAmount().toString().length > 7 ? '...' : ''} ${this.props.form.destTokenSymbol}`
    return (
      <p>You are about to exchange<br /><strong>{sourceAmount.slice(0, 7)}{sourceAmount.length > 7 ? '...' : ''} {sourceTokenSymbol}</strong>&nbsp;for&nbsp;<strong>{destAmount.slice(0, 7)}{destAmount.length > 7 ? '...' : ''} {destTokenSymbol}</strong></p>
    )
  }
  getDesAmount = () => {
    return this.props.form.sourceAmount * converters.toT(this.props.form.offeredRate)
  }

  recap = () => {
    var sourceAmount = this.props.form.sourceAmount;
    var sourceTokenSymbol = this.props.form.sourceTokenSymbol;
    var destAmount = this.getDesAmount().toString();
    var destTokenSymbol = this.props.form.destTokenSymbol;
    return {
      sourceAmount, sourceTokenSymbol, destAmount, destTokenSymbol
    }
  }

  closeModal = (event) => {
    this.props.dispatch(exchangeActions.hidePassphrase())
  }
  closeModalConfirm = (event) => {
    this.props.dispatch(exchangeActions.hideConfirm())
  }
  closeModalApprove = (event) => {
    this.props.dispatch(exchangeActions.hideApprove())
  }
  changePassword = (event) => {
    this.props.dispatch(exchangeActions.changePassword())
  }

  formParams = () => {
    var selectedAccount = this.props.account.address
    var sourceToken = this.props.form.sourceToken
    var sourceAmount = converters.stringToHex(this.props.form.sourceAmount, this.props.form.sourceDecimal)
    var destToken = this.props.form.destToken
    var minConversionRate = converters.numberToHex(this.props.form.minConversionRate)
    var destAddress = this.props.account.address
    var maxDestAmount = converters.numberToHex(this.props.form.maxDestAmount)
    var throwOnFailure = this.props.form.throwOnFailure
    var nonce = validators.verifyNonce(this.props.account.getUsableNonce())
    // should use estimated gas
    var gas = converters.numberToHex(this.props.form.gas)
    // should have better strategy to determine gas price
    var gasPrice = converters.numberToHex(converters.gweiToWei(this.props.form.gasPrice))
    return {
      selectedAccount, sourceToken, sourceAmount, destToken,
      minConversionRate, destAddress, maxDestAmount,
      throwOnFailure, nonce, gas, gasPrice
    }
  }
  checkTokenBalanceOfColdWallet = () => {
    const password = ""
    const params = this.formParams()
    const account = this.props.account
    const ethereum = this.props.ethereum

    const formId = "exchange"
    const data = this.recap()
    this.props.dispatch(exchangeActions.checkTokenBalanceOfColdWallet(formId, ethereum, account.address, params.sourceToken,
      params.sourceAmount, params.destToken, params.destAddress,
      params.maxDestAmount, params.minConversionRate,
      params.throwOnFailure, params.nonce, params.gas,
      params.gasPrice, account.keystring, account.type, password, account, data, this.props.keyService))
  }

  processExchangeAfterApprove = () => {
    const params = this.formParams()
    const account = this.props.account
    const ethereum = this.props.ethereum
    this.props.dispatch(exchangeActions.doApprove(ethereum, params.sourceToken, params.sourceAmount, params.nonce, params.gas, params.gasPrice,
      account.keystring, account.password, account.type, account, this.props.keyService))
  }

  processTx = () => {
    // var errors = {}
    try {
      var password = ""
      if (this.props.account.type === "keystore") {
        password = document.getElementById("passphrase").value
        document.getElementById("passphrase").value = ''
      }
      const params = this.formParams()
      var account = this.props.account
      var ethereum = this.props.ethereum

      var formId = "exchange"
      var data = this.recap()
      this.props.dispatch(exchangeActions.processExchange(formId, ethereum, account.address, params.sourceToken,
        params.sourceAmount, params.destToken, params.destAddress,
        params.maxDestAmount, params.minConversionRate,
        params.throwOnFailure, params.nonce, params.gas,
        params.gasPrice, account.keystring, account.type, password, account, data, this.props.keyService))


    } catch (e) {
      console.log(e)
      this.props.dispatch(exchangeActions.throwPassphraseError("Key derivation failed"))
    }
  }

  // processTxAfterConfirm = () => {
  //   var password = ""
  //   const params = this.formParams()
  //   var account = this.props.account
  //   var ethereum = this.props.ethereum

  //   var formId = "exchange"
  //   var data = this.recap()
  //   this.props.dispatch(exchangeActions.processExchangeAfterConfirm(formId, ethereum, account.address, params.sourceToken,
  //     params.sourceAmount, params.destToken, params.destAddress,
  //     params.maxDestAmount, params.minConversionRate,
  //     params.throwOnFailure, params.nonce, params.gas,
  //     params.gasPrice, account.keystring, account.type, password, account, data, this.props.keyService))
  // }

  content = () => {
    return (
      <PassphraseModal recap={this.createRecap()}
        onChange={this.changePassword}
        onClick={this.processTx}
        onCancel={this.closeModal}
        passwordError={this.props.form.errors.passwordError || this.props.form.bcError.message} />
    )
  }
  contentConfirm = () => {
    return (
      <ConfirmTransferModal recap={this.createRecap()}
        onCancel={this.closeModalConfirm}
        onExchange={this.processTx}
        isConfirming={this.props.form.isConfirming}
        type="exchange"
      />
    )
  }
  contentApprove = () => {
    return (
      <ApproveModal recap="Please approve"
        onCancel={this.closeModalApprove}
        isApproving={this.props.form.isApproving}
        onSubmit={this.processExchangeAfterApprove} />
    )
  }

  render() {
    var modalPassphrase = ""
    var modalConfirm = ""
    var modalApprove = ""
    if (this.props.account.type === "keystore") {
      modalPassphrase = (<Modal
        className={{
          base: 'reveal tiny',
          afterOpen: 'reveal tiny'
        }}
        isOpen={this.props.form.passphrase}
        onRequestClose={this.closeModal}
        contentLabel="password modal"
        content={this.content()}
        size="tiny"
      />)
    } else {
      modalConfirm = (<Modal
        className={{
          base: 'reveal tiny',
          afterOpen: 'reveal tiny'
        }}
        isOpen={this.props.form.confirmColdWallet}
        onRequestClose={this.closeModalConfirm}
        contentLabel="confirm modal"
        content={this.contentConfirm()}
        size="tiny"
      />)
      modalApprove = (
        <Modal className={{
          base: 'reveal tiny',
          afterOpen: 'reveal tiny'
        }}
          isOpen={this.props.form.confirmApprove}
          onRequestClose={this.closeModalApprove}
          contentLabel="approve modal"
          content={this.contentApprove()}
          size="tiny"
        />
      )
    }
    var classNameNext = "button accent animated pulse infinite"
    if (!validators.anyErrors(this.props.form.errors)) {
      classNameNext += " next"
    }
    return (
      <PostExchangeBtn submit={this.clickExchange}
        modalPassphrase={modalPassphrase}
        modalConfirm={modalConfirm}
        modalApprove={modalApprove}
        classNameNext={classNameNext} />
    )
  }
}