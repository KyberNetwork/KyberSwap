import React from "react"
import { connect } from "react-redux"

import UserSelect from "./ExchangeForm/UserSelect"
import TokenSource from "./ExchangeForm/TokenSource"
import TokenDest from "./ExchangeForm/TokenDest"
import ExchangeRate from "./ExchangeForm/ExchangeRate"
import RecipientSelect from "./ExchangeForm/RecipientSelect"
import TransactionConfig from "./Elements/TransactionConfig"
import Credential from "./Elements/Credential"
import PostExchange from "./ExchangeForm/PostExchange"

import { specifyGasLimit, specifyGasPrice } from "../actions/exchangeFormActions"


@connect((store) => {
  return {
    gas: store.exchangeForm.gas,
    gasPrice: store.exchangeForm.gasPrice,
  }
})
export default class ExchangeForm extends React.Component {

  componentWillMount() {
    this.specifyGas = this.specifyGas.bind(this)
    this.specifyGasPrice = this.specifyGasPrice.bind(this)
  }

  specifyGas(event) {
    this.props.dispatch(specifyGasLimit(event.target.value));
  }

  specifyGasPrice(event) {
    this.props.dispatch(specifyGasPrice(event.target.value));
  }

  render() {
    return (
    <div>
      <form>
        <UserSelect />
        <TokenSource />
        <TokenDest />
        <ExchangeRate />
        <RecipientSelect />
        <TransactionConfig gas={this.props.gas} gasPrice={this.props.gasPrice} gasHandler={this.specifyGas} gasPriceHandler={this.specifyGasPrice} />
        <Credential passphraseID={this.props.passphraseID} />
        <PostExchange passphraseID={this.props.passphraseID} />
      </form>
    </div>)
  }
}
