import React from "react"
import { connect } from "react-redux"


import { calculateMinAmount, toT } from "../../utils/converter"

import { ExchangeRate, PostExchange } from "../Exchange"
import { ExchangeForm } from "../../components/Transaction"
import { SelectTokenModal, ChangeGasModal, TransactionLoading, Token } from "../CommonElements"

import { anyErrors } from "../../utils/validators"

import { openTokenModal, hideSelectToken } from "../../actions/utilActions"
//import { selectTokenAsync, thowErrorSourceAmount } from "../../actions/exchangeActions"
import * as exchangeActions from "../../actions/exchangeActions"

import { TransactionConfig } from "../../components/CommonElement"
@connect((store) => {  
  const ethereum = store.connection.ethereum
  const account = store.account
  const exchange = store.exchange
  const tokens = store.tokens
  return {account, ethereum, exchange, tokens}
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

  render() {
    if (this.props.account.isStoreReady) {
      if (!!!this.props.account.account.address) {
        this.props.dispatch(push("/"))        
        return (
          <div></div>
        )
      }
    }

    var balance = ""
    var token = this.props.tokens[this.props.exchange.sourceTokenSymbol]
    if(token){
      balance = toT(token.balance,8)
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

    // var errorSelectSameToken = this.props.errors.selectSameToken === "" ? "" : (
    //   <div>{this.props.errors.selectSameToken}</div>
    // )
    // var errorSelectTokenToken = this.props.errors.selectTokenToken === "" ? "" : (
    //   <div>{this.props.errors.selectTokenToken}</div>
    // )
    // var errorSourceAmount = this.props.errors.sourceAmountError === "" ? "" : (
    //   <div>{this.props.errors.sourceAmountError}</div>
    // )


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


    // var buttonStep1 = (
    //   <button onClick={this.proccessSelectToken}>Continue</button>
    // )
    // var buttonShowAdvance = (
    //   <button onClick={this.showAdvanceOption}>Advance</button>
    // )

    // var sourceAmount = (
    //   <input type="text" value={this.props.sourceAmount} onChange={this.changeSourceAmount} />
    // )
    // var destAmount = (
    //   <input value={this.getDesAmount()} />
    // )
    var selectTokenModal = (
      <SelectTokenModal chooseToken={this.chooseToken} type="exchange" />
    )
    var changeGasModal = (
      <ChangeGasModal type="exchange"
        gas={this.props.exchange.gas}
        gasPrice={this.props.exchange.gasPrice}
        open={this.props.exchange.advanced}
        gasPriceError={this.props.exchange.errors.gasPriceError}
        gasError={this.props.exchange.errors.gasError}
      />
    )
    var exchangeRate = (
      <ExchangeRate />
    )
    var exchangeButton = (
      <PostExchange />
    )
    var trasactionLoadingScreen = (
      <TransactionLoading tx={this.props.exchange.txHash} makeNewTransaction={this.makeNewExchange} type="exchange"/>
    )
    var gasConfig = (
      <TransactionConfig gas={this.props.exchange.gas}
              gasPrice={this.props.exchange.gasPrice}
              gasHandler={this.specifyGas}
              gasPriceHandler={this.specifyGasPrice}
              gasPriceError={this.props.exchange.gasPriceError}
              gasError={this.props.exchange.gasError}/>
    )   

    return (
      <ExchangeForm step={this.props.exchange.step}
        tokenSource={tokenSource}
        tokenDest={tokenDest}
        selectTokenModal={selectTokenModal}
        changeGasModal={changeGasModal}
        exchangeRate={exchangeRate}
        gasConfig = {gasConfig}
        exchangeButton={exchangeButton}
        trasactionLoadingScreen={trasactionLoadingScreen}
        recap={this.createRecap()}
        errors={errors}
        button={button}
        input={input}
        balance = {balance}
        sourceTokenSymbol = {this.props.exchange.sourceTokenSymbol}
        />
    )
  }
}
