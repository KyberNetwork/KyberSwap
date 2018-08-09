import React from "react"
import { connect } from "react-redux"

import Dropdown, { DropdownTrigger, DropdownContent } from 'react-simple-dropdown';
import { getTranslate } from 'react-localize-redux';
import * as marketActions from "../../actions/marketActions"
import * as analytics from "../../utils/analytics"


@connect((store) => {
    return {
        translate: getTranslate(store.locale),
        display: store.market.configs.column.display,
        shows: store.market.configs.column.shows
    }
})

export default class ManageColumn extends React.Component {
    constructor() {
        super()
        this.state = {
            open: false
        }
    }

    showSelector = (e) => {
        this.setState({ open: true })
    }

    hideSelector = (e) => {
        this.setState({ open: false })
    }


    selectDisplayColumn = (e, key) => {
        this.props.dispatch(marketActions.changeDisplayColumn(key))
    }

    selectShowsColumn = (e, key) => {
        var value = e.target.checked
        this.props.dispatch(marketActions.changeShowColumn(key, value))
        analytics.trackMarketSetting(this.props.shows.listItem[key].title, value)
    }

    getDisplayColumn = (e) => {
        return Object.keys(this.props.display.listItem).map((key, i) => {
            return (
                <div key={key} onClick={(e) => this.selectDisplayColumn(e, key)} className="display-item">
                    <i>icon</i>
                    <label>
                        {this.props.display.listItem[key]}
                    </label>
                </div>
            )
        })
    }

    getTranslateFromKey = (key) => {
        switch (key) {
            case "market": {
                return "market.market"
            }
            case "sell_price": {
                return "market.sell_price"
            }
            case "buy_price": {
                return "market.buy_price"
            }
            case "last_7d": {
                return "market.last_7d"
            }
            case "change": {
                return "market.change"
            }
            case "circulating_supply": {
                return "market.circulating_supply"
            }
            case "total_supply": {
                return "market.total_supply"
            }
            case "market_cap": {
                return "market.market_cap"
            }
            case "volume": {
                return "market.volume"
            }
        }
    }

    getShowsColumn = (e) => {
        return Object.keys(this.props.shows.listItem).map((key, i) => {
            var index = this.props.shows.active.indexOf(key)
            var checked = index === -1 ? false : true
            var title = this.props.shows.listItem[key].title
            return (
                <label key={key} for={this.props.shows.listItem[key].title} className="column-label">
                    <span className={checked ? "item-title" : ""}>{this.props.translate(this.getTranslateFromKey(key)) || title}</span>
                    <input id={this.props.shows.listItem[key].title} type="checkbox" onChange={(e) => this.selectShowsColumn(e, key)} checked={checked} />
                    <span className="checkmark"></span>
                </label>
            )
        })
    }
    //<div key={key} className="column-label">
    render() {
        return (
            <div>
                <div className="token-selector">
                    <Dropdown onShow={(e) => this.showSelector(e)} onHide={(e) => this.hideSelector(e)} active={this.state.open}>
                        <DropdownTrigger className="notifications-toggle">
                            <div className="focus-item d-flex">
                                <img src={require("../../../assets/img/landing/setting.svg")} />
                            </div>
                        </DropdownTrigger>
                        <DropdownContent>
                            <div className="select-item">
                                <div className="setting-header">
                                    <img src={require("../../../assets/img/landing/setting.svg")} />
                                    <span>{this.props.translate("market.settings") || "Settings"}</span>
                                </div>
                                <div className="list-setting">
                                    {/* <div>
                                        {this.getDisplayColumn()}
                                    </div> */}
                                    <div>
                                        {this.getShowsColumn()}
                                    </div>
                                </div>
                            </div>
                        </DropdownContent>
                    </Dropdown>
                </div>
            </div>
        )
    }
}
