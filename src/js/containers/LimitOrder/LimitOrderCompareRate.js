import React from "react"
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'
import * as converters from "../../utils/converter"
import BLOCKCHAIN_INFO from "../../../../env";
import * as constants from "../../services/constants"

@connect((store) => {
  const account = store.account.account
  const translate = getTranslate(store.locale)
  const tokens = store.tokens.tokens
  const limitOrder = store.limitOrder
  const ethereum = store.connection.ethereum

  return {
    translate, limitOrder, tokens, account, ethereum
  }
})

export default class LimitOrderCompareRate extends React.Component {

  renderCurrentRate (srcTokenSymbol, destTokenSymbol, expectedRate = 0) {
    const sourceToken = this.props.tokens[this.props.limitOrder.sourceTokenSymbol];
    const tokenBuyRate = this.props.limitOrder.offeredRate ? converters.convertBuyRate(this.props.limitOrder.offeredRate) : 0;
    const rateLoadingHtml = <span className="rate-loading"> <img src={require('../../../assets/img/waiting-white.svg')}/></span>;

    return (
      <div className="limit-order-compare-rate__content">
        <span className={"limit-order-compare-rate__text"}>{this.props.translate("limit_order.current_rate") || "Current Rate"}:</span>

        <div>
          <div className="rate">1 {srcTokenSymbol} = {this.props.limitOrder.isSelectToken ? rateLoadingHtml : converters.roundingRateNumber(expectedRate)} {destTokenSymbol}</div>

          {(sourceToken && sourceToken.is_quote) &&
            <div className="rate">1 {destTokenSymbol} = {this.props.limitOrder.isSelectToken ? rateLoadingHtml : converters.roundingRateNumber(tokenBuyRate)} {srcTokenSymbol}</div>
          }
        </div>
      </div>
    )
  }

  render() {
    const srcTokenSymbol = this.props.limitOrder.sourceTokenSymbol === BLOCKCHAIN_INFO.wrapETHToken ? constants.WETH_SUBSTITUTE_NAME : this.props.limitOrder.sourceTokenSymbol;
    const destTokenSymbol = this.props.limitOrder.destTokenSymbol === BLOCKCHAIN_INFO.wrapETHToken ? constants.WETH_SUBSTITUTE_NAME : this.props.limitOrder.destTokenSymbol;

    if (this.props.limitOrder.isSelectToken) {
      return (
        <div className={"limit-order-compare-rate"}>
          {this.renderCurrentRate(srcTokenSymbol, destTokenSymbol)}
        </div>
      )
    }

    if (!this.props.limitOrder.isSelectToken && this.props.limitOrder.offeredRate == 0){
      return ""
    }

    if (!this.props.limitOrder.isSelectToken && this.props.limitOrder.offeredRate != 0) {
      var triggerRate = converters.roundingRate(this.props.limitOrder.triggerRate)
      var percentChange = converters.percentChange(triggerRate, this.props.limitOrder.offeredRate)
      const expectedRate = converters.toT(this.props.limitOrder.offeredRate);
      const executePercentage = converters.getBigNumberValueByPercentage(triggerRate, 1);
      const executeRate = +converters.toT(converters.sumOfTwoNumber(triggerRate, executePercentage), 18, 6);

      return (
        <div className={"limit-order-compare-rate"}>
          {this.renderCurrentRate(srcTokenSymbol, destTokenSymbol, expectedRate)}

          {percentChange > 0 && (
            <div className={"limit-order-compare-rate__execute-rate"}>
              {this.props.translate("limit_order.higher_rate", { percentChange: percentChange }) || `Your preferred rate is ${percentChange}% higher than current rate`}
            </div>
          )}

          {percentChange < 0 && percentChange > -100 && (
            <div className={"limit-order-compare-rate__execute-rate"}>
              {this.props.translate("limit_order.lower_rate", { percentChange: percentChange }) || `Your preferred rate is ${percentChange}% lower than current rate`}
            </div>
          )}

          {/*{triggerRate > 0 &&
            <div>
              {this.props.translate("limit_order.execute_rate", {
                tokenPair: `${srcTokenSymbol}/${destTokenSymbol}`,
                executeRate: executeRate,
              }) || `Your order will be executed when ${tokenPair} hits ${executeRate} (1% higher)`}
            </div>
          }*/}
        </div>
      )
    }
  }
}
