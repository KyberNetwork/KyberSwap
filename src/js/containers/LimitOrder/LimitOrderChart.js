import React from "react"
import { connect } from "react-redux"
import {TradingView} from "../Market"

@connect((store, props) => {
  const limitOrder = store.limitOrder

  return {
    limitOrder
  }
})
export default class LimitOrderChart extends React.Component {
  render() {
    const { sourceTokenSymbol, destTokenSymbol, currentQuote } = this.props.limitOrder;
    return (
      <TradingView 
        sourceTokenSymbol={sourceTokenSymbol}
        destTokenSymbol={destTokenSymbol}
        currentQuote={currentQuote}
      />
    )
  }
}
