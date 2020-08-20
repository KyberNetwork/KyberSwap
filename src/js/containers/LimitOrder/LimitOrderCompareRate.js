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
  getPercentChange = () => {
    const isBuyForm = this.props.isBuyForm;
    const offeredRate = isBuyForm ? converters.toT(this.props.limitOrder.buyRate) : converters.toT(this.props.limitOrder.sellRate);
    const formattedOfferedRate = isBuyForm ? converters.divOfTwoNumber(1, offeredRate) : offeredRate;
    return offeredRate ? converters.percentChange(this.props.triggerRate, formattedOfferedRate) : 0;
  };
  
  render() {
    const percentChange = this.getPercentChange();

    return (
      <div className={"limit-order-form__prefer-rate theme__text-4"}>
        {!this.props.limitOrder.isFetchingRate && percentChange > 0 && (
          this.props.translate("limit_order.higher_rate", { percentChange: percentChange }) || `Your price is <span class="limit-order__percent limit-order__percent--positive">${percentChange}%</span> higher than market price`
        )}

        {!this.props.limitOrder.isFetchingRate && percentChange < 0 && percentChange > -100 && (
          this.props.translate("limit_order.lower_rate", { percentChange: percentChange }) || `Your price is <span class="limit-order__percent limit-order__percent--negative">${percentChange}%</span> lower than market price`
        )}
      </div>
    )
  }
}
