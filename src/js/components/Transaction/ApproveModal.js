import React from "react"
import { gweiToEth, stringToBigNumber } from "../../utils/converter";

const ApproveModal = (props) => {
  var gasPrice = stringToBigNumber(gweiToEth(props.gasPrice))
  var totalGas = gasPrice.mul(props.gas)
  return (
    <div>
      <div class="title text-center">{props.translate("modal.eth_token_exchange") || "ETH token exchange"}</div>
      <a className="x" onClick={(e) => props.onCancel(e)}>&times;</a>
      <div class="content with-overlap">
        <div class="row">
          <div class="column">
            <center>
              <p class="message">
                {props.translate('modal.approve_exchange', { token: props.token, address: props.address })
                  || <span>You need to grant permission for Kyber Wallet to interact with  {props.token} on address {props.address}.</span>}
              </p>

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


            </center>
          </div>

        </div>
      </div>
      <div class="overlap">
        <a className={"button accent submit-approve " + (props.isApproving ? "waiting" : "next")}
          onClick={(e) => props.onSubmit(e)}
        >{props.translate("modal.approve") || "Approve"}</a>
      </div>
    </div>
  )
}

export default ApproveModal
