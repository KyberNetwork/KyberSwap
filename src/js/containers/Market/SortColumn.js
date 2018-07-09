import React from "react"
import { connect } from "react-redux"


import { Selector } from "../CommonElements"

import { getTranslate } from 'react-localize-redux';
import * as marketActions from "../../actions/marketActions"


@connect((store) => {
    return {
        translate: getTranslate(store.locale),
        sort: store.market.configs.sort
    }
})
export default class SortColumn extends React.Component {
    changeSortColumn = (value) => {
        this.props.dispatch(marketActions.changeSort(value))
    }
    render() {
        return (
            <div className="market-sort">
                <div className="header-label">Sort</div>
                <Selector
                    defaultItem={this.props.sort.focus}
                    listItem={this.props.sort.listItem}
                    onChange = {this.changeSortColumn}
                />
            </div>
        )
    }
}
