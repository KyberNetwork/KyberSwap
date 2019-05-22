import React from "react"
import { connect } from "react-redux"
import ReactTooltip from 'react-tooltip'
import { getTranslate } from 'react-localize-redux'
import * as common from "../../utils/common"
import { filterInputNumber } from "../../utils/validators";
import * as limitOrderActions from "../../actions/limitOrderActions"
import * as globalActions from "../../actions/globalActions"
import { TokenSelector } from "../TransactionCommon"
import constants from "../../services/constants"

import { default as _ } from 'underscore';

import { LimitOrderCompareRate } from "../LimitOrder";
import * as converters from "../../utils/converter";

@connect((store, props) => {
  const account = store.account.account
  const translate = getTranslate(store.locale)
  const tokens = store.tokens.tokens
  const limitOrder = store.limitOrder
  const ethereum = store.connection.ethereum

  return {
    translate, limitOrder, tokens, account, ethereum,
    global: store.global

  }
})

export default class LimitOrderForm extends React.Component {
  // constructor(){
  //   super()
  //   this.state = {
  //     isShowSourceAmountError: false,
  //     isShowTriggerRateError: false
  //   }
  // }

  componentDidUpdate(prevProps) {
    if ((this.props.limitOrder.errors.sourceAmount.length > 0 && prevProps.limitOrder.errors.sourceAmount.length === 0) || 
    (this.props.limitOrder.errors.rateSystem !== "" && prevProps.limitOrder.errors.rateSystem === "")){
      setTimeout(() => {
        ReactTooltip.show(document.getElementById("limit-order-error-trigger"))
      }, 300)
    }

    if (this.props.limitOrder.errors.triggerRate.length > 0 && prevProps.limitOrder.errors.triggerRate.length === 0){
      setTimeout(() => {
        ReactTooltip.show(document.getElementById("trigger-rate-error-trigger"))
      }, 300)
    }
  }

  componentDidMount = () => {    
    if (this.props.limitOrder.errors.sourceAmount.length > 0 || this.props.limitOrder.errors.rateSystem !== ""){
      setTimeout(() => {
        ReactTooltip.show(document.getElementById("limit-order-error-trigger"))
      }, 300)
    }
    if (this.props.limitOrder.errors.triggerRate.length > 0){
      setTimeout(() => {
        ReactTooltip.show(document.getElementById("trigger-rate-error-trigger"))
      }, 300)
    }
  }

  getEthereumInstance = () => {
    var ethereum = this.props.ethereum
    if (!ethereum){
      ethereum = new EthereumService()
    }
    return ethereum
  }

  fetchCurrentRate = (sourceAmount) => {
    var source = this.props.limitOrder.sourceToken
    var dest = this.props.limitOrder.destToken
    
    var sourceTokenSymbol = this.props.limitOrder.sourceTokenSymbol
    var isManual = true

    var ethereum = this.getEthereumInstance()
    this.props.dispatch(limitOrderActions.updateRate(ethereum, source, dest, sourceAmount, sourceTokenSymbol, isManual));
    
  }

  lazyFetchRate = _.debounce(this.fetchCurrentRate, 500)

  handleInputChange = (e, type, referValue) => {
    var value = e.target.value
    var check = filterInputNumber(e, value, referValue)
    if (check) {     
      if (value < 0) return
      this.props.dispatch(limitOrderActions.inputChange(type, value));
      
      if (type === "source"){
        this.lazyFetchRate(value)
      }
    }
  };

  addSrcAmountByBalancePercentage = (balancePercentage) => {
    const srcTokenSymbol = this.props.limitOrder.sourceTokenSymbol;
    const srcToken = this.props.tokens[srcTokenSymbol];
    const srcTokenBalance = converters.toT(srcToken.balance, srcToken.decimals);

    let sourceAmountByPercentage = srcTokenBalance * (balancePercentage / 100);

    if (!+sourceAmountByPercentage) sourceAmountByPercentage = 0;

    this.props.dispatch(limitOrderActions.inputChange('source', sourceAmountByPercentage));
  };


  render() {    

    var errorSourceAmount = ""
    var errorShow = this.props.limitOrder.errors.sourceAmount.map((value, index) => {
      errorSourceAmount += `<span class="error-text" key=${index}>${value}</span>`
    })
    if (this.props.limitOrder.errors.rateSystem !== ""){
      errorSourceAmount += `<span class="error-text">${this.props.limitOrder.errors.rateSystem}</span>`
    }

    var errorTriggerRate = ""
    var errorShow = this.props.limitOrder.errors.triggerRate.map((value, index) => {
      errorTriggerRate += `<span class="error-text" key=${index}>${value}</span>`
    })
    
    return (
      <div className={"exchange-content exchange-content--limit-order limit-order-form container"}>
        {this.props.account !== false && (
          <div className={'balance-order'}>
            <div className={'balance-order__item'} onClick={() => this.addSrcAmountByBalancePercentage(25)}>25%</div>
            <div className={'balance-order__item'} onClick={() => this.addSrcAmountByBalancePercentage(50)}>50%</div>
            <div className={'balance-order__item'} onClick={() => this.addSrcAmountByBalancePercentage(100)}>100%</div>
          </div>
        )}
        <div className={"exchange-content__item--wrapper"}>
          <div className={"exchange-item-label"}>{this.props.translate("transaction.exchange_from") || "From"}:</div>
          <div className={`exchange-content__item exchange-content__item--left select-token ${errorSourceAmount != "" ? "error" : ""}`}
          >
            <div className={`input-div-content`}>
              <div className={"exchange-content__label-content"}>
                <div className="exchange-content__select select-token-panel">
                <TokenSelector
                      type="source"
                      focusItem={this.props.limitOrder.sourceTokenSymbol}
                      listItem={this.props.tokens}
                      chooseToken={this.props.chooseToken}
                      screen="limit_order"
                      banToken="ETH"                 
                    />
                </div>
              </div>
              <div className={`exchange-content__input-container`}>
                <div className={"main-input main-input__left"}>
                  <div id="limit-order-error-trigger" className="input-tooltip-wrapper" data-tip={`<div>${errorSourceAmount}</div>`} data-html={true} data-event='click focus' data-for="source-amount-error" data-scroll-hide="false">
                    <input
                      className={`exchange-content__input`}
                      min="0"
                      step="0.000001"
                      placeholder="0" autoFocus
                      type={this.props.global.isOnMobile ? "number" : "text"} maxLength="50" autoComplete="off"
                      value={this.props.limitOrder.sourceAmount}                      
                      onChange={(e) => this.handleInputChange(e, "source", this.props.limitOrder.sourceAmount)}
                    />
                  </div>
                </div>
              </div>
            </div>
            {errorSourceAmount &&
              <ReactTooltip globalEventOff="click" html={true} place="bottom" className="select-token-error" id="source-amount-error" type="light" />
            }
          </div>
        </div>

        <div className={"exchange-content__item--wrapper"}>
          <div className={"exchange-item-label"}>{this.props.translate("transaction.exchange_to") || "To"}:</div>
          <div className={"exchange-content__item exchange-content__item--left"}>
            <div className={`input-div-content`}>
              <div className={"exchange-content__label-content"}>
                <div className="exchange-content__select select-token-panel">
                  <TokenSelector
                    type="dest"
                    focusItem={this.props.limitOrder.destTokenSymbol}
                    listItem={this.props.tokens}
                    chooseToken={this.props.chooseToken}
                    screen="limit_order"
                    banToken="ETH"
                  />
                </div>
              </div>
              <div className={`exchange-content__input-container`}>
                <div className={"main-input main-input__left"}>
                  <input
                    className={`exchange-content__input`}
                    step="0.000001"
                    placeholder="0"
                    min="0"
                    type={this.props.global.isOnMobile ? "number" : "text"}
                    maxLength="50"
                    autoComplete="off"
                    value={this.props.limitOrder.destAmount}
                    onChange={(e) => this.handleInputChange(e, "dest", this.props.limitOrder.destAmount)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={"exchange-content__item--wrapper"}>
          <div className={"exchange-item-label"}>{this.props.translate("transaction.rate_label") || "Rate"}:</div>
          <div className={`exchange-content__item exchange-content__item--left exchange-content__item--no-pd-left select-token ${errorTriggerRate != "" ? "error" : ""}`}>
            <div className={`input-div-content`}>
              <div className={'exchange-content__label-content exchange-content__label-content--disabled'}>
                {this.props.limitOrder.sourceTokenSymbol} / {this.props.limitOrder.destTokenSymbol}
              </div>
              <div id="trigger-rate-error-trigger" className="input-tooltip-wrapper input-tooltip-wrapper__rate" data-tip={`<div>${errorTriggerRate}</div>`} data-html={true} data-event='click focus' data-for="trigger-rate-error" data-scroll-hide="false">
              {/* <div className={"main-input main-input__left main-input--rate"}> */}
                <input
                  className={`exchange-content__input`}
                  step="0.000001"
                  placeholder="0"
                  min="0"
                  type={this.props.global.isOnMobile ? "number" : "text"}
                  maxLength="50"
                  autoComplete="off"
                  value={this.props.limitOrder.triggerRate}
                  onChange={(e) => this.handleInputChange(e, "rate", this.props.limitOrder.triggerRate)}
                />
              </div>
            </div>
            {errorTriggerRate &&
              <ReactTooltip globalEventOff="click" html={true} place="bottom" className="select-token-error" id="trigger-rate-error" type="light" />
            }
          </div>
        </div>

        <LimitOrderCompareRate />
      </div>
    )
  }
}
