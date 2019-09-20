import React from "react"
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'
import * as common from "../../utils/common"
import { filterInputNumber } from "../../utils/validators";
import * as limitOrderActions from "../../actions/limitOrderActions"
import * as constants from "../../services/constants"
import { debounce } from 'underscore';
import { LimitOrderCompareRate, LimitOrderSubmit, LimitOrderFee } from "../LimitOrder";
import { RateWarningModal, ForceCancelOrderModal } from "../LimitOrder/LimitOrderModals";
import * as converters from "../../utils/converter";
import BLOCKCHAIN_INFO from "../../../../env";
import EthereumService from "../../services/ethereum/ethereum";

@connect((store, props) => {
  const account = store.account.account;
  const translate = getTranslate(store.locale);
  const tokens = store.tokens.tokens;
  const limitOrder = store.limitOrder;
  const ethereum = store.connection.ethereum;
  const modifiedTokens = props.availableBalanceTokens();
  const sourceToken = modifiedTokens.find(token => token.symbol === limitOrder.sourceTokenSymbol);
  const destToken = modifiedTokens.find(token => token.symbol === limitOrder.destTokenSymbol);

  return {
    translate, limitOrder, tokens, account, ethereum,
    global: store.global, sourceToken, destToken, modifiedTokens
  }
})

export default class LimitOrderForm extends React.Component {
  lazyFetchRate = debounce(this.fetchCurrentRate, 500);

  constructor(props) {
    super(props);

    this.state = {
      formType: 'buy'
    }
  }

  setFormType = (type) => {
    if (this.state.formType === type) return;

    this.props.dispatch(limitOrderActions.changeFormType(
      this.props.sourceToken,
      this.props.destToken
    ));
    this.props.dispatch(limitOrderActions.setSideTrade(type))
    this.setState({ formType: type });
  };

  getEthereumInstance = () => {
    let ethereum = this.props.ethereum;

    if (!ethereum) ethereum = new EthereumService();

    return ethereum
  };

  fetchCurrentRate = (sourceAmount) => {
    const sourceTokenSymbol = this.props.limitOrder.sourceTokenSymbol;
    const sourceToken = this.props.limitOrder.sourceToken;
    const destTokenSymbol = this.props.limitOrder.destTokenSymbol;
    const destToken = this.props.limitOrder.destToken;
    const isManual = true;
    const ethereum = this.getEthereumInstance();

    this.props.dispatch(limitOrderActions.updateRate(ethereum, sourceTokenSymbol, sourceToken, destTokenSymbol, destToken, sourceAmount, isManual));
  };

  handleFocus = (e, type) => {
    this.props.global.analytics.callTrack("trackLimitOrderFocusAmount", type);
  };

  handleInputChange = (e, type, referValue) => {
    const value = e.target.value;
    const check = filterInputNumber(e, value, referValue);

    if (check) {
      if (value < 0) return;

      this.props.dispatch(limitOrderActions.inputChange(type, e.target.value, this.props.sourceToken.decimals, this.props.destToken.decimals));
      
      if (type === "source") this.lazyFetchRate(value);
    }
  };

  getMaxGasApprove = () => {
    const tokens = this.props.tokens;
    const sourceSymbol = this.props.limitOrder.sourceTokenSymbol;

    if (tokens[sourceSymbol] && tokens[sourceSymbol].gasApprove) {
      return tokens[sourceSymbol].gasApprove
    } else {
      return this.props.limitOrder.max_gas_approve
    }
  };

  getMaxGasExchange = () => {
    const tokens = this.props.tokens;
    const destTokenSymbol = BLOCKCHAIN_INFO.wrapETHToken;

    return tokens[destTokenSymbol] && tokens[destTokenSymbol].gasLimit ? tokens[destTokenSymbol].gasLimit : this.props.limitOrder.max_gas;
  };

  calculateMaxFee = () => {
    const gasApprove = this.getMaxGasApprove();
    const gasExchange = this.getMaxGasExchange();
    const totalGas = gasExchange + gasApprove * 2;

    return converters.totalFee(this.props.limitOrder.gasPrice, totalGas);
  };

  addSrcAmountByBalancePercentage = (balancePercentage) => {
    const srcTokenSymbol = this.props.limitOrder.sourceTokenSymbol;
    const srcToken = this.props.modifiedTokens.find(token => token.symbol === srcTokenSymbol);
    let sourceAmountByPercentage = converters.getBigNumberValueByPercentage(srcToken.balance, balancePercentage);

    if (srcTokenSymbol === BLOCKCHAIN_INFO.wrapETHToken && balancePercentage === 100){
      const ethBalance = this.props.tokens["ETH"].balance;
      const fee = this.calculateMaxFee();

      if (converters.compareTwoNumber(ethBalance, fee) === 1) {
        sourceAmountByPercentage = converters.subOfTwoNumber(sourceAmountByPercentage, fee)
      } else {
        sourceAmountByPercentage = converters.subOfTwoNumber(sourceAmountByPercentage, ethBalance)
      }
    }

    if (converters.compareTwoNumber(sourceAmountByPercentage, 0) === -1) sourceAmountByPercentage = 0;

    this.props.dispatch(limitOrderActions.inputChange(
      'source',
      converters.toT(sourceAmountByPercentage, srcToken.decimals),
      this.props.sourceToken.decimals,
      this.props.destToken.decimals
    ));
  };

  closeRateWarningTooltip = () => {
    const { isAgreeForceSubmit } = this.props.limitOrder;

    if (!isAgreeForceSubmit) {
      this.props.dispatch(limitOrderActions.setIsDisableSubmit(false));
    }

    this.props.dispatch(limitOrderActions.throwError("rateWarning", ""));
  };

  toggleAgreeSubmit = () => {
    const { isAgreeForceSubmit, isDisableSubmit } = this.props.limitOrder;

    if (!isAgreeForceSubmit) {
      this.props.dispatch(limitOrderActions.setForceSubmitRate(this.props.limitOrder.triggerRate));
    }

    this.props.dispatch(limitOrderActions.setIsDisableSubmit(!isDisableSubmit));
    this.props.dispatch(limitOrderActions.setAgreeForceSubmit(!isAgreeForceSubmit));
  };

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
    return higherRateOrders
  };

  resetToMarketRate = () => {
    const expectedRate = converters.toT(this.props.limitOrder.offeredRate);

    this.props.dispatch(limitOrderActions.inputChange(
      "rate",
      converters.roundingRateNumber(expectedRate),
      this.props.sourceToken.decimals,
      this.props.destToken.decimals
    ));
  };

  // getRateWarningTooltip = () => {
  //   if (!this.props.account) return null;

  //   return (
  //     <div className="rate-warning-tooltip">
  //       <div className="rate-warning-tooltip__title">
  //         <div className="rate-warning-tooltip__description">
  //           {this.props.translate("limit_order.rate_warning_title") || `By submitting this order, you also CANCEL the following orders:`}
  //         </div>
  //         <span className="rate-warning-tooltip__faq">
  //           <a href={`/faq#can-I-submit-multiple-limit-orders-for-same-token-pair`} target="_blank">
  //             {this.props.translate("why") || "Why?"}
  //           </a>
  //         </span>
  //       </div>
        
  //       <div className="rate-warning-tooltip__order-container">
  //         {this.getListWarningOrdersComp()}
  //       </div>

  //       <div className="rate-warning-tooltip__footer">
  //         <label className="rate-warning-tooltip__confirm">
  //           <span className="rate-warning-tooltip__confirm--text">
  //             {this.props.translate("i_understand") || "I understand"}
  //           </span>
  //           <input type="checkbox" 
  //             checked={this.props.limitOrder.isAgreeForceSubmit}
  //             className="rate-warning-tooltip__confirm--checkbox"
  //             onChange={e => this.toggleAgreeSubmit()}/>
  //           <span className="rate-warning-tooltip__confirm--checkmark"/>
  //         </label>
  //       </div>
  //     </div>
  //   );
  // };

  render() {
    const srcTokenSymbol = this.props.limitOrder.sourceTokenSymbol === BLOCKCHAIN_INFO.wrapETHToken ? constants.WETH_SUBSTITUTE_NAME : this.props.limitOrder.sourceTokenSymbol;
    const destTokenSymbol = this.props.limitOrder.destTokenSymbol === BLOCKCHAIN_INFO.wrapETHToken ? constants.WETH_SUBSTITUTE_NAME : this.props.limitOrder.destTokenSymbol;
    const quoteSymbol = this.state.formType === 'buy' ? srcTokenSymbol : destTokenSymbol;
    const targetSymbol = this.state.formType === 'buy' ? destTokenSymbol : srcTokenSymbol;

    return (
      <div className={"limit-order-form theme__background-2"}>
        <div className={"limit-order-form__header theme__border-2"}>
          <div
            className={`limit-order-form__tab ${this.state.formType === 'buy' ? 'limit-order-form__tab--active' : ''}`}
            onClick={() => this.setFormType('buy')}>
              Buy {targetSymbol}
          </div>
          <div
            className={`limit-order-form__tab ${this.state.formType === 'sell' ? 'limit-order-form__tab--active' : ''}`}
            onClick={() => this.setFormType('sell')}>
              Sell {targetSymbol}
          </div>
        </div>

        <div className={"limit-order-form__item theme__background-4 theme__text-2"}>
          <div className={"limit-order-form__tag theme__input-tag"} onClick={this.resetToMarketRate}>Price</div>
          <input
            className={"limit-order-form__input theme__text-2"}
            step="0.000001"
            placeholder="0"
            min="0"
            type={this.props.global.isOnMobile ? "number" : "text"}
            maxLength="50"
            autoComplete="off"
            value={this.props.limitOrder.isFetchingRate ? 'Loading...' : this.props.limitOrder.triggerRate}
            onChange={(e) => this.handleInputChange(e, "rate", this.props.limitOrder.triggerRate)}
            onFocus={e => this.handleFocus(e, "rate")}
            disabled={this.props.limitOrder.isFetchingRate}
          />
          <div className={"limit-order-form__symbol theme__text-3"}>{quoteSymbol}</div>

          {this.props.global.isOnMobile &&
            <RateWarningModal
              isOpen={this.props.limitOrder.errors.rateWarning !== ""}
              getListWarningOrdersComp={this.getListWarningOrdersComp}
              toggleAgreeSubmit={this.toggleAgreeSubmit}
              closeRateWarningTooltip={this.closeRateWarningTooltip}
              {...this.props}
            />
          }
        </div>

        <div className={"exchange__error"}>
          {this.props.limitOrder.errors.triggerRate.map((value, index) => {
            return <span className="exchange__error-item" key={index}>{value}</span>
          })}

          {this.props.limitOrder.errors.rateSystem &&
            <div className={"exchange__error-item"}>{this.props.limitOrder.errors.rateSystem}</div>
          }
        </div>

        <LimitOrderCompareRate/>

        <div className={"limit-order-form__item theme__background-4 theme__text-2"}>
          <div className={"limit-order-form__tag theme__input-tag"}>Amount</div>
          {this.state.formType === 'buy' &&
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
          }

          {this.state.formType === 'sell' &&
            <input
              className={"limit-order-form__input theme__text-2"}
              step="0.000001"
              placeholder="0"
              min="0"
              type={this.props.global.isOnMobile ? "number" : "text"}
              maxLength="50"
              autoComplete="off"
              value={this.props.limitOrder.sourceAmount}
              onChange={(e) => this.handleInputChange(e, "source", this.props.limitOrder.sourceAmount)}
              onFocus={e => this.handleFocus(e, "source")}
            />
          }

          <div className={"limit-order-form__symbol theme__text-3"}>{targetSymbol}</div>
        </div>

        <div className={"exchange__error"}>
          {this.props.limitOrder.errors.sourceAmount.map((value, index) => {
            return <div className="exchange__error-item" key={index}>{value}</div>
          })}
        </div>

        {this.props.account &&
          <div className={"limit-order-form__balance-container"}>
            <div className={"theme__text-4"}>
              <div className={"limit-order-form__available"}>Available Balance</div>
              <div className={"limit-order-form__token"}>{converters.formatNumber(converters.toT(this.props.sourceToken.balance, this.props.sourceToken.decimals), 6)} {srcTokenSymbol}</div>
            </div>
            <div className={'common__balance theme__text-2'}>
              <div className={'common__balance-item theme__button-2'} onClick={() => this.addSrcAmountByBalancePercentage(25)}>25%</div>
              <div className={'common__balance-item theme__button-2'} onClick={() => this.addSrcAmountByBalancePercentage(50)}>50%</div>
              <div className={'common__balance-item theme__button-2'} onClick={() => this.addSrcAmountByBalancePercentage(100)}>100%</div>
            </div>
          </div>
        }

        <LimitOrderFee formType={this.state.formType}/>

        <LimitOrderSubmit
          availableBalanceTokens={this.props.modifiedTokens}
          getOpenOrderAmount={this.props.getOpenOrderAmount}
          setSubmitHandler={this.props.setSubmitHandler}
        />

        {this.props.limitOrder.errors.rateWarning !== "" && !this.props.global.isOnMobile && (
          <ForceCancelOrderModal
            toggleAgreeSubmit={this.toggleAgreeSubmit}
            getListWarningOrdersComp={this.getListWarningOrdersComp}
          />
        )
        }
      </div>
    )
  }
}
