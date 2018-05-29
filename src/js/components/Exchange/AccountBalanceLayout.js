import React from "react"
import * as converts from "../../utils/converter"
import BigNumber from "bignumber.js"
import ReactTooltip from 'react-tooltip'

const AccountBalanceLayout = (props) => {

  function displayBalance(balance, rateUSD) {
    return props.showBalance ? 
    `${props.translate("address.my_balance") || "My Balance"}: 
    <strong>${balance}</strong>
    <br/>${props.translate("address.estimated_value") || "Estimated value"}: 
    <strong>${converts.roundingNumber(balance * rateUSD)}</strong> USD`
    : `${props.translate("address.my_balance") || "Balance"}: <strong>${balance}</strong>`
  }

  function getBalances() {
    var balances = converts.shortEthBalance(props.tokens)
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
                        onChange={(e)=>console.log}/>
                <div class="check"></div>

                <label className="label-radio" for={token.symbol + "options"}>
                  <div className="symbol font-w-b">{token.symbol}</div>
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

  return (
    <div id="balance-account">
      <div className="balance-header">
        <div className="title">
          {props.translate("address.my_balance") || "My balance"}
        </div>
        {props.showBalance && (
              <p className="estimate-value">
                <span className="text-upcase">{props.translate("address.total") || "Total"} {getBalanceUsd()} USD</span>
              </p>
            )}
      </div>
      
      <div id="search-balance" className="row">
        <div className="column small-10">
          <input type="text" placeholder="Search" onChange={(e) => props.changeSearchBalance(e)} value = {props.searchWord}  className="search-input"/>
        </div>   
        <div className="column small-2 sort-balance">
        </div>
      </div>
      <div className="balances custom-radio custom-scroll">
        <ul>
          {getBalances()}
        </ul>
      </div>
    </div>
  )
}

export default AccountBalanceLayout