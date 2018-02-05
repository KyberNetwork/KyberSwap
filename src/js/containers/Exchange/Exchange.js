import React from "react"
import { connect } from "react-redux"
import { push } from 'react-router-redux';

import { gweiToWei, stringToHex, getDifferentAmount, toT, roundingNumber, caculateSourceAmount, caculateDestAmount, gweiToEth, toPrimitiveNumber, stringToBigNumber, toEther } from "../../utils/converter"

import { PostExchangeWithKey, MinRate } from "../Exchange"
import { ExchangeForm, TransactionConfig } from "../../components/Transaction"

import { TokenSelector, TransactionLoading, Token } from "../CommonElements"

import { anyErrors } from "../../utils/validators"

import { openTokenModal, hideSelectToken } from "../../actions/utilActions"
import * as exchangeActions from "../../actions/exchangeActions"
//import { randomForExchange } from "../../utils/random"
import { getTranslate } from 'react-localize-redux';

@connect((store) => {
  const ethereum = store.connection.ethereum
  const account = store.account
  const exchange = store.exchange
  const tokens = store.tokens.tokens
  const translate = getTranslate(store.locale)
  
  return { account, ethereum, exchange, tokens, translate }
})


export default class Exchange extends React.Component {

  chooseToken = (symbol, address, type) => {
    this.props.dispatch(exchangeActions.selectTokenAsync(symbol, address, type, this.props.ethereum))
  }

  changeSourceAmount = (e) => {
    var value = e.target.value
    if (value < 0) return 
    this.props.dispatch(exchangeActions.inputChange('source', value));

    var sourceDecimal = 18
    var sourceTokenSymbol = this.props.exchange.sourceTokenSymbol
    var minRate = 0
    var tokens = this.props.tokens
    if (tokens[sourceTokenSymbol]) {
      sourceDecimal = tokens[sourceTokenSymbol].decimal
      minRate = tokens[sourceTokenSymbol].minRate
    }
    //check amount to reset rate
    var differenceValue = getDifferentAmount(value, 
                            this.props.exchange.prevAmount,  
                            sourceDecimal, minRate, sourceTokenSymbol)
    //console.log(differenceValue)
    if(differenceValue > this.props.exchange.rangeSetRate){
      var ethereum = this.props.ethereum
      var source = this.props.exchange.sourceToken
      var dest = this.props.exchange.destToken
      var destTokenSymbol = this.props.exchange.destTokenSymbol
      var sourceAmountHex = stringToHex(value, sourceDecimal)
      var rateInit = 0
      if(sourceTokenSymbol === 'ETH' && destTokenSymbol !=='ETH'){
        rateInit = this.props.tokens[destTokenSymbol].minRateEth
      }
      if(sourceTokenSymbol !== 'ETH' && destTokenSymbol ==='ETH'){
        rateInit = this.props.tokens[sourceTokenSymbol].minRate
      }
      this.props.dispatch(exchangeActions.updateRateExchange(ethereum, source, dest, sourceAmountHex, true, rateInit))
      this.props.dispatch(exchangeActions.updatePrevSource(value))
    }
  }

  changeDestAmount = (e) => {
    var value = e.target.value
    if (value < 0 ) return 
    this.props.dispatch(exchangeActions.inputChange('dest', value));
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

  specifyGas = (event) => {
    var value = event.target.value
    this.props.dispatch(exchangeActions.specifyGas(value))
  }

  specifyGasPrice = (value) => {
    this.props.dispatch(exchangeActions.specifyGasPrice(value + ""))
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
      var balance = balanceBig.div(Math.pow(10, token.decimal)).toString()
      balance = toPrimitiveNumber(balance)

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
      prevValue:toT(this.props.exchange.balanceData.prevSource, this.props.exchange.balanceData.sourceDecimal),
      nextValue:toT(this.props.exchange.balanceData.nextSource, this.props.exchange.balanceData.sourceDecimal)
    }
    var balanceDest = {
      prevValue:toT(this.props.exchange.balanceData.prevDest, this.props.exchange.balanceData.destDecimal),
      nextValue:toT(this.props.exchange.balanceData.nextDest, this.props.exchange.balanceData.destDecimal),
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
      analizeError : this.props.exchange.analizeError
    }
    var transactionLoadingScreen = (
      <TransactionLoading tx={this.props.exchange.txHash}
        tempTx={this.props.exchange.tempTx}
        makeNewTransaction={this.makeNewExchange}
        type="exchange"        
        balanceInfo={balanceInfo}
        broadcasting={this.props.exchange.broadcasting}
        broadcastingError={this.props.exchange.broadcastError}
        analyze = {analyze}
      />
    )

    //--------For select token
    var tokenDest = {}
    var isNotSupport = false
    Object.keys(this.props.tokens).map((key, i) => {
      isNotSupport = false
      if (this.props.exchange.sourceTokenSymbol === key){
        isNotSupport = true
      }
      if(this.props.exchange.sourceTokenSymbol !=="ETH" && key !== "ETH"){
        isNotSupport = true
      } 
      tokenDest[key] = {...this.props.tokens[key], isNotSupport: isNotSupport}
    })
      
    var tokenSourceSelect = (
      <TokenSelector type="source"
                      focusItem = {this.props.exchange.sourceTokenSymbol}
                      listItem = {this.props.tokens}
                      chooseToken = {this.chooseToken}
                      />
    )
    var tokenDestSelect = (
      <TokenSelector type="des"
                      focusItem = {this.props.exchange.destTokenSymbol}
                      listItem = {tokenDest}
                      chooseToken = {this.chooseToken}
                      />
    )
    //--------End


    var errors = {
      selectSameToken: this.props.exchange.errors.selectSameToken || '',
      selectTokenToken: this.props.exchange.errors.selectTokenToken || '',
      sourceAmount: this.props.exchange.errors.sourceAmountError || '',
      tokenSource: ''
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
        swapToken = {this.swapToken}
        maxCap={toEther(this.props.exchange.maxCap)}
      />
    )
  }
}
