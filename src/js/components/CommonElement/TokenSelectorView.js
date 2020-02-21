import React from "react"
import { caculateEthBalance, toT, roundingNumber } from "../../utils/converter"
import Dropdown, { DropdownTrigger, DropdownContent } from 'react-simple-dropdown';
import { getAssetUrl, getTokenBySymbol } from "../../utils/common";
import BLOCKCHAIN_INFO from "../../../../env"
import * as constants from "../../services/constants";

const TokenSelectorView = (props) => {
  var focusItem = getTokenBySymbol(props.tokens, props.focusItem)

  var getListToken = () => {
    // sort token by balance
    const allTokens = props.tokens.sort((a,b) => {
      var aEthBalance = caculateEthBalance(a)
      var bEthBalance = caculateEthBalance(b)      
      return bEthBalance - aEthBalance 
    });
  
    const tokens = props.isLoadAllTokens ? allTokens : allTokens.slice(0, props.tokenNumberLimit)
    const searchWord = props.searchWord;
  
    return tokens.map((item, i) => {
      if (item.symbol === props.banToken) return

      if(searchWord && !item.name.toLowerCase().includes(searchWord) && !item.symbol.toLowerCase().includes(searchWord)) return;

      if (item.symbol !== props.focusItem) {
        var balance = toT(item.balance, item.decimals)
        return (
          <div key={item.symbol} onClick={(e) => props.selectItem(e, item.symbol, item.address)} className="token-item theme__token-item">
            <div className="d-flex">
              <div className={"token-info"}>
                <div className="item-icon">
                  <img alt={item.name} src={getAssetUrl(`tokens/${item.substituteImage ? item.substituteImage : item.symbol}.svg`)} />
                </div>
                <div>{item.substituteSymbol ? item.substituteSymbol : item.symbol}</div>
              </div>
              {(props.type !== "des" && props.account != false) &&
              <div className="item-balance">
                <div className="item-balance-value">
                  {`${roundingNumber(balance)} ${item.substituteSymbol ? item.substituteSymbol : item.symbol}`}
                </div>
              </div>
              }
            </div>
          </div>
        )
      }
    })
  };

  const getWethTitle = () => {
    const wethAddress = props.tokens.filter(item => item.symbol === "WETH")[0].address;
    return (
      <div className="select-item__title" onClick={e => { 
        props.selectItem(e, BLOCKCHAIN_INFO.wrapETHToken, wethAddress);
        props.hideTokens();
      }}>
        <div className="item-icon">
          <img alt={constants.WETH_SUBSTITUTE_NAME} src={getAssetUrl(`tokens/eth-weth.svg`)} />
        </div>
        <div className={"select-item__information"}>
          <div>
            <span className="bold-text">{props.translate("limit_order.eth_not_support").slice(0, 4) || "ETH*"}</span>
            <span> {props.translate("limit_order.eth_not_support").slice(4) || " represents the sum of ETH & WETH for easy reference."}</span>
          </div>
        </div>
      </div>
    )
  }

  const priorityTokens = BLOCKCHAIN_INFO.priority_tokens.map(value => {
    var token = getTokenBySymbol(props.tokens, value)
    return <span className={"theme__priority-token"} key={value} onClick={(e) => {props.selectItem(e, value, token.address); props.hideTokens(e) }}>
      <img src={getAssetUrl(`tokens/${value.toLowerCase()}.svg`)} />
      {value}
    </span>
  });

  return (
    <div className={`token-selector ${props.type} ${props.isFixToken ? "fix_token" : ""}`}>
      <Dropdown active={props.open} onShow = {(e) => props.showTokens(e)} onHide = {(e) => props.hideTokens(e)} disabled={props.isFixToken} className={"theme__dropdown"}>
        <DropdownTrigger className="notifications-toggle">
          <div className="focus-item d-flex">
            <div className="d-flex">
              <div className="icon">
                <img alt={focusItem.name} src={getAssetUrl(`tokens/${focusItem.substituteImage ? focusItem.substituteImage : focusItem.symbol}.svg`)} />
              </div>
              <div>
                <div className="focus-name">
                  <span>{focusItem.substituteSymbol ? focusItem.substituteSymbol : focusItem.symbol}</span>
                </div>
              </div>
            </div>
            {props.screen === "limit_order" && focusItem.symbol.toLowerCase() === "weth" && 
              <img src={require("../../../assets/img/v3/info_grey.svg")} className="weth-info"/>
            }
            <div className={`common__triangle theme__border-top ${props.open ? 'up' : 'down'}`}/>
          </div>
        </DropdownTrigger>
        <DropdownContent className="common__slide-up">
          <div className="select-item theme__background-7">
            {props.screen === "limit_order" && getWethTitle()}
            {props.screen !== "limit_order" && <div className="select-item__priority-token">{priorityTokens}</div>}
            <div className="select-item__body">
              <div className="search-item theme__token-input">
                <input className="search-item__input" value={props.searchWord} placeholder={props.translate("transaction.try_dai") || `Try "DAI"`} onChange={(e) => props.changeWord(e)} type="text" onFocus={(e) => props.analytics.callTrack("trackSearchToken")}/>
              </div>
              <div className="list-item" onScroll={props.onListScroll}>
                {getListToken()}
              </div>
            </div>
          </div>
          
        </DropdownContent>
      </Dropdown>
    </div>
  )
}

export default TokenSelectorView
