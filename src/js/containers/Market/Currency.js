import React from "react"
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux';
import * as marketActions from "../../actions/marketActions"

@connect((store) => {
  return {
    translate: getTranslate(store.locale),
    currency: store.market.configs.currency,
    analytics: store.global.analytics,
    focus: store.market.configs.currency.focus
  }
})
export default class Currency extends React.Component {
  changeCurrency = (value) => {
    this.props.dispatch(marketActions.changeCurrency(value))
    this.props.analytics.callTrack("trackBaseCurrency", value);
  }

  render() {
    return (
      <div className="market__header-currency">
        <div className={"market__header-quotes"}>
          {this.props.currency.listItem && (
            this.props.currency.listItem.map((tokenSymbol, key) => {
              return (
                <a
                  key={key}
                  className={this.props.currentCurrency === tokenSymbol ? 'currency-item active' : 'currency-item'}
                  onClick={()=>this.changeCurrency(tokenSymbol)}
                >
                  {tokenSymbol}
                </a>
              )
            })
          )}
        </div>
      </div>
    )
  }
}
