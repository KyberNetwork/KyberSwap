import React from "react"
import { PendingOverlay } from "../../components/CommonElement"

const PostTransferBtn = (props) => {

  return (
    <div className="frame">
      {props.step !== 2 ?
        <div class="row">
          <div className="transaction-footer">
            <div className="column small-11 medium-4 large-4">
              {props.termAndServices}
            </div>

            <div class="column small-11 medium-4 large-4 text-center">
              <a className={'submit-transfer ' + props.className} data-open="passphrase-modal" onClick={props.submit}>{props.translate("transaction.transfer") || "Transfer"}</a>
            </div>

            <div className="column small-11 medium-4 large-4">
              <div class="clearfix">
                <div class="advanced-switch base-line float-right">
                  <label class="switch-caption" for="advanced">{props.translate("transaction.advanced") || "Advance"}</label>
                  <div class="switch accent">
                    <input class="switch-input" id="advanced" type="checkbox" />
                    <label class="switch-paddle" for="advanced"><span class="show-for-sr">Advanced Mode</span></label>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
        :
        <div class="row">
          <div class="column small-11 medium-10 large-9 small-centered text-center">
            <a className={'submit-transfer ' + props.className} data-open="passphrase-modal" onClick={props.submit}>{props.translate("transaction.transfer") || "Transfer"}</a>
          </div>
        </div>
      }
      {props.modalPassphrase}
      <PendingOverlay isEnable={props.isConfirming} />
    </div>
  )
}

export default PostTransferBtn
