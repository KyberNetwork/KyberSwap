import React from "react"
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux';
import * as marketActions from "../../actions/marketActions"

@connect((store, props) => {
  return {
    translate: getTranslate(store.locale),
    searchWord: store.market.configs.searchWord,
    showSearchInput: props.showSearchInput,
    analytics: store.global.analytics
  }
})
export default class SearchWord extends React.Component {
  constructor(){
    super()
    this.state={open:false}
  }

  changeSearch = (e) => {
    var value = e.target.value
    this.props.dispatch(marketActions.changeSearchWord(value))
    this.props.dispatch(marketActions.resetListToken(value))
  }

  showSelector = () =>{
    if (!this.props.showSearchInput) {
      this.props.dispatch(marketActions.showSearchInput(true))
    } else {
      this.props.dispatch(marketActions.showSearchInput(false))
    }
  }

  render() {
    return (
      <div className="search-input">
        <input className="search-input__input theme__input" type="text" placeholder={this.props.translate("market.search") || "Search"} value={this.props.searchWord} onChange={(e) => this.changeSearch(e)} onFocus={() => this.props.analytics.callTrack("trackSearchETHMarket")}/>
      </div>
    )
  }
}
