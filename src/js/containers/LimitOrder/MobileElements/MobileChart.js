

import React from "react"
import { connect } from "react-redux"
import LimitOrderChart from "../LimitOrderChart";
import {setSideTrade} from "../../../actions/limitOrderActions"


@connect((store, props) => {
    const limitOrder = store.limitOrder
  
    return {
      limitOrder
    }
  })

export default class MobileChart extends React.Component {
    
    takeAction  = (sideTrade) => {
        this.props.dispatch(setSideTrade(sideTrade))
        this.props.toggleMobileChart()
    }

    render() {
        var baseToken = this.props.limitOrder.sideTrade === "buy"? this.props.limitOrder.destTokenSymbol : this.props.limitOrder.sourceTokenSymbol
        return (
            <div>
                <LimitOrderChart />
                <div className="ld-actions">
                    <a onClick={() => this.takeAction("buy")}>Buy {baseToken}</a>
                    <a onClick={() => this.takeAction("sell")}>Sell {baseToken}</a>
                </div>                
            </div>
        )
    }
}