import React from "react"
import { connect } from "react-redux"

import { getTranslate } from 'react-localize-redux';
import * as marketActions from "../../actions/marketActions"
import * as analytics from "../../utils/analytics"

@connect((store) => {
    return {
      translate: getTranslate(store.locale),
      searchWord: store.market.configs.searchWord
    }
  })
export default class SearchWord extends React.Component {
    changeSearch = (e) => {
        var value = e.target.value
        this.props.dispatch(marketActions.changeSearchWord(value))
        this.props.dispatch(marketActions.resetListToken(value))
    }
    render() {
        return (
            <div className="search-symbol">
                <div className="header-label">{this.props.translate("market.search") || "Search"}</div>
                <div>
                    <input type="text" className="search-input" placeholder={this.props.translate("market.try_searching_for_token") || "Try Searching for Token"} value={this.props.searchWord} onChange={(e) => this.changeSearch(e)} onFocus={(e) => analytics.trackSearchETHMarket()}/>
                </div>
            </div>
        )
    }
}
