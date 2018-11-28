import React from "react"

const FeeDetail = (props) => {
  return (
    <div className="gas-configed">
      <div className={"title-fee"}>{props.translate("transaction.transaction_fee") || 'Transaction Fee'}</div>
      <div className={"total-fee"}>
        {props.totalGas.toString()} <span>ETH</span>
      </div>
      <div className={"fee-detail"}>
        {props.gasPrice} Gwei (Gas Price) * {props.gas} (Gas Limit)
      </div> 
    </div>
  )
}

export default FeeDetail
