import React from "react"
import { connect } from "react-redux"

import {UserSelect, TokenSource, TokenDest, ExchangeRate, RecipientSelect, PostExchange, CrossSend, MinRate, Advanced} from "../ExchangeForm"

import {Credential,TransactionConfig} from "../../components/Forms/Components"

import constants from "../../services/constants"
import ReactTooltip from 'react-tooltip'

import { specifyGasLimit, specifyGasPrice, resetStep, selectAdvance, deselectAdvance } from "../../actions/exchangeFormActions"
import { errorName } from "../../utils/converter"

const quickExchangeModalID = "quick-exchange-modal"

@connect((store, props) => {
  var exchangeForm = store.exchangeForm[props.exchangeFormID]
  exchangeForm = exchangeForm || {...constants.INIT_EXCHANGE_FORM_STATE}
  var sourceToken = exchangeForm.sourceToken
  var destToken = exchangeForm.destToken
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
    isCrossSend: sourceToken != destToken,
    advanced: exchangeForm.advanced,
    bcError: exchangeForm.bcError,
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

  focusNext =(value, event) => {         
    if(event.key === 'Enter'){
      event.preventDefault()
      if(document.getElementsByName(value)[0]){
        document.getElementsByName(value)[0].focus();        
      }      
    }
  }

  goNextStep =(event) => {         
    if(event.key === 'Enter'){
      event.preventDefault()
      if(document.getElementById('next-exchange')){
        document.getElementById('next-exchange').click();        
      }      
    }
  }

  getCircleClass = (tx) => {
    if (tx) {
      if (tx.status == "success") {
        return "circle success"
      } else if (tx.status == "failed") {
        return "circle failed"
      }
    }
    return "circle"
  }

  render() {
    if (this.props.step == 4) {
      var txStatus
      var txHash = this.props.txHash
      var tx = this.props.tx
      if (this.props.broadcasting) {
        txStatus = <h3>Broadcasting your transaction...</h3>
      } else if (this.props.bcError != "") {
        txStatus = <div>
          <h3>Broadcasting your transaction failed.</h3>
          <h3>
            Error: {errorName(this.props.bcError.message)}
            <span data-tip data-for='failure-tooltip'>
              <i class="k-icon k-icon-question"></i>
            </span>
          </h3>
          <ReactTooltip id='failure-tooltip' effect="solid" place="right" offset={{'left': -15}} className="k-tooltip">
            <span>{this.props.bcError.message}</span>
          </ReactTooltip>
        </div>
      } else {
        if (tx.status == "pending") {
          txStatus = <div>
            <h3>Transaction</h3>
            <a target="_blank" href={"https://kovan.etherscan.io/tx/" + txHash}>{txHash}</a>
            <h3>is waiting for confirmation...</h3>
          </div>
        } else if (tx.status == "failed") {
          txStatus = <div>
            <h3>Transaction</h3>
            <a target="_blank" href={"https://kovan.etherscan.io/tx/" + txHash}>{txHash}</a>
            <h3>is failed. Please try again later.</h3>
          </div>
        } else if (tx.status == "success") {
          txStatus = <div>
            <h3>Transaction</h3>
            <a target="_blank" href={"https://kovan.etherscan.io/tx/" + txHash}>{txHash}</a>
            <h3>is successful.</h3>
          </div>
        } else {
          txStatus = <div>
            <h3>Transaction</h3>
            <a target="_blank" href={"https://kovan.etherscan.io/tx/" + txHash}>{txHash}</a>
            <h3>is confirmed.</h3>
          </div>
        }
      }
    }
    return (      
      <div>
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
              <div class={this.props.exchangeFormID != "quick-exchange" ? "progress-bar progress-squeeze" : "progress-bar"}>
                { this.props.exchangeFormID != "quick-exchange" ?
                  <div class="step step-1">
                    <span class="left-bridge"></span>
                    <span class="right-bridge"></span>
                    <span class="circle"></span>
                    <div class="label">
                      Destination
                    </div>
                  </div> : ""
                }
                <div class="step step-2">
                  <span class="left-bridge"></span>
                  <span class="right-bridge"></span>
                  <span class="circle"></span>
                  <div class="label">
                    { this.props.exchangeFormID == "quick-exchange" ?
                      "Exchange setting" : "Send setting"
                    }
                  </div>
                </div>
                <div class="step step-advance" className={this.props.advanced?"step step-advance":"step step-advance hide-step"}>
                  <span class="left-bridge"></span>
                  <span class="right-bridge"></span>
                  <span class="circle"></span>
                  <div class="label">Advanced</div>
                </div>
                <div class="step step-3">
                  <span class="left-bridge"></span>
                  <span class="right-bridge"></span>
                  <span class="circle"></span>
                  <div class="label">Passphrase</div>
                </div>
                <div class="step step-4">
                  <span class="left-bridge"></span>
                  <span class="right-bridge"></span>
                  <span class={this.getCircleClass(tx)} ></span>
                  <div class="label">Done</div>
                </div>
              </div>
            </div>
            <div className={(this.props.isCrossSend || !this.props.allowDirectSend)?"page cross-send":"page"}>
              <div class="page-item item-1">
                <div>
                  <UserSelect exchangeFormID={this.props.exchangeFormID}/>
                </div>
                <div>
                  <RecipientSelect  onKeyPress={(event) => this.goNextStep(event)} exchangeFormID={this.props.exchangeFormID}/>                
                </div>
              </div>
              <div class="page-item item-2">
                <div class="content">
                  <ul>
                    <TokenSource onKeyPress={(event) => this.focusNext('token_des', event)} exchangeFormID={this.props.exchangeFormID} />
                    { this.props.allowDirectSend ?
                      <CrossSend exchangeFormID={this.props.exchangeFormID} /> : ""
                    }
                    { (!this.props.allowDirectSend) ?
                      <li>
                        <TokenDest
                          expectedAmount={true}
                          disableMinAmount={true}
                          onKeyPress={(event) => this.focusNext('min_rate', event)}
                          exchangeFormID={this.props.exchangeFormID}
                          allowDirectSend={this.props.allowDirectSend}/>
                      </li> : ""
                    }
                    <li>
                      <div>
                        <label class="advance-label">Advanced
                          <span data-tip data-for='advance-tooltip'>
                            <i class="k-icon k-icon-question"></i>
                          </span>
                        </label>
                         <ReactTooltip id='advance-tooltip' effect="solid" place="right" offset={{'left': -15}} className="k-tooltip">                                                        
                           <span>To configure minimum rate and gas info</span>
                         </ReactTooltip>
                        <input type="checkbox" defaultChecked={this.props.advanced} onChange={this.selectAdvance} id="advance-option"/>
                        <label class="k-checkbox" for="advance-option"></label>
                      </div>
                    </li>
                    { this.props.advanced && (!this.props.allowDirectSend || this.props.isCrossSend )?
                      <li>
                        <Advanced focusNext={this.focusNext} goNextStep={this.goNextStep} exchangeFormID={this.props.exchangeFormID} allowDirectSend={this.props.allowDirectSend} />
                      </li> : ""
                    }
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
                    gasPriceHandler={this.specifyGasPrice} 
                    onGasPress = {(event) => this.focusNext('gas_price', event)}
                    onGasPricePress = {this.goNextStep}
                    />
                </div>
              </div>
              <div class="page-item item-3">
                <Credential noLabel={true} passphraseID={this.props.passphraseID} error={this.props.passwordError}  onKeyPress={(event) => this.goNextStep(event)}/>
              </div>
              <div class="page-item item-4">
                {txStatus}
                { (tx && tx.status == "failed") || this.props.bcError != "" ?
                  <span class="verify">
                    <i class="k-icon k-icon-failed" ></i>
                  </span> : ""
                }
                { tx && tx.status == "success" ?
                  <span class="verify">
                    <i class="k-icon k-icon-verify" ></i>
                  </span> : ""
                }
              </div>
            </div>
            <div class="next" id="exchange-next">
              <PostExchange passphraseID={this.props.passphraseID} exchangeFormID={this.props.exchangeFormID} allowDirectSend={this.props.allowDirectSend} postExchangeHandler={this.props.postExchangeHandler}/>
            </div>
          </div>
        </div>
      </div>)
  }
}
