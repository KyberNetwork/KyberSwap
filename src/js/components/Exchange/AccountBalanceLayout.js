import React from "react"
import * as converts from "../../utils/converter"
import BigNumber from "bignumber.js"
import BLOCKCHAIN_INFO from "../../../../env"
import Dropdown, { DropdownTrigger, DropdownContent } from 'react-simple-dropdown';
import SlideDown, { SlideDownTrigger, SlideDownContent } from "../CommonElement/SlideDown";
import { TokenChart } from "../../containers/Market";
import * as analytics from "../../utils/analytics"

const AccountBalanceLayout = (props) => {

  function displayBalance(balance, rateUSD) {
    return props.showBalance ? 
    `${props.translate("address.my_balance") || "My Balance"}: 
    <strong>${balance}</strong>
    <br/>${props.translate("address.estimated_value") || "Estimated value"}: 
    <strong>${converts.roundingNumber(balance * rateUSD)}</strong> USD`
    : `${props.translate("address.my_balance") || "Balance"}: <strong>${balance}</strong>`
  }

  function reorderToken(tokens){
      if (props.sortType === "Price"){
        if (props.sortValue){
          return converts.sortEthBalance(tokens)
        }else{
          return converts.sortASCEthBalance(tokens)
        }
      }else{
        if (props.sortValue){
          var ordered = []
          Object.keys(tokens).sort().forEach(function(key) {
            ordered.push(tokens[key])
          })
          return ordered
        }else{
          var ordered = []
          Object.keys(tokens).sort().reverse().forEach(function(key) {
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
        var balance = converts.toT(token.balance, token.decimal)
        var searchWord = props.searchWord.toLowerCase()
        var symbolL = token.symbol.toLowerCase()
        var classBalance = "";

        if (token.symbol === props.sourceActive) classBalance += "active"
        if (!symbolL.includes(searchWord)) classBalance += " hide"
        
        return (
            <li key={token.symbol} data-for={token.symbol}
              onClick={(e) => props.selectToken(e, token.symbol, token.address)} className = {classBalance}
            >
              <div className='balance-item'>
                <input checked={token.symbol === props.sourceActive?true: false} 
                        type="radio" id={token.symbol + "options"} name="b-selector"
                        onChange={(e)=>console.log()}/>
                <div class="check"></div>

                <label className="label-radio" for={token.symbol + "options"}>
                  <div className="symbol">{token.symbol}</div>
                  <div className="balance">{converts.roundingNumber(balance)}</div>
                </label>
              </div>
            </li>
        )
      })
    return balances
  }

  function getBalanceUsd() {
    var total = 0
    Object.values(props.tokens).map(token => {
      if (!token.rateUSD){
        return
      }
      var balance = converts.toT(token.balance, token.decimal)
      total += balance * token.rateUSD
    })
    //console.log("total: " + total)
    var roundingTotal = converts.roundingNumber(total)
    return roundingTotal
  }

  function getWalletType(walletType){
    switch(walletType){
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

  return (
    <div id="balance-account" className={props.account !== false? "has-account":"no-account"}>

    {props.account === false && (
        <div className="balance-address">
          <div className="title">{props.translate("address.your_wallet_address") || "Your Wallet Address"}</div>
          <div className="lock-wallet">
              You haven't unlocked your wallet,<br></br> <a onClick={(e)=>props.acceptTerm()}>click here</a>
          </div>
        </div>
      )}

      {props.account !== false && (
        <div className="balance-address">
          <div className="title">{props.translate("address.your_wallet_address") || "Your Wallet Address"}</div>
          <div>
            <a className="short-address" target="_blank" href={BLOCKCHAIN_INFO.ethScanUrl + "address/" + props.account.address} onClick={(e) => {analytics.trackClickShowAddressOnEtherescan()}}>
              {props.account.address ? props.account.address.slice(0, 8) : ''} ... {props.account.address ? props.account.address.slice(-6) : ''}
            </a>
          </div>
        </div>
      )}

      <TokenChart
        sourceTokenSymbol={props.sourceTokenSymbol}
        destTokenSymbol={props.destTokenSymbol}
        isChartActive={props.isChartActive}
        chartTimeRange={props.chartTimeRange}
        onChangeChartRange={props.onChangeChartRange}
        onToggleChartContent={props.onToggleChartContent}
      />

      {props.account !== false && (
        <SlideDown active={props.isBalanceActive}>
          <SlideDownTrigger onToggleContent={() => props.toggleBalanceContent()}>
            <div className="balance-header">
              <div className="title">
                {props.translate("address.my_balance") || "My balance"}
              </div>
              {props.showBalance && (
                <div className="estimate-value">
                  {props.translate("address.total") || "Total"} {getBalanceUsd()} USD
                </div>
              )}
            </div>
          </SlideDownTrigger>

          <SlideDownContent>
            <div id="balance-content">
              <div className="balance-panel">
                <div id="search-balance" className="row">
                  <div className="column small-10">
                    <input type="text" placeholder={props.translate("address.search") || "Search"} onChange={(e) => props.changeSearchBalance(e)} value = {props.searchWord}  className="search-input"/>
                  </div>

                  <Dropdown  onShow = {(e) => props.showSort(e)} onHide = {(e) => props.hideSort(e)} active={props.sortActive}>
                    <DropdownTrigger className="notifications-toggle">
                      <div className="column small-2 sort-balance"></div>
                    </DropdownTrigger>
                    <DropdownContent>
                      <div className="select-item">
                        <div onClick={(e)=>props.sortSymbol()}>{props.translate("address.symbol") || "SYMBOL"}</div>
                        <div onClick={(e)=>props.sortPrice()}>{props.translate("address.price") || "PRICE"}</div>
                      </div>
                    </DropdownContent>
                  </Dropdown>

                </div>
                <div className="balances custom-radio">
                  <ul>{getBalances()}</ul>
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
