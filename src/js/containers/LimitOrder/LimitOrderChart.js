import React from "react"
import { connect } from "react-redux"
import {TradingView} from "../Market"

@connect((store, props) => {
  const limitOrder = store.limitOrder

  const currentQuote = limitOrder.sourceTokenSymbol === "WETH" ? "ETH" : limitOrder.sourceTokenSymbol;

  return {
    destTokenSymbol: limitOrder.destTokenSymbol,
    currentQuote
  }
})
export default class LimitOrderChart extends React.Component {
  render() {
    const { currentQuote, destTokenSymbol } = this.props;

    return (
      <TradingView 
        destTokenSymbol={destTokenSymbol}
        currentQuote={currentQuote}
      />
    )
  }
}
