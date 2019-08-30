import React from "react"
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'
import * as common from "../../utils/common"
import { filterInputNumber } from "../../utils/validators";
import * as limitOrderActions from "../../actions/limitOrderActions"
import * as constants from "../../services/constants"
import { debounce } from 'underscore';
import { LimitOrderCompareRate, LimitOrderSubmit } from "../LimitOrder";
import { RateWarningModal } from "../LimitOrder/LimitOrderModals";
import * as converters from "../../utils/converter";
import BLOCKCHAIN_INFO from "../../../../env";

@connect((store, props) => {
  const account = store.account.account
  const translate = getTranslate(store.locale)
  const tokens = store.tokens.tokens
  const limitOrder = store.limitOrder
  const ethereum = store.connection.ethereum
  const sourceToken = tokens[limitOrder.sourceTokenSymbol]
  const destToken = tokens[limitOrder.destTokenSymbol]

  return {
    translate, limitOrder, tokens, account, ethereum,
    global: store.global, sourceToken, destToken
  }
})

export default class LimitOrderForm extends React.Component {
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

  lazyFetchRate = debounce(this.fetchCurrentRate, 500)

  handleFocus = (e, type) => {
    this.props.global.analytics.callTrack("trackLimitOrderFocusAmount", type);
  }

  handleInputChange = (e, type, referValue) => {
    var value = e.target.value
    var check = filterInputNumber(e, value, referValue)
    if (check) {     
      if (value < 0) return
      this.props.dispatch(limitOrderActions.inputChange(type, e.target.value, this.props.sourceToken.decimals, this.props.destToken.decimals));
      
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

    var totalFee = converters.totalFee(this.props.limitOrder.gasPrice, totalGas)    
    return totalFee
  }

  addSrcAmountByBalancePercentage = (balancePercentage) => {
    const srcTokenSymbol = this.props.limitOrder.sourceTokenSymbol;
    const srcToken = this.props.availableBalanceTokens.find(token => {
      return token.symbol === srcTokenSymbol;
    });

    var srcTokenBalance = srcToken.balance;
    let sourceAmountByPercentage = converters.getBigNumberValueByPercentage(srcTokenBalance, balancePercentage);

    if (srcTokenSymbol === BLOCKCHAIN_INFO.wrapETHToken && balancePercentage === 100){
      var ethBalance = this.props.tokens["ETH"].balance
      var fee = this.calcualteMaxFee()
      if(converters.compareTwoNumber(ethBalance, fee) === 1){
        sourceAmountByPercentage = converters.subOfTwoNumber(sourceAmountByPercentage, fee)
      }else{
        sourceAmountByPercentage = converters.subOfTwoNumber(sourceAmountByPercentage, ethBalance)
      }
    }

    if (converters.compareTwoNumber(sourceAmountByPercentage, 0) == -1) sourceAmountByPercentage = 0    

    this.props.dispatch(limitOrderActions.inputChange('source', converters.toT(sourceAmountByPercentage, srcToken.decimals), this.props.sourceToken.decimals, this.props.destToken.decimals));
  };

  closeRateWarningTooltip = () => {
    const { isAgreeForceSubmit } = this.props.limitOrder;

    if (!isAgreeForceSubmit) {
      this.props.dispatch(limitOrderActions.setIsDisableSubmit(false));
    }

    this.props.dispatch(limitOrderActions.throwError("rateWarning", ""));
  }

  toggleAgreeSubmit = () => {
    const { isAgreeForceSubmit, isDisableSubmit } = this.props.limitOrder;

    if (!isAgreeForceSubmit) {
      this.props.dispatch(limitOrderActions.setForceSubmitRate(this.props.limitOrder.triggerRate));
    }

    this.props.dispatch(limitOrderActions.setIsDisableSubmit(!isDisableSubmit));
    this.props.dispatch(limitOrderActions.setAgreeForceSubmit(!isAgreeForceSubmit));
  }

  getListWarningOrdersComp = () => {
    if (!this.props.account) return null;

    let higherRateOrders = [];

    if (this.props.limitOrder.filterMode === "client") {
      higherRateOrders = this.props.limitOrder.listOrder.filter(item => {
        return item.source === this.props.limitOrder.sourceTokenSymbol &&
              item.dest === this.props.limitOrder.destTokenSymbol &&
              item.user_address.toLowerCase() === this.props.account.address.toLowerCase() &&
              item.status === constants.LIMIT_ORDER_CONFIG.status.OPEN &&
              converters.compareTwoNumber(this.props.limitOrder.triggerRate, item.min_rate) < 0;
      });
    } else {
      higherRateOrders = this.props.limitOrder.relatedOrders;
    }

    const tableComp = higherRateOrders.map(item => {
      const datetime = common.getFormattedDate(item.updated_at);
      const rate = converters.displayNumberWithDot(item.min_rate, 9);
      return (
        <div key={item.id} className="rate-warning-tooltip__order">
          <div>{datetime}</div>
          <div>{item.source.toUpperCase()}/{item.dest.toUpperCase()} >= <span title={item.min_rate}>{rate}</span></div>
        </div>
      );
    });

    return tableComp;
  }

  resetToMarketRate = (e) => {
    const expectedRate = converters.toT(this.props.limitOrder.offeredRate);
    this.props.dispatch(limitOrderActions.inputChange("rate", converters.roundingRateNumber(expectedRate), this.props.sourceToken.decimals, this.props.destToken.decimals));
  }

  getRateWarningTooltip = () => {
    if (!this.props.account) return null;

    return (
      <div className="rate-warning-tooltip">
        <div className="rate-warning-tooltip__title">
          <div className="rate-warning-tooltip__description">
            {this.props.translate("limit_order.rate_warning_title") || `By submitting this order, you also CANCEL the following orders:`}
          </div>
          <span className="rate-warning-tooltip__faq">
            <a href={`/faq#can-I-submit-multiple-limit-orders-for-same-token-pair`} target="_blank">
              {this.props.translate("why") || "Why?"}
            </a>
          </span>
        </div>
        
        <div className="rate-warning-tooltip__order-container">
          {this.getListWarningOrdersComp()}
        </div>

        <div className="rate-warning-tooltip__footer">
          <label className="rate-warning-tooltip__confirm">
            <span className="rate-warning-tooltip__confirm--text">
              {this.props.translate("i_understand") || "I understand"}
            </span>
            <input type="checkbox" 
              checked={this.props.limitOrder.isAgreeForceSubmit}
              className="rate-warning-tooltip__confirm--checkbox"
              onChange={e => this.toggleAgreeSubmit()}/>
            <span className="rate-warning-tooltip__confirm--checkmark"></span>
          </label>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className={"limit-order-form theme__background-2"}>
        <div className={"limit-order-form__header theme__border-2"}>
          <div className={"limit-order-form__tab limit-order-form__tab--active"}>Buy OMG</div>
          <div className={"limit-order-form__tab"}>Sell OMG</div>
        </div>

        <div className={"limit-order-form__item theme__background-4 theme__text-2"}>
          <div className={"limit-order-form__tag theme__background-3"} onClick={e => this.resetToMarketRate()}>Price</div>
          <input
            className={"limit-order-form__input theme__text-2"}
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
          <div className={"limit-order-form__symbol theme__text-3"}>DAI</div>

          {this.props.global.isOnMobile == true &&
            <RateWarningModal
              isOpen={this.props.limitOrder.errors.rateWarning !== ""}
              getListWarningOrdersComp={this.getListWarningOrdersComp}
              toggleAgreeSubmit={this.toggleAgreeSubmit}
              closeRateWarningTooltip={this.closeRateWarningTooltip}
              {...this.props}
            />
          }
        </div>

        <div className={"limit-order-form__prefer-rate theme__text-4"}>Your preferred rate is <span>15%</span> higher than Market rate.</div>

        <div className={"limit-order-form__item theme__background-4 theme__text-2"}>
          <div className={"limit-order-form__tag theme__background-3"}>Amount</div>
          <input
            className={"limit-order-form__input theme__text-2"}
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
          <div className={"limit-order-form__symbol theme__text-3"}>OMG</div>
        </div>

        <div className={"limit-order-form__balance-container"}>
          <div className={"theme__text-4"}>
            <div className={"limit-order-form__available"}>Token Avaiable</div>
            <div className={"limit-order-form__token"}>34,787.098765342 DAI</div>
          </div>
          <div className={'limit-order-form__balance theme__text-2'}>
            <div className={'limit-order-form__balance-item theme__button-2'} onClick={() => this.addSrcAmountByBalancePercentage(25)}>25%</div>
            <div className={'limit-order-form__balance-item theme__button-2'} onClick={() => this.addSrcAmountByBalancePercentage(50)}>50%</div>
            <div className={'limit-order-form__balance-item theme__button-2'} onClick={() => this.addSrcAmountByBalancePercentage(100)}>100%</div>
          </div>
        </div>

        <div className={"limit-order-form__fee theme__text-4 theme__border-2"}>Fee: 10.2240005 KNC</div>

        <div className={"limit-order-form__total"}>
          <span className={"theme__text-4"}>Total</span> <span className={"theme__text-5"}>308.41594 DAI</span>
        </div>

        <LimitOrderSubmit
          availableBalanceTokens={this.props.availableBalanceTokens}
          getOpenOrderAmount={this.props.getOpenOrderAmount}
          setSubmitHandler={this.props.setSubmitHandler}
        />

        {/*<LimitOrderCompareRate/>*/}
      </div>
    )
  }
}
