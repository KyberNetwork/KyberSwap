import React from "react"
import { connect } from "react-redux"

import * as ethUtil from 'ethereumjs-util'

import * as validators from "../../utils/validators"
import * as converters from "../../utils/converter"

import * as exchangeActions from "../../actions/exchangeActions"


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
    if(this.props.form.step == 1){
      this.props.dispatch(exchangeActions.goToStep(2))
    } else if (this.props.form.step == 2){
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
    if (isNaN(this.props.form.sourceAmount) || !this.props.form.sourceAmount || this.props.form.sourceAmount == '') {
      this.props.dispatch(exchangeActions.thowErrorSourceAmount("Source amount must be a number"))
      return false
    }    
    else if (parseFloat(this.props.form.sourceAmount) > parseFloat(converters.toT(this.props.form.sourceBalance, 8))) {
      this.props.dispatch(exchangeActions.thowErrorSourceAmount("Source amount is too high"))
      return false
    }
    return true
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
      <p>You are about to exchange<br/><strong>{sourceAmount.slice(0, 7)}{sourceAmount.length > 7 ? '...' : ''} {sourceTokenSymbol}</strong>&nbsp;for&nbsp;<strong>{destAmount.slice(0, 7)}{destAmount.length > 7 ? '...' : ''} {destTokenSymbol}</strong></p>
    )
  }
  getDesAmount = () => {
    return this.props.form.sourceAmount * converters.toT(this.props.form.offeredRate,6)
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

  formParams = () => {
    var selectedAccount = this.props.account.address
    var sourceToken = this.props.form.sourceToken
    var sourceAmount =  converters.numberToHex(converters.toTWei(this.props.form.sourceAmount))
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
                        onChange = {this.changePassword}
                        onClick = {this.processTx}
                        onCancel = {this.closeModal}
                        passwordError={this.props.form.errors.passwordError || this.props.form.bcError.message} />
    )
  }
  contentConfirm = () => {
    return (
      <ConfirmTransferModal recap={this.createRecap()}
                    onCancel={this.closeModalConfirm}
                    onExchange = {this.processTxAfterConfirm} 
                    type = "exchange"
                    />      
    )
  }
  contentApprove = () =>{
    return (
      <ApproveModal recap="Please approve"
                    onCancel={this.closeModalApprove}
                    onSubmit = {this.approveTx} />      
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
    var modalPassphrase = this.props.account.type === "keystore" ? (
      <Modal
        className={{base: 'reveal tiny',
            afterOpen: 'reveal tiny'}}
        isOpen={this.props.form.passphrase}
        onRequestClose={this.closeModal}
        contentLabel="password modal"
        content={this.content()}
        size="tiny"
      />
    ) : (
    <div>
      <Modal
        className={{base: 'reveal tiny',
            afterOpen: 'reveal tiny'}}
        isOpen={this.props.form.confirmColdWallet}
        onRequestClose={this.closeModalConfirm}
        contentLabel="confirm modal"
        content={this.contentConfirm()}
        size="tiny"
      />
      <Modal className={{base: 'reveal tiny',
            afterOpen: 'reveal tiny'}}
        isOpen={this.props.form.confirmApprove}
        onRequestClose={this.closeModalApprove}
        contentLabel="approve modal"
        content={this.contentApprove()}
        size="tiny"
      />
      {/* <Modal className={{base: 'reveal tiny',
            afterOpen: 'reveal tiny'}}
        isOpen={this.props.form.showConfirmApprove}
        onRequestClose={this.closeModalConfirmApprove}
        contentLabel="confirm approve modal"
        content={this.contentConfirmApprove()}
        size="tiny"
      /> */}
    </div>
  )
      
    return (
      <div>
        <div class="row hide-on-choose-token-pair">
          <div class="column small-11 medium-10 large-9 small-centered text-center">
            <p class="note">Passphrase is needed for each exchange transaction</p><a class="button accent" onClick={this.clickExchange} data-open="passphrase-modal">Exchange</a>
          </div>
        </div>
        <div class="row show-on-choose-token-pair">
          <div class="column small-11 medium-10 large-9 small-centered text-center">
            <p class="note">Passphrase is needed for each exchange transaction</p><a class="button accent next animated pulse infinite" onClick={this.clickExchange}>Next</a>
          </div>
        </div>
        
        {modalPassphrase}
      </div>
    )
  }
}