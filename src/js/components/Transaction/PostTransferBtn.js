import React from "react"
import { PendingOverlay } from "../../components/CommonElement"

const PostTransferBtn = (props) => {

  return (
    <div>
      {props.isHaveAccount && !props.isChangingWallet &&
        <a className={'submit-transfer ' + props.className} data-open="passphrase-modal" onClick={props.submit}>
          {props.translate("transaction.transfer") || "Transfer"}
        </a>
      }
      {props.modalPassphrase}
      <PendingOverlay isEnable={props.isConfirming} />
    </div>
  )
}

export default PostTransferBtn
