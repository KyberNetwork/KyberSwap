import React from "react"
import * as converts from "../../utils/converter"
import BLOCKCHAIN_INFO from "../../../../env"
import Dropdown, { DropdownTrigger, DropdownContent } from 'react-simple-dropdown';
import SlideDown, { SlideDownTrigger, SlideDownContent } from "../CommonElement/SlideDown";

const AccountBalanceLayout = (props) => {

  function displayBalance(balance, rateUSD) {
    return props.showBalance ?
      `${props.translate("address.my_balance") || "My Balance"}: 
    <strong>${balance}</strong>
    <br/>${props.translate("address.estimated_value") || "Estimated value"}: 
    <strong>${converts.roundingNumber(balance * rateUSD)}</strong> USD`
      : `${props.translate("address.my_balance") || "Balance"}: <strong>${balance}</strong>`
  }

  function reorderToken(tokens) {
    if (props.sortType === "Price") {
      if (props.sortValue) {
        return converts.sortEthBalance(tokens)
      } else {
        return converts.sortASCEthBalance(tokens)
      }
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
  }

  function getBalances() {
    var tokens = reorderToken(props.tokens)
    var balances = tokens
      .map(token => {
        var balance = converts.toT(token.balance, token.decimals)
        var searchWord = props.searchWord.toLowerCase()
        var symbolL = token.symbol.toLowerCase()
        var classBalance = "";

        if (token.symbol === props.sourceActive) classBalance += " active"
        if (!symbolL.includes(searchWord)) classBalance += " hide"
        if (balance == 0) classBalance += " disabled"
        if (props.isFixedSourceToken && props.screen === "swap") {
          classBalance += " deactivated";
        }

        return (
          <div
            key={token.symbol}
            onClick={(e) => props.selectBalance(token.symbol)}
            className={"account-balance__token-item" + classBalance}
          >
            <div className="account-balance__token-symbol">{token.symbol}</div>
            <div className="account-balance__token-balance">{converts.roundingNumber(balance)}</div>
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
                      <span className="account-balance__address-text">{props.translate("address.your_wallet") || "Your Wallet"}</span>
                      {!props.isOnDAPP && <span className={"account-balance__wallet-name"}><span>-</span>{getWalletName()}</span>}
                    </div>
                    {/* <div className="slide-arrow-container">
                      <div className="slide-arrow"></div>
                    </div> */}
                  </div>
                  <a className="account-balance__address-link" target="_blank" href={BLOCKCHAIN_INFO.ethScanUrl + "address/" + props.account.address}
                    onClick={(e) => { props.analytics.callTrack("trackClickShowAddressOnEtherescan"); e.stopPropagation(); }}>
                    {props.account.address}
                  </a>
                </div>
              </div>
            </div>
            <div className="account-balance__content">
              <div>
                <div className={"account-balance__content-input-container"}>
                  <div className="account-balance__content-search-container">
                    <input
                      className="account-balance__content-search"
                      type="text"
                      placeholder={props.translate("address.search") || "Search by Name"}
                      onChange={(e) => props.changeSearchBalance(e)}
                      value={props.searchWord}
                    />
                  </div>

                  <Dropdown
                    className={"account-balance__sort"}
                    onShow={(e) => props.showSort(e)}
                    onHide={(e) => props.hideSort(e)}
                    active={props.sortActive}
                  >
                    <DropdownTrigger>
                      <div className={"account-balance__sort-dropdown"}>
                        {props.sortType == 'Symbol' ? props.translate("address.symbol") || "Symbol" : props.translate("address.price") || "Price"}
                      </div>
                      <div className={"account-balance__sort-arrow"}></div>
                    </DropdownTrigger>
                    <DropdownContent>
                      <div className={"account-balance__sort-category"}>
                        <div className={`account-balance__sort-item ${props.sortType == 'Symbol' ? 'active' : ''}`} onClick={(e) => props.sortSymbol()}>{props.translate("address.symbol") || "Symbol"}</div>
                        <div className={`account-balance__sort-item ${props.sortType == 'Price' ? 'active' : ''}`} onClick={(e) => props.sortPrice()}>{props.translate("address.price") || "Price"}</div>
                      </div>
                    </DropdownContent>
                  </Dropdown>
                </div>

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
