import React from "react"
import { PendingOverlay } from "../../components/CommonElement"

const PostExchangeBtn = (props) => {
  return (
    <div className="py-4">
      <div className="small-11 medium-12 large-12">
        <div class="column transaction-footer">
          <div class="small-12 text-center mx-auto">
            <a class={props.className} onClick={props.submit} data-open="passphrase-modal">Swap</a>
            {props.rateToken}
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
