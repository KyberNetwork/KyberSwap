import React from "react"
import { connect } from "react-redux"

import * as ethUtil from 'ethereumjs-util'

import { numberToHex, toTWei, gweiToWei, toT, weiToGwei } from "../../utils/converter"
import { verifyAccount, verifyToken, verifyAmount, verifyNonce, verifyNumber, anyErrors } from "../../utils/validators"
//import constants from "../../services/constants"


//import { hidePassphrase, changePassword, throwPassphraseError, finishExchange, hideConfirm } from "../../actions/exchangeActions"
//import * as exchangeActions { thowErrorSourceAmount, openPassphrase, doTransaction, processExchange } from "../../actions/exchangeActions"
import * as exchangeActions from "../../actions/exchangeActions"

import { updateAccount, incManualNonceAccount } from "../../actions/accountActions"
import { addTx } from "../../actions/txActions"
import Tx from "../../services/tx"

import { Modal } from "../../components/CommonElement"
import {PassphraseModal, ConfirmTransferModal, ApproveModal} from "../../components/Transaction"

@connect((store) => {
  var sourceTokenSymbol = store.exchange.sourceTokenSymbol
  var tokens = store.tokens
  var sourceBalance = 0
  if (tokens[sourceTokenSymbol]){    
    sourceBalance = tokens[sourceTokenSymbol].balance    
  }
  
  return {    
    form: { ...store.exchange, sourceBalance },
    account: store.account.account,
    ethereum: store.connection.ethereum
  }
})

export default class PostExchange extends React.Component {
  clickExchange = () => {
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
  validateExchange = () => {
    //check source amount
    if (isNaN(this.props.form.sourceAmount)) {
      this.props.dispatch(exchangeActions.thowErrorSourceAmount("Source amount must be a number"))
      return false
    }    
    else if (parseFloat(this.props.form.sourceAmount) > parseFloat(toT(this.props.form.sourceBalance, 8))) {
      this.props.dispatch(exchangeActions.thowErrorSourceAmount("Source amount is too high"))
      return false
    }
    return true
  }
  content = () => {
    return (
      <PassphraseModal recap={this.createRecap()}
                        onChange = {this.changePassword}
                        onClick = {this.processTx}
                        passwordError={this.props.form.errors.passwordError} />
    )
  }
  contentConfirm = () => {
    return (
      <ConfirmTransferModal recap={this.createRecap()}
                    onCancel={this.closeModalConfirm}
                    onExchange = {this.broacastTx} />      
    )
  }
  contentApprove = () =>{
    return (
      <ApproveModal recap="Please approve"
                    onCancel={this.closeModalApprove}
                    onSubmit = {this.approveTx} />      
    )
  }
  contentConfirmApprove = () =>{
    return (
      <ApproveModal recap="Approve successfully, please exchange"
                    onCancel={this.closeModalConfirmApprove}
                    onSubmit = {this.processTx} />      
    )
  }
  approveTx = () => {
    const params = this.formParams()
    const account = this.props.account
    const ethereum = this.props.ethereum
    this.props.dispatch(exchangeActions.doApprove(ethereum, params.sourceToken, params.sourceAmount, params.nonce, params.gas, params.gasPrice,
      account.keystring, account.password, account.type))
  }
  broacastTx = () => {
    var id = "exchange"
    var ethereum = this.props.ethereum
    var tx = this.props.form.txRaw
    const account = this.props.account
    this.props.dispatch(exchangeActions.doTransaction(id, ethereum, tx, account))
  }
  createRecap = () => {
    var recap = `exchange ${this.props.form.sourceAmount.toString().slice(0, 7)}${this.props.form.sourceAmount.toString().length > 7 ? '...' : ''} ${this.props.form.sourceTokenSymbol} for ${this.getDesAmount().toString().slice(0, 7)}${this.getDesAmount().toString().length > 7 ? '...' : ''} ${this.props.form.destTokenSymbol}`
    return recap
  }
  getDesAmount = () => {
    return this.props.form.sourceAmount * toT(this.props.form.offeredRate,6)
  }

  recap = () => {
    var sourceAmount = this.props.form.sourceAmount.toString();
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
  // broacastTx = () => {
  //   const id = "exchange"
  //   const ethereum = this.props.ethereum
  //   const tx = this.props.form.txRaw
  //   this.props.dispatch(doTransaction(id, ethereum, tx, (ex, trans) => {
  //     this.runAfterBroacastTx(ex, trans)
  //     this.props.dispatch(finishExchange())
  //   }))
  // }
  formParams = () => {
    var selectedAccount = this.props.account.address
    var sourceToken = this.props.form.sourceToken
    var sourceAmount = numberToHex(toTWei(this.props.form.sourceAmount))
    var destToken = this.props.form.destToken
    var minConversionRate = numberToHex(this.props.form.minConversionRate)
    var destAddress = this.props.account.address
    var maxDestAmount = numberToHex(this.props.form.maxDestAmount)
    var throwOnFailure = this.props.form.throwOnFailure
    var nonce = verifyNonce(this.props.account.getUsableNonce())
    // should use estimated gas
    var gas = numberToHex(this.props.form.gas)
    // should have better strategy to determine gas price
    var gasPrice = numberToHex(gweiToWei(this.props.form.gasPrice))
    return {
      selectedAccount, sourceToken, sourceAmount, destToken,
      minConversionRate, destAddress, maxDestAmount,
      throwOnFailure, nonce, gas, gasPrice
    }
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
    // sending by wei
    var account = this.props.account
    var ethereum = this.props.ethereum

   // var call = params.sourceToken == constants.ETHER_ADDRESS ? etherToOthersFromAccount : tokenToOthersFromAccount
    //var dispatch = this.props.dispatch
    var formId = "exchange"    
    this.props.dispatch(exchangeActions.processExchange(formId, ethereum, account.address, params.sourceToken,
      params.sourceAmount, params.destToken, params.destAddress,
      params.maxDestAmount, params.minConversionRate,
      params.throwOnFailure, params.nonce, params.gas,
      params.gasPrice, account.keystring, account.type, password, account))

    // call(
    //   formId, ethereum, account.address, params.sourceToken,
    //   params.sourceAmount, params.destToken, params.destAddress,
    //   params.maxDestAmount, params.minConversionRate,
    //   params.throwOnFailure, params.nonce, params.gas,
    //   params.gasPrice, account.keystring, account.type, password, (ex, trans) => {

    //     this.runAfterBroacastTx(ex, trans)
    //     dispatch(finishExchange())
    //   })


    } catch (e) {
      console.log(e)
      this.props.dispatch(exchangeActions.throwPassphraseError("Key derivation failed"))
      //errors["passwordError"] = e.message
    }
  }

  // runAfterBroacastTx = (ex, trans) => {
  //   const account = this.props.account
  //   const params = this.formParams()
  //   const ethereum = this.props.ethereum
  //   const dispatch = this.props.dispatch
  //   const tx = new Tx(
  //     ex, account.address, ethUtil.bufferToInt(trans.gas),
  //     weiToGwei(ethUtil.bufferToInt(trans.gasPrice)),
  //     ethUtil.bufferToInt(trans.nonce), "pending", "exchange", this.recap())
  //   dispatch(incManualNonceAccount(account.address))
  //   dispatch(updateAccount(ethereum, account))
  //   dispatch(addTx(tx))
  // }

  render() {
    var modalPassphrase = this.props.account.type === "keystore" ? (
      <Modal
        isOpen={this.props.form.passphrase}
        onRequestClose={this.closeModal}
        contentLabel="password modal"
        content={this.content()}
      />
    ) : (<div>
      <Modal
        isOpen={this.props.form.confirmColdWallet}
        onRequestClose={this.closeModalConfirm}
        contentLabel="confirm modal"
        content={this.contentConfirm()}
      />
      <Modal
        isOpen={this.props.form.confirmApprove}
        onRequestClose={this.closeModalApprove}
        contentLabel="approve modal"
        content={this.contentApprove()}
      />
      <Modal
        isOpen={this.props.form.showConfirmApprove}
        onRequestClose={this.closeModalConfirmApprove}
        contentLabel="confirm approve modal"
        content={this.contentConfirmApprove()}
      />
    </div>)
      
    return (
      <div>
        <button onClick={this.clickExchange}>Exchange</button>
        {modalPassphrase}
      </div>
    )
  }
}