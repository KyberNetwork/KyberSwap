import React from "react"
import { PendingOverlay } from "../../components/CommonElement"

const PostTransferBtn = (props) => {

  return (
    <div>        
        <a className={'submit-transfer ' + props.className} data-open="passphrase-modal" onClick={props.submit}>{props.translate("transaction.transfer") || "Transfer"}</a>

       {/* <div class="column small-11 medium-10 large-9 small-centered text-center">
          
        </div>

      {props.step !== 2 ?
        <div class="small-11 medium-12 large-12">
          <div className="column transaction-footer">
            <div className="small-12 medium-4 text-center mx-auto">
              <a className={'submit-transfer ' + props.className} data-open="passphrase-modal" onClick={props.submit}>{props.translate("transaction.transfer") || "Transfer"}</a>
            </div>           
          </div>
        </div>
        :
        <div>
          <div class="column small-11 medium-10 large-9 small-centered text-center">
            <a className={'submit-transfer ' + props.className} data-open="passphrase-modal" onClick={props.submit}>{props.translate("transaction.transfer") || "Transfer"}</a>
          </div>
        </div>
      } */}
      {props.modalPassphrase}
      <PendingOverlay isEnable={props.isConfirming} />
    </div>
  )
}

export default PostTransferBtn
