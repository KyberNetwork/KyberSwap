import React from "react"
import { connect } from "react-redux"
import { push } from 'react-router-redux';
import { withRouter } from 'react-router-dom'
import * as converters from "../../utils/converter"
import { TransactionConfig } from "../../components/Transaction"
import { ExchangeBodyLayout } from "../../components/Exchange"
import { AdvanceConfigLayout, MinConversionRate } from "../../components/TransactionCommon"
import { TransactionLoading, Token } from "../CommonElements"
import { TokenSelector, AccountBalance, TopBalance } from "../TransactionCommon"
import * as validators from "../../utils/validators"
import * as common from "../../utils/common"
import { openTokenModal, hideSelectToken } from "../../actions/utilActions"
import * as globalActions from "../../actions/globalActions"
import * as exchangeActions from "../../actions/exchangeActions"
import constants from "../../services/constants"
import { getTranslate } from 'react-localize-redux'
import { debounce } from 'underscore';
import BLOCKCHAIN_INFO from "../../../../env";
import * as web3Package from "../../services/web3"
import { importAccountMetamask } from "../../actions/accountActions"
import EthereumService from "../../services/ethereum/ethereum"
import {MinRate, RateBetweenToken } from "../Exchange"
import ReactTooltip from 'react-tooltip'

@connect((store, props) => {
  const ethereum = store.connection.ethereum
  const account = store.account
  const exchange = store.exchange
  const tokens = store.tokens.tokens
  const translate = getTranslate(store.locale)
  const global = store.global
  const sourceToken = tokens[exchange.sourceTokenSymbol]
  const destToken = tokens[exchange.destTokenSymbol]

  return {
    account, ethereum, tokens, translate, 
    global, exchange, sourceToken, destToken
  }
})

class ExchangeBody extends React.Component {
  constructor() {
    super()
    this.state = {
      focus: "",
      // defaultShowTooltip: true,
    }

  }



  componentDidUpdate(prevProps) {    
    if (Object.keys(this.props.exchange.errors.sourceAmount).length > Object.keys(prevProps.exchange.errors.sourceAmount).length){      
      setTimeout(() => {
        ReactTooltip.show(document.getElementById("swap-error-trigger"))
      }, 300)
    }
  }



  componentDidMount = () => {
    if (this.props.global.changeWalletType !== "swap") this.props.dispatch(globalActions.closeChangeWallet())

    const { pathname } = this.props.history.location;
    this.updateTitle(pathname);
    this.props.dispatch(globalActions.updateTitleWithRate());

    this.props.history.listen((location, action) => {
      const { pathname } = location;
      this.updateTitle(pathname);
    })
    

    if (Object.keys(this.props.exchange.errors.sourceAmount).length > 0){
      setTimeout(() => {
        ReactTooltip.show(document.getElementById("swap-error-trigger"))
      }, 300)
    }

  }

  updateTitle = (pathname) => {
    let title = this.props.global.documentTitle;
    if (common.isAtSwapPage(pathname)) {
      let { sourceTokenSymbol, destTokenSymbol } = common.getTokenPairFromRoute(pathname);
      sourceTokenSymbol = sourceTokenSymbol.toUpperCase();
      destTokenSymbol = destTokenSymbol.toUpperCase();

      if (sourceTokenSymbol !== destTokenSymbol) {
        if (sourceTokenSymbol === "ETH") {
          title = `${destTokenSymbol}/${sourceTokenSymbol} | Swap ${sourceTokenSymbol}-${destTokenSymbol} | KyberSwap`;
        } else {
          title = `${sourceTokenSymbol}/${destTokenSymbol} | Swap ${sourceTokenSymbol}-${destTokenSymbol} | KyberSwap`;
        }
      } else {
        title = "Kyber Network | Instant Exchange | No Fees";
      }
    } else {
      title = "Kyber Network | Instant Exchange | No Fees";
    }

    document.title = title;
    this.props.dispatch(globalActions.setDocumentTitle(title));
  }

  validateTxFee = (gasPrice) => {
    if (this.props.account.account === false) {
      return
    }
    var validateWithFee = validators.verifyBalanceForTransaction(this.props.tokens['ETH'].balance, this.props.exchange.sourceTokenSymbol,
      this.props.exchange.sourceAmount, this.props.exchange.gas + this.props.exchange.gas_approve, gasPrice)

    if (validateWithFee) {
      this.props.dispatch(exchangeActions.thowErrorEthBalance("error.eth_balance_not_enough_for_fee"))
      return
    }
  }
  lazyValidateTransactionFee = debounce(this.validateTxFee, 500)


  updateGlobal = (sourceTokenSymbol, sourceToken, destTokenSymbol, destToken) => {
    var path = constants.BASE_HOST +  "/swap/" + sourceTokenSymbol.toLowerCase() + "-" + destTokenSymbol.toLowerCase()
    path = common.getPath(path, constants.LIST_PARAMS_SUPPORTED)
    this.props.dispatch(globalActions.goToRoute(path))
    this.props.dispatch(globalActions.updateTitleWithRate());

    var sourceAmount = this.props.exchange.sourceAmount
    var refetchSourceAmount = this.props.exchange.inputFocus === "source"?false: true
    this.props.dispatch(exchangeActions.updateRate(this.props.ethereum, sourceTokenSymbol, sourceToken, destTokenSymbol, destToken, sourceAmount, true, refetchSourceAmount,constants.EXCHANGE_CONFIG.updateRateType.selectToken));
  }

  selectSourceToken = (symbol) => {        
    var sourceTokenSymbol = symbol
    var sourceToken = this.props.tokens[sourceTokenSymbol].address
    var destTokenSymbol = this.props.exchange.destTokenSymbol
    var destToken = this.props.tokens[destTokenSymbol].address
    this.props.dispatch(exchangeActions.selectToken(sourceTokenSymbol, sourceToken, destTokenSymbol, destToken, "source"));

    this.updateGlobal(sourceTokenSymbol, sourceToken, destTokenSymbol, destToken)
    this.props.global.analytics.callTrack("trackChooseToken", "from", symbol);
  }

  selectDestToken = (symbol) => {
    var sourceTokenSymbol = this.props.exchange.sourceTokenSymbol
    var sourceToken = this.props.tokens[sourceTokenSymbol].address
    var destTokenSymbol = symbol
    var destToken = this.props.tokens[destTokenSymbol].address
    this.props.dispatch(exchangeActions.selectToken(sourceTokenSymbol, sourceToken, destTokenSymbol, destToken, "dest"));

    this.updateGlobal(sourceTokenSymbol, sourceToken, destTokenSymbol, destToken)
    this.props.global.analytics.callTrack("trackChooseToken", "to", symbol);
  }


  dispatchUpdateRateExchange = (sourceAmount, refetchSourceAmount) => {
    var sourceDecimal = 18
    var sourceTokenSymbol = this.props.exchange.sourceTokenSymbol
    
    if (sourceTokenSymbol === "ETH") {
      if (parseFloat(sourceAmount) > constants.ETH.MAX_AMOUNT) {
        this.props.dispatch(exchangeActions.throwErrorSourceAmount(constants.EXCHANGE_CONFIG.sourceErrors.rate, this.props.translate("error.handle_amount")))
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
    var sourceToken = this.props.exchange.sourceToken
    var destToken = this.props.exchange.destToken
    var destTokenSymbol = this.props.exchange.destTokenSymbol
    //var sourceAmountHex = stringToHex(sourceValue, sourceDecimal)
    var rateInit = 0
    if (sourceTokenSymbol === 'ETH' && destTokenSymbol !== 'ETH') {
      rateInit = this.props.tokens[destTokenSymbol].minRateEth
    }
    if (sourceTokenSymbol !== 'ETH' && destTokenSymbol === 'ETH') {
      rateInit = this.props.tokens[sourceTokenSymbol].minRate
    }

    this.props.dispatch(exchangeActions.updateRate(this.props.ethereum, sourceTokenSymbol, sourceToken, destTokenSymbol, destToken, sourceAmount, true, refetchSourceAmount,constants.EXCHANGE_CONFIG.updateRateType.changeAmount));


  }

  getFormParams = () => {
    var sourceTokenSymbol = this.props.exchange.sourceTokenSymbol
    var rateSourceToEth = this.props.tokens[sourceTokenSymbol].rate
    var sourceBalance =  this.props.tokens[sourceTokenSymbol].balance
    var sourceDecimal = this.props.tokens[sourceTokenSymbol].decimals

    var destTokenSymbol = this.props.exchange.destTokenSymbol    
    var destDecimal = this.props.tokens[destTokenSymbol].decimals

    var maxCap = this.props.account.maxCap

    return {sourceTokenSymbol, rateSourceToEth, sourceBalance,  sourceDecimal, destTokenSymbol, destDecimal, maxCap}
  }

  validateSourceAmount = (value) => {
    var {sourceTokenSymbol, rateSourceToEth, sourceBalance,  sourceDecimal, destTokenSymbol, destDecimal, maxCap} = this.getFormParams()
    // var check = true
    var sourceAmount = value
    var validateAmount = validators.verifyAmount(sourceAmount,
      rateSourceToEth,
      sourceTokenSymbol,
      sourceDecimal,
      //this.props.exchange.expectedRate,      
      rateSourceToEth,
      destTokenSymbol,
      destDecimal,
      maxCap)
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


  dispatchEstimateGasNormal = () => {
    this.props.dispatch(exchangeActions.estimateGasNormal())
  }

  lazyUpdateRateExchange = debounce(this.dispatchUpdateRateExchange, 500)
  // lazyUpdateValidateSourceAmount = debounce(this.validateSourceAmount, 500)

  lazyEstimateGas = debounce(this.dispatchEstimateGasNormal, 500)


  validateRateAndSource = (sourceValue, refetchSourceAmount = false) => {
    this.lazyUpdateRateExchange(sourceValue, refetchSourceAmount)
  }
  changeSourceAmount = (e, amount) => {
    var value 
    if(e){
      value = e.target.value
    }else{
      value = amount
    }
    if (value < 0) return
    this.props.dispatch(exchangeActions.inputChange('source', value, this.props.sourceToken.decimals, this.props.destToken.decimals));

    this.lazyEstimateGas()

    this.validateRateAndSource(value)
  }

  changeDestAmount = (e, amount) => {
    var value 
    if(e){
      value = e.target.value
    }else{
      value = amount
    }
    
    if (value < 0) return
    this.props.dispatch(exchangeActions.inputChange('dest', value, this.props.sourceToken.decimals, this.props.destToken.decimals))

    var valueSource = converters.caculateSourceAmount(value, this.props.exchange.expectedRate, 6)
    this.validateRateAndSource(valueSource, true);
  }

  focusSource = () => {
    this.props.dispatch(exchangeActions.focusInput('source'));
    this.props.dispatch(exchangeActions.setIsSelectTokenBalance(false))
    this.setState({ focus: "source" })
    this.props.global.analytics.callTrack("trackClickInputAmount", "from");
  }

  blurSource = () => {
    this.setState({ focus: "" })
  }

  focusDest = () => {
    this.props.dispatch(exchangeActions.focusInput('dest'));
    this.props.dispatch(exchangeActions.setIsSelectTokenBalance(false));
    this.setState({ focus: "dest" })
    this.props.global.analytics.callTrack("trackClickInputAmount", "to");
  }

  blurDest = () => {
    this.setState({ focus: "" })
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

      this.props.dispatch(exchangeActions.inputChange('source', balance, this.props.sourceToken.decimals, this.props.destToken.decimals))
      this.props.ethereum.fetchRateExchange(true)
    }
    this.props.global.analytics.callTrack("trackClickAllIn", "Swap", tokenSymbol);
  }

  swapToken = () => {
    var isFixedDestToken = !!(this.props.account && this.props.account.account.type === "promo" && this.props.account.account.info.destToken)
    if (isFixedDestToken) {
      return
    }
    this.props.dispatch(exchangeActions.swapToken())
    //update source token, dest token
    if (this.props.exchange.inputFocus === "source"){
      this.props.dispatch(exchangeActions.focusInput('dest'));
      this.props.dispatch(exchangeActions.changeAmount('source', ""))
      this.props.dispatch(exchangeActions.changeAmount('dest', this.props.exchange.sourceAmount))
    }else{
      this.props.dispatch(exchangeActions.focusInput('source'));
      this.props.dispatch(exchangeActions.changeAmount('source', this.props.exchange.destAmount))
      this.props.dispatch(exchangeActions.changeAmount('dest', ""))
    }
    var sourceTokenSymbol = this.props.exchange.destTokenSymbol
    var sourceToken = this.props.exchange.destToken
    var destTokenSymbol = this.props.exchange.sourceTokenSymbol
    var destToken = this.props.exchange.sourceToken

    this.props.dispatch(exchangeActions.selectToken(sourceTokenSymbol, sourceToken, destTokenSymbol, destToken, "swap"));
    this.updateGlobal(sourceTokenSymbol, sourceToken, destTokenSymbol, destToken)

    this.props.global.analytics.callTrack("trackClickSwapDestSrc", this.props.exchange.sourceTokenSymbol, this.props.exchange.destTokenSymbol);
  }


  toggleAdvanceContent = () => {

      if (this.props.exchange.customRateInput.value === "" && this.props.exchange.customRateInput.isDirty) {
        this.props.dispatch(exchangeActions.setCustomRateInputError(true));
        return;
      }
    
    
    if (this.props.exchange.isAdvanceActive) {
      this.props.global.analytics.callTrack("trackClickHideAdvanceOption", "Swap")
      const expectedRate = this.props.exchange.expectedRate;

      // User basic rate 3% or custom rate
      const minRate = converters.caculatorRateToPercentage(this.props.exchange.customRateInput.isSelected ? 100 - this.props.exchange.customRateInput.value : 97, expectedRate);  
  
      this.props.dispatch(exchangeActions.setMinRate(minRate.toString()));
      this.props.dispatch(exchangeActions.setCustomRateInputError(false));
      this.props.dispatch(exchangeActions.setCustomRateInputDirty(false));
    } else {
      this.props.global.analytics.callTrack("trackClickShowAdvanceOption", "Swap")
    }
    this.props.dispatch(exchangeActions.toggleAdvanceContent());

    if (!this.props.exchange.isOpenAdvance) {
      this.props.dispatch(exchangeActions.setIsOpenAdvance());
    }
  }

  // closeAdvance = () => {

  // }

  specifyGasPrice = (value) => {
    this.props.dispatch(exchangeActions.specifyGasPrice(value + ""))
    if (this.props.account !== false && !this.props.global.isChangingWallet) {
      this.lazyValidateTransactionFee(value)
    }
  }

  selectedGasHandler = (value, level, levelString) => {
    this.props.dispatch(exchangeActions.setSelectedGasPrice(value, level))
    this.specifyGasPrice(value)
    this.props.global.analytics.callTrack("trackChooseGas", "swap", value, levelString);
  }

  handleSlippageRateChanged = (e, isInput = false) => {
    if (isInput) {
      if (e.target.value === "" && this.props.exchange.customRateInput.isDirty) {
        this.props.dispatch(exchangeActions.setCustomRateInputError(true));
      } else {
        this.props.dispatch(exchangeActions.setCustomRateInputError(false));
      }
      this.props.dispatch(exchangeActions.setCustomRateInputDirty(true));
      this.props.dispatch(exchangeActions.setCustomRateInputValue(e.target.value));
    } else {
      this.props.dispatch(exchangeActions.setCustomRateInputDirty(false));
      this.props.dispatch(exchangeActions.setCustomRateInputError(false));
    }

    this.props.dispatch(exchangeActions.setIsSelectCustomRate(isInput));

    const expectedRate = this.props.exchange.expectedRate;
    let value = isInput ? 100 - e.currentTarget.value : e.currentTarget.value;

    if (value > 100) {
      value = 100;
    } else if (value < 10) {
      value = 10;
    }

    const minRate = converters.caculatorRateToPercentage(value, expectedRate);

    this.props.dispatch(exchangeActions.setMinRate(minRate.toString()));
    this.props.global.analytics.callTrack("trackSetNewMinrate", value);
  }

  // setDefaulTooltip = (value) => {
  //   this.setState({ defaultShowTooltip: value })
  // }

  getAdvanceLayout = () => {
    const minConversionRate = (
      <MinConversionRate
        isSelectToken={this.props.exchange.isSelectToken}
        minConversionRate={this.props.exchange.minConversionRate}
        expectedRate={this.props.exchange.expectedRate}
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
        isAdvanceActive={this.props.exchange.isAdvanceActive}
        // toggleAdvanceContent={this.toggleAdvanceContent}
        minConversionRate={minConversionRate}
        type="exchange"
        maxGasPrice={this.props.exchange.maxGasPrice}
      />
    )
  }

  getBalanceLayout = () => {
    return (
      <AccountBalance
        // chooseToken={this.selectSourceToken}
        sourceActive={this.props.exchange.sourceTokenSymbol}
        destTokenSymbol={this.props.exchange.destTokenSymbol}
        // onToggleBalanceContent={this.toggleBalanceContent}
        isBalanceActive={this.props.exchange.isAdvanceActive}
        walletName={this.props.account.walletName}
        screen="swap"
        isOnDAPP={this.props.account.isOnDAPP}
        // changeAmount={exchangeActions.inputChange}
        // changeFocus={exchangeActions.focusInput}
        selectToken={this.selectToken}
      />)
  }


  closeChangeWallet = () => {
    this.props.dispatch(globalActions.closeChangeWallet())
  }

  clearSession = (e) => {
    this.props.dispatch(globalActions.clearSession(this.props.exchange.gasPrice))
    this.props.global.analytics.callTrack("trackClickChangeWallet")
    // this.props.dispatch(globalActions.setGasPrice(this.props.ethereum))
  }

  acceptTerm = (e) => {
    this.props.dispatch(globalActions.acceptTermOfService());
    this.props.dispatch(globalActions.acceptConnectWallet());
  }

  clearIsOpenAdvance = () => {
    this.props.dispatch(exchangeActions.clearIsOpenAdvance());
  }

  selectTokenBalance = () => {
    this.props.dispatch(exchangeActions.setIsSelectTokenBalance(true));
  }

  reorderToken = () => {
    var tokens = this.props.tokens
    const orderedTokens = converters.sortEthBalance(tokens);
    return orderedTokens.slice(0, 3)
  }

  selectToken = (sourceSymbol) => {
        this.selectSourceToken(sourceSymbol)

        var sourceBalance = this.props.tokens[sourceSymbol].balance
      
        var sourceDecimal = this.props.tokens[sourceSymbol].decimals
        var amount

        if (sourceSymbol !== "ETH") {
            amount = sourceBalance
            amount = converters.toT(amount, sourceDecimal)
            amount = amount.replace(",", "")
        } else {
            var gasLimit
            var totalGas

            var destTokenSymbol = this.props.exchange.destTokenSymbol
                gasLimit = this.props.tokens[destTokenSymbol].gasLimit || this.props.exchange.max_gas
                totalGas = converters.calculateGasFee(this.props.exchange.gasPrice, gasLimit) * Math.pow(10, 18)

            amount = sourceBalance - totalGas * 120 / 100
            amount = converters.toEther(amount)
            amount = converters.roundingNumber(amount).toString(10)
            amount = amount.replace(",", "")
        }

        if (amount < 0) amount = 0;

        this.props.dispatch(exchangeActions.inputChange('source', amount, this.props.sourceToken.decimals, this.props.destToken.decimals))
        this.props.dispatch(exchangeActions.focusInput('source'));
        this.selectTokenBalance();
        this.props.global.analytics.callTrack("trackClickToken", sourceSymbol, this.props.screen);
  }

  render() {

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

    var isFixedSourceToken = !!(this.props.account && this.props.account.account.type === "promo" && this.props.tokens[BLOCKCHAIN_INFO.promo_token])
    var tokenSourceSelect = (
      <TokenSelector
        type="source"
        focusItem={this.props.exchange.sourceTokenSymbol}
        listItem={this.props.tokens}
        chooseToken={this.selectSourceToken}
        isFixToken={isFixedSourceToken}
      />
    )
    var isFixedDestToken = !!(this.props.account && this.props.account.account.type === "promo" && this.props.account.account.info.destToken)
    var tokenDestSelect = (
      <TokenSelector
        type="dest"
        focusItem={this.props.exchange.destTokenSymbol}
        listItem={tokenDest}
        chooseToken={this.selectDestToken}
        isFixToken={isFixedDestToken}
      />
    )
    //--------End


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


    var rateToken = (
      <RateBetweenToken

      />
    )

    var topBalance = <TopBalance showMore={this.toggleAdvanceContent}
      // chooseToken={this.selectSourceToken}
      activeSymbol={this.props.exchange.sourceTokenSymbol}
      screen="swap"
      // selectTokenBalance={this.selectTokenBalance}
      // changeAmount={exchangeActions.inputChange}
      // changeFocus={exchangeActions.focusInput} 
      orderedTokens = {this.reorderToken()}
      selectToken = {this.selectToken}
      />
      
    return (
      <ExchangeBodyLayout
        chooseToken={this.selectSourceToken}
        exchange={this.props.exchange}
        account={this.props.account.account}
        step={this.props.exchange.step}
        tokenSourceSelect={tokenSourceSelect}
        tokenDestSelect={tokenDestSelect}
        // transactionLoadingScreen={transactionLoadingScreen}
        // errors={errors}
        input={input}
        addressBalance={addressBalance}
        sourceTokenSymbol={this.props.exchange.sourceTokenSymbol}
        destTokenSymbol={this.props.exchange.destTokenSymbol}
        translate={this.props.translate}
        swapToken={this.swapToken}
        // maxCap={maxCap}
        errorNotPossessKgt={this.props.exchange.errorNotPossessKgt}
        isAgreedTermOfService={this.props.global.termOfServiceAccepted}
        advanceLayout={this.getAdvanceLayout()}
        balanceLayout={this.getBalanceLayout()}
        focus={this.state.focus}
        networkError={this.props.global.network_error}
        isChangingWallet={this.props.global.isChangingWallet}
        changeWalletType={this.props.global.changeWalletType}
        closeChangeWallet={this.closeChangeWallet}
        global={this.props.global}
        clearSession={this.clearSession}
        walletName={this.props.account.walletName}
        isFixedDestToken={isFixedDestToken}
        acceptTerm={this.acceptTerm}
        isAcceptConnectWallet={this.props.global.isAcceptConnectWallet}

        // isBalanceActive = {this.props.exchange.isBalanceActive}
        isAdvanceActive={this.props.exchange.isAdvanceActive}
        toggleAdvanceContent={this.toggleAdvanceContent}

        isOpenAdvance={this.props.exchange.isOpenAdvance}
        clearIsOpenAdvance={this.clearIsOpenAdvance}

        rateToken={rateToken}

        // defaultShowTooltip={this.state.defaultShowTooltip}
        setDefaulTooltip={this.setDefaulTooltip}

        topBalance={topBalance}

        isOnDAPP={this.props.account.isOnDAPP}

        isSelectTokenBalance={this.props.exchange.isSelectTokenBalance}
      />
    )
  }
}

export default withRouter(ExchangeBody);
