import React from "react"
import Dropdown, { DropdownTrigger, DropdownContent } from 'react-simple-dropdown';

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

  showSelector = () => {
    this.setState({open: true})
  }

  hideSelector = () => {
    this.setState({open: false})
  }

  selectItem = (index) => {
    var path = this.state.list[index]
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
      if (dPath.value === this.props.currentDPath.value) {
        description = dPath.desc
        if (dPath.value) {
          result = `${dPath.value} - ${description}`
          break
        }
      }
      let input = document.getElementById('form-input-custom-path')
      if (input && input.value === this.props.currentDPath.value && !dPath.value) {
        description = dPath.desc
        result = `${input.value} - ${description}`
        break
      }
      if (!dPath.value && input && input.value !== this.props.currentDPath.value) {
        description = dPath.desc
        result = `${this.props.currentDPath.value} - ${description}`
        break
      }
    }
    return result
  }

  getListItem = () => {
    let input = document.getElementById('form-input-custom-path')
    let inputValue = input ? input.value : ""
    return (this.state.list).map((dPath, index) => {
      return (
        <div key={dPath + index} className="token-item" onClick={(e) => {
          var el = e.target.tagName
          if (el === "INPUT") return
          if (dPath.value === this.props.currentDPath.value || (!dPath.value && inputValue === this.props.currentDPath.value)) {
            this.setState({
              open: false
            })
          } else if (dPath.value) {
            this.selectItem(index)
          } else if (!dPath.value) {
            this.setState({
              open: false
            })
            this.state.onChange(dPath)
          }
        }}>
          {
            dPath.value ? (
              <div>
                <div class="name">{dPath.value}</div>
                <div class="note">{dPath.desc}</div>
              </div>
            ) : (
              <div className="input-custom-path">
                <div class="">
                  <input
                    id="form-input-custom-path"
                    type="text"
                    name="customPath"
                    defaultValue={dPath.defaultValue}
                    placeholder="Your Custom Path"
                    onFocus={() => this.props.analytics.callTrack("trackClickCustomPathColdWallet")}
                  />
                  <img src={require('../../../assets/img/angle-right.svg')}/>
                </div>
              </div>
            )
          }
          {
            ((this.props.currentDPath.value === dPath.value && inputValue != dPath.value) || (!dPath.value && inputValue === this.props.currentDPath.value)) ?
              <img src={require('../../../assets/img/import-account/checked-arrow.svg')}/>
              : ""
          }
        </div>
      )
    })
  }

  render() {
    return (
      <div className="token-selector">
        <Dropdown onShow={(e) => this.showSelector(e)} onHide={(e) => this.hideSelector(e)} active={this.state.open}>
          <DropdownTrigger className="notifications-toggle">
            <div className="focus-item d-flex theme__text">
              <div>
                {this.focusItem()}
              </div>
              <div>
                <img src={require('../../../assets/img/v3/price_drop_down.svg')}/>
              </div>
            </div>
          </DropdownTrigger>
          <DropdownContent>
            <div className="select-item">
              <div className="list-item theme__background-44">
                {this.getListItem()}
              </div>
            </div>
          </DropdownContent>
        </Dropdown>
      </div>
    )
  }
}
