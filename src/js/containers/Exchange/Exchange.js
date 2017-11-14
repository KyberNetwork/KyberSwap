import React from "react"
import { connect } from "react-redux"
import { push } from 'react-router-redux';

import { calculateMinAmount, toT, displayBalance } from "../../utils/converter"

import { PostExchange } from "../Exchange"
import { ExchangeForm, TransactionConfig } from "../../components/Transaction"
import { SelectToken, TransactionLoading, Token } from "../CommonElements"

import { anyErrors } from "../../utils/validators"

import { openTokenModal, hideSelectToken } from "../../actions/utilActions"
import * as exchangeActions from "../../actions/exchangeActions"
import * as converters from "../../utils/converter"
import { randomForExchange } from "../../utils/random"
@connect((store) => {
  const ethereum = store.connection.ethereum
  const account = store.account
  const exchange = store.exchange
  const tokens = store.tokens.tokens
  return { account, ethereum, exchange, tokens }
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

  proccessSelectToken = () => {
    if (!anyErrors(this.props.exchange.errors)) {
      this.props.dispatch(exchangeActions.goToStep(2))
    }
  }
  showAdvanceOption = () => {
    this.props.dispatch(exchangeActions.showAdvance())
  }
  changeSourceAmount = (e) => {
    var value = e.target.value
    this.props.dispatch(exchangeActions.changeSourceAmout(value))
  }

  getDesAmount = () => {
    return this.props.exchange.sourceAmount * toT(this.props.exchange.offeredRate, 6)
  }
  createRecap = () => {
    var recap = `exchange ${this.props.exchange.sourceAmount.toString().slice(0, 7)}${this.props.exchange.sourceAmount.toString().length > 7 ? '...' : ''} ${this.props.exchange.sourceTokenSymbol} for ${this.getDesAmount().toString().slice(0, 7)}${this.getDesAmount().toString().length > 7 ? '...' : ''} ${this.props.exchange.destTokenSymbol}`
    return recap
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
      var balanceBig = token.balance
      if (tokenSymbol === "ETH") {
        if (!balanceBig.greaterThanOrEqualTo(Math.pow(10, 17))) {
          return false
        }
        balanceBig = balanceBig.minus(Math.pow(10, 17))
      }
      var balance = balanceBig.div(Math.pow(10, token.decimal)).toString()
      this.props.dispatch(exchangeActions.changeSourceAmout(balance))
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
      balance = displayBalance(token.balance, token.decimal, 8)
      nameSource = token.name
    }

    var balanceDest = ""
    var nameDest = ""
    var tokenDest = this.props.tokens[this.props.exchange.destTokenSymbol]
    if (tokenDest) {
      balanceDest = displayBalance(tokenDest.balance, tokenDest.decimal, 8)
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
      selectSameToken: this.props.exchange.errors.selectSameToken,
      selectTokenToken: this.props.exchange.errors.selectTokenToken,
      sourceAmount: this.props.exchange.errors.sourceAmountError,
      tokenSource: ''
    }

    var button = {
      selectToken: {
        onClick: this.proccessSelectToken
      },
      showAdvance: {
        onClick: this.showAdvanceOption
      }
    }

    var input = {
      sourceAmount: {
        type: 'number',
        value: this.props.exchange.sourceAmount,
        onChange: this.changeSourceAmount
      },
      destAmount: {
        type: 'number',
        value: this.getDesAmount()
      }
    }

    var selectTokenModal = (
      <SelectToken chooseToken={this.chooseToken} type="exchange" />
    )

    var exchangeRate = {
      sourceToken: this.props.exchange.sourceTokenSymbol,
      rate: toT(this.props.exchange.offeredRate, 6),
      destToken: this.props.exchange.destTokenSymbol,
      percent: "-"
    }
    var exchangeButton = (
      <PostExchange />
    )
    var trasactionLoadingScreen = (
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
      <TransactionConfig gas={this.props.exchange.gas}
        gasPrice={this.props.exchange.gasPrice}
        gasHandler={this.specifyGas}
        gasPriceHandler={this.specifyGasPrice}
        gasPriceError={this.props.exchange.errors.gasPriceError}
        gasError={this.props.exchange.errors.gasError}
        totalGas={converters.gweiToEth(this.props.exchange.gas * this.props.exchange.gasPrice)}
      />
    )

    return (
      <ExchangeForm step={this.props.exchange.step}
        tokenSource={tokenSource}
        tokenDest={tokenDest}
        selectTokenModal={selectTokenModal}
        exchangeRate={exchangeRate}
        gasConfig={gasConfig}
        exchangeButton={exchangeButton}
        trasactionLoadingScreen={trasactionLoadingScreen}
        recap={this.createRecap()}
        errors={errors}
        button={button}
        input={input}
        balance={balance}
        sourceTokenSymbol={this.props.exchange.sourceTokenSymbol}
        setAmount={this.setAmount}
        isSelectToken = {this.props.exchange.isSelectToken}
      />
    )
  }
}
