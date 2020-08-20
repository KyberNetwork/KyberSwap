import React from "react"
import Dropdown, { DropdownTrigger, DropdownContent } from 'react-simple-dropdown';
import { getAssetUrl } from "../../utils/common";

const Selector = (props) => {
  var focusItem = props.listItem[props.focusItem]
  var listShow = {}
  
  Object.keys(props.listItem).map((key, i) => {
    var token = props.listItem[key],
      matchName = token.name.toLowerCase().includes(props.searchWord),
      matchSymbol = token.symbol.toLowerCase().includes(props.searchWord)
    if (matchSymbol || matchName) {
      listShow[key] = props.listItem[key]
    }
  })

  var getListToken = () => {
    return Object.keys(listShow).map((key, i) => {
      if (key !== props.focusItem) {
        var item = listShow[key]
        var balance = toT(item.balance, item.decimals)
        return (
          <div key={key} onClick={(e) => props.selectItem(e, item.symbol, item.address)} className="token-item">
            <div>
              <span className="item-icon">
                <img src={getAssetUrl(`tokens/${item.symbol}.svg`)} />
              </span>
              <span className="item-name">
                <span className="font-w-b">{item.symbol}</span><span className="show-for-large token-name"> - {item.name}</span></span>
              {item.isNotSupport &&
                <span className="unsupported">{props.translate("error.not_supported") || "not supported"}</span>
              }
            </div>
            <div>
              <span title={balance}>{roundingNumber(balance)}</span>
            </div>
          </div>
        )
      }
    })
  }

  return (
    <div className="token-selector">
      <Dropdown onShow = {(e) => props.showTokens(e)} onHide = {(e) => props.hideTokens(e)}>
        <DropdownTrigger className="notifications-toggle">
          <div className="focus-item d-flex">
            <div>
              <div className="icon">
                <img src={getAssetUrl(`tokens/${focusItem.symbol}.svg`)} />
              </div>
              <div>
                <div>{focusItem.name}</div>
                <div>
                  <span className="token-balance" title = {toT(focusItem.balance)}>{roundingNumber(toT(focusItem.balance, focusItem.decimals))}</span>
                  <span className="token-symbol">{focusItem.symbol}</span>
                </div>
              </div>
            </div>
            <div><i className={'k k-angle white ' + (props.open ? 'up' : 'down')}></i></div>
          </div>
        </DropdownTrigger>
        <DropdownContent>
          <div className="select-item">
            <div className="search-item">
              <input value={props.searchWord} placeholder={props.translate("search") || "Search"} onChange={(e) => props.changeWord(e)} type="text"/>
            </div>
            <div className="list-item">
              {getListToken()}
            </div>
          </div>
        </DropdownContent>
      </Dropdown>
    </div>
  )

}
export default Selector
