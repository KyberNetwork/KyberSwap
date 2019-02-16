import React from "react"
import { toT, roundingNumber } from "../../utils/converter"
import Dropdown, { DropdownTrigger, DropdownContent } from 'react-simple-dropdown';
import { getAssetUrl, getTokenBySymbol } from "../../utils/common";
import BLOCKCHAIN_INFO from "../../../../env"



const TokenSelectorView = (props) => {
  var focusItem = getTokenBySymbol(props.listToken, props.focusItem)

  var getListToken = () => {
    var banToken = props.banToken ? props.banToken : ""
    return props.listShowToken.map((item, i) => {
      if (item.symbol === props.banToken) return
      if (item.symbol !== props.focusItem) {
        var balance = toT(item.balance, item.decimals)
        return (
          <div key={item.symbol} onClick={(e) => props.selectItem(e, item.symbol, item.address)} className="token-item">
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
    var token = getTokenBySymbol(props.listToken, value)
    return <span key={value} onClick={(e) => {props.selectItem(e, value, token.address); props.hideTokens(e) }}>
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
              <input value={props.searchWord} placeholder={props.translate("transaction.try_dai") || `Try "DAI"`} onChange={(e) => props.changeWord(e)} type="text" onFocus={(e) => props.analytics.callTrack("trackSearchToken")}/>
            </div>
            <div className="list-item custom-scroll" onScroll={props.onListScroll}>
              {getListToken()}
            </div>
          </div>
        </DropdownContent>
      </Dropdown>
    </div>
  )

}
export default TokenSelectorView
