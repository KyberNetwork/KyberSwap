import React from "react"
import { toT, roundingNumber } from "../../utils/converter"
import Dropdown, { DropdownTrigger, DropdownContent } from 'react-simple-dropdown';
import { getAssetUrl } from "../../utils/common";
import BLOCKCHAIN_INFO from "../../../../env"

const TokenSelectorView = (props) => {
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
    var banToken = props.banToken ? props.banToken : ""
    return Object.keys(listShow).map((key, i) => {
      if (key === props.banToken) return
      if (key !== props.focusItem) {
        var item = listShow[key]
        var balance = toT(item.balance, item.decimals)
        return (
          <div key={key} onClick={(e) => props.selectItem(e, item.symbol, item.address)} className="token-item">
            <div className="d-flex">
              <div className={"token-info"}>
                <div className="item-icon">
                  <img src={getAssetUrl(`tokens/${item.symbol}.svg`)} />
                </div>
                <div>{item.symbol}</div>
              </div>
              {(props.type !== "des" && props.account != false) &&
              <div className="item-balance">
                <div title={balance} className="item-balance-value">
                  {`${roundingNumber(balance)} ${item.symbol}`}
                </div>
              </div>
              }
            </div>
          </div>
        )
      }
    })
  }

  var priorityTokens = BLOCKCHAIN_INFO.priority_tokens.map(value => {
    return <span key={value} onClick={(e) => {props.selectItem(e, value, props.listItem[value].address); props.hideTokens(e) }}>
      <img src={getAssetUrl(`tokens/${value.toLowerCase()}.svg`)} />
      {value}
    </span>
  })

  return (
    <div className={`token-selector ${props.type} ${props.isFixToken?"fix_token" : ""}`}>
      <Dropdown active={props.open} onShow = {(e) => props.showTokens(e)} onHide = {(e) => props.hideTokens(e)} disabled ={props.isFixToken? true: false}>
        <DropdownTrigger className="notifications-toggle">
          <div className="focus-item d-flex">
            <div className="d-flex">
              <div className="icon">
                <img src={getAssetUrl(`tokens/${focusItem.symbol}.svg`)} />
              </div>
              <div>
                <div className="focus-name">
                  <span>{focusItem.symbol}</span>
                </div>
              </div>
            </div>
            <div><i className={'k k-angle bold ' + (props.open ? 'up' : 'down')}></i></div>
          </div>
        </DropdownTrigger>
        <DropdownContent>
          <div className="select-item">
            <div className="select-item__priority-token">{priorityTokens}</div>
            <div className="search-item">
              <input value={props.searchWord} placeholder={props.translate("try_dai") || `Try "DAI"`} onChange={(e) => props.changeWord(e)} type="text" onFocus={(e) => props.analytics.callTrack("trackSearchToken")}/>
            </div>
            <div className="list-item custom-scroll">
              {getListToken()}
            </div>
          </div>
        </DropdownContent>
      </Dropdown>
    </div>
  )

}
export default TokenSelectorView
