import React from "react"
import { connect } from "react-redux"
import * as ethUtil from 'ethereumjs-util'

import constants from "../../services/constants"

import * as validators from "../../utils/validators"
import * as converters from "../../utils/converter"

import * as transferActions from "../../actions/transferActions"

import { PassphraseModal, ConfirmTransferModal, PostTransferBtn } from "../../components/Transaction"

import { Modal } from "../../components/CommonElement"

@connect((store, props) => {
  const tokens = store.tokens
  const tokenSymbol = store.transfer.tokenSymbol
  var balance = 0
  if (tokens[tokenSymbol]) {
    balance = tokens[tokenSymbol].balance
  }
  return {
    account: store.account.account,
    transfer: store.transfer,
    form: { ...store.transfer, balance },
    ethereum: store.connection.ethereum
  };

})


export default class PostTransfer extends React.Component {
  clickTransfer = () => {
    if (this.validateTransfer()) {
      //check account type
      switch (this.props.account.type) {
        case "keystore":
          this.props.dispatch(transferActions.openPassphrase())
          break
        case "trezor":
        case "ledger":
          this.props.dispatch(transferActions.showConfirm())
          break
      }

    }
  }
  validateTransfer = () => {
    //check dest address is an ethereum address
    //console.log(validators.verifyAccount(this.props.form.destAddress))
    var check = true
    var checkNumber = true
    if (validators.verifyAccount(this.props.form.destAddress) !== null) {
      this.props.dispatch(transferActions.throwErrorDestAddress("This is not an address"))
      check = false
    }
    if (isNaN(this.props.form.amount) || !this.props.form.amount || this.props.form.amount == '') {
      this.props.dispatch(transferActions.thowErrorAmount("Amount must be a number"))
      check = false
      checkNumber = false
    }
    if(!checkNumber){
      return false
    }
    var amountBig = converters.stringToBigNumber(this.props.form.amount)
    if (amountBig.greaterThan(this.props.form.balance)) {
      this.props.dispatch(transferActions.thowErrorAmount("Amount is too high"))
      check = false
    }
    return check
  }

  content = () => {
    return (
      <PassphraseModal recap={this.createRecap()}
        onChange={this.changePassword}
        onClick={this.processTx}
        onCancel={this.closeModal}
        passwordError={this.props.form.errors.passwordError || this.props.form.bcError} />
    )
  }
  contentConfirm = () => {
    return (
      <ConfirmTransferModal recap={this.createRecap()}
        onCancel={this.closeModal}
        onExchange={this.processTx}
        isConfirming={this.props.form.isConfirming}
        type="transfer"
      />

    )
  }
  // broacastTx = () => {
  //   const id = "transfer"
  //   const ethereum = this.props.ethereum
  //   const tx = this.props.form.txRaw
  //   const account = this.props.account
  //   var data = this.recap()
  //   this.props.dispatch(transferActions.doTransaction(id, ethereum, tx, account, data))
  // }
  createRecap = () => {
    var form = this.props.form;
    var amount = form.amount.toString();
    var destAddress = form.destAddress;
    var tokenSymbol = form.tokenSymbol;
    // return `transfer ${form.amount.toString().slice(0, 7)}${form.amount.toString().length > 7 ? '...' : ''} ${form.tokenSymbol} to ${form.destAddress.slice(0, 7)}...${form.destAddress.slice(-5)}`
    return (
      <p>You are about to transfer<br /><strong>{amount.slice(0, 7)}{amount.length > 7 ? '...' : ''} {tokenSymbol}</strong>&nbsp;to&nbsp;<strong>{destAddress.slice(0, 7)}...{destAddress.slice(-5)}</strong></p>
    )
  }

  recap = () => {
    var amount = this.props.form.amount.toString();
    var tokenSymbol = this.props.form.tokenSymbol;
    var destAddress = this.props.form.destAddress;
    return {
      amount, tokenSymbol, destAddress
    }
  }
  closeModal = (event) => {
    switch (this.props.account.type) {
      case "keystore":
        this.props.dispatch(transferActions.hidePassphrase())
        break
      case "trezor":
      case "ledger":
        this.props.dispatch(transferActions.hideConfirm())
        break
    }

  }
  changePassword = (event) => {
    this.props.dispatch(transferActions.changePassword())
  }
  formParams = () => {
    var selectedAccount = this.props.account.address
    var token = this.props.form.token
    var amount = converters.stringToHex(this.props.form.amount)
    var destAddress = this.props.form.destAddress
    var throwOnFailure = this.props.form.throwOnFailure
    var nonce = validators.verifyNonce(this.props.account.getUsableNonce())
    // should use estimated gas
    var gas = converters.numberToHex(this.props.form.gas)
    // should have better strategy to determine gas price
    var gasPrice = converters.numberToHex(converters.gweiToWei(this.props.form.gasPrice))
    return {
      selectedAccount, token, amount, destAddress,
      throwOnFailure, nonce, gas, gasPrice
    }
  }

  processTx = (event) => {
    try {
      var password = ""
      if (this.props.account.type === "keystore") {
        password = document.getElementById("passphrase").value
        document.getElementById("passphrase").value = ''
      }
      const params = this.formParams()
      //console.log(params)
      //return
      // sending by wei
      var account = this.props.account
      var ethereum = this.props.ethereum

      //var call = params.token == constants.ETHER_ADDRESS ? sendEtherFromAccount : sendTokenFromAccount

      //var dispatch = this.props.dispatch
      //var sourceAccount = account
      var formId = "transfer"
      var data = this.recap()
      this.props.dispatch(transferActions.processTransfer(formId, ethereum, account.address,
        params.token, params.amount,
        params.destAddress, params.nonce, params.gas,
        params.gasPrice, account.keystring, account.type, password, account, data))

      // var formId = "transfer"
      // call(
      //   formId, ethereum, account.address,
      //   params.token, params.amount,
      //   params.destAddress, params.nonce, params.gas,
      //   params.gasPrice, account.keystring, account.type, password, (ex, trans) => {
      //     this.runAfterBroacastTx(ex, trans)
      //     dispatch(finishTransfer())

      //     // const tx = new Tx(
      //     //   ex, account.address, ethUtil.bufferToInt(trans.gas),
      //     //   weiToGwei(ethUtil.bufferToInt(trans.gasPrice)),
      //     //   ethUtil.bufferToInt(trans.nonce), "pending", "send", {
      //     //     sourceToken: params.token,
      //     //     sourceAmount: params.amount,
      //     //     destAddress: params.destAddress,
      //     //   })
      //     // dispatch(incManualNonceAccount(account.address))
      //     // dispatch(updateAccount(ethereum, account))
      //     // dispatch(addTx(tx))
      //   })
      //document.getElementById("passphrase").value = ''
      //dispatch(finishTransfer())
    } catch (e) {
      console.log(e)
      this.props.dispatch(transferActions.throwPassphraseError("Key derivation failed"))
      //errors["passwordError"] = e.message
    }
  }
  // runAfterBroacastTx = (ex, trans) => {
  //   const account = this.props.account
  //   const params = this.formParams()
  //   const ethereum = this.props.ethereum
  //   const dispatch = this.props.dispatch
  //   var recap = this.createRecap()
  //   const tx = new Tx(
  //     ex, account.address, ethUtil.bufferToInt(trans.gas),
  //     weiToGwei(ethUtil.bufferToInt(trans.gasPrice)),
  //     ethUtil.bufferToInt(trans.nonce), "pending", "send", this.recap())
  //   dispatch(incManualNonceAccount(account.address))
  //   dispatch(updateAccount(ethereum, account))
  //   dispatch(addTx(tx))
  // }
  render() {
    var modalPassphrase = this.props.account.type === "keystore" ? (
      <Modal
        className={{
          base: 'reveal tiny',
          afterOpen: 'reveal tiny'
        }}
        isOpen={this.props.form.passphrase}
        onRequestClose={this.closeModal}
        contentLabel="password modal"
        content={this.content()}
        size="tiny"
      />
    ) : <Modal
        className={{
          base: 'reveal tiny',
          afterOpen: 'reveal tiny'
        }}
        isOpen={this.props.form.confirmColdWallet}
        onRequestClose={this.closeModal}
        contentLabel="confirm modal"
        content={this.contentConfirm()}
        size="tiny"
      />
    return (
      <PostTransferBtn modalPassphrase = {modalPassphrase}
                       submit = {this.clickTransfer}  />      
      // <div>
      //   <button onClick={this.clickTransfer}>Transfer</button>
      //   {modalPassphrase}
      // </div>
    )
  }
}