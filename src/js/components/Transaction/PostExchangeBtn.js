import React from "react"
import { PendingOverlay } from "../../components/CommonElement"

const PostExchangeBtn = (props) => {
  return (
    <div className="bg-primary py-4">
      {props.step == 2 ?
        <div className="row small-11 medium-12 large-12">
          <div class="column transaction-footer">
            <div class="small-12 medium-4 text-center mx-auto">
              {props.rateToken}
              <a class={props.className} onClick={props.submit} data-open="passphrase-modal">{props.translate("transaction.exchange") || "Exchange"}</a>
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
