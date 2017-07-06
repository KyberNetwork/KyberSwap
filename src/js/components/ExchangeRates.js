import React from "react"
import { connect } from "react-redux"


@connect((store) => {
  return {rates: store.global.rates}
})
export default class ExchangeRates extends React.Component {
  render() {
    var rates = Object.keys(this.props.rates).map((rateID) => {
      var rate = this.props.rates[rateID]
      return (
        <div key={rateID}>
          <h3>Rate({rate.source.name}, {rate.dest.name})</h3>
          <p>Reserve: {rate.reserve.name}</p>
          <p>Rate: {rate.rate.toString(10)}</p>
          <p>Expiration block: {rate.expirationBlock.toString(10)}</p>
          <p>Balance: {rate.balance.toString(10)}</p>
        </div>
      )
    })
    return (
      <div>
        {rates}
      </div>
    )
  }
}
