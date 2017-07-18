import React from "react"
import { connect } from "react-redux"
import { getToken, pairID, toT } from "../../utils/converter"


@connect((store) => {
  var sourceToken = getToken(store.exchangeForm.sourceToken)
  var destToken = getToken(store.exchangeForm.destToken)
  var rate = store.global.rates[pairID(sourceToken, destToken)]
  if (rate && rate.rate.toNumber() != 0) {
    return {
      tokenSourceSymbol: store.exchangeForm.sourceTokenSymbol,
      tokenDestSymbol: store.exchangeForm.destTokenSymbol,
      offeredRateExpiryBlock: rate.expirationBlock.toString(10),
      offeredRateBalance: toT(rate.balance),
      offeredRate: "1 " + store.exchangeForm.sourceTokenSymbol + " = " + toT(rate.rate) + " " + store.exchangeForm.destTokenSymbol
    }
  } else {
    return {
      tokenSourceSymbol: store.exchangeForm.sourceTokenSymbol,
      tokenDestSymbol: store.exchangeForm.destTokenSymbol,
      offeredRateExpiryBlock: "Unavailable",
      offeredRateBalance: "Unavailable",
      offeredRate: "Unavailable",
    }
  }
})
export default class ExchangeRate extends React.Component {

  render() {
    return (
      <div class="rate-wrapper">
        <h3>
          Deal offered from KyberNetwork
        </h3>
        <div class="rate">
          <div>
            <label>Exchange Rate</label>
            <span>{this.props.offeredRate}</span>
          </div>
          <div>
            <label>Expired Block</label>
            <span>{this.props.offeredRateExpiryBlock}</span>
          </div>
          <div>
            <label>Reserve Balance</label>
            <span>{this.props.offeredRateBalance}</span>
          </div>
        </div>
      </div>)
  }
}
