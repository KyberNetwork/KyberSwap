import React from "react"
import * as converts from "../../utils/converter"
import BLOCKCHAIN_INFO from "../../../../env"
import SlideDown, { SlideDownContent } from "../CommonElement/SlideDown";
import { SortableComponent } from "../CommonElement"

const AccountBalanceLayout = (props) => {
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
            <div id="stable-equivalent">{
              props.sortType == "Eth" ? (<span>{ converts.toT(converts.multiplyOfTwoNumber(balance, token.rate), false, 6)} E</span>) :
                (<span>{ converts.toT(converts.multiplyOfTwoNumber(balance, token.rateUSD), "0", 2)} $</span>)
            }</div>
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
  }

  return (
    <div className="account-balance">
      {props.account !== false && (
        <SlideDown active={props.isBalanceActive}>
          <SlideDownContent>
            <div className="balance-header">
              <div className="slide-down__trigger-container">
                <div>
                  <div className={"account-balance__address"}>
                    <div>
                      <span className="account-balance__address-text">{props.translate("address.your_wallet") || "Wallet"}</span>
                    </div>
                  </div>
                  <div>
                    <a className="account-balance__address-link theme__text-3" target="_blank" href={BLOCKCHAIN_INFO.ethScanUrl + "address/" + props.account.address}
                      onClick={(e) => { props.analytics.callTrack("trackClickShowAddressOnEtherescan"); e.stopPropagation(); }}>
                      {props.account.address.slice(0, 22)}...{props.account.address.slice(-4)}
                    </a>
                    <span className="account-balance__reimport" onClick={props.openReImport}>
                      {props.translate("import.change_address") || "CHANGE"}
                    </span>
                  </div>
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
