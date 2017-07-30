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
import CrossSend from "./ExchangeForm/CrossSend"
import constants from "../services/constants"

import { specifyGasLimit, specifyGasPrice, resetStep, selectAdvance, deselectAdvance } from "../actions/exchangeFormActions"

const quickExchangeModalID = "quick-exchange-modal"

@connect((store, props) => {
  var exchangeForm = store.exchangeForm[props.exchangeFormID]
  exchangeForm = exchangeForm || {...constants.INIT_EXCHANGE_FORM_STATE}
  return {
    gas: exchangeForm.gas,
    gasError: exchangeForm.errors["gasError"],
    gasPrice: exchangeForm.gasPrice,
    gasPriceError: exchangeForm.errors["gasPriceError"],
    step: exchangeForm.step,
    passwordError: exchangeForm.errors["passwordError"],
    broadcasting: exchangeForm.broadcasting,
    txHash: exchangeForm.txHash,
    tx: store.txs[exchangeForm.txHash],
    isCrossSend: exchangeForm.isCrossSend,
    advanced: exchangeForm.advanced,
  }
})
export default class ExchangeForm extends React.Component {

  specifyGas = (event) => {
    this.props.dispatch(
      specifyGasLimit(this.props.exchangeFormID, event.target.value))
  }

  specifyGasPrice = (event) => {
    this.props.dispatch(
      specifyGasPrice(this.props.exchangeFormID, event.target.value))
  }

  onClose = (event) => {
    event.preventDefault()
    this.props.postExchangeHandler(event)
  }

  selectAdvance = (event) => {
    if (event.target.checked) {
      this.props.dispatch(selectAdvance(this.props.exchangeFormID))
    } else {
      this.props.dispatch(deselectAdvance(this.props.exchangeFormID))
    }
  }

  done = (event) => {
    event.preventDefault()
    this.props.dispatch(
      resetStep(this.props.exchangeFormID))
    if (this.props.postExchangeHandler) {
      this.props.postExchangeHandler(event)
    }
  }

  render() {
    if (this.props.step == 4) {
      var txStatus
      var txHash = this.props.txHash
      var tx = this.props.tx
      if (this.props.broadcasting) {
        txStatus = <h3>Broadcasting your transaction...</h3>
      } else {
        if (tx.status == "pending") {
          txStatus = <div>
            <h3>Transaction</h3>
            <a href={"https://kovan.etherscan.io/tx/" + txHash}>{txHash}</a>
            <h3>is waiting for confirmations...</h3>
          </div>
        } else {
          txStatus = <div>
            <h3>Transaction</h3>
            <a href={"https://kovan.etherscan.io/tx/" + txHash}>{txHash}</a>
            <h3>is confirmed.</h3>
          </div>
        }
      }
    }
    return (
      <form autoComplete="false" >
        <div class="k-page k-page-exchange">
          <div class="title">
            <div class="left">
              <i class={"k-icon " + this.props.extraClass}></i>
              <span>{this.props.label}</span>
            </div>
            <div class="right">
              <button onClick={this.onClose}>
                <i  class="k-icon k-icon-close"></i>
              </button>
            </div>
          </div>
          <div class="advance">
          </div>
          <div class="exchange-page" data-page={this.props.step}>
            <div class="k-progress">
              <div class="progress-bar">
                <div class="step step-1">
                  <span class="circle"></span>
                </div>
                <div class="step step-2">
                  <div class="bridge"></div>
                  <span class="circle"></span>
                </div>
                { this.props.advanced ?
                  <div class="step step-advance">
                    <div class="bridge"></div>
                    <span class="circle"></span>
                  </div> : ""
                }
                <div class="step step-3">
                  <div class="bridge"></div>
                  <span class="circle"></span>
                </div>
                <div class="step step-4">
                  <div class="bridge"></div>
                  <span class="circle"></span>
                </div>
              </div>
              <div class={ this.props.advanced ? "advanced-progress-label progress-label" : "progress-label" }>
                <div class="progress-step-1">Addresses</div>
                <div class="progress-step-2">Amount</div>
                { this.props.advanced ?
                  <div class="progress-step-advance">Advance Option</div> : ""
                }
                <div class="progress-step-3">Password</div>
                <div class="progress-step-4">Done</div>
              </div>
            </div>
            <div class="page">
              <div class="page-item item-1">
                <h3>
                  <i class="k-icon k-icon-home-white"></i>
                  <span>Addresses</span>
                </h3>
                <div>
                  <UserSelect exchangeFormID={this.props.exchangeFormID}/>
                </div>
                <div>
                  <RecipientSelect exchangeFormID={this.props.exchangeFormID}/>                
                </div>
              </div>
              <div class="page-item item-2">
                <div class="content">
                  <ul>
                    <TokenSource exchangeFormID={this.props.exchangeFormID} />
                    { this.props.allowDirectSend ?
                      <CrossSend exchangeFormID={this.props.exchangeFormID} /> : ""
                    }
                    <TokenDest exchangeFormID={this.props.exchangeFormID} allowDirectSend={this.props.allowDirectSend}/>
                    <li>
                      <label>Advanced configuration</label>
                      <input type="checkbox" defaultChecked={this.props.advanced} onChange={this.selectAdvance}/>
                    </li>
                    {/*
                    <li>
                      <label>Max Destination Amount </label>
                      <select>
                        <option>BTC</option>
                        <option>ETH</option>
                      </select>
                      <span>123,456,789,101,112,567</span>
                    </li>
                    <li>
                      <label>Min Destination Amount</label>
                      <select>
                        <option>BTC</option>
                        <option>ETH</option>
                      </select>
                      <span>123,456,789,101,112,567</span>                      
                    </li>
                    */}
                  </ul>
                </div>
                { (this.props.isCrossSend || !this.props.allowDirectSend) ? <ExchangeRate exchangeFormID={this.props.exchangeFormID}/> : "" }
              </div>
              <div class="page-item item-advance">
                <div class="content">
                  <TransactionConfig gas={this.props.gas}
                    gasError={this.props.gasError}
                    gasPrice={this.props.gasPrice}
                    gasPriceError={this.props.gasPriceError}
                    gasHandler={this.specifyGas}
                    gasPriceHandler={this.specifyGasPrice} />
                </div>
              </div>
              <div class="page-item item-3">
                <Credential passphraseID={this.props.passphraseID} error={this.props.passwordError} />
              </div>
              <div class="page-item item-4">
                {txStatus}
                <span class="verify">
                  <i class="k-icon k-icon-verify" onClick={this.done} ></i>
                </span>
              </div>
            </div>
            <div class="next" id="exchange-next">
              <PostExchange passphraseID={this.props.passphraseID} exchangeFormID={this.props.exchangeFormID} allowDirectSend={this.props.allowDirectSend}/>
            </div>
          </div>
        </div>
      </form>)
  }
}
