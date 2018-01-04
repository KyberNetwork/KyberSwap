import React from "react"
import * as converts from "../../utils/converter"
import BigNumber from "bignumber.js"
const AccountBalanceView = (props) => {

  function getBalances() {
    var balances = Object.values(props.tokens).map(token => {
      var balance = converts.toT(token.balance, token.decimal)

      var tokenEpsilon = converts.caculateTokenEpsilon(token.rate, token.decimal, token.symbol)
      var bigBalance = new BigNumber(token.balance)
      return (
        props.showZeroBalance || bigBalance.greaterThanOrEqualTo(tokenEpsilon) ? 
        <div className="columns my-2" key={token.symbol} onClick={(e) => props.selectToken(e, token.symbol, token.address)}>
          <div className={'balance-item ' + (token.symbol == props.sourceActive ? 'active' : '')}>
            <img src={require("../../../assets/img/tokens/" + token.icon)} />
            <div className="d-inline-block">
              <div className="symbol font-w-b">{token.symbol}</div>
              <div title={balance} className="balance">{converts.roundingNumber(balance)}</div>
            </div>
          </div>
        </div>
        : <div key={token.symbol}/>
      )
    })
    return balances
  }

  var total = 0
  Object.values(props.tokens).map(token => {
    var balance = converts.toT(token.balance, token.decimal)
    total += balance * token.rateUSD
  })

  var roundingTotal = converts.roundingNumber(total)
  return (
    <div>
      <div className="row balance-header small-11 medium-12 large-12">
        <div className="column">
          <div className="mt-3 clearfix">
            <h4 className="title font-w-b float-left">{props.translate("address.my_balance") || "My balance"}</h4>
            <span onClick={props.toggleZeroBalance}>
              <a className="p-3">
                {props.showZeroBalance ? "Hide small balances" : "Show all balances"}
              </a>
            </span>
            <p title={total} className="float-right font-w-b">
              <span className="text-success text-uppercase">{props.translate("address.total") || "Total"}</span>
              <span className="font-s-up-1 ml-2">{roundingTotal}</span> USD
            </p>
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