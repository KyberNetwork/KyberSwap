import React from "react"
import { connect } from "react-redux"

import { getTranslate } from 'react-localize-redux';
import * as marketActions from "../../actions/marketActions"

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
        }
    render() {
        return (
            <div className="search-symbol">
                <div className="header-label">Search</div>
                <div>
                    <input className="search-input" placeholder="Try Searching for Token" value={this.props.searchWord} onChange={(e) => this.changeSearch(e)} />
                </div>
            </div>
        )
    }
}
