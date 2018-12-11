import React from "react"
import { connect } from "react-redux"
import { push } from 'react-router-redux';
import * as converters from "../../utils/converter"
import { TransactionConfig } from "../../components/Transaction"
import { ExchangeBodyLayout } from "../../components/Exchange"
import { AdvanceConfigLayout, GasConfig, MinConversionRate } from "../../components/TransactionCommon"
import { TransactionLoading, Token } from "../CommonElements"
import { TokenSelector, AccountBalance } from "../TransactionCommon"
import { SwapBalanceModal } from "../Exchange"
import * as validators from "../../utils/validators"
import * as common from "../../utils/common"
import { openTokenModal, hideSelectToken } from "../../actions/utilActions"
import * as globalActions from "../../actions/globalActions"
import * as exchangeActions from "../../actions/exchangeActions"
import * as analytics from "../../utils/analytics"
import constansts from "../../services/constants"
import { getTranslate } from 'react-localize-redux'
import { default as _ } from 'underscore';
import BLOCKCHAIN_INFO from "../../../../env";
import * as web3Package from "../../services/web3"
import { importAccountMetamask } from "../../actions/accountActions"
import EthereumService from "../../services/ethereum/ethereum"

@connect((store, props) => {
  const langs = store.locale.languages
  const currentLang = common.getActiveLanguage(langs)
  const ethereum = store.connection.ethereum
  const account = store.account
  const exchange = store.exchange
  const tokens = store.tokens.tokens
  const translate = getTranslate(store.locale)
  var sourceTokenSymbol = store.exchange.sourceTokenSymbol
  var sourceBalance = 0
  var sourceDecimal = 18
  var sourceName = "Ether"
  var rateSourceToEth = 0

  if (tokens[sourceTokenSymbol]) {
    sourceBalance = tokens[sourceTokenSymbol].balance
    sourceDecimal = tokens[sourceTokenSymbol].decimals
    sourceName = tokens[sourceTokenSymbol].name
    rateSourceToEth = tokens[sourceTokenSymbol].rate
  }

  var destTokenSymbol = store.exchange.destTokenSymbol
  var destBalance = 0
  var destDecimal = 18
  var destName = "Kybernetwork"

  if (tokens[destTokenSymbol]) {
    destBalance = tokens[destTokenSymbol].balance
    destDecimal = tokens[destTokenSymbol].decimals
    destName = tokens[destTokenSymbol].name
  }

  return {
    account, ethereum, tokens, translate, currentLang,
    global: store.global,
    exchange: {
      ...store.exchange, sourceBalance, sourceDecimal, destBalance, destDecimal,
      sourceName, destName, rateSourceToEth,
      advanceLayout: props.advanceLayout
    }
  }
})

export default class ExchangeBody extends React.Component {
  constructor() {
    super()
    this.state = {
      focus: ""
    }
  }

  componentDidMount = () => {
    if (this.props.global.changeWalletType !== "swap") this.props.dispatch(globalActions.closeChangeWallet())

    const web3Service = web3Package.newWeb3Instance();

    if (web3Service !== false) {
      const walletType = web3Service.getWalletType();
      const isDapp = (walletType !== "metamask") && (walletType !== "modern_metamask");

      if (isDapp) {
        const ethereumService = this.props.ethereum ? this.props.ethereum : new EthereumService();

        this.props.dispatch(importAccountMetamask(web3Service, BLOCKCHAIN_INFO.networkId,
          ethereumService, this.props.tokens, this.props.translate, walletType))
      }
    }
  }

  validateTxFee = (gasPrice) => {
    if (this.props.account.account === false){
      return
    }
    var validateWithFee = validators.verifyBalanceForTransaction(this.props.tokens['ETH'].balance, this.props.exchange.sourceTokenSymbol,
    this.props.exchange.sourceAmount, this.props.exchange.gas + this.props.exchange.gas_approve, gasPrice)

    if (validateWithFee) {
      this.props.dispatch(exchangeActions.thowErrorEthBalance("error.eth_balance_not_enough_for_fee"))
      return
    }
  }
  lazyValidateTransactionFee = _.debounce(this.validateTxFee, 500)

  chooseToken = (symbol, address, type) => {
    this.props.dispatch(exchangeActions.selectTokenAsync(symbol, address, type, this.props.ethereum))
    var path
    if (type === "source"){
      path = constansts.BASE_HOST + "/swap/" + symbol.toLowerCase() + "_" + this.props.exchange.destTokenSymbol.toLowerCase()
      analytics.trackChooseToken("from", symbol)
    }else{
      path = constansts.BASE_HOST + "/swap/" + this.props.exchange.sourceTokenSymbol.toLowerCase() + "_" + symbol.toLowerCase()
      analytics.trackChooseToken("to", symbol)
    }

    path = common.getPath(path, constansts.LIST_PARAMS_SUPPORTED)
    this.props.dispatch(globalActions.goToRoute(path))
    // analytics.trackChooseToken(type, symbol)
  }

  dispatchUpdateRateExchange = (sourceValue) => {
    var sourceDecimal = 18
    var sourceTokenSymbol = this.props.exchange.sourceTokenSymbol

    if (sourceTokenSymbol === "ETH") {
      if (parseFloat(sourceValue) > 1000) {
        this.props.dispatch(exchangeActions.throwErrorHandleAmount())
        return
      }
    } else {
      var destValue = converters.caculateDestAmount(sourceValue, this.props.exchange.rateSourceToEth, 6)
      if (parseFloat(destValue) > 1000) {
        this.props.dispatch(exchangeActions.throwErrorHandleAmount())
        return
      }
    }

    //var minRate = 0
    var tokens = this.props.tokens
    if (tokens[sourceTokenSymbol]) {
      sourceDecimal = tokens[sourceTokenSymbol].decimals
      //minRate = tokens[sourceTokenSymbol].minRate
    }

    var ethereum = this.props.ethereum
    var source = this.props.exchange.sourceToken
    var dest = this.props.exchange.destToken
    var destTokenSymbol = this.props.exchange.destTokenSymbol
    //var sourceAmountHex = stringToHex(sourceValue, sourceDecimal)
    var rateInit = 0
    if (sourceTokenSymbol === 'ETH' && destTokenSymbol !== 'ETH') {
      rateInit = this.props.tokens[destTokenSymbol].minRateEth
    }
    if (sourceTokenSymbol !== 'ETH' && destTokenSymbol === 'ETH') {
      rateInit = this.props.tokens[sourceTokenSymbol].minRate
    }

    this.props.dispatch(exchangeActions.updateRateExchange(ethereum, source, dest, sourceValue, sourceTokenSymbol, true, rateInit))
  }

  validateSourceAmount = (value) => {
    // var check = true
    var sourceAmount = value
    var validateAmount = validators.verifyAmount(sourceAmount,
      this.props.exchange.sourceBalance,
      this.props.exchange.sourceTokenSymbol,
      this.props.exchange.sourceDecimal,
      //this.props.exchange.offeredRate,
      this.props.exchange.rateSourceToEth,
      this.props.exchange.destDecimal,
      this.props.exchange.maxCap)
    var sourceAmountErrorKey = false
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
      // case "too small":
      //   sourceAmountErrorKey = "error.source_amount_too_small"
      //   break
      case "too high for reserve":
        sourceAmountErrorKey = "error.source_amount_too_high_for_reserve"
        break
    }

    if (sourceAmountErrorKey === "error.source_amount_is_not_number") {
      return
    }

    if (sourceAmountErrorKey !== false && sourceAmountErrorKey !== "error.source_amount_is_not_number") {
      this.props.dispatch(exchangeActions.thowErrorSourceAmount(sourceAmountErrorKey))
      return
      //check = false
    }

    var validateWithFee = validators.verifyBalanceForTransaction(this.props.tokens['ETH'].balance, this.props.exchange.sourceTokenSymbol,
      sourceAmount, this.props.exchange.gas + this.props.exchange.gas_approve, this.props.exchange.gasPrice)

    if (validateWithFee) {
      this.props.dispatch(exchangeActions.thowErrorEthBalance("error.eth_balance_not_enough_for_fee"))
      return
      // check = false
    }
  }

  lazyUpdateRateExchange = _.debounce(this.dispatchUpdateRateExchange, 500)
  lazyUpdateValidateSourceAmount = _.debounce(this.validateSourceAmount, 500)

  validateRateAndSource = (sourceValue) => {
    this.lazyUpdateRateExchange(sourceValue)
    if (this.props.account.account !== false) {
      this.lazyUpdateValidateSourceAmount(sourceValue)
    }
  }
  changeSourceAmount = (e) => {
    var value = e.target.value
    if (value < 0) return
    this.props.dispatch(exchangeActions.inputChange('source', value));

    this.validateRateAndSource(value)
  }

  changeDestAmount = (e) => {
    var value = e.target.value
    if (value < 0) return
    this.props.dispatch(exchangeActions.inputChange('dest', value))

    var valueSource = converters.caculateSourceAmount(value, this.props.exchange.offeredRate, 6)
    this.validateRateAndSource(valueSource)
  }

  focusSource = () => {
    this.props.dispatch(exchangeActions.focusInput('source'));
    this.setState({focus:"source"})
    analytics.trackClickInputAmount("from")
  }

  blurSource = () => {
    this.setState({ focus: "" })
  }

  focusDest = () => {
    this.props.dispatch(exchangeActions.focusInput('dest'));
    this.setState({focus:"dest"})
    analytics.trackClickInputAmount("to")
  }

  blurDest = () => {
    this.setState({ focus: "" })
  }

  makeNewExchange = () => {
    this.props.dispatch(exchangeActions.makeNewExchange());
    analytics.trackClickNewTransaction("Swap")
  }  

  setAmount = () => {
    var tokenSymbol = this.props.exchange.sourceTokenSymbol
    var token = this.props.tokens[tokenSymbol]
    if (token) {
      var balanceBig = converters.stringToBigNumber(token.balance)
      if (tokenSymbol === "ETH") {
        var gasLimit = this.props.exchange.max_gas
        var gasPrice = converters.stringToBigNumber(converters.gweiToWei(this.props.exchange.gasPrice))
        var totalGas = gasPrice.multipliedBy(gasLimit)

        if (!balanceBig.isGreaterThanOrEqualTo(totalGas)) {
          return false
        }
        balanceBig = balanceBig.minus(totalGas)
      }
      var balance = balanceBig.div(Math.pow(10, token.decimals)).toString(10)

      this.focusSource()

      this.props.dispatch(exchangeActions.inputChange('source', balance))
      this.props.ethereum.fetchRateExchange(true)
    }
    analytics.trackClickAllIn("Swap", tokenSymbol)
  }

  swapToken = () => {
    this.props.dispatch(exchangeActions.swapToken())
    this.props.ethereum.fetchRateExchange(true)

    var path = constansts.BASE_HOST + "/swap/" + this.props.exchange.destTokenSymbol.toLowerCase() + "_" + this.props.exchange.sourceTokenSymbol.toLowerCase()
    path = common.getPath(path, constansts.LIST_PARAMS_SUPPORTED)
    this.props.dispatch(globalActions.goToRoute(path))
    analytics.trackClickSwapDestSrc(this.props.exchange.sourceTokenSymbol, this.props.exchange.destTokenSymbol)
  }

  analyze = () => {
    var ethereum = this.props.ethereum
    var exchange = this.props.exchange
    this.props.dispatch(exchangeActions.analyzeError(ethereum, exchange.txHash))
  }

  toggleBalanceContent = (value) => {
    this.props.dispatch(exchangeActions.toggleBalanceContent(value))    
  }

  specifyGasPrice = (value) => {
    this.props.dispatch(exchangeActions.specifyGasPrice(value + ""))
    if (this.props.account !== false && !this.props.global.isChangingWallet) {
      this.lazyValidateTransactionFee(value)
    }
  }

  selectedGasHandler = (value, level, levelString) => {
    this.props.dispatch(exchangeActions.seSelectedGas(level))
    this.specifyGasPrice(value)
    analytics.trackChooseGas(value, levelString)
  }

  handleSlippageRateChanged = (e, isInput = false) => {
    const offeredRate  = this.props.exchange.offeredRate;
    let value = isInput ? 100 - e.currentTarget.value : e.currentTarget.value;

    if (value > 100) {
      value = 100;
    } else if (value < 0) {
      value = 0;
    }

    const minRate = converters.caculatorRateToPercentage(value, offeredRate);

    this.props.dispatch(exchangeActions.setMinRate(minRate.toString()));
    analytics.trackSetNewMinrate(value)
  }

  getAdvanceLayout = () => {
    const minConversionRate = (
      <MinConversionRate
        isSelectToken={this.props.exchange.isSelectToken}
        minConversionRate={this.props.exchange.minConversionRate}
        offeredRate={this.props.exchange.offeredRate}
        slippageRate={this.props.exchange.slippageRate}
        onSlippageRateChanged={this.handleSlippageRateChanged}
        sourceTokenSymbol={this.props.exchange.sourceTokenSymbol}
        destTokenSymbol={this.props.exchange.destTokenSymbol}
      />
    );

    return (
      <AdvanceConfigLayout
        selectedGas={this.props.exchange.selectedGas}
        selectedGasHandler={this.selectedGasHandler}
        gasPriceSuggest={this.props.exchange.gasPriceSuggest}
        translate={this.props.translate}
        isBalanceActive = {this.props.exchange.isBalanceActive}
        toggleBalanceContent={this.toggleBalanceContent}
        minConversionRate={minConversionRate}
      />
    )
  }

  getBalanceLayout = () => {
    return (
      <AccountBalance
        chooseToken={this.chooseToken}
        sourceActive={this.props.exchange.sourceTokenSymbol}
        destTokenSymbol={this.props.exchange.destTokenSymbol}
        onToggleBalanceContent={this.toggleBalanceContent}
        isBalanceActive = {this.props.exchange.isBalanceActive}
        tradeType = "swap"
      />)
  }

  getSwapBalance = () => {
    return (
      <SwapBalanceModal />
    )
  }

  closeChangeWallet = () => {
    this.props.dispatch(globalActions.closeChangeWallet())
  }

  clearSession = (e) => {
    this.props.dispatch(globalActions.clearSession(this.props.exchange.gasPrice))
    // this.props.dispatch(globalActions.setGasPrice(this.props.ethereum))
  }

  render() {
    var balanceInfo = {
      sourceAmount: converters.toT(this.props.exchange.balanceData.sourceAmount, this.props.exchange.balanceData.sourceDecimal),
      sourceSymbol: this.props.exchange.balanceData.sourceSymbol,
      sourceTokenName: this.props.exchange.balanceData.sourceName,
      destAmount: converters.toT(this.props.exchange.balanceData.destAmount, this.props.exchange.balanceData.destDecimal),
      destTokenName: this.props.exchange.balanceData.destName,
      destSymbol: this.props.exchange.balanceData.destSymbol,
    }

    var analyze = {
      action: this.analyze,
      isAnalize: this.props.exchange.isAnalize,
      isAnalizeComplete: this.props.exchange.isAnalizeComplete,
      analizeError: this.props.exchange.analizeError
    }
    var transactionLoadingScreen = (
      <TransactionLoading
        tx={this.props.exchange.txHash}
        tempTx={this.props.exchange.tempTx}
        makeNewTransaction={this.makeNewExchange}
        type="exchange"
        balanceInfo={balanceInfo}
        broadcasting={this.props.exchange.broadcasting}
        broadcastingError={this.props.exchange.broadcastError}
        analyze={analyze}
        isOpen={this.props.exchange.step === 3}
      />
    )

    //--------For select token
    var tokenDest = {}
    var isNotSupport = false
    Object.keys(this.props.tokens).map((key, i) => {
      isNotSupport = false
      if (this.props.exchange.sourceTokenSymbol === key) {
        isNotSupport = true
      }
      if (this.props.exchange.sourceTokenSymbol !== "ETH" && key !== "ETH") {
        isNotSupport = true
      }
      tokenDest[key] = { ...this.props.tokens[key], isNotSupport: isNotSupport }
    })

    var tokenSourceSelect = (
      <TokenSelector
        type="source"
        focusItem={this.props.exchange.sourceTokenSymbol}
        listItem={this.props.tokens}
        chooseToken={this.chooseToken}
      />
    )
    var tokenDestSelect = (
      <TokenSelector
        type="des"
        focusItem={this.props.exchange.destTokenSymbol}
        listItem={tokenDest}
        chooseToken={this.chooseToken}
      />
    )
    //--------End

    var errors = {
      selectSameToken: this.props.exchange.errors.selectSameToken || '',
      selectTokenToken: this.props.exchange.errors.selectTokenToken || '',
      sourceAmount: this.props.exchange.errors.sourceAmountError || this.props.exchange.errors.ethBalanceError || '',
      tokenSource: '',
      rateSystem: this.props.exchange.errors.rateSystem,
      rateAmount: this.props.exchange.errors.rateAmount,
      notPossessKgt: this.props.exchange.errors.notPossessKgt,
      exchange_enable: this.props.exchange.errors.exchange_enable
    }

    var input = {
      sourceAmount: {
        type: 'number',
        value: this.props.exchange.sourceAmount,
        onChange: this.changeSourceAmount,
        onFocus: this.focusSource,
        onBlur: this.blurSource
      },
      destAmount: {
        type: 'number',
        value: this.props.exchange.destAmount,
        onChange: this.changeDestAmount,
        onFocus: this.focusDest,
        onBlur: this.blurDest
      }
    }

    var addressBalance = ""
    var token = this.props.tokens[this.props.exchange.sourceTokenSymbol]
    if (token) {
      addressBalance = {
        value: converters.toT(token.balance, token.decimals),
        roundingValue: converters.roundingNumber(converters.toT(token.balance, token.decimals))
      }
    }

    var maxCap = this.props.exchange.maxCap
    if (maxCap !== "infinity") {
      maxCap = converters.toEther(this.props.exchange.maxCap)
    }

    return (
      <ExchangeBodyLayout
        chooseToken={this.chooseToken}
        exchange={this.props.exchange}
        account={this.props.account.account}
        step={this.props.exchange.step}
        tokenSourceSelect={tokenSourceSelect}
        tokenDestSelect={tokenDestSelect}
        transactionLoadingScreen={transactionLoadingScreen}
        errors={errors}
        input={input}
        addressBalance={addressBalance}
        sourceTokenSymbol={this.props.exchange.sourceTokenSymbol}
        destTokenSymbol={this.props.exchange.destTokenSymbol}
        translate={this.props.translate}
        swapToken={this.swapToken}
        maxCap={maxCap}
        errorNotPossessKgt={this.props.exchange.errorNotPossessKgt}
        isAgreed={this.props.global.termOfServiceAccepted}
        advanceLayout={this.getAdvanceLayout()}
        balanceLayout={this.getBalanceLayout()}
        focus={this.state.focus}
        networkError={this.props.global.network_error}
        isChangingWallet = {this.props.global.isChangingWallet}
        changeWalletType = {this.props.global.changeWalletType}
        closeChangeWallet = {this.closeChangeWallet}
        global={this.props.global}
        swapBalance = {this.getSwapBalance()}
        clearSession={this.clearSession}
        walletName={this.props.account.walletName}
      />
    )
  }
}
