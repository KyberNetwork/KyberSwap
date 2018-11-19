import React from "react"
import { PendingOverlay } from "../../components/CommonElement"

const PostExchangeBtn = (props) => {
  return (
    <div className="exchange-wrapper-btn">
      <div>
        {props.isHaveAccount && !props.isChangingWallet &&
          <div>
            <a className={props.className} onClick={props.submit} data-open="passphrase-modal">
              {props.translate("transaction.swap") || "Swap"}
            </a>
          </div>
        }
      </div>
      {props.modalExchange}
      <PendingOverlay isEnable={props.isConfirming || props.isApproving}/>
    </div>
  )
}

export default PostExchangeBtn
