import React from "react"
import * as converts from "../../utils/converter"

const AccountBalanceView = (props) => {

  function getBalances() {
    var balances = Object.values(props.tokens).map(token => {
      var balance = converts.toT(token.balance, token.decimal)
      return (
        <div className="columns my-2" key={token.symbol} onClick={(e) => props.selectToken(e, token.symbol, token.address)}>
          <div className={'balance-item ' + (token.symbol == props.sourceActive ? 'active' : '')}>
            <img src={require("../../../assets/img/tokens/" + token.icon)} />
            <div className="d-inline-block">
              <div className="symbol font-w-b">{token.symbol}</div>
              <div title={balance.toString()} className="balance">{converts.roundingNumber(balance)}</div>
            </div>
          </div>
        </div>
      )
    })
    return balances
  }

  function getBalanceUsd(){
    var total = 0
    Object.values(props.tokens).map(token => {
      var balance = converts.toT(token.balance, token.decimal)
      total += balance * token.rateUSD
    })
    var roundingTotal = converts.roundingNumber(total)
    return roundingTotal    
  }
  
  return (
    <div>
      <div className="row balance-header small-11 medium-12 large-12">
        <div className="column">
          <div className="mt-3 clearfix">
            <h4 className="title font-w-b float-left">{props.translate("address.my_balance") || "My balance"}</h4>
            {props.showBalance && (
              <p className="float-right">
                <span className="text-capitalize">{props.translate("address.total") || "Total"}</span>
                <span className="font-w-b font-s-up-1 ml-2">{getBalanceUsd()}</span> USD
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="balances">
        <div className={'row px-4 small-up-1 medium-up-3 large-up-5 ' + (props.expanded ? 'active' : '')}>
          {getBalances()}
        </div>
        <div className="expand">
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

export default AccountBalanceView