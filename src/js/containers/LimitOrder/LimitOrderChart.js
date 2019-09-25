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
    const { sourceTokenSymbol, destTokenSymbol, sideTrade } = this.props.limitOrder;

    let quoteSymbol, baseSymbol;
    if (sideTrade === "buy") {
      baseSymbol = destTokenSymbol;
      quoteSymbol = sourceTokenSymbol === "WETH" ? "ETH" : sourceTokenSymbol;
    } else if (sideTrade === "sell") {
      baseSymbol = sourceTokenSymbol;
      quoteSymbol = destTokenSymbol === "WETH" ? "ETH" : destTokenSymbol;
    }

    return (
      <TradingView 
        baseSymbol={baseSymbol}
        quoteSymbol={quoteSymbol}
      />
    )
  }
}
