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

import { specifyGasLimit, specifyGasPrice, resetStep } from "../actions/exchangeFormActions"


@connect((store) => {
  return {
    gas: store.exchangeForm.gas,
    gasError: store.exchangeForm.errors["gasError"],
    gasPrice: store.exchangeForm.gasPrice,
    gasPriceError: store.exchangeForm.errors["gasPriceError"],
    step: store.exchangeForm.step,
    passwordError: store.exchangeForm.errors["passwordError"],
    broadcasting: store.exchangeForm.broadcasting,
    txHash: store.exchangeForm.txHash,
    tx: store.txs[store.exchangeForm.txHash],
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

  done = (event) => {
    event.preventDefault()
    this.props.dispatch(resetStep())
  }

  render() {
    if (this.props.step == 4) {
      var txStatus
      var txHash = this.props.txHash
      var tx = this.props.tx
      if (this.props.broadcasting) {
        txStatus = <p>Broadcasting your transaction...</p>
      } else {
        if (tx.status == "pending") {
          txStatus = <p>Transaction {txHash} is waiting for confirmations...</p>
        } else {
          txStatus = <p>Transaction {txHash} is mined</p>
        }
      }
    }
    return (
      <form>
        <div class="k-page k-page-exchange">
          <div class="exchange-page" data-page={this.props.step}>
            <div class="k-progress">
              <div class="progress-bar">
                <div class="step step-1">
                  <span>1</span>
                </div>
                <div class="step step-2">
                  <div class="bridge"></div>
                  <span>2</span>
                </div>
                <div class="step step-3">
                  <div class="bridge"></div>
                  <span>3</span>
                </div>
                <div class="step step-4">
                  <div class="bridge"></div>
                  <span>4</span>
                </div>
              </div>
            </div>
            <div class="page">
              <div class="page-item item-1">
                <UserSelect />
                <RecipientSelect />
                <TokenSource />
                <TokenDest />
                <ExchangeRate />
              </div>
              <div class="page-item item-2">
                <TransactionConfig gas={this.props.gas}
                  gasError={this.props.gasError}
                  gasPrice={this.props.gasPrice}
                  gasPriceError={this.props.gasPriceError}
                  gasHandler={this.specifyGas}
                  gasPriceHandler={this.specifyGasPrice} />
              </div>
              <div class="page-item item-3">
                <Credential passphraseID={this.props.passphraseID} error={this.props.passwordError} />
              </div>
              <div class="page-item item-4">
                <span class="verify">
                  <i class="k-icon k-icon-verify"></i>
                </span>
                {txStatus}
                <button class="button" onClick={this.done}>Done</button>
              </div>
            </div>
            <div class="next" id="exchange-next">
              <PostExchange passphraseID={this.props.passphraseID} />
            </div>
          </div>
        </div>
      </form>)
  }
}
