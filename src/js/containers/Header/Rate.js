import React from "react"
import { connect } from "react-redux"
import { RateView } from "../../components/Header"

@connect((store) => {
  return {
    rates: store.tokens.tokens
  }
})

export default class Rate extends React.Component {

  render() {
    return (
      <RateView rates={this.props.rates} />
    )
  }
}
