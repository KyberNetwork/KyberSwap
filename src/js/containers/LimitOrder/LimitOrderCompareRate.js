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
  render() {
    const srcTokenSymbol = this.props.limitOrder.sourceTokenSymbol === BLOCKCHAIN_INFO.wrapETHToken ? constants.WETH_SUBSTITUTE_NAME : this.props.limitOrder.sourceTokenSymbol;
    const destTokenSymbol = this.props.limitOrder.destTokenSymbol === BLOCKCHAIN_INFO.wrapETHToken ? constants.WETH_SUBSTITUTE_NAME : this.props.limitOrder.destTokenSymbol;

    if (this.props.limitOrder.isSelectToken) {
      return (
        <div className={"limit-order-compare-rate"}>
          <div className="limit-order-compare-rate__text">
            <span>{this.props.translate("limit_order.current_rate") || "Current Rate"}:</span>{' '}
            <span className="rate">1 {srcTokenSymbol} = <span className="rate-loading"> <img src={require('../../../assets/img/waiting-white.svg')} /></span> {destTokenSymbol}</span>
          </div>
        </div>
      )
    }

    // if (!this.props.limitOrder.isSelectToken && this.props.limitOrder.offeredRate == 0){
    //   return (
    //     <div className={"limit-order-compare-rate"}>
    //       {this.props.translate("limit_order.pair_not_supported") || "This pair is currently not supported by market"}
    //     </div>
    //   )
    // }

    if (!this.props.limitOrder.isSelectToken && this.props.limitOrder.offeredRate != 0) {
      var triggerRate = converters.roundingRate(this.props.limitOrder.triggerRate)
      var percentChange = converters.percentChange(triggerRate, this.props.limitOrder.offeredRate)
      var expectedRate = converters.toT(this.props.limitOrder.offeredRate)

      return (
        <div className={"limit-order-compare-rate"}>
          <div className={"limit-order-compare-rate__text"}>
            <span>{this.props.translate("limit_order.current_rate") || "Current Rate"}:</span>{' '}
            <span className="rate">1 {srcTokenSymbol} = {converters.roundingNumber(expectedRate)} {destTokenSymbol}</span>
          </div>

          {percentChange > 0 && (
            <div className={"limit-order-compare-rate__text"}>
              {this.props.translate("limit_order.higher_rate", { percentChange: percentChange }) || `Your price is ${percentChange}% higher than current Market`}
            </div>
          )}

          {percentChange < 0 && percentChange > -100 && (
            <div className={"limit-order-compare-rate__text"}>
              {this.props.translate("limit_order.lower_rate", { percentChange: percentChange }) || `Your price is ${percentChange}% lower than current Market`}
            </div>
          )}
        </div>
      )
    }
  }
}
