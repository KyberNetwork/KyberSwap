import React from "react"
import { connect } from "react-redux"
//import { getToken, pairID, toT } from "../../utils/converter"
//import constants from "../../services/constants"


@connect((store, props) => {
  //get rate
  return props
  // var exchangeForm = store.exchangeForm[props.exchangeFormID]
  // exchangeForm = exchangeForm || {...constants.INIT_EXCHANGE_FORM_STATE}
  // var sourceToken = getToken(exchangeForm.sourceToken)
  // var destToken = getToken(exchangeForm.destToken)
  // var rate = store.global.rates[pairID(sourceToken, destToken)]
  // var rate = 
  // if (rate && rate.rate.toNumber() != 0) {
  //   return {
  //     tokenSourceSymbol: exchangeForm.sourceTokenSymbol,
  //     tokenDestSymbol: exchangeForm.destTokenSymbol,
  //     offeredRateExpiryBlock: rate.expirationBlock.toString(10),
  //     offeredRateBalance: toT(rate.balance, 8),
  //     offeredRate: "1 " + exchangeForm.sourceTokenSymbol + " = " + toT(rate.rate, 6) + " " + exchangeForm.destTokenSymbol
  //   }
  // } else {
  //   return {
  //     tokenSourceSymbol: exchangeForm.sourceTokenSymbol,
  //     tokenDestSymbol: exchangeForm.destTokenSymbol,
  //     offeredRateExpiryBlock: "Unavailable",
  //     offeredRateBalance: "Unavailable",
  //     offeredRate: "Unavailable",
  //   }
  // }
})
export default class ExchangeRate extends React.Component {

  render() {
    return (
      <div class="rate-wrapper">
        <div class="rate">
          <div>
            <label>Exchange Rate</label>
            <span>{this.props.rate[0].toString()}</span>
          </div>
          <div>
            <label>Expiration Block</label>
            <span>{this.props.rate[1].toString()}</span>
          </div>
          <div>
            <label>Reserve Balance</label>
            <span>{this.props.rate[2].toString()}</span>
          </div>
        </div>
      </div>)
  }
}
