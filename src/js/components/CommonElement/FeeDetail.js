import React from "react"
import {calculateGasFee} from "../../utils/converter"

const FeeDetail = (props) => {
  var totalGas = +calculateGasFee(props.gasPrice, props.gas)
  return (
    <div className="gas-configed">
      <div className={"title-fee"}>{props.translate("transaction.transaction_fee") || 'Transaction Fee'}</div>
      <div className={"total-fee"}>
        {totalGas.toString()} <span>ETH</span>
      </div>
      <div className={"fee-detail"}>
        {props.gasPrice} Gwei (Gas Price) * {props.gas} (Gas Limit)
      </div> 
    </div>
  )
}

export default FeeDetail
