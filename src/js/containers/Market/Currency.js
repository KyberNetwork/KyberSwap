import React from "react"
import { connect } from "react-redux"


import { Selector } from "../CommonElements"

import { getTranslate } from 'react-localize-redux';
import * as marketActions from "../../actions/marketActions"
import * as analytics from "../../utils/analytics"


@connect((store) => {
    return {
        translate: getTranslate(store.locale),
        currency: store.market.configs.currency
    }
})
export default class Currency extends React.Component {
    changeCurrency = (value) => {
        this.props.dispatch(marketActions.changeCurrency(value))
        analytics.trackBaseCurrency(value)
    }

    renderCurrency(){
       return Object.keys(this.props.currency.listItem).map(key => {
            return <a key={key} className='currency-item' onClick={(e)=>this.changeCurrency(key)}>{this.props.currency.listItem[key]}</a>
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
