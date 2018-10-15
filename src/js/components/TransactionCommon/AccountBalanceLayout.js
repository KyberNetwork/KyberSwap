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
        var balance = converts.toT(token.balance, token.decimals)

        var tokenEpsilon = converts.caculateTokenEpsilon(token.rate, token.decimals, token.symbol)
        var bigBalance = new BigNumber(token.balance)
        return (
          props.showZeroBalance || bigBalance.isGreaterThanOrEqualTo(tokenEpsilon) ?
            <div data-tip={displayBalance(balance, token.rateUSD)}
              className="columns my-2" key={token.symbol} data-for={token.symbol}
              onClick={(e) => props.selectToken(e, token.symbol, token.address)}
            >
              <div className={'balance-item ' + (token.symbol == props.sourceActive ? 'active' : '')}>
                <div className="d-inline-block">
                  <div className="symbol font-w-b">{token.symbol}</div>
                  <div className="balance">{converts.roundingNumber(balance)}</div>
                </div>
              </div>
              <ReactTooltip place="bottom" id={token.symbol} type="light" html={true}/>
            </div>
            : <div key={token.symbol} />
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
      var balance = converts.toT(token.balance, token.decimals)
      total += balance * token.rateUSD
    })
    //console.log("total: " + total)
    var roundingTotal = converts.roundingNumber(total)
    return roundingTotal
  }

  // var checkBox = props.showZeroBalance ? <img src={require("../../../assets/img/checkmark-selected-dark.svg")} />
  //   : <img src={require("../../../assets/img/checkmark-unselected-dark.svg")} />

  return (
    <div id="balance-account">
      <div className="balance-header">
        <div className="title">
          {props.translate("address.my_balance") || "My balance"}
        </div>
        {props.showBalance && (
              <div className="estimate-value">
                <span className="text-capitalize">{props.translate("address.total") || "Total value"}</span>
                <span className="font-w-b font-s-up-1 ml-2">{getBalanceUsd()}</span> USD
              </div>
            )}
      </div>
      
      <div id="search-balance">
         <div>  
           <input placeholder={props.translate("address.search") || "Search"}/>
        </div>   
        <div>
          Sort
        </div>
      </div>
      <div className="balances">
        <div className={'row small-up-3 medium-up-6 large-up-8 ' + (props.expanded ? 'active' : '')}>
          {getBalances()}
        </div>
        <div className={"expand " + (Object.keys(props.tokens).length > 8 ? "" : "d-none-md")}>
          <div className="row align-right">
            <div className="text-right">
              <button onClick={props.toggleBalances}>
                <i className={'k k-angle ' + (props.expanded ? 'up' : '')}></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountBalanceLayout
