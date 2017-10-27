import React from "react"
import { connect } from "react-redux"
//import { getToken, pairID, toT } from "../../utils/converter"
//import constants from "../../services/constants"
import {toT} from "../../utils/converter"

@connect((store, props) => {
  //get rate
  return store.exchange
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
      <div class="column">
        <p class="token-compare">1 {this.props.sourceTokenSymbol} = {toT(this.props.offeredRate,6)} {this.props.destTokenSymbol}<span class="up">-%</span></p>
      </div>


      // <div class="rate-wrapper">
      //   <div class="rate">
      //     <div>
      //       <label>Exchange Rate</label>
      //       <span>{toT(this.props.offeredRate,6)}</span>
      //     </div>
      //     <div>
      //       <label>Expiration Block</label>
      //       <span>{this.props.offeredRateExpiryBlock}</span>
      //     </div>
      //     <div>
      //       <label>Reserve Balance</label>
      //       <span>{toT(this.props.offeredRateBalance,8)}</span>
      //     </div>
      //   </div>
      // </div>
    )
  }
}
