import React from "react"
import { PendingOverlay } from "../../components/CommonElement"

const PostTransferBtn = (props) => {

  return (
    <div className="bg-primary py-4">
      {props.step !== 2 ?
        <div class="row small-11 medium-12 large-12">
          <div className="column transaction-footer">
            <div className="small-12 medium-4 text-center mx-auto">
              <a className={'submit-transfer ' + props.className} data-open="passphrase-modal" onClick={props.submit}>{props.translate("transaction.transfer") || "Transfer"}</a>
            </div>

            <div className="adv-btn">
              <div class="clearfix">
                <div class="advanced-switch base-line float-right">
                  <label class="switch-caption" for="advanced">{props.translate("transaction.advanced") || "Advance"}</label>
                  <div class="switch accent">
                    <input class="switch-input" onChange={props.openConfig} id="advanced" type="checkbox" checked={props.advanced ? true : false} />
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
