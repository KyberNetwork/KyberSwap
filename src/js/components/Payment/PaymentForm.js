import React from "react"
import { connect } from "react-redux"

import WalletSelect from "./WalletSelect"
import TokenSource from "./TokenSource"
import TokenDest from "./TokenDest"
import ExchangeRate from "./ExchangeRate"
import RecipientSelect from "./RecipientSelect"
import OnlyApproveToken from "./OnlyApproveToken"
import TransactionConfig from "../Elements/TransactionConfig"
import Credential from "../Elements/Credential"
import PostPayment from "./PostPayment"

import { specifyGasLimit, specifyGasPrice } from "../../actions/paymentFormActions"


@connect((store) => {
  return {
    gas: store.paymentForm.gas,
    gasPrice: store.paymentForm.gasPrice,
  }
})
export default class PaymentForm extends React.Component {

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
        <WalletSelect />
        <TokenSource />
        <TokenDest />
        <ExchangeRate />
        <RecipientSelect />
        <OnlyApproveToken />
        <TransactionConfig gas={this.props.gas} gasPrice={this.props.gasPrice} gasHandler={this.specifyGas} gasPriceHandler={this.specifyGasPrice} />
        <Credential passphraseID={this.props.passphraseID} />
        <PostPayment passphraseID={this.props.passphraseID} />
      </div>
    )
  }
}
