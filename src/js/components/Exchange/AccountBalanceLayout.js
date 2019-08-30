import React from "react"
import * as converts from "../../utils/converter"
import BLOCKCHAIN_INFO from "../../../../env"
import Dropdown, { DropdownTrigger, DropdownContent } from 'react-simple-dropdown';
import SlideDown, { SlideDownTrigger, SlideDownContent } from "../CommonElement/SlideDown";
import { SortableComponent } from "../CommonElement"
const AccountBalanceLayout = (props) => {

  function displayBalance(balance, rateUSD) {
    return props.showBalance ?
      `${props.translate("address.my_balance") || "My Balance"}: 
    <strong>${balance}</strong>
    <br/>${props.translate("address.estimated_value") || "Estimated value"}: 
    <strong>${converts.roundingNumber(balance * rateUSD)}</strong> USD`
      : `${props.translate("address.my_balance") || "Balance"}: <strong>${balance}</strong>`
  }

  function reorderToken() {
    let tokens = props.tokens;
    if (props.isLimitOrderTab) {
      tokens = props.getFilteredTokens(props.sortValue);
    }
    switch (props.sortType) {
      case "Eth": 
        if (props.isLimitOrderTab) {
          return tokens;
        } else {
          if (props.sortValue) {
            return converts.sortEthBalance(tokens)
          } else {
            return converts.sortASCEthBalance(tokens)
          }
        }
        break;
      case "Name":
        if (props.isLimitOrderTab) {
          return tokens.sort((firstToken, secondToken) => {
            const firstTokenSymbol = firstToken.substituteSymbol ? firstToken.substituteSymbol : firstToken.symbol;
            const secondTokenSymbol = secondToken.substituteSymbol ? secondToken.substituteSymbol : secondToken.symbol;

            return !props.sortValue ? firstTokenSymbol.localeCompare(secondTokenSymbol) : secondTokenSymbol.localeCompare(firstTokenSymbol);
          });
        } else {
          if (props.sortValue) {
            var ordered = []
            Object.keys(tokens).sort().forEach(function (key) {
              ordered.push(tokens[key])
            })
            return ordered
          } else {
            var ordered = []
            Object.keys(tokens).sort().reverse().forEach(function (key) {
              ordered.push(tokens[key])
            })
            return ordered
          }
        }
        break;
      case "Bal": 
        return tokens.sort((a, b) => {return (props.sortValue ? -1 : 1)*(+a.balance - b.balance)} )
        break;
      case "USDT":
        return tokens.sort((a, b) => {return (props.sortValue ? -1 : 1)*(+a.balance - b.balance)} )
        break;
    }
  }

  function getsubstituteSymbol(){
    return reorderToken().filter((t) => Object.keys(t).includes("substituteSymbol"))[0]
  }
  function getBalances() {
    var tokens = reorderToken()
    console.log("[][]", tokens)

    var balances = tokens
      .map(token => {
        var balance = converts.toT(token.balance, token.decimals)
        var searchWord = props.searchWord.toLowerCase()
        var symbolL = token.symbol.toLowerCase()
        var classBalance = "";

        if (token.symbol === props.sourceActive) classBalance += " active"
        if (!symbolL.includes(searchWord)) classBalance += " hide"
        if (balance == 0) classBalance += " disabled"
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
            <img src={"https://files.kyber.network/DesignAssets/tokens/"+(token.symbol == "WETH" ? "eth" : token.symbol).toLowerCase()+".svg"} />
            <div>
              <span className="account-balance__token-symbol">{token.substituteSymbol ? token.substituteSymbol : token.symbol}</span>
              <div className="account-balance__token-balance theme__text-3">{converts.roundingNumber(balance)}</div>
            </div>
            <div style={{width: '100%', textAlign: 'right'}}>{
              props.sortType == "Eth" ? (<span>{ converts.toT(converts.multiplyOfTwoNumber(balance, token.rate), false, 6)} <h6 style={{display: 'inline-block'}}>E</h6></span>) : 
              (<span>{ converts.toT(converts.multiplyOfTwoNumber(balance, token.rateUSD), "0", 2)} <h6 style={{display: 'inline-block'}}>$</h6></span>)
            }</div>
          </div>
        )
      })
    return balances
  }

  function getBalanceUsd() {
    var total = 0

    Object.values(props.tokens).map(token => {
      if (!token.rateUSD) {
        return
      }
      var balance = converts.toT(token.balance, token.decimals)
      total += balance * token.rateUSD
    })

    var roundingTotal = converts.roundingNumber(total)

    return roundingTotal
  }

  function getWalletType(walletType) {
    switch (walletType) {
      case "metamask":
        return "Metamask"
      case "trezor":
        return "Trezor"
      case "ledger":
        return "Ledger"
      case "keystore":
        return "Json"
      case "privateKey":
        return "Private Key"
      default:
        return ""
    }
  }

  function toggleShowBalance(e) {
    var advanceContent = document.getElementById("balance-content");
    var arrowBalance = document.getElementById("arrow-balance");
    if (advanceContent.className === "show-balance") {
      advanceContent.className = "";
      arrowBalance.className = "";
    } else {
      advanceContent.className = "show-balance";
      arrowBalance.className = "arrow-balance-up";
    }
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
  }
  return (
    <div className="account-balance">
      {props.account !== false && (
        <SlideDown active={props.isBalanceActive}>
          {/* <SlideDownTrigger onToggleContent={() => props.toggleBalanceContent()}>
            <div className="balance-header">

              <div className="slide-down__trigger-container">
                <div>
                  <div className={"account-balance__address"}>
                    <div>
                      <span className="account-balance__address-text">{props.translate("address.your_wallet") || "Your Wallet"}</span>
                      {!props.isOnDAPP && <span className={"account-balance__wallet-name"}><span>-</span>{getWalletName()}</span>}
                    </div>
                    <div className="slide-arrow-container">
                      <div className="slide-arrow"></div>
                    </div>
                  </div>
                  <a className="account-balance__address-link" target="_blank" href={BLOCKCHAIN_INFO.ethScanUrl + "address/" + props.account.address}
                    onClick={(e) => { props.analytics.callTrack("trackClickShowAddressOnEtherescan");   e.stopPropagation(); }}>
                    {props.account.address}
                  </a>
                </div>
              </div>
            </div>
          </SlideDownTrigger> */}
          <SlideDownContent>
            <div className="balance-header">

              <div className="slide-down__trigger-container">
                <div>
                  <div className={"account-balance__address"}>
                    <div>
                      <span className="account-balance__address-text theme__text-label-bold">{props.translate("address.your_wallet") || "Wallet"}</span>
                      {!props.isOnDAPP && <span className={"account-balance__wallet-name"}><span>-</span>{getWalletName()}</span>}
                    </div>
                    {/* <div className="slide-arrow-container">
                      <div className="slide-arrow"></div>
                    </div> */}
                  </div>
                  {/* <div className="account-balance__address-eth-balance theme__text-label-bold">{converts.toT(getsubstituteSymbol().balance, getsubstituteSymbol().decimals, 3)} <h6 style={{display: 'inline-block'}}>ETH</h6></div>*/}
                  <a className="account-balance__address-link theme__text-3" target="_blank" href={BLOCKCHAIN_INFO.ethScanUrl + "address/" + props.account.address}
                    onClick={(e) => { props.analytics.callTrack("trackClickShowAddressOnEtherescan"); e.stopPropagation(); }}>
                    {props.account.address}
                  </a>
                </div>
              </div>
            </div>
            <div className="account-balance__control-panel">
              {/* <div className="account-balance__cat-panel">
                <span className="theme__tab active">KYBER LIST</span>
                <span className="theme__tab">OTHER</span>
              </div>*/}
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
                  <SortableComponent text="Eth" Wrapper="span" isActive={props.sortType == "Eth"} onClick={(isDsc) => onClick("Eth", isDsc)}/> 
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
