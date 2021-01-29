import React from "react"
import ReactTooltip from "react-tooltip";
import { calculateGasFee } from "../../utils/converter";

const FeeDetail = (props) => {
  const totalGas = props.totalGas ? props.totalGas : +calculateGasFee(props.gasPrice, props.gas);

  return (
    <div className="gas-configed theme__text-4">
      <div className={"title-fee theme__text-5"}>
        {props.translate("transaction.transaction_fee") || 'Max Transaction Fee'}
        <span className="common__info-icon" data-tip={props.translate("info.max_gas_fee")} data-for="max-gas-info">
          <img src={require('../../../assets/img/common/blue-indicator.svg')} alt=""/>
        </span>
        <ReactTooltip className="common__tooltip" place="top" id="max-gas-info" type="light"/>
      </div>
      <div className={"total-fee"}>
        <span className={"total-fee__number theme__text"}>{totalGas.toString()} ETH</span>
        <span className={"total-fee__formula theme__text-6"}>{props.gasPrice} Gwei (Gas Price) * {props.gas} (Gas Limit)</span>
      </div>
      {(props.reserveRoutingEnabled && props.reserveRoutingChecked) && (
        <div className="fee-info">{props.translate("info.reserve_routing_used")}</div>
      )}
    </div>
  )
}

export default FeeDetail
