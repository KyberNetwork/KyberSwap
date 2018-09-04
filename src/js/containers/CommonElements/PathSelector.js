import React from "react"
import Dropdown, { DropdownTrigger, DropdownContent } from 'react-simple-dropdown';
import { getTranslate } from 'react-localize-redux';
import * as analytics from "../../utils/analytics"

export default class PathSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            list: props.listItem,
            onChange: props.choosePath ? props.choosePath : null,
            walletType: props.walletType,
        }
    }

    showSelector = (e) => {
        this.setState({ open: true })
    }

    hideSelector = (e) => {
        this.setState({ open: false })
    }

    selectItem = (e, index) => {
        var path = this.state.list[index].path
        this.setState({
            open: false
        })
        if (this.state.onChange) this.state.onChange(path)
    }

    focusItem = () => {
        var result
        var description = ""
        for (let index = 0; index < this.props.listItem.length; index++) {
            const dPath = this.props.listItem[index];
            if (dPath.path === this.props.currentDPath) {
                description = dPath.desc
                if (dPath.path) {
                    result = `${dPath.path} - ${description}`
                    break
                }
            }
            let input = document.getElementById('form-input-custom-path')
            if (input && input.value === this.props.currentDPath && !dPath.path) {
                description = dPath.desc
                result = `${input.value} - ${description}`
                break
            }
            if (!dPath.path && input && input.value !== this.props.currentDPath) {
                description = dPath.desc
                result = `${this.props.currentDPath} - ${description}`
                break
            }
        }
        return result
    }

    getListItem = () => {
        let input = document.getElementById('form-input-custom-path')
        let inputValue = input ? input.value : "" 
        return (this.state.list).map((dPath, index) => {
            let disabledPath = (this.state.walletType == 'ledger' && dPath.notSupport) ? true : false
            if (!disabledPath) {
                return (
                    <div key={dPath + index} className="token-item" onClick={(e) => {
                        var el = e.target.tagName
                        if (el === "INPUT") return
                        if (dPath.path === this.props.currentDPath || (!dPath.path && inputValue === this.props.currentDPath)) {
                            this.setState({
                                open: false
                            })
                        } else if (dPath.path) {
                            this.selectItem(e, index)
                        } else if (!dPath.path){
                            this.setState({
                                open: false                                                
                            })
                            this.state.onChange(dPath.path)
                        }
                        }}>
                        { 
                            dPath.path ? (
                                <div>
                                    <div class="name">{dPath.path}</div>
                                    <div class="note">{dPath.desc}</div>
                                </div>
                            ) : (
                                <div className="input-custom-path">
                                    <div class="">
                                        <input id="form-input-custom-path" type="text" name="customPath" defaultValue={dPath.defaultP}  placeholder="Your Custom Path" onFocus={(e) => analytics.trackClickCustomPathColdWallet()}/>
                                        <img src={require('../../../assets/img/angle-right.svg')}/>
                                    </div>
                                </div>
                            )
                        }
                        {
                            ((this.props.currentDPath === dPath.path && inputValue != dPath.path) || (!dPath.path && inputValue === this.props.currentDPath)) ? 
                            <img src={require('../../../assets/img/import-account/checked-arrow.svg')}/>
                            : ""
                        }
                    </div>
                )
            }
        })
    }

    render() {
        return (
            <div className="token-selector">
                <Dropdown onShow={(e) => this.showSelector(e)} onHide={(e) => this.hideSelector(e)} active={this.state.open}>
                    <DropdownTrigger className="notifications-toggle">
                        <div className="focus-item d-flex">
                            <div>
                                {this.focusItem()}
                            </div>
                            <div>
                                <img src={require('../../../assets/img/exchange/arrow-down-swap.svg')} />
                            </div>                            
                        </div>
                    </DropdownTrigger>
                    <DropdownContent>
                        <div className="select-item">
                            <div className="list-item custom-scroll">
                                {this.getListItem()}
                            </div>
                        </div>
                    </DropdownContent>
                </Dropdown>
            </div>
        )
    }
}
