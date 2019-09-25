import React from "react"
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'
import * as converters from "../../utils/converter"

@connect((store) => {
  const translate = getTranslate(store.locale);
  const limitOrder = store.limitOrder;

  return { translate, limitOrder }
})

export default class LimitOrderCompareRate extends React.Component {
  render() {
    const offeredRate = converters.toT(this.props.limitOrder.offeredRate);
    const formattedOfferedRate = this.props.limitOrder.sideTrade === 'buy' ? converters.divOfTwoNumber(1, offeredRate) : offeredRate;
    const percentChange = this.props.limitOrder.offeredRate != "0" ? converters.percentChange(this.props.triggerRate, formattedOfferedRate) : 0;

    return (
      <div className={"limit-order-form__prefer-rate theme__text-4"}>
        {!this.props.limitOrder.isFetchingRate && percentChange > 0 && (
          this.props.translate("limit_order.higher_rate", { percentChange: percentChange }) || `Your preferred rate is <span class="limit-order__percent limit-order__percent--positive">${percentChange}%</span> higher than current rate`
        )}

        {!this.props.limitOrder.isFetchingRate && percentChange < 0 && percentChange > -100 && (
          this.props.translate("limit_order.lower_rate", { percentChange: percentChange }) || `Your preferred rate is <span class="limit-order__percent limit-order__percent--negative">${percentChange}%</span> lower than current rate`
        )}
      </div>
    )
  }
}
