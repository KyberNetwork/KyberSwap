import React from "react"
import { connect } from "react-redux"

import constants from "../../services/constants"

import * as validators from "../../utils/validators"
import * as converters from "../../utils/converter"

import * as transferActions from "../../actions/transferActions"
import * as utilActions from "../../actions/utilActions"

import { TermAndServices } from "../../containers/CommonElements"
import { PassphraseModal, ConfirmTransferModal, PostTransferBtn } from "../../components/Transaction"

import { Modal } from "../../components/CommonElement"
import { getTranslate } from 'react-localize-redux';

@connect((store, props) => {
  const tokens = store.tokens.tokens
  const tokenSymbol = store.transfer.tokenSymbol
  var balance = 0
  var decimal = 18
  var tokenName = "kyber"
  if (tokens[tokenSymbol]) {
    balance = tokens[tokenSymbol].balance
    decimal = tokens[tokenSymbol].decimal
    tokenName = tokens[tokenSymbol].name
  }
  return {
    account: store.account.account,
    transfer: store.transfer,
    tokens: store.tokens,
    form: { ...store.transfer, balance, decimal, tokenName },
    ethereum: store.connection.ethereum,
    keyService: props.keyService,
    translate: getTranslate(store.locale)
  };

})


export default class PostTransfer extends React.Component {
  clickTransfer = () => {
    if (validators.anyErrors(this.props.form.errors)) return
    if (this.validateTransfer()) {

      //agree terms and services
      if (!this.props.form.termAgree) {
        let titleModal = this.props.translate('layout.terms_of_service') || 'Terms of Service'
        let contentModal = this.props.translate('error.term_error') || 'You must agree terms and services!'
        return this.props.dispatch(utilActions.openInfoModal(titleModal, contentModal))
      }

      this.props.dispatch(transferActions.setSnapshot(this.props.form))
      this.props.dispatch(transferActions.fetchGasSnapshot())

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

    if (isNaN(parseFloat(this.props.form.amount))) {
      this.props.dispatch(transferActions.thowErrorAmount("error.amount_must_be_number"))
      check = false
      checkNumber = false
    } else {
      var testBalanceWithFee = validators.verifyBalanceForTransaction(this.props.tokens.tokens['ETH'].balance,
        this.props.form.tokenSymbol, this.props.form.amount, this.props.form.gas, this.props.form.gasPrice)
      if (testBalanceWithFee) {
        this.props.dispatch(transferActions.thowErrorEthBalance("error.eth_balance_not_enough_for_fee"))
        check = false
      }
    }


    var testGasPrice = parseFloat(this.props.form.gasPrice)
    if (isNaN(testGasPrice)) {
      this.props.dispatch(transferActions.thowErrorGasPrice("error.gas_price_not_number"))
      check = false
    }

    if (!checkNumber) {
      return false
    }
    var amountBig = converters.stringEtherToBigNumber(this.props.form.amount, this.props.form.decimal)
    if (amountBig.isGreaterThan(this.props.form.balance)) {
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
        isFetchingGas={this.props.form.snapshot.isFetchingGas}
        gasPrice={this.props.form.snapshot.gasPrice}
        gas={this.props.form.snapshot.gas}
      />
    )
  }
  contentConfirm = () => {
    return (
      <ConfirmTransferModal recap={this.createRecap()}
        onCancel={this.closeModal}
        onExchange={this.processTx}
        isConfirming={this.props.form.isConfirming}
        gasPrice={this.props.form.snapshot.gasPrice}
        gas={this.props.form.snapshot.gas}
        isFetchingGas={this.props.form.snapshot.isFetchingGas}
        type="transfer"
        translate={this.props.translate}
        title={this.props.translate("modal.confirm_transfer_title") || "Transfer confirm"}
        errors={this.props.form.signError}
        walletType={this.props.account.type}
      />
    )
  }
  createRecap = () => {
    var form = this.props.form;
    var amount = form.amount.toString();
    var destAddress = form.destAddress;
    var tokenSymbol = form.tokenSymbol;
    return (
      <p>{this.props.translate("transaction.about_to_transfer") || "You are about to transfer"}
        <br />
        <span class="text-success">
          <strong>
            {amount.slice(0, 7)}{amount.length > 7 ? '...' : ''} {tokenSymbol}</strong>
          <span className="color-white">{this.props.translate("transaction.to") || "to"}</span>
          <strong>{destAddress.slice(0, 7)}...{destAddress.slice(-5)}</strong>
        </span>
      </p>
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
      case "trezor":
      case "metamask":
      case "ledger":
      case "privateKey":
        if (this.props.form.isConfirming) return
        this.props.dispatch(transferActions.hideConfirm())
        this.props.dispatch(transferActions.resetSignError())
        break
    }
  }
  changePassword = () => {
    this.props.dispatch(transferActions.changePassword())
  }

  clickCheckbox = (value) => {
    this.props.dispatch(transferActions.setTermAndServices(value))
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
    var balanceData = {
      balance: this.props.form.balance.toString(),
      name: this.props.form.tokenName,
      decimal: this.props.form.decimal,
      tokenSymbol: this.props.form.tokenSymbol,
    }
    return {
      selectedAccount, token, amount, destAddress,
      throwOnFailure, nonce, gas, gasPrice, balanceData
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
        params.gasPrice, account.keystring, account.type, password, account, data, this.props.keyService, params.balanceData))
    } catch (e) {
      console.log(e)
      this.props.dispatch(transferActions.throwPassphraseError(this.props.translate("error.passphrase_error")))
    }
  }

  openConfig = () => {
    this.props.dispatch(transferActions.toggleAdvance());
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
    if (!validators.anyErrors(this.props.form.errors) && this.props.form.termAgree) {
      className += " animated infinite pulse next"
    }

    var termAndServices = (<TermAndServices clickCheckbox={this.clickCheckbox}
      termAgree={this.props.form.termAgree} />)

    return (
      <PostTransferBtn
        className={className}
        modalPassphrase={modalPassphrase}
        submit={this.clickTransfer}
        accountType={this.props.account.type}
        isConfirming={this.props.form.isConfirming}
        translate={this.props.translate}
        step={this.props.transfer.step}
        termAndServices={termAndServices}
        openConfig={this.openConfig}
        advanced={this.props.transfer.advanced}
      />
    )
  }
}