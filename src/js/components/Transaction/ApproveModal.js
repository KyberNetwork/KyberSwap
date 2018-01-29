import React from "react"

const ApproveModal = (props) => {
  return (
    <div>
      <div className="title text-center">{props.translate("modal.eth_token_exchange") || "ETH token exchange"}</div>
      <a className="x" onClick={(e) => props.onCancel(e)}>&times;</a>
      <div className="content with-overlap">
        <div className="row">
          <div className="column">
            <center>
              <p className="message">
                {props.translate('modal.approve_exchange', { token: props.token, address: props.address }) || 
                <span>You need to grant permission for Kyber Wallet to interact with  {props.token} on address {props.address}.</span>}
              </p>
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
        <a className={"button accent submit-approve " + (props.isApproving ? "waiting" : "next")}
          onClick={(e) => props.onSubmit(e)}
        >{props.translate("modal.approve") || "Approve"}</a>
      </div>
    </div>
  )
}

export default ApproveModal
