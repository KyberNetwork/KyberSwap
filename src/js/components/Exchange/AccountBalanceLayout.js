import React from "react"
import * as converts from "../../utils/converter"
import BigNumber from "bignumber.js"
//import ReactTooltip from 'react-tooltip'
import BLOCKCHAIN_INFO from "../../../../env"
import Dropdown, { DropdownTrigger, DropdownContent } from 'react-simple-dropdown';

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
          return converts.shortEthBalance(tokens)
        }else{
          return converts.shortASCEthBalance(tokens)
        }
      }else{
        if (props.sortValue){
          var ordered = []
          console.log(tokens)
          Object.keys(tokens).sort().forEach(function(key) {
            ordered.push(tokens[key])
          })
          console.log(ordered)
          return ordered
        }else{
          var ordered = []
          console.log(tokens)          
          Object.keys(tokens).sort().reverse().forEach(function(key) {
            ordered.push(tokens[key])
          })
          console.log(ordered)
          return ordered
        }
      }
      
  }

  function getBalances() {
    var tokens = reorderToken(props.tokens)
    var balances = tokens 
      .map(token => {
        var balance = converts.toT(token.balance, token.decimal)

        var tokenEpsilon = converts.caculateTokenEpsilon(token.rate, token.decimal, token.symbol)
        var bigBalance = new BigNumber(token.balance)

        var searchWord = props.searchWord.toLowerCase()
        var symbolL = token.symbol.toLowerCase()

        var classBalance = ""
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
    <div id="balance-account">
      <div className="balance-address">
        <div className="title">{props.translate("address.your_wallet_address") || "Your Wallet Address"}</div>
        <div>
          <a className="short-address" target="_blank" href={BLOCKCHAIN_INFO.ethScanUrl + "address/" + props.address}>{props.address ? props.address.slice(0, 8) : ''} ... {props.address ? props.address.slice(-6) : ''}</a>
        </div>
      </div>

      <div className="balance-header balance-large">
        <div className="title">
          {props.translate("address.my_balance") || "My balance"}
        </div>
        {props.showBalance && (
              <div className="estimate-value">
                <span className="text-upcase">{props.translate("address.total") || "Total"} {getBalanceUsd()} USD</span>
              </div>
            )}
      </div>
      
      <div className="balance-header balance-medium" onClick={(e) => toggleShowBalance()}>
          <div>
            <div className="title">
              {props.translate("address.my_balance") || "My balance"}
            </div>
            {props.showBalance && (
              <div className="estimate-value">
                <span className="text-upcase">{props.translate("address.total") || "Total"} {getBalanceUsd()} USD</span>
              </div>
            )}
          </div>
          <img src={require("../../../assets/img/exchange/arrow-down-swap.svg")} id="arrow-balance"/> 
      </div>
      
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
          <div className="balances custom-radio custom-scroll">
            <ul>
              {getBalances()}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountBalanceLayout