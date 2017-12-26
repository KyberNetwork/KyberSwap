import React from "react"
import * as converts from "../../utils/converter"

const AccountBalanceView = (props) => {

  function getBalances(){
    var balances = Object.values(props.tokens).map(token => {
      var balance = converts.toT(token.balance, token.decimal)
      return (
        <div key={token.symbol}>
          <div><img src={require("../../../assets/img/tokens/" + token.icon)} /></div>
          <div>
            <div>{token.symbol}</div>
            <div title={balance}>{converts.roundingNumber(balance)}</div>
          </div>
        </div>
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
      <div>
        <span>My balance</span>
        <span title = {total}>Total: {roundingTotal} USD</span>
      </div>
      <div>
        {getBalances()}
      </div>
    </div>
  )
}

export default AccountBalanceView