import React from "react"
import { gweiToEth, stringToBigNumber } from "../../utils/converter";

const ConfirmTransferModal = (props) => {
  var gasPrice = stringToBigNumber(gweiToEth(props.gasPrice))
  var totalGas = gasPrice.mul(props.gas)
  return (
    <div>
      <div className="title text-center">{props.title}</div>
      <a className="x" onClick={(e) => props.onCancel(e)}>&times;</a>
      <div className="content with-overlap">
        <div className="row">
          <div className="column">
            <center>
              {props.recap}
              <div className="gas-configed text-light text-center">
                <div className="row">
                  <p className="column small-6">Gas Price</p>
                  <p className="column small-6">{props.gasPrice} Gwei</p>
                </div>
                <div className="row">
                  <p className="column small-6">{props.translate("transaction.transaction_fee") || "Transaction Fee"}</p>
                  <p className="column small-6">{props.isFetchingGas ?
                    <img src={require('../../../assets/img/waiting-white.svg')} /> 
                    : <span>{totalGas.toString()}</span>
                  } ETH</p>
                </div>
                <hr className="mt-0" />
              </div>
              {props.isConfirming ? (
                <p>{props.translate("modal.waiting_for_confirmation") || "Waiting for confirmation from your wallet"}</p>
              )
                : (
                  <p>{props.translate("modal.press_confirm_if_really_want") || "Press confirm to continue"}</p>
                )
              }
            </center>
            {props.errors ? (
              <div className="ledger-error">
                {props.errors}
              </div>
              ): ''
            }
          </div>
        </div>
      </div>
      <div className="overlap">
        <a className={"button accent process-submit " + (props.isConfirming || props.isFetchingGas ? "waiting" : "next")} onClick={(e) => props.onExchange(e)}>{props.translate("modal.confirm") || "Confirm"}</a>
      </div>
    </div>
  )
}

export default ConfirmTransferModal
