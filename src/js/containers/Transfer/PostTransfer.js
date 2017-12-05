import React from "react"
import { connect } from "react-redux"

import constants from "../../services/constants"

import * as validators from "../../utils/validators"
import * as converters from "../../utils/converter"

import * as transferActions from "../../actions/transferActions"

import { PassphraseModal, ConfirmTransferModal, PostTransferBtn } from "../../components/Transaction"

import { Modal } from "../../components/CommonElement"
import { getTranslate } from 'react-localize-redux';

@connect((store, props) => {
  const tokens = store.tokens.tokens
  const tokenSymbol = store.transfer.tokenSymbol
  var balance = 0
  var decimal = 18
  if (tokens[tokenSymbol]) {
    balance = tokens[tokenSymbol].balance
    decimal = tokens[tokenSymbol].decimal
  }
  return {
    account: store.account.account,
    transfer: store.transfer,
    form: { ...store.transfer, balance, decimal },
    ethereum: store.connection.ethereum,
    keyService: props.keyService,
    translate: getTranslate(store.locale)
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
        case "privateKey":
        case "trezor":
        case "ledger":
        case "metamask":
          this.props.dispatch(transferActions.showConfirm())
          break
      }

    }
  }
  validateTransfer = () => {
    //check dest address is an ethereum address
    var check = true
    var checkNumber = true
    if (validators.verifyAccount(this.props.form.destAddress.trim()) !== null) {
      this.props.dispatch(transferActions.throwErrorDestAddress("error.dest_address"))
      check = false
    }
    var testGasPrice = parseFloat(this.props.form.gasPrice)
    if (isNaN(testGasPrice)) {
      this.props.dispatch(transferActions.thowErrorGasPrice("Gas price is not number"))
      check = false
    }
    if (isNaN(parseFloat(this.props.form.amount))) {
      this.props.dispatch(transferActions.thowErrorAmount("error.amount_must_be_number"))
      check = false
      checkNumber = false
    }
    if (!checkNumber) {
      return false
    }
    var amountBig = converters.stringEtherToBigNumber(this.props.form.amount, this.props.form.decimal)
    if (amountBig.greaterThan(this.props.form.balance)) {
      this.props.dispatch(transferActions.thowErrorAmount("error.amount_transfer_too_hign"))
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
        passwordError={this.props.form.errors.passwordError || this.props.form.bcError} 
        translate={this.props.translate}
      />
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
  createRecap = () => {
    var form = this.props.form;
    var amount = form.amount.toString();
    var destAddress = form.destAddress;
    var tokenSymbol = form.tokenSymbol;
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
  closeModal = () => {
    switch (this.props.account.type) {
      case "keystore":
        this.props.dispatch(transferActions.hidePassphrase())
        break
      case "privateKey":
      case "trezor":
      case "ledger":
        this.props.dispatch(transferActions.hideConfirm())
        break
    }

  }
  changePassword = () => {
    this.props.dispatch(transferActions.changePassword())
  }
  formParams = () => {
    var selectedAccount = this.props.account.address
    var token = this.props.form.token
    var amount = converters.stringToHex(this.props.form.amount, this.props.form.decimal)
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

  processTx = (password) => {
    try {
      if (this.props.account.type !== "keystore") {
        password = ''
      }
      const params = this.formParams()
      // sending by wei
      var account = this.props.account
      var ethereum = this.props.ethereum
      var formId = "transfer"
      var data = this.recap()
      this.props.dispatch(transferActions.processTransfer(formId, ethereum, account.address,
        params.token, params.amount,
        params.destAddress, params.nonce, params.gas,
        params.gasPrice, account.keystring, account.type, password, account, data, this.props.keyService))
    } catch (e) {
      console.log(e)
      this.props.dispatch(transferActions.throwPassphraseError("Key derivation failed"))
    }
  }
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
    let className = "button accent "
    if (!validators.anyErrors(this.props.form.errors)) {
      className += " animated infinite pulse next"
    }
    return (
      <PostTransferBtn 
        className={className}
        modalPassphrase={modalPassphrase}
        submit={this.clickTransfer} 
        accountType = {this.props.account.type}
        isConfirming={this.props.form.isConfirming}
        translate={this.props.translate}
      />
    )
  }
}