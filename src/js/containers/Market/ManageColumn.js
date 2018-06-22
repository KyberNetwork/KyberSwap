import React from "react"
import { connect } from "react-redux"

import Dropdown, { DropdownTrigger, DropdownContent } from 'react-simple-dropdown';
import { getTranslate } from 'react-localize-redux';
import * as marketActions from "../../actions/marketActions"


@connect((store) => {
    return {
        translate: getTranslate(store.locale),
        display: store.market.configs.column.display,
        shows: store.market.configs.column.shows
    }
})

export default class ManageColumn extends React.Component {
    constructor(){
        super()
        this.state = {
            open:false
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

    getShowsColumn = (e) => {
        return Object.keys(this.props.shows.listItem).map((key, i) => {
            var index = this.props.shows.active.indexOf(key)
            var checked = index === -1? false: true
            return (
                <label key={key} for={this.props.shows.listItem[key].title} className="column-label">
                    <span className={checked ? "item-title" : ""}>{this.props.shows.listItem[key].title}</span>
                    <input id={this.props.shows.listItem[key].title} type="checkbox" onChange = {(e) => this.selectShowsColumn(e, key)} checked = {checked}/>
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
                    <Dropdown onShow={(e) => this.showSelector(e)} onHide={(e) => this.hideSelector(e)}  active ={this.state.open}>
                        <DropdownTrigger className="notifications-toggle">
                            <div className="focus-item d-flex">
                                <img src={require("../../../assets/img/landing/setting.svg")} />
                            </div>
                        </DropdownTrigger>
                        <DropdownContent>
                            <div className="select-item">
                                <div className="setting-header">
                                    <img src={require("../../../assets/img/landing/setting.svg")} />
                                    <span>settings</span>
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
