import React from "react"
import { connect } from "react-redux"
import LimitOrderChart from "../LimitOrderChart";

@connect((store, props) => {
  const limitOrder = store.limitOrder

  return { limitOrder }
})
export default class MobileChart extends React.Component {
  takeAction  = (sideTrade, baseSymbol, quoteSymbol) => {
    this.props.setFormType(sideTrade, baseSymbol, quoteSymbol);
    this.props.toggleMobileChart()
  };

  render() {
    const baseToken = this.props.limitOrder.sideTrade === "buy"? this.props.limitOrder.destTokenSymbol : this.props.limitOrder.sourceTokenSymbol;
    const quoteToken = this.props.limitOrder.sideTrade === "buy"? this.props.limitOrder.sourceTokenSymbol : this.props.limitOrder.destTokenSymbol;

    return (
      <div>
        <LimitOrderChart />
        <div className="ld-actions">
          <a onClick={() => this.takeAction("buy", baseToken, quoteToken)}>Buy {baseToken}</a>
          <a onClick={() => this.takeAction("sell", baseToken, quoteToken)}>Sell {baseToken}</a>
        </div>
      </div>
    )
  }
}
