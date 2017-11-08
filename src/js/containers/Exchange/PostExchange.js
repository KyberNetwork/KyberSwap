import React from "react"
import { connect } from "react-redux"

import * as ethUtil from 'ethereumjs-util'

import * as validators from "../../utils/validators"
import * as converters from "../../utils/converter"

import * as exchangeActions from "../../actions/exchangeActions"

import { Modal } from "../../components/CommonElement"
import { PassphraseModal, ConfirmTransferModal, ApproveModal, PostExchangeBtn } from "../../components/Transaction"

@connect((store) => {
  var sourceTokenSymbol = store.exchange.sourceTokenSymbol
  var tokens = store.tokens.tokens
  var sourceBalance = 0
  var sourceDecimal = 18
  if (tokens[sourceTokenSymbol]) {
    sourceBalance = tokens[sourceTokenSymbol].balance
    sourceDecimal = tokens[sourceTokenSymbol].decimal
  }

  return {
    form: { ...store.exchange, sourceBalance, sourceDecimal },
    account: store.account.account,
    ethereum: store.connection.ethereum
  }
})

export default class PostExchange extends React.Component {
  clickExchange = () => {
    if (this.props.form.step == 1) {
      // console.log(this.props.form.errors)
      // console.log(validators.anyErrors(this.props.form.errors))
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
          case "trezor":
          case "ledger":
            this.processTx()
            break
        }
      }
    }
  }
  validateExchange = () => {
    //check source amount
    var validateAmount = validators.verifyAmount(this.props.form.sourceAmount, 
                                                  this.props.form.sourceBalance, 
                                                  this.props.form.sourceDecimal,
                                                  this.props.form.minConversionRate)
    if (validateAmount !== null) {
      this.props.dispatch(exchangeActions.thowErrorSourceAmount("Source amount is " + validateAmount))
      return false
    }
    return true
    // if (isNaN(this.props.form.sourceAmount) || !this.props.form.sourceAmount || this.props.form.sourceAmount == '') {
    //   this.props.dispatch(exchangeActions.thowErrorSourceAmount("Source amount must be a number"))
    //   return false
    // }    
    // var sourceAmountBig = converters.stringToBigNumber(this.props.form.sourceAmount)
    // if (sourceAmountBig.greaterThan(this.props.form.sourceBalance)) {
    //   this.props.dispatch(exchangeActions.thowErrorSourceAmount("Source amount is too high"))
    //   return false
    // }
    // var epsilon = cons
    // if (sourceAmountBig.greaterThan(this.props.form.sourceBalance)) {
    //   this.props.dispatch(exchangeActions.thowErrorSourceAmount("Source amount is too high"))
    //   return false
    // }
    // return true
  }

  approveTx = () => {
    const params = this.formParams()
    const account = this.props.account
    const ethereum = this.props.ethereum
    this.props.dispatch(exchangeActions.doApprove(ethereum, params.sourceToken, params.sourceAmount, params.nonce, params.gas, params.gasPrice,
      account.keystring, account.password, account.type, account))
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
    return this.props.form.sourceAmount * converters.toT(this.props.form.offeredRate, 6)
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
  closeModalConfirmApprove = (event) => {
    this.props.dispatch(exchangeActions.hideConfirmApprove())
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

  // broacastTx = () => {
  //   var id = "exchange"
  //   var ethereum = this.props.ethereum
  //   var tx = this.props.form.txRaw
  //   const account = this.props.account
  //   var data = this.recap()
  //   this.props.dispatch(exchangeActions.doTransaction(id, ethereum, tx, account, data))
  // }

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
        params.gasPrice, account.keystring, account.type, password, account, data))


    } catch (e) {
      console.log(e)
      this.props.dispatch(exchangeActions.throwPassphraseError("Key derivation failed"))
      //errors["passwordError"] = e.message
    }
  }

  processTxAfterConfirm = () => {
    // var errors = {}

    var password = ""
    const params = this.formParams()
    var account = this.props.account
    var ethereum = this.props.ethereum

    var formId = "exchange"
    var data = this.recap()
    this.props.dispatch(exchangeActions.processExchangeAfterConfirm(formId, ethereum, account.address, params.sourceToken,
      params.sourceAmount, params.destToken, params.destAddress,
      params.maxDestAmount, params.minConversionRate,
      params.throwOnFailure, params.nonce, params.gas,
      params.gasPrice, account.keystring, account.type, password, account, data))
  }

  // processTxAfterApprove = ()=>{        
  //   var password = ""
  //   const params = this.formParams()
  //   var account = this.props.account
  //   var ethereum = this.props.ethereum
  //   var formId = "exchange"
  //   var data = this.recap()
  //   this.props.dispatch(exchangeActions.processExchangeAfterApprove(formId, ethereum, account.address, params.sourceToken,
  //     params.sourceAmount, params.destToken, params.destAddress,
  //     params.maxDestAmount, params.minConversionRate,
  //     params.throwOnFailure, params.nonce, params.gas,
  //     params.gasPrice, account.keystring, account.type, password, account, data))
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
        onExchange={this.processTxAfterConfirm}
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
        onSubmit={this.approveTx} />
    )
  }
  // contentConfirmApprove = () =>{
  //   return (
  //     <ApproveModal recap="Approve successfully, please exchange"
  //                   onCancel={this.closeModalConfirmApprove}
  //                   onSubmit = {this.processTxAfterApprove} />      
  //   )
  // }

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