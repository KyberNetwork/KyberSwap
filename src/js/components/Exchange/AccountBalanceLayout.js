import React from "react"
import * as converts from "../../utils/converter"
import BLOCKCHAIN_INFO from "../../../../env"
import SlideDown, { SlideDownContent } from "../CommonElement/SlideDown";
import { SortableComponent } from "../CommonElement"

const AccountBalanceLayout = (props) => {
  function get24ChangeClass(change, isValidRate) {
    if (isValidRate && change > 0) {
      return 'account-balance__token-row--positive';
    } else if (isValidRate && change < 0) {
      return 'account-balance__token-row--negative';
    } else {
      return ''
    }
  }
  
  function get24ChangeValue(sortType, tokenSymbol, isValidRate) {
    let changeByETH = props.marketTokens[`ETH_${tokenSymbol}`] ? props.marketTokens[`ETH_${tokenSymbol}`].change : 0;
    if (changeByETH === 0) {
      changeByETH = props.marketTokens[`${tokenSymbol}_ETH`] ? props.marketTokens[`${tokenSymbol}_ETH`].change : 0;
    }
    const changeByUSD = props.marketTokens[`USDC_${tokenSymbol}`] ? props.marketTokens[`USDC_${tokenSymbol}`].change : 0;
    
    if (sortType === 'Eth') {
      return <div className={`account-balance__token-row ${get24ChangeClass(changeByETH, isValidRate)}`}>{(isValidRate) ? `${changeByETH}%` : '---'}</div>
    }
  
    return <div className={`account-balance__token-row ${get24ChangeClass(changeByUSD, isValidRate)}`}>{(isValidRate) ? `${changeByUSD}%` : '---'}</div>
  }
  
  function getBalances() {
    const tokens = props.getCustomizedTokens();
    let isEmpty = true;
    
    const allBalances = tokens.map(token => {
      var balance = converts.toT(token.balance, token.decimals)
      var searchWord = props.searchWord.toLowerCase()
      var symbolL = token.symbol.toLowerCase()
      let classBalance = "";
      const noBalance = balance == 0;
      const isValidRate = token.symbol === "ETH" || converts.compareTwoNumber(token.rate, 0);
    
      if (token.symbol === props.sourceActive) classBalance += " active"
      
      if (!symbolL.includes(searchWord) || (props.hideZeroBalance && noBalance)) return null;
      
      isEmpty = false;
      
      if (props.isLimitOrderTab && (!token.sp_limit_order || !props.isValidPriority(token))) {
        classBalance += " disabled unclickable"
      } else if (noBalance) {
        classBalance += " disabled"
      } else if (props.hideZeroBalance) {
        classBalance += " unclickable"
      }
      
      if ((props.isFixedSourceToken && props.screen === "swap") || (token.symbol === "PT" && props.screen === "transfer")) {
        classBalance += " deactivated";
      }
    
      return (
        <div
          key={token.symbol}
          {...(!classBalance.includes('unclickable') && {onClick: (e) => props.selectBalance( props.isLimitOrderTab ? (token.symbol == "ETH" ? "WETH" : token.symbol) : (token.symbol))})}
          className={"account-balance__token-item" + classBalance}
        >
          <div className={"account-balance__token-row account-balance__token-info"}>
            <img src={"https://files.kyber.network/DesignAssets/tokens/"+(token.substituteImage ? token.substituteImage : token.symbol).toLowerCase()+".svg"} />
            <div>
              <div className="account-balance__token-symbol">{token.substituteSymbol ? token.substituteSymbol : token.symbol}</div>
              <div className="account-balance__token-balance theme__text-3">{converts.formatNumber(balance, 5)}</div>
            </div>
          </div>
          {
            (isValidRate) ?
              (<div className="account-balance__token-row stable-equivalent">{
                props.sortType == "Eth" ? (<span>{ converts.toT(converts.multiplyOfTwoNumber(balance, token.symbol == "ETH" ? "1000000000000000000" : token.rate), false, 6)} E</span>) :
                  (<span>{converts.toT(converts.multiplyOfTwoNumber(balance, token.rateUSD), "0", 2)}$</span>)
              }</div>) :
              (<div className="account-balance__token-row stable-equivalent">
                {props.hideZeroBalance && (
                  <span>---</span>
                )}
              
                {!props.hideZeroBalance && (
                  <span className="error">maintenance</span>
                )}
              </div>)
          }
          
          {props.show24hChange && get24ChangeValue(props.sortType, token.symbol, isValidRate)}
        </div>
      )
    });
    
    return !isEmpty || props.searchWord ? allBalances : false;
  }
  
  const allBalances = getBalances();
  const isPortfolio = props.screen === 'portfolio';
  const isHideAllInfo = props.hideZeroBalance && allBalances === false;

  return (
    <div className={`account-balance common__slide-up account-balance--${props.screen}`}>
      {props.account !== false && (
        <SlideDown active={true}>
          <SlideDownContent>
            {!isPortfolio && (
              <div className="balance-header">
                <div className="slide-down__trigger-container">
                  <div className={"account-balance__address"}>
                    <div className="account-balance__address-text">{props.translate("address.your_wallet") || "Wallet"}</div>
                    <div>
                      <a className="account-balance__address-link theme__text-3" target="_blank" href={BLOCKCHAIN_INFO.ethScanUrl + "address/" + props.account.address}
                         onClick={(e) => { props.analytics.callTrack("trackClickShowAddressOnEtherescan"); e.stopPropagation(); }}>
                        {props.account.address.slice(0, 20)}...{props.account.address.slice(-4)}
                      </a>
                      <span className="account-balance__reimport" onClick={props.openReImport}>
                        {props.translate("change") || "CHANGE"}
                      </span>
                    </div>
                    {props.isLimitOrderTab &&
                      <div className="account-balance__address-text">
                        {props.translate("limit_order.your_available_balance") || "Tokens Available for Limit Order"}
                      </div>
                    }
                  </div>
                </div>
              </div>
            )}

            <div className="account-balance__control-panel">
              <div className={`account-balance__search-panel ${props.hideZeroBalance ? 'common__flexbox' : ''}`}>
                {props.hideZeroBalance && (
                  <div className="account-balance__text-panel">All Tokens</div>
                )}
                
                {!isHideAllInfo && (
                  <div className="account-balance__content-search-container">
                    <input
                      className="account-balance__content-search theme__search"
                      type="text"
                      placeholder={props.translate("address.search") || "Search by Name"}
                      onClick={props.clickOnInput}
                      onChange={(e) => props.changeSearchBalance(e)}
                      value={props.searchWord}
                    />
                  </div>
                )}
              </div>
  
              {!isHideAllInfo && (
                <div className="account-balance__sort-panel theme__background-4">
                  <div>
                    <SortableComponent text="Name" Wrapper="span" isActive={props.sortType == "Name"} onClick={(isDsc) => props.onClickSortType("Name", isDsc)}/>
                    <span className="account-balance__sort-separation theme__separation"> | </span>
                    <SortableComponent text="Bal" Wrapper="span" isActive={props.sortType == "Bal"} onClick={(isDsc) => props.onClickSortType("Bal", isDsc)}/>
                  </div>
                  <div>
                    <SortableComponent text="ETH" Wrapper="span" isActive={props.sortType == "Eth"} onClick={(isDsc) => props.onClickSortType("Eth", isDsc)}/>
                    <span className="account-balance__sort-separation theme__separation"> | </span>
                    <SortableComponent text="USD" Wrapper="span" isActive={props.sortType == "USDT"} onClick={(isDsc) => props.onClickSortType("USDT", isDsc)}/>
                  </div>
                  {props.show24hChange && (
                    <div>{props.translate("change") || "Change"}</div>
                  )}
                </div>
              )}
            </div>

            <div className="account-balance__content">
              <div>
                <div className="balances custom-radio">
                  <div className={`account-balance__token-list ${isHideAllInfo ? 'account-balance__token-list--empty' : ''}`}>
                    {!isHideAllInfo ? allBalances : '-- % --'}
                  </div>
                </div>
              </div>
            </div>
          </SlideDownContent>
        </SlideDown>
      )}
    </div>
  )
};

export default AccountBalanceLayout
