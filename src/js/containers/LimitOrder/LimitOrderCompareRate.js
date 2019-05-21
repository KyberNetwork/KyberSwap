import React from "react"
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'
import * as converters from "../../utils/converter"

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

  renderTokenCurrentRate = (isLoading = false) => {
    const srcSymbol = this.props.limitOrder.sourceTokenSymbol;
    const destSymbol = this.props.limitOrder.destTokenSymbol;
    const offeredRate = this.props.limitOrder.offeredRate;

    if (srcSymbol === 'WETH') {
      const expectedRate = offeredRate ? converters.convertBuyRate(offeredRate) : 0;
      return this.getTokenCurrentRateHtml(destSymbol, srcSymbol, expectedRate, isLoading);
    } else {
      const expectedRate = converters.toT(offeredRate);
      return this.getTokenCurrentRateHtml(srcSymbol, destSymbol, expectedRate, isLoading);
    }
  }

  getTokenCurrentRateHtml = (srcSymbol, destSymbol, expectedRate, isLoading = false) => {
    return (
      <span className="rate">
        <span>1 {srcSymbol} = </span>
        {isLoading && (
          <span className="rate-loading">
            <img src={require('../../../assets/img/waiting-white.svg')} />
          </span>
        )}
        {!isLoading && converters.roundingNumber(expectedRate)}
        <span> {destSymbol}</span>
      </span>
    )
  }

    render() {
        if (this.props.limitOrder.isSelectToken) {
            return (
                <div className={"limit-order-compare-rate"}>
                    <div className="limit-order-compare-rate__text">
                        <span>Current Rate:</span>{' '}
                        {this.renderTokenCurrentRate(true)}
                    </div>
                </div>
            )
        }

        if (!this.props.limitOrder.isSelectToken && this.props.limitOrder.offeredRate == 0){
            return (
                <div className={"limit-order-compare-rate"}>
                    This pair is currently not supported by market
                </div>
            )
        }

        if (!this.props.limitOrder.isSelectToken && this.props.limitOrder.offeredRate != 0) {
            var triggerRate = converters.roundingRate(this.props.limitOrder.triggerRate)
            var percentChange = converters.percentChange(triggerRate, this.props.limitOrder.offeredRate)

            return (
                <div className={"limit-order-compare-rate"}>
                    <div className={"limit-order-compare-rate__text"}>
                        <span>Current Rate:</span>{' '}
                        {this.renderTokenCurrentRate()}
                    </div>

                    {percentChange > 0 && (
                    <div className={"limit-order-compare-rate__text"}>
                      Your price is {percentChange}% higher than current Market
                    </div>
                  )}

                    {percentChange < 0 && percentChange > -100 && (
                    <div className={"limit-order-compare-rate__text"}>
                      Your price is {Math.abs(percentChange)}% lower than current Market
                    </div>
                  )}
                </div>
            )
        }
    }
}
