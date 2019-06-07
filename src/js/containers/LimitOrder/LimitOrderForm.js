import React from "react"
import { connect } from "react-redux"
import ReactTooltip from 'react-tooltip'
import { getTranslate } from 'react-localize-redux'
import * as common from "../../utils/common"
import { filterInputNumber } from "../../utils/validators";
import * as limitOrderActions from "../../actions/limitOrderActions"
import * as globalActions from "../../actions/globalActions"
import { TokenSelector } from "../TransactionCommon"
import * as constants from "../../services/constants"
import { default as _ } from 'underscore';
import { LimitOrderCompareRate } from "../LimitOrder";
import * as converters from "../../utils/converter";
import BLOCKCHAIN_INFO from "../../../../env";
import { Tooltip } from "react-tippy";

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
    if ((this.props.limitOrder.errors.sourceAmount.length > prevProps.limitOrder.errors.sourceAmount.length) ||
    (this.props.limitOrder.errors.rateSystem !== "" && prevProps.limitOrder.errors.rateSystem === "")){
      setTimeout(() => {
        ReactTooltip.show(document.getElementById("limit-order-error-trigger"))
      }, 300)
    }

    if (this.props.limitOrder.errors.triggerRate.length > prevProps.limitOrder.errors.triggerRate.length){
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
    var sourceTokenSymbol = this.props.limitOrder.sourceTokenSymbol
    var sourceToken = this.props.limitOrder.sourceToken
    var destTokenSymbol = this.props.limitOrder.destTokenSymbol
    var destToken = this.props.limitOrder.destToken

    var isManual = true

    var ethereum = this.getEthereumInstance()
    this.props.dispatch(limitOrderActions.updateRate(ethereum, sourceTokenSymbol, sourceToken, destTokenSymbol, destToken, sourceAmount, isManual));
    
  }

  lazyFetchRate = _.debounce(this.fetchCurrentRate, 500)

  handleFocus = (e, type) => {
    this.props.global.analytics.callTrack("trackLimitOrderFocusAmount", type);
  }

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

  getMaxGasApprove = () => {
    var tokens = this.props.tokens
    var sourceSymbol = this.props.limitOrder.sourceTokenSymbol
    if (tokens[sourceSymbol] && tokens[sourceSymbol].gasApprove) {
      return tokens[sourceSymbol].gasApprove
    } else {
      return this.props.limitOrder.max_gas_approve
    }
  }

  getMaxGasExchange = () => {
    const tokens = this.props.tokens
    var destTokenSymbol = BLOCKCHAIN_INFO.wrapETHToken
    var destTokenLimit = tokens[destTokenSymbol] && tokens[destTokenSymbol].gasLimit ? tokens[destTokenSymbol].gasLimit : this.props.limitOrder.max_gas

    return destTokenLimit;

  }

  calcualteMaxFee = () => {
    var gasApprove = this.getMaxGasApprove()
    var gasExchange = this.getMaxGasExchange()
    var totalGas = gasExchange + gasApprove * 2 

    var totalFee = converters.calculateGasFee(this.props.limitOrder.gasPrice, totalGas)    
    return totalFee
  }

  addSrcAmountByBalancePercentage = (balancePercentage) => {
    const srcTokenSymbol = this.props.limitOrder.sourceTokenSymbol;
    const srcToken = this.props.availableBalanceTokens.find(token => {
      return token.symbol === srcTokenSymbol;
    });
    const srcTokenBalance = converters.toT(srcToken.balance, srcToken.decimals);


    let sourceAmountByPercentage = converters.getBigNumberValueByPercentage(srcTokenBalance, balancePercentage);

    //if souce token is weth, we spend a small amount to make approve tx, swap tx
    if (srcTokenSymbol === BLOCKCHAIN_INFO.wrapETHToken && balancePercentage === 100){          
      var ethBalance = this.props.tokens["ETH"].balance
      var fee = this.calcualteMaxFee()
      if(converters.compareTwoNumber(ethBalance, converters.toEther(fee)) === 1){
        sourceAmountByPercentage -= fee
      }else{
        sourceAmountByPercentage -= converters.toEther(ethBalance)
      }
    }

    if (!+sourceAmountByPercentage || sourceAmountByPercentage < 0) sourceAmountByPercentage = 0;

    this.props.dispatch(limitOrderActions.inputChange('source', sourceAmountByPercentage));
  };

  closeRateWarningTooltip = () => {
    this.props.dispatch(limitOrderActions.throwError("rateWarning", ""));
  }

  confirmAgreeSubmit = () => {
    this.props.dispatch(limitOrderActions.throwError("rateWarning", ""));
    this.props.submitHandler();
  }

  getRateWarningTooltip = () => {
    if (!this.props.account) {
      return null;
    }

    const higherRateOrders = this.props.limitOrder.listOrder.filter(item => {
      return item.source === this.props.limitOrder.sourceTokenSymbol &&
            item.dest === this.props.limitOrder.destTokenSymbol &&
            item.user_address.toLowerCase() === this.props.account.address.toLowerCase() &&
            item.status === constants.LIMIT_ORDER_CONFIG.status.OPEN &&
            converters.compareTwoNumber(this.props.limitOrder.triggerRate, item.min_rate) < 0;
    });

    const tableComp = higherRateOrders.map(item => {
      const datetime = common.getFormattedDate(item.status === constants.LIMIT_ORDER_CONFIG.status.OPEN || constants.LIMIT_ORDER_CONFIG.status.IN_PROGRESS ? item.created_at : item.updated_at);
      const rate = converters.roundingNumber(item.min_rate);
      return (
        <div key={item.id} className="rate-warning-tooltip__order">
          <div>{datetime}</div>
          <div>{`${item.source.toUpperCase()}/${item.dest.toUpperCase()} >= ${rate}`}</div>
        </div>
      );
    });

    return (
      <div className="rate-warning-tooltip">
        {/* Description */}
        <div className="rate-warning-tooltip__description">
          {this.props.translate("limit_order.lower_rate_warning") || "This new order has a lower rate than some orders you have created. Below orders will be cancelled when you submitted this order.s"}
        </div>
        {/* Table */}
        <div className="rate-warning-tooltip__order-container">
          {tableComp}
        </div>
        {/* Buttons */}
        <div className="rate-warning-tooltip__footer">
          <button
						className="btn-cancel"
						onClick={e => this.closeRateWarningTooltip()}
					>
						{this.props.translate("limit_order.change_rate") || "Change Rate"}
					</button>
					<button
						className="btn-confirm"
						onClick={e => this.confirmAgreeSubmit()}
					>
						{this.props.translate("import.yes") || "Yes"}
					</button>
        </div>
      </div>
    );
  }

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
                      listItem={this.props.availableBalanceTokens}
                      chooseToken={this.props.selectSourceToken}
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
                      ref={el => this.props.setSrcInputElementRef(el)}
                      min="0"
                      step="0.000001"
                      placeholder="0" autoFocus
                      type={this.props.global.isOnMobile ? "number" : "text"} maxLength="50" autoComplete="off"
                      value={this.props.limitOrder.sourceAmount}                      
                      onChange={(e) => this.handleInputChange(e, "source", this.props.limitOrder.sourceAmount)}
                      onFocus={e => this.handleFocus(e, "source")}
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
                    listItem={this.props.availableBalanceTokens}
                    chooseToken={this.props.selectDestToken}
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
                    onFocus={e => this.handleFocus(e, "dest")}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={"exchange-content__item--wrapper"}>
          <div className={"exchange-item-label"}>{this.props.translate("transaction.rate_label") || "Rate"}:</div>
          
          <Tooltip
            open={this.props.limitOrder.errors.rateWarning !== ""}
            position="right"
            interactive={true}
            animateFill={false}
            onRequestClose={() => this.closeRateWarningTooltip()}
            html={this.getRateWarningTooltip()}
          >
            <div className={`exchange-content__item exchange-content__item--left exchange-content__item--no-pd-left select-token ${errorTriggerRate != "" ? "error" : ""} ${this.props.limitOrder.errors.rateWarning !== "" ? "rate-warning" : ""}`}>
            <div className={`input-div-content`}>
              <div className={'exchange-content__label-content exchange-content__label-content--disabled'}>
                {this.props.limitOrder.sourceTokenSymbol === BLOCKCHAIN_INFO.wrapETHToken ? constants.WETH_SUBSTITUTE_NAME : this.props.limitOrder.sourceTokenSymbol} / {this.props.limitOrder.destTokenSymbol === BLOCKCHAIN_INFO.wrapETHToken ? constants.WETH_SUBSTITUTE_NAME : this.props.limitOrder.destTokenSymbol}
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
                  onFocus={e => this.handleFocus(e, "rate")}
                />
              </div>
            </div>
            {errorTriggerRate &&
              <ReactTooltip globalEventOff="click" html={true} place="bottom" className="select-token-error" id="trigger-rate-error" type="light" />
            }
            </div>
          </Tooltip>
        </div>
        <LimitOrderCompareRate />
      </div>
    )
  }
}
