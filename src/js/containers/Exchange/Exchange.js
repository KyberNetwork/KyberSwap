import React from "react"
import { connect } from "react-redux"


import { calculateMinAmount, toT } from "../../utils/converter"

import { ExchangeRate, PostExchange } from "../Exchange"
import { ExchangeForm } from "../../components/Forms"
import { SelectTokenModal, ChangeGasModal, TransactionLoading, Token } from "../CommonElements"

import { anyErrors } from "../../utils/validators"

import { openTokenModal, hideSelectToken } from "../../actions/utilActions"
import { selectTokenAsync, thowErrorSourceAmount } from "../../actions/exchangeActions"
import { errorSelectToken, goToStep, showAdvance, changeSourceAmout, openPassphrase, makeNewExchange } from "../../actions/exchangeActions"


@connect((store) => {
  if (store.account.isStoreReady){
    if (!!!store.account.account.address){
      window.location.href = "/"
    }
  }  
  const ethereum = store.connection.ethereum
  return { ...store.exchange, ethereum}
})

export default class Exchange extends React.Component {
  openSourceToken = (e) => {
    this.props.dispatch(openTokenModal("source"))
  }

  openDesToken = (e) => {
    this.props.dispatch(openTokenModal("des"))
  }

  chooseToken = (symbol, address, type) => {
    this.props.dispatch(selectTokenAsync(symbol, address, type, this.props.ethereum))
  }
  
  proccessSelectToken = () => {
    if (!anyErrors(this.props.errors)) {
      this.props.dispatch(goToStep(2))
    } 
  }
  showAdvanceOption = () => {
    this.props.dispatch(showAdvance())
  }
  changeSourceAmount = (e) => {
    var value = e.target.value
    this.props.dispatch(changeSourceAmout(value))
  }

  getDesAmount = () => {
    return this.props.sourceAmount * toT(this.props.offeredRate, 6)
  }
  createRecap = () => {
    var recap = `exchange ${this.props.sourceAmount.toString().slice(0, 7)}${this.props.sourceAmount.toString().length > 7 ? '...' : ''} ${this.props.sourceTokenSymbol} for ${this.getDesAmount().toString().slice(0, 7)}${this.getDesAmount().toString().length > 7 ? '...' : ''} ${this.props.destTokenSymbol}`
    return recap
  }

  makeNewExchange = () => {
    this.props.dispatch(makeNewExchange());
  }

  render() {
    //console.log(this.props.ethereum)
    var tokenSource = (
      <Token type="source"
        token={this.props.sourceTokenSymbol}
        onSelected={this.openSourceToken}
      />
    )
    var tokenDest = (
      <Token type="des"
        token={this.props.destTokenSymbol}
        onSelected={this.openDesToken}
      />
    )

    var errorSelectSameToken = this.props.errors.selectSameToken === "" ? "" : (
      <div>{this.props.errors.selectSameToken}</div>
    )
    var errorSelectTokenToken = this.props.errors.selectTokenToken === "" ? "" : (
      <div>{this.props.errors.selectTokenToken}</div>
    )
    var errorSourceAmount = this.props.errors.sourceAmountError === "" ? "" : (
      <div>{this.props.errors.sourceAmountError}</div>
    )
    //console.log(errorSelectSameToken)
    var buttonStep1 = (
      <button onClick={this.proccessSelectToken}>Continue</button>
    )
    var buttonShowAdvance = (
      <button onClick={this.showAdvanceOption}>Advance</button>
    )
    var sourceAmount = (
      <input type="text" value={this.props.sourceAmount} onChange={this.changeSourceAmount} />
    )
    var destAmount = (
      <input value={this.getDesAmount()} />
    )
    var selectTokenModal = (
      <SelectTokenModal chooseToken={this.chooseToken} type="exchange" />
    )
    var changeGasModal = (
      <ChangeGasModal type="exchange"
        gas={this.props.gas}
        gasPrice={this.props.gasPrice}
        open={this.props.advanced}
        gasPriceError={this.props.errors.gasPriceError}
        gasError={this.props.errors.gasError}
      />
    )
    var exchangeRate = (
      <ExchangeRate />
    )
    var exchangeButton = (
      <PostExchange />
    )
    var trasactionLoadingScreen = (
      <TransactionLoading tx={this.props.txHash} makeNewTransaction={this.makeNewExchange} />
    )
    return (
      <ExchangeForm step={this.props.step}
        tokenSource={tokenSource}
        tokenDest={tokenDest}
        buttonStep1={buttonStep1}
        buttonShowAdvance={buttonShowAdvance}
        sourceAmount={sourceAmount}
        destAmount={destAmount}
        selectTokenModal={selectTokenModal}
        changeGasModal={changeGasModal}
        exchangeRate={exchangeRate}
        exchangeButton={exchangeButton}
        errorSelectSameToken={errorSelectSameToken}
        errorSelectTokenToken={errorSelectTokenToken}
        errorSourceAmount={errorSourceAmount}
        trasactionLoadingScreen={trasactionLoadingScreen}
        recap={this.createRecap()} />
    )
  }
}
