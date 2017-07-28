import React from "react"
import { connect } from "react-redux"


@connect((store) => {
  return {rates: store.global.rates}
})
export default class ExchangeRates extends React.Component {
  render() {
    var rates = Object.keys(this.props.rates).map((rateID) => {
      var rate = this.props.rates[rateID]
      console.log(rate)
      return (
        <tr key={rateID}>
          <td>{rate.source.name}/{rate.dest.name}</td>
          <td title="{rate.rate.toString(10)}">{rate.rate.toString(10)}</td>
          <td title="{rate.balance.toString(10)}">{rate.balance.toString(10)}</td>
        </tr>      
      )
    })
    return (
      <table>
        <thead>
          <tr>
            <th width="200"></th>
            <th width="150">
              <i class="k-icon k-icon-rate"></i>
              Rate
            </th>
            <th width="200">
              <i class="k-icon k-icon-balance"></i>
              Balance
            </th>
          </tr>          
        </thead>
        <tbody>
          {rates}
        </tbody>        
      </table>
    )
  }
}
