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

import { closeModal } from "../actions/utilActions"

import constants from "../services/constants"

import { specifyGasLimit, specifyGasPrice, resetStep } from "../actions/exchangeFormActions"

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

  done = (event) => {
    event.preventDefault()
    this.props.dispatch(
      resetStep(this.props.exchangeFormID))
    if (this.props.postExchangeHandler) {
      this.props.postExchangeHandler(event)
    }
  }

  closeModal = (event) => {
    this.props.dispatch(closeModal(quickExchangeModalID))
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
          <div class="title">
            <div class="left">
              <i class="k-icon k-icon-send-green"></i>
              <span>SEND</span>
            </div>
            <div class="right">
              <span onClick={this.closeModal}>
                <i class="k-icon k-icon-close"></i>
              </span>              
            </div>
          </div>
          <div class="advance">
            <i class="k-icon k-icon-setting"></i>
            <span>Advance</span>
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
                <div class="step step-3">
                  <div class="bridge"></div>
                  <span class="circle"></span>
                </div>                
              </div>
              <div class="progress-label">
                <div>Address</div>
                <div>Amount</div>
                <div>Password</div>
              </div>
            </div>
            <div class="page">
              <div class="page-item item-1">
                <h3>
                  <i class="k-icon k-icon-home-white"></i>
                  <span>Address</span>
                </h3>
                <div>
                  <UserSelect exchangeFormID={this.props.exchangeFormID}/>
                  <RecipientSelect exchangeFormID={this.props.exchangeFormID}/>                
                </div>                
              </div>
              <div class="page-item item-2">
                <div class="content">
                  <ul>
                    <li>
                      <label>Amounts to send</label>
                      <select>
                        <option>BTC</option>
                        <option>ETH</option>
                      </select>
                      <input type="text"/>
                    </li>
                    <li>
                      <label>Convert to a different currency ?</label>                      
                      <input type="checkbox"/>
                    </li>
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
                  </ul>
                </div>                
                <ExchangeRate exchangeFormID={this.props.exchangeFormID}/>
              </div>
              <div class="page-item item-3">
                <Credential passphraseID={this.props.passphraseID} error={this.props.passwordError} />
              </div>
              <div class="page-item item-4">
                <h3>Congratulations. Your transaction has been processed.</h3>
                <span class="verify">
                  <i class="k-icon k-icon-verify"></i>
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
