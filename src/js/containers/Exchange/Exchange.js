import React from "react"
import { connect } from "react-redux"
import { push } from 'react-router-redux';

import { gweiToWei, stringToHex, getDifferentAmount, toT, roundingNumber, caculateSourceAmount, caculateDestAmount, gweiToEth, toPrimitiveNumber, stringToBigNumber, toEther } from "../../utils/converter"

import { PostExchangeWithKey, MinRate } from "../Exchange"
import { ExchangeForm, TransactionConfig } from "../../components/Transaction"

import { TokenSelector, TransactionLoading, Token } from "../CommonElements"

import * as validators from "../../utils/validators"

import { openTokenModal, hideSelectToken } from "../../actions/utilActions"
import * as exchangeActions from "../../actions/exchangeActions"
//import { randomForExchange } from "../../utils/random"
import { getTranslate } from 'react-localize-redux'
import { default as _ } from 'underscore'

@connect((store) => {
  const ethereum = store.connection.ethereum
  const account = store.account
  const exchange = store.exchange
  const tokens = store.tokens.tokens
  const translate = getTranslate(store.locale)

  var sourceTokenSymbol = store.exchange.sourceTokenSymbol
  var sourceBalance = 0
  var sourceDecimal = 18
  var sourceName = "Ether"
  if (tokens[sourceTokenSymbol]) {
    sourceBalance = tokens[sourceTokenSymbol].balance
    sourceDecimal = tokens[sourceTokenSymbol].decimal
    sourceName = tokens[sourceTokenSymbol].name
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
    account, ethereum, tokens, translate, exchange: {
      ...store.exchange, sourceBalance, sourceDecimal, destBalance, destDecimal,
      sourceName, destName
    }
  }
})


export default class Exchange extends React.Component {

  chooseToken = (symbol, address, type) => {
    this.props.dispatch(exchangeActions.selectTokenAsync(symbol, address, type, this.props.ethereum))
  }

  dispatchUpdateRateExchange = (ethereum, source, dest, sourceAmountHex, isManual, rateInit) => {
    this.props.dispatch(exchangeActions.updateRateExchange(ethereum, source, dest, sourceAmountHex, isManual, rateInit))
  }




  validateSourceAmount = (value) => {
    // var check = true
    var sourceAmount = value
    var validateAmount = validators.verifyAmount(sourceAmount,
      this.props.exchange.sourceBalance,
      this.props.exchange.sourceTokenSymbol,
      this.props.exchange.sourceDecimal,
      this.props.exchange.offeredRate,
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

    if(sourceAmountErrorKey === "error.source_amount_is_not_number"){
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

  validateTxFee = (gasPrice) => {
    var validateWithFee = validators.verifyBalanceForTransaction(this.props.tokens['ETH'].balance, this.props.exchange.sourceTokenSymbol,
    this.props.exchange.sourceAmount, this.props.exchange.gas + this.props.exchange.gas_approve, gasPrice)

    if (validateWithFee) {
      this.props.dispatch(exchangeActions.thowErrorEthBalance("error.eth_balance_not_enough_for_fee"))
      return
      // check = false
    }
  }

  lazyUpdateRateExchange = _.debounce(this.dispatchUpdateRateExchange, 500)
  lazyUpdateValidateSourceAmount = _.debounce(this.validateSourceAmount, 500)
  lazyValidateTransactionFee = _.debounce(this.validateTxFee, 500)

 
  validateRateAndSource = (sourceValue) => {
    var sourceDecimal = 18
    var sourceTokenSymbol = this.props.exchange.sourceTokenSymbol
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
    var sourceAmountHex = stringToHex(sourceValue, sourceDecimal)
    var rateInit = 0
    if (sourceTokenSymbol === 'ETH' && destTokenSymbol !== 'ETH') {
      rateInit = this.props.tokens[destTokenSymbol].minRateEth
    }
    if (sourceTokenSymbol !== 'ETH' && destTokenSymbol === 'ETH') {
      rateInit = this.props.tokens[sourceTokenSymbol].minRate
    }

    // this.lazyUpdateRateExchange(ethereum, source, dest, sourceAmountHex, true, rateInit)
    this.lazyUpdateRateExchange(ethereum, source, dest, sourceAmountHex, true, rateInit)

    this.lazyUpdateValidateSourceAmount(sourceValue)
  }
  changeSourceAmount = (e) => {
    var value = e.target.value
    if (value < 0) return
    this.props.dispatch(exchangeActions.inputChange('source', value));

    this.validateRateAndSource(value)
    // //check amount to reset rate
    // var differenceValue = getDifferentAmount(value, 
    //                         this.props.exchange.prevAmount,  
    //                         sourceDecimal, minRate, sourceTokenSymbol)
    // //console.log(differenceValue)
    // if(differenceValue > this.props.exchange.rangeSetRate){
    //   var ethereum = this.props.ethereum
    //   var source = this.props.exchange.sourceToken
    //   var dest = this.props.exchange.destToken
    //   var destTokenSymbol = this.props.exchange.destTokenSymbol
    //   var sourceAmountHex = stringToHex(value, sourceDecimal)
    //   var rateInit = 0
    //   if(sourceTokenSymbol === 'ETH' && destTokenSymbol !=='ETH'){
    //     rateInit = this.props.tokens[destTokenSymbol].minRateEth
    //   }
    //   if(sourceTokenSymbol !== 'ETH' && destTokenSymbol ==='ETH'){
    //     rateInit = this.props.tokens[sourceTokenSymbol].minRate
    //   }
    //   this.props.dispatch(exchangeActions.updateRateExchange(ethereum, source, dest, sourceAmountHex, true, rateInit))
    //   this.props.dispatch(exchangeActions.updatePrevSource(value))
    // }
  }

  changeDestAmount = (e) => {
    var value = e.target.value
    if (value < 0) return
    this.props.dispatch(exchangeActions.inputChange('dest', value))

    var valueSource = caculateSourceAmount(value, this.props.exchange.offeredRate, 6)
    this.validateRateAndSource(valueSource)
  }

  specifyGas = (event) => {
    var value = event.target.value
    this.props.dispatch(exchangeActions.specifyGas(value))
  }

  specifyGasPrice = (value) => {
    this.props.dispatch(exchangeActions.specifyGasPrice(value + ""))
    this.lazyValidateTransactionFee(value)
  }

  focusSource = () => {
    this.props.dispatch(exchangeActions.focusInput('source'));
  }

  focusDest = () => {
    this.props.dispatch(exchangeActions.focusInput('dest'));
  }

  makeNewExchange = () => {
    this.props.dispatch(exchangeActions.makeNewExchange());
  }  

  setAmount = () => {
    var tokenSymbol = this.props.exchange.sourceTokenSymbol
    var token = this.props.tokens[tokenSymbol]
    if (token) {
      var balanceBig = stringToBigNumber(token.balance)
      if (tokenSymbol === "ETH") {
        var gasLimit = this.props.exchange.gas
        var gasPrice = stringToBigNumber(gweiToWei(this.props.exchange.gasPrice))
        var totalGas = gasPrice.mul(gasLimit)

        if (!balanceBig.greaterThanOrEqualTo(totalGas)) {
          return false
        }
        balanceBig = balanceBig.minus(totalGas)
      }
      var balance = balanceBig.div(Math.pow(10, token.decimal)).toString(10)
      //balance = toPrimitiveNumber(balance)

      this.focusSource()

      this.props.dispatch(exchangeActions.inputChange('source', balance));
    }
  }

  swapToken = () => {
    this.props.dispatch(exchangeActions.swapToken())
    this.props.ethereum.fetchRateExchange()
  }

  analyze = () => {
    var ethereum = this.props.ethereum
    var exchange = this.props.exchange
    //var tokens = this.props.tokens
    this.props.dispatch(exchangeActions.analyzeError(ethereum, exchange.txHash))
  }

  render() {
    if (this.props.account.isStoreReady) {
      if (!!!this.props.account.account.address) {
        setTimeout(() => this.props.dispatch(push("/")), 1000)
        return (
          <div></div>
        )
      }
    } else {
      return (
        <div></div>
      )
    }

    //for transaction loading screen
    var balance = {
      prevValue: toT(this.props.exchange.balanceData.prevSource, this.props.exchange.balanceData.sourceDecimal),
      nextValue: toT(this.props.exchange.balanceData.nextSource, this.props.exchange.balanceData.sourceDecimal)
    }
    var balanceDest = {
      prevValue: toT(this.props.exchange.balanceData.prevDest, this.props.exchange.balanceData.destDecimal),
      nextValue: toT(this.props.exchange.balanceData.nextDest, this.props.exchange.balanceData.destDecimal),
      // value: toT(tokenDest.balance, tokenDest.decimal),
      // roundingValue: roundingNumber(toT(tokenDest.balance, tokenDest.decimal)),
    }

    var balanceInfo = {
      //sourceTokenSymbol: this.props.exchange.sourceTokenSymbol,
      sourceAmount: balance,
      sourceSymbol: this.props.exchange.balanceData.sourceSymbol,
      sourceTokenName: this.props.exchange.balanceData.sourceName,
      //destTokenSymbol: this.props.exchange.destTokenSymbol,
      destAmount: balanceDest,
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
      rateAmount : this.props.exchange.errors.rateAmount
    }

    var input = {
      sourceAmount: {
        type: 'number',
        value: this.props.exchange.sourceAmount,
        onChange: this.changeSourceAmount,
        onFocus: this.focusSource
      },
      destAmount: {
        type: 'number',
        value: this.props.exchange.destAmount,
        onChange: this.changeDestAmount,
        onFocus: this.focusDest
      }
    }
    // console.log(input)
    var exchangeButton = (
      <PostExchangeWithKey />
    )


    var gasPrice = stringToBigNumber(gweiToEth(this.props.exchange.gasPrice))
    var totalGas = gasPrice.mul(this.props.exchange.gas + this.props.exchange.gas_approve)
    var gasConfig = (
      <TransactionConfig gas={this.props.exchange.gas + this.props.exchange.gas_approve}
        gasPrice={this.props.exchange.gasPrice}
        maxGasPrice={this.props.exchange.maxGasPrice}
        gasHandler={this.specifyGas}
        gasPriceHandler={this.specifyGasPrice}
        gasPriceError={this.props.exchange.errors.gasPriceError}
        gasError={this.props.exchange.errors.gasError}
        totalGas={totalGas.toString()}
        translate={this.props.translate}
        minRate={<MinRate />}
        gasPriceSuggest={this.props.exchange.gasPriceSuggest}
        advanced={this.props.exchange.advanced}
      />
    )

    var addressBalance = ""
    var token = this.props.tokens[this.props.exchange.sourceTokenSymbol]
    if (token) {
      addressBalance = {
        value: toT(token.balance, token.decimal),
        roundingValue: roundingNumber(toT(token.balance, token.decimal))
      }
    }
    return (
      <ExchangeForm step={this.props.exchange.step}
        tokenSourceSelect={tokenSourceSelect}
        tokenDestSelect={tokenDestSelect}
        gasConfig={gasConfig}
        exchangeButton={exchangeButton}
        transactionLoadingScreen={transactionLoadingScreen}
        errors={errors}
        input={input}
        balance={addressBalance}
        sourceTokenSymbol={this.props.exchange.sourceTokenSymbol}
        setAmount={this.setAmount}
        translate={this.props.translate}
        swapToken={this.swapToken}
        maxCap={toEther(this.props.exchange.maxCap)}
      />
    )
  }
}
