import React from "react"
import Dropdown, { DropdownTrigger, DropdownContent } from 'react-simple-dropdown';
import { getTranslate } from 'react-localize-redux';

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
        var desc = this.state.list[index].desc
        this.setState({
            focus: { name: path },
            open: false,
            currentDPath: path,
            description: desc
        })
        if (this.state.onChange) this.state.onChange(path)
    }

    focusItem = () => {
        return (this.props.listItem).map((dPath, index) => {
            if (dPath.path === this.props.currentDPath) {
                var description = dPath.desc
                if (dPath.path) {
                    return `${dPath.path} - ${description}`
                }
                return `${dPath.defaultP} - ${description}`
            }
        })
    }

    getListItem = () => {
        return (this.state.list).map((dPath, index) => {
            let disabledPath = (this.state.walletType == 'ledger' && dPath.notSupport) ? true : false
            if (!disabledPath) {
                return (
                    <div key={dPath + index} className="token-item" onClick={(e) => {
                        if (dPath.path === this.props.currentDPath) {
                            this.setState({
                                open: false
                            })
                        } else if (dPath.path) this.selectItem(e, index)
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
                                        <input id="form-input-custom-path" type="text" name="customPath" defaultValue={dPath.defaultP}  placeholder="Your Custom Path" />
                                        <img src={require('../../../assets/img/angle-right.svg')} onClick={(e) => {
                                            if (dPath.path === this.props.currentDPath) {
                                                this.setState({
                                                    open: false
                                                })
                                            } else if (this.state.onChange){
                                                this.setState({
                                                    open: false                                                
                                                })
                                                this.state.onChange(dPath.path)
                                            } 
                                        }}/>
                                    </div>
                                </div>
                            )
                        }
                        {
                            (this.props.currentDPath === dPath.path) ? 
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
