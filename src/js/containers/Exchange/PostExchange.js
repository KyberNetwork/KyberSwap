import React from "react"
import { connect } from "react-redux"
import ReactTooltip from 'react-tooltip'

import * as validators from "../../utils/validators"
import * as converters from "../../utils/converter"



import * as exchangeActions from "../../actions/exchangeActions"
import * as utilActions from "../../actions/utilActions"

import {getWalletId} from "../../services/web3"

import { Modal } from "../../components/CommonElement"
import { TermAndServices } from "../../containers/CommonElements"

import { PassphraseModal, ConfirmTransferModal, ApproveModal } from "../../components/Transaction"
import { PostExchangeBtn } from "../../components/Exchange"

import { getTranslate } from 'react-localize-redux';
import { RateBetweenToken } from "../Exchange"
import * as analytics from "../../utils/analytics"

@connect((store, props) => {
  var sourceTokenSymbol = store.exchange.sourceTokenSymbol
  var tokens = store.tokens.tokens
  var sourceBalance = 0
  var sourceDecimal = 18
  var sourceName = "Ether"
  var sourceIcon = "eth.svg"  

  var rateSourceToEth = 0
  if (tokens[sourceTokenSymbol]) {
    sourceBalance = tokens[sourceTokenSymbol].balance
    sourceDecimal = tokens[sourceTokenSymbol].decimal
    sourceName = tokens[sourceTokenSymbol].name
    sourceIcon = tokens[sourceTokenSymbol].icon
    rateSourceToEth = tokens[sourceTokenSymbol].rate
  }

  var destTokenSymbol = store.exchange.destTokenSymbol
  var destBalance = 0
  var destDecimal = 18
  var destName = "Kybernetwork"
  var destIcon = "knc.svg"
  if (tokens[destTokenSymbol]) {
    destBalance = tokens[destTokenSymbol].balance
    destDecimal = tokens[destTokenSymbol].decimal
    destName = tokens[destTokenSymbol].name
    destIcon = tokens[destTokenSymbol].icon
  }

  return {
    form: {
      ...store.exchange, sourceBalance, sourceDecimal, destBalance, destDecimal,
      sourceName, destName, sourceIcon, destIcon, rateSourceToEth
    },
    snapshot: store.exchange.snapshot,
    account: store.account.account,
    ethereum: store.connection.ethereum,
    tokens: store.tokens,
    keyService: props.keyService,
    translate: getTranslate(store.locale),
  }
})

export default class PostExchange extends React.Component {
  constructor() {
    super()
    this.state = { form: {} }
  }
  clickExchange = () => {
    if (this.props.form.errorNotPossessKgt) {
      return
    }
    if (this.props.form.isSelectToken) {
      return
    }
    if (this.props.form.maxCap == 0) {
      let titleModal = this.props.translate('transaction.notification') || 'Notification'
      let contentModal = this.props.translate('transaction.not_enable_exchange') || 'Your address is not enabled for exchange'
      this.props.dispatch(utilActions.openInfoModal(titleModal, contentModal))
      return
    }
    if (validators.anyErrors(this.props.form.errors)) return;
    if (this.props.form.step == 1) {
      if (!validators.anyErrors(this.props.form.errors)) {
        this.props.dispatch(exchangeActions.goToStep(2))
      }
    } else if (this.props.form.step == 2) {
      if (this.validateExchange()) {
        //agree terms and services
        if (!this.props.form.termAgree) {
          let titleModal = this.props.translate('layout.terms_of_service') || 'Terms of Service'
          let contentModal = this.props.translate('error.term_error') || 'You must agree terms and services!'
          return this.props.dispatch(utilActions.openInfoModal(titleModal, contentModal))
        }
        //check account type
        //save a copy of form
        // this.setState({form: this.formParams()})

        this.props.dispatch(exchangeActions.setSnapshot(this.props.form))

        // var ethereum = this.props.ethereum
        // var source = this.props.form.sourceToken
        // var dest = this.props.form.destToken
        // var destTokenSymbol = this.props.form.destTokenSymbol
        // var sourceAmount = this.props.form.sourceAmount
        // var sourceDecimal = this.props.form.sourceDecimal
        // var sourceAmountHex = converters.stringToHex(sourceAmount, sourceDecimal)
        // var rateInit = 0

        // this.props.dispatch(exchangeActions.updateRateExchange(ethereum, source, dest, sourceAmountHex, true, rateInit))

        this.props.dispatch(exchangeActions.updateRateSnapshot(this.props.ethereum))

        switch (this.props.account.type) {
          case "keystore":
            this.props.dispatch(exchangeActions.fetchGasSnapshot())
            this.props.dispatch(exchangeActions.openPassphrase())
            break
          case "privateKey":
            this.props.dispatch(exchangeActions.fetchGasSnapshot())
            this.props.dispatch(exchangeActions.showConfirm())
            break
          case "trezor":
          case "ledger":
          case "metamask":
            if (this.props.form.sourceTokenSymbol === "ETH") {
              this.props.dispatch(exchangeActions.fetchGasSnapshot())
              this.props.dispatch(exchangeActions.showConfirm())
            } else {
              // this.props.dispatch(exchangeActions.fetchGas())
              this.checkTokenBalanceOfColdWallet()
            }
            break
        }
      }
    }
  }

  clickCheckbox = (value) => {
    this.props.dispatch(exchangeActions.setTermAndServices(value))
  }

  validateExchange = () => {
    if (this.props.form.offeredRate === "0") {
      this.props.dispatch(utilActions.openInfoModal(this.props.translate("error.error_occurred"),
        this.props.translate("error.source_amount_rate_error")))
      return false
    }
    // if(this.props.form.error_rate_system){
    //   this.props.dispatch(exchangeActions.setErrorRateSystem())
    //   return false
    // }
    //check source amount
    var check = true
    var validateAmount = validators.verifyAmount(this.props.form.sourceAmount,
      this.props.form.sourceBalance,
      this.props.form.sourceTokenSymbol,
      this.props.form.sourceDecimal,
      this.props.form.rateSourceToEth,
      //this.props.form.offeredRate,      
      this.props.form.destDecimal,
      this.props.form.maxCap)
    var sourceAmountErrorKey
    switch (validateAmount) {
      case "not a number":
        sourceAmountErrorKey = "error.source_amount_is_not_number"
        break
      case "too high":
        sourceAmountErrorKey = "error.source_amount_too_high"
        break
      case "too high cap":
        sourceAmountErrorKey = "error.source_amount_too_high_cap"
        break
      case "too small":
        sourceAmountErrorKey = "error.source_amount_too_small"
        break
      case "too high for reserve":
        sourceAmountErrorKey = "error.source_amount_too_high_for_reserve"
        break
    }

    if (this.props.form.sourceAmount) {
      var validateWithFee = validators.verifyBalanceForTransaction(this.props.tokens.tokens['ETH'].balance, this.props.form.sourceTokenSymbol,
        this.props.form.sourceAmount, this.props.form.gas + this.props.form.gas_approve, this.props.form.gasPrice)

      if (validateWithFee) {
        this.props.dispatch(exchangeActions.thowErrorEthBalance("error.eth_balance_not_enough_for_fee"))
        check = false
      }
    }

    if (sourceAmountErrorKey) {
      this.props.dispatch(exchangeActions.thowErrorSourceAmount(sourceAmountErrorKey))
      check = false
    }
    var testGasPrice = parseFloat(this.props.form.gasPrice)
    if (isNaN(testGasPrice)) {
      this.props.dispatch(exchangeActions.thowErrorGasPrice("error.gas_price_not_number"))
      check = false
    } else {
      if (parseFloat(this.props.form.gasPrice) > this.props.form.maxGasPrice) {
        this.props.dispatch(exchangeActions.thowErrorGasPrice("error.gas_price_limit"))
        check = false
      }
    }

    var testRate = parseFloat(this.props.form.minConversionRate)
    if (isNaN(testRate)) {
      this.props.dispatch(exchangeActions.thowErrorRate(this.props.translate("error.rate_not_number") || "Rate is not number"))
      check = false
    }
    return check
  }

  createRecap = () => {
    if (!this.props.snapshot || !Object.keys(this.props.snapshot).length) return

    var sourceAmount = this.props.snapshot.sourceAmount.toString();
    var destAmount = this.props.snapshot.destAmount.toString()
    var sourceTokenSymbol = this.props.snapshot.sourceTokenSymbol
    var destTokenSymbol = this.props.snapshot.destTokenSymbol
    var sourceIcon = this.props.form.sourceIcon
    var destIcon = this.props.form.destIcon

    var minRate = this.props.snapshot.minConversionRate
    var offeredRate = this.props.snapshot.offeredRate
    if (converters.compareRate(minRate, offeredRate) === 1) {
      return (
        <div className="confirm-exchange-modal">
          <div className="modal-title message">
            {this.props.translate("transaction.about_to_swap") || "You are about to swap"}
          </div>
          <div className="amount">
            <div className="amount-item amount-left">
              <div className="d-flex">
                <div className="item-icon">
                  <img src={require("../../../assets/img/tokens/" + sourceIcon)} />
                </div>
                <span>
                  {sourceAmount.slice(0, 7)}{sourceAmount.length > 7 ? '...' : ''} {sourceTokenSymbol}
                </span>
              </div>
            </div>
            <div className="space"><img src={require("../../../assets/img/confirm-exchange-arrow.svg")}/></div>
            <div className="amount-item amount-right">
              {this.props.snapshot.isFetchingRate ?
                <img src={require('../../../assets/img/waiting-white.svg')} />
                :
                <div className="d-flex">
                  <div className="item-icon">
                    <img src={require("../../../assets/img/tokens/" +destIcon)} />
                  </div>
                  <span className="grid-x">
                    {destAmount.slice(0, 7)}{destAmount.length > 7 ? '...' : ''} {destTokenSymbol}
                  </span>
                </div>
              }

            </div>
          </div>
          {!this.props.snapshot.isFetchingRate &&
            <div className="description error">
              <span className="error-text">
                {this.props.translate("error.min_rate_greater_expected_rate") || "Your configured minimal exchange rate is higher than what is recommended by KyberNetwork. Your exchange has high chance to fail"}
              </span>
            </div>
          }
        </div>
      )
    } else {
      var slippagePercent = converters.calculatePercentRate(minRate, offeredRate)
      return (
        <div className="confirm-exchange-modal">
          <div className="title-description">
            {this.props.translate("transaction.about_to_swap") || "You are about to swap"}
          </div>
          <div className="amount">
            <div className="amount-item amount-left">
              <div className="grid-x">
                <div className="cell medium-3 small-12 amount-icon">
                  <img src={require("../../../assets/img/tokens/" + sourceIcon)} />
                </div>
                <div className="cell medium-9 small-12">
                  <div className="amount-detail">
                    <span>
                      {sourceAmount.slice(0, 7)}{sourceAmount.length > 7 ? '...' : ''}
                    </span>
                    <span>
                      {sourceTokenSymbol}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="space"><img src={require("../../../assets/img/exchange/arrow-right-orange.svg")}/></div>
            <div className="amount-item amount-right">
              {this.props.snapshot.isFetchingRate ?
                <img src={require('../../../assets/img/waiting-white.svg')} />
                :
                <div className="grid-x">
                  <div className="cell medium-3 small-12 amount-icon">
                    <img src={require("../../../assets/img/tokens/" + destIcon)} />
                  </div>
                  <div className="cell medium-9 small-12">
                    <div className="amount-detail">
                      <span>
                        {destAmount.slice(0, 7)}{destAmount.length > 7 ? '...' : ''}
                      </span>
                      <span>
                        {destTokenSymbol}
                      </span>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      )
    }

  }
  getDesAmount = () => {
    return this.props.form.sourceAmount * converters.toT(this.props.form.offeredRate)
  }

  recap = () => {
    var sourceAmount = this.props.snapshot.sourceAmount;
    var sourceTokenSymbol = this.props.snapshot.sourceTokenSymbol;
    var destAmount = this.props.snapshot.destAmount
    var destTokenSymbol = this.props.snapshot.destTokenSymbol;
    return {
      sourceAmount, sourceTokenSymbol, destAmount, destTokenSymbol
    }
  }

  closeModal = (event) => {
    this.props.dispatch(exchangeActions.hidePassphrase())
    this.props.dispatch(exchangeActions.resetSignError())
    analytics.trackClickCloseModal("Passphrase Modal")
  }
  closeModalConfirm = (event) => {
    analytics.trackClickCloseModal("ConfirmTransferModal")
    if (this.props.form.isConfirming) return
    this.props.dispatch(exchangeActions.hideConfirm())
    this.props.dispatch(exchangeActions.resetSignError())
  }
  closeModalApprove = (event) => {
    analytics.trackClickCloseModal("Approve Modal")
    if (this.props.form.isApproving) return
    this.props.dispatch(exchangeActions.hideApprove())
    this.props.dispatch(exchangeActions.resetSignError())
  }
  changePassword = (event) => {
    this.props.dispatch(exchangeActions.changePassword())
  }

  formParams = () => {
    var selectedAccount = this.props.account.address
    var sourceToken = this.props.form.sourceToken
    var sourceAmount = converters.stringToHex(this.props.form.sourceAmount, this.props.form.sourceDecimal)
    var destToken = this.props.form.destToken

    var minConversionRate = converters.toTWei(this.props.form.minConversionRate)
    minConversionRate = converters.numberToHex(minConversionRate)

    var destAddress = this.props.account.address
    var maxDestAmount = converters.biggestNumber()
    var throwOnFailure = this.props.form.throwOnFailure
    var nonce = validators.verifyNonce(this.props.account.getUsableNonce())
    // should use estimated gas
    var gas = converters.numberToHex(this.props.form.gas)
    var gas_approve = converters.numberToHex(this.props.form.gas_approve)
    // should have better strategy to determine gas price
    var gasPrice = Math.round(this.props.form.gasPrice*10)/10
    gasPrice = converters.numberToHex(converters.gweiToWei(gasPrice))

    var sourceTokenSymbol = this.props.form.sourceTokenSymbol
    var balanceData = {
      sourceName: this.props.form.sourceName,
      sourceSymbol: this.props.form.sourceTokenSymbol,
      sourceDecimal: this.props.form.sourceDecimal,
      //source: this.props.form.sourceBalance.toString(),
      destName: this.props.form.destName,
      destDecimal: this.props.form.destDecimal,
      destSymbol: this.props.form.destTokenSymbol,
      //dest: this.props.form.destBalance.toString()
      sourceAmount: this.props.form.balanceData.sourceAmount,
      destAmount: this.props.form.balanceData.destAmount,
    }
    return {
      selectedAccount, sourceToken, sourceAmount, destToken,
      minConversionRate, destAddress, maxDestAmount,
      throwOnFailure, nonce, gas, gas_approve, gasPrice, balanceData, sourceTokenSymbol
    }
  }

  formParamOfSnapshot = () => {
    var selectedAccount = this.props.account.address
    var sourceToken = this.props.snapshot.sourceToken
    var sourceAmount = converters.stringToHex(this.props.snapshot.sourceAmount, this.props.snapshot.sourceDecimal)
    var destToken = this.props.snapshot.destToken

    var minConversionRate = converters.toTWei(this.props.snapshot.minConversionRate)
    minConversionRate = converters.numberToHex(minConversionRate)

    //var blockNo = converters.numberToHexAddress(this.props.snapshot.blockNo)
     // check wallet type
    var walletType = this.props.account.walletType
    //alert(walletType)
    var blockNo =  getWalletId (walletType, this.props.snapshot.blockNo)
    //alert(blockNo)

    var destAddress = this.props.account.address
    var maxDestAmount = converters.biggestNumber()
    var throwOnFailure = this.props.snapshot.throwOnFailure
    var nonce = validators.verifyNonce(this.props.account.getUsableNonce())
    // should use estimated gas
    var gas = converters.numberToHex(this.props.snapshot.gas)
    var gas_approve = converters.numberToHex(this.props.snapshot.gas_approve)
    // should have better strategy to determine gas price
    var gasPrice = Math.round(this.props.snapshot.gasPrice*10)/10
    gasPrice = converters.numberToHex(converters.gweiToWei(gasPrice))

    var sourceTokenSymbol = this.props.snapshot.sourceTokenSymbol
    var balanceData = {
      sourceName: this.props.snapshot.sourceName,
      sourceSymbol: this.props.snapshot.sourceTokenSymbol,
      sourceDecimal: this.props.snapshot.sourceDecimal,
      // source: this.props.snapshot.sourceBalance.toString(),
      destName: this.props.snapshot.destName,
      destDecimal: this.props.snapshot.destDecimal,
      destSymbol: this.props.snapshot.destTokenSymbol,
      //  dest: this.props.snapshot.destBalance.toString(),

      sourceAmount: this.props.form.balanceData.sourceAmount,
      destAmount: this.props.form.balanceData.destAmount,
    }
    return {
      selectedAccount, sourceToken, sourceAmount, destToken,
      minConversionRate, destAddress, maxDestAmount,
      throwOnFailure, nonce, gas, gas_approve, gasPrice, balanceData, sourceTokenSymbol, blockNo
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
    const params = this.formParamOfSnapshot()
    console.log(params)
    const account = this.props.account
    const ethereum = this.props.ethereum
    this.props.dispatch(exchangeActions.doApprove(ethereum, params.sourceToken, params.sourceAmount, params.nonce, params.gas_approve, params.gasPrice,
      account.keystring, account.password, account.type, account, this.props.keyService, params.sourceTokenSymbol))
    analytics.trackClickApproveToken(params.sourceTokenSymbol)
  }

  processTx = () => {
    // var errors = {}
    try {
      var password = ""
      if (this.props.account.type === "keystore") {
        password = document.getElementById("passphrase").value
        document.getElementById("passphrase").value = ''
      }
      //const params = this.formParams()
      const params = this.formParamOfSnapshot()
      //check nonce
      params.nonce = validators.verifyNonce(this.props.account.getUsableNonce())

      var account = this.props.account
      var ethereum = this.props.ethereum

      var formId = "exchange"
      var data = this.recap()
      this.props.dispatch(exchangeActions.processExchange(formId, ethereum, account.address, params.sourceToken,
        params.sourceAmount, params.destToken, params.destAddress,
        params.maxDestAmount, params.minConversionRate,
        params.throwOnFailure, params.nonce, params.gas,
        params.gasPrice, account.keystring, account.type, password, account, data, this.props.keyService, params.balanceData, params.sourceTokenSymbol, params.blockNo))


    } catch (e) {
      console.log(e)
      this.props.dispatch(exchangeActions.throwPassphraseError(this.props.translate("error.passphrase_error")))
    }
    analytics.trackConfirmTransaction(this.props.form.sourceTokenSymbol)
  }

  content = () => {
    var minRate = this.props.snapshot.minConversionRate
    var offeredRate = this.props.snapshot.offeredRate
    var slippagePercent = converters.calculatePercentRate(minRate, offeredRate)
    return (
      <PassphraseModal recap={this.createRecap()}
        onChange={this.changePassword}
        onClick={this.processTx}
        onCancel={this.closeModal}
        passwordError={this.props.form.errors.passwordError || this.props.form.bcError.message}
        translate={this.props.translate}
        isFetchingGas={this.props.form.snapshot.isFetchingGas}
        gasPrice={this.props.form.snapshot.gasPrice}
        gas={this.props.form.snapshot.gas + this.props.form.snapshot.gas_approve}
        isFetchingRate={this.props.snapshot.isFetchingRate}
        title= {this.props.translate('modal.confirm_swap') || "Confirm Swap"}
        slippagePercent = {slippagePercent}
      />
    )
  }
  contentConfirm = () => {
    var minRate = this.props.snapshot.minConversionRate
    var offeredRate = this.props.snapshot.offeredRate
    var slippagePercent = converters.calculatePercentRate(minRate, offeredRate)
    return (
      <ConfirmTransferModal
        recap={this.createRecap()}
        onCancel={this.closeModalConfirm}
        onExchange={this.processTx}
        gasPrice={this.props.form.snapshot.gasPrice}
        gas={this.props.account.type === "privateKey" ? this.props.form.snapshot.gas + this.props.form.snapshot.gas_approve : this.props.form.snapshot.gas}
        isConfirming={this.props.form.isConfirming}
        isFetchingGas={this.props.form.snapshot.isFetchingGas}
        isFetchingRate={this.props.form.snapshot.isFetchingRate}
        type="exchange"
        translate={this.props.translate}
        title= {this.props.translate('modal.confirm_swap') || "Confirm Swap"}
        errors={this.props.form.signError}
        walletType={this.props.account.type}
        slippagePercent = {slippagePercent}
      />
    )
  }
  contentApprove = () => {
    var addressShort = this.props.account.address.slice(0, 8) + "..." + this.props.account.address.slice(-6)
    return (
      <ApproveModal recap="Please approve"
        onCancel={this.closeModalApprove}
        isApproving={this.props.form.isApproving}
        token={this.props.form.sourceTokenSymbol}
        onSubmit={this.processExchangeAfterApprove}
        translate={this.props.translate}
        address={this.props.account.address}
        gasPrice={this.props.form.snapshot.gasPrice}
        gas={this.props.form.snapshot.gas_approve}
        isFetchingGas={this.props.form.snapshot.isFetchingGas}
        errors={this.props.form.signError}
        walletType={this.props.account.type}
      />
    )
  }

  openConfig = () => {
    this.props.dispatch(exchangeActions.toggleAdvance());
  }

  render() {
    var modalPassphrase = ""
    var modalConfirm = ""
    var modalApprove = ""
    if (this.props.account.type === "keystore") {
      modalPassphrase = (<Modal
        className={{
          base: 'reveal medium confirm-modal',
          afterOpen: 'reveal medium confirm-modal'
        }}
        isOpen={this.props.form.passphrase}
        onRequestClose={this.closeModal}
        contentLabel="password modal"
        content={this.content()}
        size="medium"
      />)
    } else {
      modalConfirm = (<Modal
        className={{
          base: 'reveal medium confirm-modal',
          afterOpen: 'reveal medium confirm-modal'
        }}
        isOpen={this.props.form.confirmColdWallet}
        onRequestClose={this.closeModalConfirm}
        contentLabel="confirm modal"
        content={this.contentConfirm()}
        size="medium"
      />)
      modalApprove = (
        <Modal className={{
          base: 'reveal medium confirm-modal',
          afterOpen: 'reveal medium confirm-modal'
        }}
          isOpen={this.props.form.confirmApprove}
          onRequestClose={this.closeModalApprove}
          contentLabel="approve modal"
          content={this.contentApprove()}
          size="medium"
        />
      )
    }
    let className = "button accent "
    if (!this.props.form.errorNotPossessKgt && !validators.anyErrors(this.props.form.errors) && this.props.form.termAgree && !this.props.form.isSelectToken) {
      //className += " animated infinite pulse next"
      className += " next"
    }
    var termAndServices = (
      <TermAndServices
        clickCheckbox={this.clickCheckbox}
        termAgree={this.props.form.termAgree}
      />
    )

    var exchangeRate = {
      sourceToken: this.props.form.sourceTokenSymbol,
      rate: converters.toT(this.props.form.offeredRate),
      destToken: this.props.form.destTokenSymbol,
      percent: "-"
    }

    var rateToken = (
      <RateBetweenToken
        isSelectToken={this.props.form.isSelectToken}
        exchangeRate={exchangeRate}
      />
    )
    return (
      <PostExchangeBtn
        step={this.props.form.step}
        submit={this.clickExchange}
        modalPassphrase={modalPassphrase}
        modalConfirm={modalConfirm}
        modalApprove={modalApprove}
        className={className}
        accountType={this.props.account.type}
        isConfirming={this.props.form.isConfirming}
        isApproving={this.props.form.isApproving}
        translate={this.props.translate}
        termAndServices={termAndServices}
        rateToken={rateToken}
        openConfig={this.openConfig}
        advanced={this.props.form.advanced}
      />
    )
  }
}
