import React from "react"
import { connect } from "react-redux"
import { ExchangeRates } from "../../components/ExchangeRates"

@connect((store) => {
  return {
    rates: store.global.rates
  }
})

export default class Rate extends React.Component {
	render() {
    return (
        <div>
          This is rate table
          <ExchangeRates rates = {this.props.rates}/>
        </div>
    )
  }
}
