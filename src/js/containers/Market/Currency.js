import React from "react"
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux';
import * as marketActions from "../../actions/marketActions"

@connect((store) => {
    return {
        translate: getTranslate(store.locale),
        currency: store.market.configs.currency,
        analytics: store.global.analytics
    }
})
export default class Currency extends React.Component {
    changeCurrency = (value) => {
        this.props.dispatch(marketActions.changeCurrency(value))
        this.props.analytics.callTrack("trackBaseCurrency", value);
    }

    renderCurrency(){
       return Object.keys(this.props.currency.listItem).map(key => {
            return <a key={key} className={this.props.currentCurrency === this.props.currency.listItem[key] ? 'currency-item active' : 'currency-item'} onClick={(e)=>this.changeCurrency(key)}>{this.props.currency.listItem[key]}</a>
        })
    }

    render() {
        return (
            <div className="market__header-currency">
                {/* <div className="header-label">{this.props.translate("market.currency") || "Currency"}</div> */}
                {this.renderCurrency()}
                {/* <Selector
                    defaultItem={this.props.currency.focus}
                    listItem={this.props.currency.listItem}
                    onChange = {this.changeCurrency}
                /> */}
            </div>
        )
    }
}
