import React from "react"
import * as converts from "../../utils/converter"
import BLOCKCHAIN_INFO from "../../../../env"
import SlideDown, { SlideDownContent } from "../CommonElement/SlideDown";
import { SortableComponent } from "../CommonElement"

const AccountBalanceLayout = (props) => {
  function removedMaintenance(tokens){
    return tokens.filter(t =>  (t.symbol == "ETH" || converts.compareTwoNumber(t.rate, 0)))
  }
  function maintenance(tokens){
    return tokens.filter(t =>  !(t.symbol == "ETH" || converts.compareTwoNumber(t.rate, 0)))
  }
  function reorderToken() {
    let tokens = props.tokens;

    // if (props.isLimitOrderTab) {
    //   tokens = props.getFilteredTokens(props.sortValue);
    // }
    let res = []
    switch (props.sortType) {
      case "Eth":
        // if (props.isLimitOrderTab) {
        //   res = tokens;
        // } else {
          if (props.sortValue) {
            res = converts.sortEthBalance(tokens)
          } else {
            res = converts.sortASCEthBalance(tokens)
          }
        // }
        break;
      case "Name":
        // if (props.isLimitOrderTab) {
        //   res = tokens.sort((firstToken, secondToken) => {
        //     const firstTokenSymbol = firstToken.substituteSymbol ? firstToken.substituteSymbol : firstToken.symbol;
        //     const secondTokenSymbol = secondToken.substituteSymbol ? secondToken.substituteSymbol : secondToken.symbol;

        //     return !props.sortValue ? firstTokenSymbol.localeCompare(secondTokenSymbol) : secondTokenSymbol.localeCompare(firstTokenSymbol);
        //   });
        // } else {
          if (props.sortValue) {
            var ordered = []
            Object.keys(tokens).sort().forEach(function (key) {
              ordered.push(tokens[key])
            })
            res = ordered
          } else {
            var ordered = []
            Object.keys(tokens).sort().reverse().forEach(function (key) {
              ordered.push(tokens[key])
            })
            res = ordered
          }
        // }
        break;
      case "Bal":
        res = Object.keys(tokens).map(key => tokens[key]).sort((a, b) => {return (props.sortValue ? -1 : 1)*(converts.subOfTwoNumber(a.balance, b.balance))} )
        break;
      case "USDT":
        res = Object.keys(tokens).map(key => tokens[key]).sort((a, b) => {return (props.sortValue ? -1 : 1)*(converts.subOfTwoNumber(converts.multiplyOfTwoNumber(a.balance, a.rateUSD), converts.multiplyOfTwoNumber(b.balance, b.rateUSD)))} )
        break;
    }
    res = removedMaintenance(res).concat(maintenance(res))
    return res
  }

  function getBalances() {
    var tokens = reorderToken()
    var balances = tokens
      .map(token => {
        var balance = converts.toT(token.balance, token.decimals)
        var searchWord = props.searchWord.toLowerCase()
        var symbolL = token.symbol.toLowerCase()
        var classBalance = "";

        if (token.symbol === props.sourceActive) classBalance += " active"
        if (!symbolL.includes(searchWord)) classBalance += " hide"
        if (props.isLimitOrderTab){
          if (!token.sp_limit_order) classBalance += " disabled" 
        }else {
          if (balance == 0) classBalance += " disabled" 
        }
        if ((props.isFixedSourceToken && props.screen === "swap")
          || (token.symbol === "PT" && props.screen === "transfer")) {
          classBalance += " deactivated";
        }

        return (
          <div
            key={token.symbol}
            onClick={(e) => props.selectBalance(token.symbol)}
            className={"account-balance__token-item" + classBalance}
          >
            <img src={"https://files.kyber.network/DesignAssets/tokens/"+(token.substituteImage ? token.substituteImage : token.symbol).toLowerCase()+".svg"} />
            <div>
              <span className="account-balance__token-symbol">{token.substituteSymbol ? token.substituteSymbol : token.symbol}</span>
              <div className="account-balance__token-balance theme__text-3">{converts.roundingNumber(balance)}</div>
            </div>
            {
              (token.symbol == "ETH" || converts.compareTwoNumber(token.rate, 0)) ?  
                (<div id="stable-equivalent">{
                  props.sortType == "Eth" ? (<span>{ converts.toT(converts.multiplyOfTwoNumber(balance, token.symbol == "ETH" ? "1000000000000000000" : token.rate), false, 6)} E</span>) :
                    (<span>{ converts.toT(converts.multiplyOfTwoNumber(balance, token.rateUSD), "0", 2)} $</span>)
                }</div>) : 
                (<div id="stable-equivalent">
                  <span className="error"> maintenance </span>
                </div>)
            }
          </div>
        )
      })
    return balances
  }

  function getWalletName() {
    if (!props.walletName || props.walletName === "") {
      switch (props.account.type) {
        case "metamask":
          return "Metamask"
        case "keystore":
          return "Keystore"
        case "ledger":
          return "Ledger"
        case "trezor":
          return "Trezor"
        case "privateKey":
          return "Private key"
        case "promoCode":
          return "Promocode"
        default:
          return "Wallet"
      }
    } else {
      return props.walletName
    }
  }

  const onClick = (id, isDsc) => {
    props.onSort(id, isDsc)
    props.analytics.callTrack("trackLimitOrderClickSortOnWalletPanel", id, isDsc)
  }

  return (
    <div className="account-balance">
      {props.account !== false && (
        <SlideDown active={true}>
          <SlideDownContent>
            <div className="balance-header">
              <div className="slide-down__trigger-container">
                <div className={"account-balance__address"}>
                  <div>
                    <div>
                      <span className="account-balance__address-text">{props.translate("address.your_wallet") || "Wallet"}</span>
                    </div>
                  </div>
                  <div>
                    <a className="account-balance__address-link theme__text-3" target="_blank" href={BLOCKCHAIN_INFO.ethScanUrl + "address/" + props.account.address}
                      onClick={(e) => { props.analytics.callTrack("trackClickShowAddressOnEtherescan"); e.stopPropagation(); }}>
                      {props.account.address.slice(0, 20)}...{props.account.address.slice(-4)}
                    </a>
                    <span className="account-balance__reimport" onClick={props.openReImport}>
                      {props.translate("import.change_address") || "CHANGE"}
                    </span>
                  </div>
                  {props.isLimitOrderTab && 
                    <div className="account-balance__address-text">
                      {props.translate("limit_order.available_tokens") || "Tokens Available for Limit Order"}
                    </div>}
                </div>

              </div>
            </div>

            <div className="account-balance__control-panel">
              <div className="account-balance__search-panel">
                <div className="account-balance__content-search-container">
                  <input
                    className="account-balance__content-search theme__search"
                    type="text"
                    placeholder={props.translate("address.search") || "Search by Name"}
                    onChange={(e) => props.changeSearchBalance(e)}
                    value={props.searchWord}
                  />
                </div>
              </div>
              <div className="account-balance__sort-panel theme__background-2">
                <span id="sec-1">
                  <SortableComponent text="Name" Wrapper="span" isActive={props.sortType == "Name"} onClick={(isDsc) => onClick("Name", isDsc)}/>
                  <span className="theme__separation"> | </span>
                  <SortableComponent text="Bal" Wrapper="span" isActive={props.sortType == "Bal"} onClick={(isDsc) => onClick("Bal", isDsc)}/>
                </span>
                <span id="sec-2">
                  <SortableComponent text="ETH" Wrapper="span" isActive={props.sortType == "Eth"} onClick={(isDsc) => onClick("Eth", isDsc)}/>
                  <span className="theme__separation"> | </span>
                  <SortableComponent text="USD" Wrapper="span" isActive={props.sortType == "USDT"} onClick={(isDsc) => onClick("USDT", isDsc)}/>
                </span>
              </div>
            </div>

            <div className="account-balance__content">
              <div>
                <div className="balances custom-radio">
                  <div className="account-balance__token-list">
                    {getBalances()}
                  </div>
                </div>
              </div>
            </div>
          </SlideDownContent>
        </SlideDown>
      )}
    </div>
  )
}

export default AccountBalanceLayout
