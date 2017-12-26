import React from "react"
import { PendingOverlay } from "../../components/CommonElement"

const PostExchangeBtn = (props) => {

  return (
    <div className="frame">
      {props.step == 2 ?
        <div class="row">
          <div className="transaction-footer">
            <div className="column small-11 medium-4 large-4">
              {props.termAndServices}
            </div>
            <div class="column small-11 medium-4 large-4 text-center">
              {/* {props.accountType === "keystore" && <p class="note">{props.translate("transaction.password_needed_exchange") || "Password is needed for each exchange transaction"}</p>}                     */}
              <a class={props.className} onClick={props.submit} data-open="passphrase-modal">{props.translate("transaction.exchange") || "Exchange"}</a>
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
          <div>
            <div class="column small-11 medium-4 large-4 small-centered text-center">
              {props.accountType === "keystore" && <p class="note">{props.translate("transaction.password_needed_exchange") || "Password is needed for each exchange transaction"}</p>}
              <a className={'submit ' + props.className} onClick={props.submit}>{props.translate("transaction.next") || "Next"}</a>
            </div>
          </div>
        </div>
      }
      {props.modalPassphrase}
      {props.modalConfirm}
      {props.modalApprove}
      <PendingOverlay isEnable={props.isConfirming || props.isApproving} />
    </div>
  )
}

export default PostExchangeBtn
