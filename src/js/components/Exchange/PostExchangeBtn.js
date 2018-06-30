import React from "react"
import { PendingOverlay } from "../../components/CommonElement"

const PostExchangeBtn = (props) => {
  return (
    <div className="exchange-wrapper-btn">
      <div>
        <div>
          <a class={props.className} onClick={props.submit} data-open="passphrase-modal">{props.translate("transaction.swap") ||  "Swap" }</a>
        </div>
          {props.rateToken}
      </div>      
      
      {props.modalPassphrase}
      {props.modalConfirm}
      {props.modalApprove}
      <PendingOverlay isEnable={props.isConfirming || props.isApproving} />
    </div >
  )
}

export default PostExchangeBtn
