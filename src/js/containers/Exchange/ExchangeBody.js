import React from "react"
import { connect } from "react-redux"
import { push } from 'react-router-redux';
import * as converters from "../../utils/converter"
import { MinRate } from "../Exchange"
import { TransactionConfig } from "../../components/Transaction"
import { ExchangeBodyLayout } from "../../components/Exchange"
import { AddressBalance, AdvanceConfigLayout, GasConfig } from "../../components/TransactionCommon"
import { TransactionLoading, Token } from "../CommonElements"
import { TokenSelector, AccountBalance } from "../TransactionCommon"
import * as validators from "../../utils/validators"
import * as common from "../../utils/common"
import { openTokenModal, hideSelectToken } from "../../actions/utilActions"
import * as globalActions from "../../actions/globalActions"
import * as exchangeActions from "../../actions/exchangeActions"
import * as analytics from "../../utils/analytics"
import constansts from "../../services/constants"
import { getTranslate } from 'react-localize-redux'
import { default as _ } from 'underscore';
import { isMobile } from "../../utils/common";
import Web3Service from "../../services/web3"

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
    sourceDecimal = tokens[sourceTokenSymbol].decimal
    sourceName = tokens[sourceTokenSymbol].name
    rateSourceToEth = tokens[sourceTokenSymbol].rate
  }

  var destTokenSymbol = store.exchange.destTokenSymbol
  var destBalance = 0
  var destDecimal = 18
  var destName = "Kybernetwork"
  if (tokens[destTokenSymbol]) {
    destBalance = tokens[destTokenSymbol].balance
    destDecimal = tokens[destTokenSymbol].decimal
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
      focus: "",
      isAndroid: false,
      isIos: false
    }
  }

  componentDidMount = () => {
    var web3Service = new Web3Service();

    if (!web3Service.isHaveWeb3()) {
      if (isMobile.iOS()) {
        this.setState({isIos: true})
      } else if (isMobile.Android()) {
        this.setState({isAndroid: true});
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
      // check = false
    }
  }
  lazyValidateTransactionFee = _.debounce(this.validateTxFee, 500)

  chooseToken = (symbol, address, type) => {
    this.props.dispatch(exchangeActions.selectTokenAsync(symbol, address, type, this.props.ethereum))
    var path;

    if (type === "source") {
      path = constansts.BASE_HOST + "/swap/" + symbol.toLowerCase() + "_" + this.props.exchange.destTokenSymbol.toLowerCase();
    } else {
      path = constansts.BASE_HOST + "/swap/" + this.props.exchange.sourceTokenSymbol.toLowerCase() + "_" + symbol.toLowerCase();
    }

    path = common.getPath(path, constansts.LIST_PARAMS_SUPPORTED)
    this.props.dispatch(globalActions.goToRoute(path))
    analytics.trackChooseToken(type, symbol)
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
      sourceDecimal = tokens[sourceTokenSymbol].decimal
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
      case "too small":
        sourceAmountErrorKey = "error.source_amount_too_small"
        break
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

    var valueSource = caculateSourceAmount(value, this.props.exchange.offeredRate, 6)
    this.validateRateAndSource(valueSource)
  }

  focusSource = () => {
    this.props.dispatch(exchangeActions.focusInput('source'));
    this.setState({focus:"source"})
    analytics.trackClickInputAmount("source")
  }

  blurSource = () => {
    this.setState({ focus: "" })
  }

  focusDest = () => {
    this.props.dispatch(exchangeActions.focusInput('dest'));
    this.setState({focus:"dest"})
    analytics.trackClickInputAmount("dest")
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
      var balance = balanceBig.div(Math.pow(10, token.decimal)).toString(10)
      //balance = toPrimitiveNumber(balance)

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

  changeChartRange = (value) => {
    this.props.dispatch(exchangeActions.setChartTimeRange(value))
  }

  toggleChartContent = (value) => {
    this.props.dispatch(exchangeActions.toggleChartContent(value))
  }

  toggleBalanceContent = (value) => {
    this.props.dispatch(exchangeActions.toggleBalanceContent(value))    
  }

  specifyGas = (event) => {
    var value = event.target.value
    this.props.dispatch(exchangeActions.specifyGas(value))
  }

  specifyGasPrice = (value) => {
    this.props.dispatch(exchangeActions.specifyGasPrice(value + ""))
    if (this.props.account !== false) {
      this.lazyValidateTransactionFee(value)
    }
  }

  inputGasPriceHandler = (value) => {
    // this.setState({selectedGas: "undefined"})
    this.specifyGasPrice(value)
  }

  selectedGasHandler = (value, level, levelString) => {

    //this.setState({selectedGas: level})
    this.props.dispatch(exchangeActions.seSelectedGas(level))
    this.specifyGasPrice(value)
    analytics.trackChooseGas(value, levelString)
  }

  toggleRightPart = (value) => {
    this.props.dispatch(exchangeActions.toggleRightPart(value))
    analytics.trackClickTheRightWing("swap")
  }

  getAdvanceLayout = () => {
    if (!this.props.exchange.isOpenRight) {
      return (
        <div onClick={(e) => this.toggleRightPart(true)}>
          <div className="toogle-side toogle-advance">
            <div className="toogle-content toogle-content-advance">
              <div>{this.props.translate("transaction.advanced") || "Advance"}</div>
            </div>
          </div>
          <div className="advance-title-mobile title ">
            <div>
              {this.props.translate("transaction.advanced") || "Advanced"}
              {/* <img src={require("../../../assets/img/exchange/arrow-down-swap.svg")} id="advance-arrow" className="advance-arrow-up"/> */}
              <div id="advance-arrow" className="advance-arrow-up"></div>
            </div>
          </div>
        </div>
      )
    }

    var gasPrice = converters.stringToBigNumber(converters.gweiToEth(this.props.exchange.gasPrice))
    var totalGas = gasPrice.multipliedBy(this.props.exchange.gas + this.props.exchange.gas_approve)
    var page = "exchange"
    var gasConfig = (
      <GasConfig
        gas={this.props.exchange.gas + this.props.exchange.gas_approve}
        gasPrice={this.props.exchange.gasPrice}
        maxGasPrice={this.props.exchange.maxGasPrice}
        gasHandler={this.specifyGas}
        inputGasPriceHandler={this.inputGasPriceHandler}
        selectedGasHandler={this.selectedGasHandler}
        gasPriceError={this.props.exchange.errors.gasPriceError}
        gasError={this.props.exchange.errors.gasError}
        totalGas={totalGas.toString()}
        translate={this.props.translate}
        gasPriceSuggest={this.props.exchange.gasPriceSuggest}
        selectedGas={this.props.exchange.selectedGas}
        page={page}
      />
    )

    var minRate = <MinRate />
    var advanceConfig = <AdvanceConfigLayout minRate={minRate} gasConfig={gasConfig} translate={this.props.translate} />
    return advanceConfig
  }

  toggleLeftPart = (value) => {
    this.props.dispatch(exchangeActions.toggleLeftPart(value))
    analytics.trackClickTheLeftWing("swap")
  }

  getBalanceLayout = () => {
    if (!this.props.exchange.isOpenLeft) {
      return (
        <div className="toogle-side toogle-wallet" onClick={(e) => this.toggleLeftPart(true)}>
          <div className="toogle-content toogle-content-wallet">
            <div>{this.props.translate("transaction.wallet") || "Wallet"}</div>
          </div>
          <div className="wings-dropdown"></div>
        </div>
      )
      // return <div><button onClick={(e) => this.toggleLeftPart(true) }>Open left</button></div>
    }
    return (
      <AccountBalance
        chooseToken={this.chooseToken}
        sourceActive={this.props.exchange.sourceTokenSymbol}
        destTokenSymbol={this.props.exchange.destTokenSymbol}
        isChartActive={this.props.exchange.chart.isActive}
        
        chartTimeRange={this.props.exchange.chart.timeRange}
        onChangeChartRange={this.changeChartRange}
        onToggleChartContent={this.toggleChartContent}
        onToggleBalanceContent={this.toggleBalanceContent}
        isBalanceActive = {this.props.exchange.isBalanceActive}
      />)
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
      <TokenSelector type="source"
        focusItem={this.props.exchange.sourceTokenSymbol}
        listItem={this.props.tokens}
        chooseToken={this.chooseToken}
      />
    )
    var tokenDestSelect = (
      <TokenSelector type="des"
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
        value: converters.toT(token.balance, token.decimal),
        roundingValue: converters.roundingNumber(converters.toT(token.balance, token.decimal))
      }
    }

    var addressBalanceLayout = ""
    if (this.props.account.account !== false) {
      addressBalanceLayout = (
        <AddressBalance setAmount={this.setAmount} balance={addressBalance} translate={this.props.translate} />
      )
    }

    var maxCap = this.props.exchange.maxCap
    //alert(maxCap)
    if (maxCap !== "infinity") {
      maxCap = converters.toEther(this.props.exchange.maxCap)
    }

    return (
      <ExchangeBodyLayout
        chooseToken={this.chooseToken}
        account={this.props.account.account}
        step={this.props.exchange.step}
        tokenSourceSelect={tokenSourceSelect}
        tokenDestSelect={tokenDestSelect}
        transactionLoadingScreen={transactionLoadingScreen}
        errors={errors}
        input={input}
        addressBalanceLayout={addressBalanceLayout}
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
        // isChartActive={this.props.exchange.chart.isActive}
        // chartTimeRange={this.props.exchange.chart.timeRange}
        // onChangeChartRange={this.changeChartRange}
        // onToggleChartContent={this.toggleChartContent}
        toggleRightPart={this.toggleRightPart}
        isOpenRight={this.props.exchange.isOpenRight}
        isOpenLeft={this.props.exchange.isOpenLeft}
        toggleLeftPart={this.toggleLeftPart}
        isIos={this.state.isIos}
        isAndroid={this.state.isAndroid}
      />
    )
  }
}
