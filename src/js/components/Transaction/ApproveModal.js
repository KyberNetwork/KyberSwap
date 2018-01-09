import React from "react"

const ApproveModal = (props) => {
  return (
    <div>
      <div class="title text-center">{props.translate("modal.eth_token_exchange") || "ETH token exchange"}</div>
      <a className="x" onClick={(e) => props.onCancel(e)}>&times;</a>
      <div class="content with-overlap">
        <div class="row">
          <div class="column">
            <center>
              <p class="message">
              {props.translate('modal.approve_exchange', {token : props.token} ) || <span>You need to grant permission for Kyber Wallet to interact with  {props.token} on this address.</span>}
              </p>
            </center>
          </div>
        </div>
      </div>
      <div class="overlap">
        <a className={"button accent submit-approve " + (props.isApproving ? "waiting" : "")}
          onClick={(e) => props.onSubmit(e)}
        >{props.translate("modal.approve") || "Approve"}</a>
      </div>
    </div>
  )
}

export default ApproveModal
