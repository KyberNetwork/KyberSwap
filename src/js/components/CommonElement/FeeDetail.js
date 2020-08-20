import React from "react"
import { calculateGasFee } from "../../utils/converter"

const FeeDetail = (props) => {
  const totalGas = +calculateGasFee(props.gasPrice, props.gas);

  return (
    <div className="gas-configed theme__text-4">
      <div className={"title-fee theme__text-5"}>{props.translate("transaction.transaction_fee") || 'Transaction Fee'}</div>
      <div className={"total-fee"}>
        <span className={"total-fee__number theme__text"}>{totalGas.toString()} ETH</span>
        <span className={"total-fee__formula theme__text-6"}>{props.gasPrice} Gwei (Gas Price) * {props.gas} (Gas Limit)</span>
      </div>
    </div>
  )
}

export default FeeDetail
