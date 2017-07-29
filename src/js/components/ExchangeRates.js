import React from "react"
import { connect } from "react-redux"

import {toT} from "../utils/converter"


@connect((store) => {
  return {rates: store.global.rates}
})
export default class ExchangeRates extends React.Component {
  render() {
    var rates = Object.keys(this.props.rates).map((rateID) => {
      var rate = this.props.rates[rateID]
      return (
        <tr key={rateID}>
          <td>{rate.source.name}/{rate.dest.name}</td>
          <td title={toT(rate.rate)}>{toT(rate.rate, 8)}</td>
          <td title={toT(rate.balance)}>{toT(rate.balance, 8)}</td>
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
