import React from "react"
import { connect } from "react-redux"
import { push } from 'react-router-redux';

import { stringToHex, getDifferentAmount, toT, roundingNumber, 
        caculateSourceAmount, caculateDestAmount, gweiToEth, toPrimitiveNumber, stringToBigNumber } from "../../utils/converter"

import { PostExchangeWithKey, MinRate, RateBetweenToken } from "../Exchange"
import { ExchangeForm, TransactionConfig } from "../../components/Transaction"
import { SelectToken, TransactionLoading, Token } from "../CommonElements"

import { anyErrors } from "../../utils/validators"

import { openTokenModal, hideSelectToken } from "../../actions/utilActions"
import * as exchangeActions from "../../actions/exchangeActions"
import { randomForExchange } from "../../utils/random"
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

  openSourceToken = (e) => {
    this.props.dispatch(openTokenModal("source", this.props.exchange.sourceTokenSymbol))
  }

  openDesToken = (e) => {
    this.props.dispatch(openTokenModal("des", this.props.exchange.destTokenSymbol))
  }

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
      var sourceAmountHex = stringToHex(this.props.exchange.sourceAmount, sourceDecimal)
      this.props.dispatch(exchangeActions.updateRateExchange(ethereum, source, dest, sourceAmountHex))
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

  specifyGasPrice = (event) => {
    var value = event.target.value
    this.props.dispatch(exchangeActions.specifyGasPrice(value))
  }

  setAmount = () => {
    var tokenSymbol = this.props.exchange.sourceTokenSymbol
    var token = this.props.tokens[tokenSymbol]
    if (token) {
      var balanceBig = stringToBigNumber(token.balance)
      if (tokenSymbol === "ETH") {
        if (!balanceBig.greaterThanOrEqualTo(Math.pow(10, 17))) {
          return false
        }
        balanceBig = balanceBig.minus(Math.pow(10, 17))
      }
      var balance = balanceBig.div(Math.pow(10, token.decimal)).toString()
      balance = toPrimitiveNumber(balance)

      this.focusSource()
      
      this.props.dispatch(exchangeActions.inputChange('source', balance));
    }
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

    var balance = ""
    var nameSource = ""
    var token = this.props.tokens[this.props.exchange.sourceTokenSymbol]
    if (token) {
      balance = {
        value: toT(token.balance, token.decimal),
        roundingValue: roundingNumber(toT(token.balance, token.decimal))
      }
      nameSource = token.name
    }

    var balanceDest = ""
    var nameDest = ""
    var tokenDest = this.props.tokens[this.props.exchange.destTokenSymbol]
    if (tokenDest) {
      balanceDest = {
        value: toT(tokenDest.balance, tokenDest.decimal),
        roundingValue: roundingNumber(toT(tokenDest.balance, tokenDest.decimal)),
      }
      nameDest = tokenDest.name
    }

    var balanceInfo = {
      sourceTokenSymbol: this.props.exchange.sourceTokenSymbol,
      sourceAmount: balance,
      sourceTokenName: nameSource,
      destTokenSymbol: this.props.exchange.destTokenSymbol,
      destAmount: balanceDest,
      destTokenName: nameDest
    }

    var tokenSource = (
      <Token type="source"
        token={this.props.exchange.sourceTokenSymbol}
        onSelected={this.openSourceToken}
      />
    )
    var tokenDest = (
      <Token type="des"
        token={this.props.exchange.destTokenSymbol}
        onSelected={this.openDesToken}
      />
    )

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

    var selectTokenModal = (
      <SelectToken chooseToken={this.chooseToken} type="exchange" />
    )

    var exchangeButton = (
      <PostExchangeWithKey />
    )
    var transactionLoadingScreen = (
      <TransactionLoading tx={this.props.exchange.txHash}
        tempTx={this.props.exchange.tempTx}
        makeNewTransaction={this.makeNewExchange}
        type="exchange"
        balanceInfo={balanceInfo}
        broadcasting={this.props.exchange.broadcasting}
        broadcastingError={this.props.exchange.bcError}
      />
    )
    var gasConfig = (
      <TransactionConfig gas={this.props.exchange.gas_estimate}
        gasPrice={this.props.exchange.gasPrice}
        maxGasPrice = {this.props.exchange.maxGasPrice}
        gasHandler={this.specifyGas}
        gasPriceHandler={this.specifyGasPrice}
        gasPriceError={this.props.exchange.errors.gasPriceError}
        gasError={this.props.exchange.errors.gasError}
        totalGas={gweiToEth(this.props.exchange.gas_estimate * this.props.exchange.gasPrice)}
        translate={this.props.translate}        
      />
    ) 

    var exchangeRate = {
      sourceToken: this.props.exchange.sourceTokenSymbol,
      rate: toT(this.props.exchange.minConversionRate),
      destToken: this.props.exchange.destTokenSymbol,
      percent: "-"
    }

    var rateToken = (
      <RateBetweenToken
        isSelectToken={this.props.exchange.isSelectToken}
        exchangeRate={exchangeRate}
      />
    )

    return (
      <ExchangeForm step={this.props.exchange.step}
        tokenSource={tokenSource}
        tokenDest={tokenDest}
        selectTokenModal={selectTokenModal}
        gasConfig={gasConfig}
        exchangeButton={exchangeButton}
        transactionLoadingScreen={transactionLoadingScreen}
        errors={errors}
        input={input}
        balance={balance}
        sourceTokenSymbol={this.props.exchange.sourceTokenSymbol}
        setAmount={this.setAmount}
        isSelectToken = {this.props.exchange.isSelectToken}
        translate={this.props.translate}
        minRate = {<MinRate />}
        rateToken = {rateToken}
      />
    )
  }
}
