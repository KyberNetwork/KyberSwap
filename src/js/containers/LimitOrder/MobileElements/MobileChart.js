import React from "react"
import { connect } from "react-redux"
import LimitOrderChart from "../LimitOrderChart";
import BLOCKCHAIN_INFO from "../../../../../env";

@connect((store, props) => {
  const limitOrder = store.limitOrder

  return { limitOrder }
})
export default class MobileChart extends React.Component {
  takeAction  = (sideTrade, baseSymbol, quoteSymbol) => {
    this.props.setFormType(sideTrade, baseSymbol, quoteSymbol);
    this.props.toggleMobileChart()
    window.scrollTo({top: 0});
  };

  getDisplayToken = (token) => {
    return token === BLOCKCHAIN_INFO.wrapETHToken ? 'ETH*' : token;
  }

  render() {
    const baseToken = this.props.limitOrder.sideTrade === "buy"? this.props.limitOrder.destTokenSymbol : this.props.limitOrder.sourceTokenSymbol;
    const quoteToken = this.props.limitOrder.sideTrade === "buy"? this.props.limitOrder.sourceTokenSymbol : this.props.limitOrder.destTokenSymbol;

    return (
      <div>
        <LimitOrderChart />
        <div className="ld-actions">
          <a onClick={() => this.takeAction("buy", baseToken, quoteToken)}>Buy {this.getDisplayToken(baseToken)}</a>
          <a onClick={() => this.takeAction("sell", baseToken, quoteToken)}>Sell {this.getDisplayToken(baseToken)}</a>
        </div>
      </div>
    )
  }
}
