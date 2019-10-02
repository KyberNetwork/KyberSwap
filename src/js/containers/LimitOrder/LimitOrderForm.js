import React from "react"
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'
import { filterInputNumber } from "../../utils/validators";
import * as limitOrderActions from "../../actions/limitOrderActions"
import * as constants from "../../services/constants"
import { debounce } from 'underscore';
import { LimitOrderCompareRate, LimitOrderSubmit, LimitOrderFee } from "../LimitOrder";
import { ForceCancelOrderModal } from "../LimitOrder/LimitOrderModals";
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
    let value = e.target.value;
    const check = filterInputNumber(e, value, referValue);

    if (check) {
      if (value < 0) return;

      this.props.dispatch(limitOrderActions.inputChange(type, value, this.props.sourceToken.decimals, this.props.destToken.decimals, true));
      
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

  toggleAgreeSubmit = () => {
    const { isAgreeForceSubmit, isDisableSubmit } = this.props.limitOrder;

    if (!isAgreeForceSubmit) {
      const triggerRate = this.props.limitOrder.sideTrade === "buy" ? converters.divOfTwoNumber(1, this.props.limitOrder.triggerBuyRate) : this.props.limitOrder.triggerRate;
      this.props.dispatch(limitOrderActions.setForceSubmitRate(triggerRate));
    }

    this.props.dispatch(limitOrderActions.setIsDisableSubmit(!isDisableSubmit));
    this.props.dispatch(limitOrderActions.setAgreeForceSubmit(!isAgreeForceSubmit));
  };

  getListWarningOrdersComp = () => {
    if (!this.props.account) return null;

    let higherRateOrders = [];
    const triggerRate = this.props.limitOrder.sideTrade === "buy" ? converters.divOfTwoNumber(1, this.props.limitOrder.triggerBuyRate) : this.props.limitOrder.triggerRate;

    if (this.props.limitOrder.filterMode === "client") {
      higherRateOrders = this.props.limitOrder.listOrder.filter(item => {
        const pairComparison = this.props.limitOrder.sourceTokenSymbol === item.source && this.props.limitOrder.destTokenSymbol === item.dest;

        if (pairComparison) {
          const rateComparison = converters.compareTwoNumber(item.min_rate, triggerRate) > 0;
          return item.user_address.toLowerCase() === this.props.account.address.toLowerCase() &&
                item.status === constants.LIMIT_ORDER_CONFIG.status.OPEN &&
                rateComparison;
        } 
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

  render() {
    const srcTokenSymbol = this.props.limitOrder.sourceTokenSymbol === BLOCKCHAIN_INFO.wrapETHToken ? constants.WETH_SUBSTITUTE_NAME : this.props.limitOrder.sourceTokenSymbol;
    const destTokenSymbol = this.props.limitOrder.destTokenSymbol === BLOCKCHAIN_INFO.wrapETHToken ? constants.WETH_SUBSTITUTE_NAME : this.props.limitOrder.destTokenSymbol;
    const quoteSymbol = this.props.limitOrder.sideTrade === 'buy' ? srcTokenSymbol : destTokenSymbol;
    const targetSymbol = this.props.limitOrder.sideTrade === 'buy' ? destTokenSymbol : srcTokenSymbol;
    const triggerRate = this.props.limitOrder.sideTrade === 'buy' ? this.props.limitOrder.triggerBuyRate : this.props.limitOrder.triggerRate;

    return (
      <div className={"limit-order-form theme__background-2"}>
        <div className={"limit-order-form__header theme__border-2"}>
          <div
            className={`limit-order-form__tab ${this.props.limitOrder.sideTrade === 'buy' ? 'limit-order-form__tab--active' : ''}`}
            onClick={() => this.props.setFormType('buy', targetSymbol, quoteSymbol)}>
              {this.props.translate("limit_order.buy", {symbol: targetSymbol}) || `Buy ${targetSymbol}`}
          </div>
          <div
            className={`limit-order-form__tab ${this.props.limitOrder.sideTrade === 'sell' ? 'limit-order-form__tab--active' : ''}`}
            onClick={() => this.props.setFormType('sell', targetSymbol, quoteSymbol)}>
            {this.props.translate("limit_order.sell", {symbol: targetSymbol}) || `Sell ${targetSymbol}`}
          </div>
        </div>

        <div className={"limit-order-form__item theme__background-4 theme__text-2"}>
          <div className={"limit-order-form__tag theme__input-tag"} onClick={this.resetToMarketRate}>{this.props.translate("limit_order.price") || "Price"}</div>
          <input
            className={"limit-order-form__input theme__text-2"}
            step="0.000001"
            placeholder="0"
            min="0"
            type={this.props.global.isOnMobile ? "number" : "text"}
            maxLength="50"
            autoComplete="off"
            value={this.props.limitOrder.isFetchingRate ? 'Loading...' : triggerRate}
            onChange={(e) => this.handleInputChange(e, "rate", triggerRate)}
            onFocus={e => this.handleFocus(e, "rate")}
            disabled={this.props.limitOrder.isFetchingRate}
          />
          <div className={"limit-order-form__symbol theme__text-3"}>{quoteSymbol}</div>
        </div>

        <div className={"exchange__error"}>
          {this.props.limitOrder.errors.triggerRate.map((value, index) => {
            return <span className="exchange__error-item" key={index}>{value}</span>
          })}

          {this.props.limitOrder.errors.rateSystem &&
            <div className={"exchange__error-item"}>{this.props.limitOrder.errors.rateSystem}</div>
          }
        </div>

        <LimitOrderCompareRate triggerRate={triggerRate}/>

        <div className={"limit-order-form__item theme__background-4 theme__text-2"}>
          <div className={"limit-order-form__tag theme__input-tag"}>{this.props.translate("limit_order.amount") || "Amount"}</div>
          {this.props.limitOrder.sideTrade === 'buy' &&
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

          {this.props.limitOrder.sideTrade === 'sell' &&
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
              <div className={"limit-order-form__available"}>{this.props.translate("limit_order.available_balance") || "Available Balance"}</div>
              <div className={"limit-order-form__token"}>{converters.formatNumber(converters.toT(this.props.sourceToken.balance, this.props.sourceToken.decimals), 6)} {srcTokenSymbol}</div>
            </div>
            <div className={'common__balance theme__text-2'}>
              <div className={'common__balance-item theme__button-2'} onClick={() => this.addSrcAmountByBalancePercentage(25)}>25%</div>
              <div className={'common__balance-item theme__button-2'} onClick={() => this.addSrcAmountByBalancePercentage(50)}>50%</div>
              <div className={'common__balance-item theme__button-2'} onClick={() => this.addSrcAmountByBalancePercentage(100)}>100%</div>
            </div>
          </div>
        }

        <LimitOrderFee formType={this.props.limitOrder.sideTrade}/>

        <LimitOrderSubmit
          availableBalanceTokens={this.props.modifiedTokens}
          getOpenOrderAmount={this.props.getOpenOrderAmount}
          setSubmitHandler={this.props.setSubmitHandler}
        />

        {this.props.limitOrder.errors.rateWarning !== "" && (
          <ForceCancelOrderModal
            toggleAgreeSubmit={this.toggleAgreeSubmit}
            getListWarningOrdersComp={this.getListWarningOrdersComp}
          />
        )}
      </div>
    )
  }
}
