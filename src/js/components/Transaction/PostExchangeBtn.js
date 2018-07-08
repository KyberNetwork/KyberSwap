import React from "react"
import { PendingOverlay } from "../../components/CommonElement"

const PostExchangeBtn = (props) => {
  return (
    <div className="bg-primary py-4">
      <div className="row small-11 medium-12 large-12">
        <div class="column transaction-footer">
          <div class="small-12 medium-4 text-center mx-auto">
            {props.rateToken}
            <a class={props.className} onClick={props.submit} data-open="passphrase-modal">{props.translate("transaction.exchange") || "Exchange"}</a>
          </div>
        </div>
      </div>      
      
      {props.modalPassphrase}
      {props.modalConfirm}
      {props.modalApprove}
      <PendingOverlay isEnable={props.isConfirming || props.isApproving} />
    </div >
  )
}

export default PostExchangeBtn
