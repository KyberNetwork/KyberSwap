import React from "react"
import { connect } from "react-redux"

import { getTranslate } from 'react-localize-redux';
import * as marketActions from "../../actions/marketActions"
import Dropdown, { DropdownTrigger, DropdownContent } from 'react-simple-dropdown';

@connect((store, props) => {
    return {
      translate: getTranslate(store.locale),
      searchWord: store.market.configs.searchWord,
      showSearchInput: props.showSearchInput
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
        // this.setState({open:true})
        if (!this.props.showSearchInput) {
            this.props.dispatch(marketActions.showSearchInput(true))
        } else {
            this.props.dispatch(marketActions.showSearchInput(false))
        }
    }
    // hideSelector = () =>{
    //     this.setState({open:false})
    //     this.props.dispatch(marketActions.showSearchInput(false))
    // }
    render() {
        return (
            <div className="search-symbol">
                <div className="search-icon" onClick={(e) => this.showSelector()}>
                    <img className="search-img" src={require("../../../assets/img/search_icon.svg")} />
                </div>
                {/* <div className="header-label">{this.props.translate("market.search") || "Search"}</div> */}
                {/* <Dropdown onShow={(e) => this.showSelector()} onHide={(e) => this.hideSelector()} active={this.state.open}>
                    <DropdownTrigger className="notifications-toggle">
                        <div className="search-icon">
                            <img src={require("../../../assets/img/search_icon.svg")} />
                        </div>
                    </DropdownTrigger>
                    <DropdownContent>
                        <div className='search-space'>
                            <input type="text" className="search-input" placeholder={this.props.translate("market.try_searching_for_token") || "Try Searching for Token"} value={this.props.searchWord} onChange={(e) => this.changeSearch(e)} onFocus={(e) => analytics.trackSearchETHMarket()} />
                        </div>
                    </DropdownContent>
                </Dropdown> */}
                <div>
                    <input type="text" className="search-input" placeholder={this.props.translate("market.try_searching_for_token") || "Try Searching for Token"} value={this.props.searchWord} onChange={(e) => this.changeSearch(e)} onFocus={(e) => analytics.trackSearchETHMarket()}/>
                </div>
            </div>
        )
    }
}
