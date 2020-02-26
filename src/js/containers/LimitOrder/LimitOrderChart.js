import React from "react"
import { connect } from "react-redux"
import {TradingView} from "../Market"

@connect((store) => {
  const limitOrder = store.limitOrder

  return {
    limitOrder
  }
})
export default class LimitOrderChart extends React.Component {
  render() {
    const { sourceTokenSymbol, destTokenSymbol } = this.props.limitOrder;
    
    return (
      <TradingView 
        baseSymbol={sourceTokenSymbol}
        quoteSymbol={destTokenSymbol}
      />
    )
  }
}
