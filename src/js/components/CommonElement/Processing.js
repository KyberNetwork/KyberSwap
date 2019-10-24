import React from "react"

const ProcessingModal = (props) => {
  return (
    <div>
      {props.isEnable &&
        <div id="waiting" class={props.checkTimeImportLedger ? 'ledger' : ''}>
          <div class="caption">
            {props.translate("transaction.processing") || "Processing"}
            <div>
              {props.checkTimeImportLedger ?
                <React.Fragment>
                  {props.translate("error.please_make_sure") || "Please make sure"}: <br />
                  <div class="ledger-error-des">
                  {props.translate("error.ledger_plugged_in") || "- Your Ledger is properly plugged in."}<br />
                  {props.translate("error.ledger_logged_in") || "- You have logged into your Ledger."}<br />
                  </div>
                </React.Fragment>
              : ''}
            </div>
          </div>
        </div>
      }
    </div>
  )

}
export default ProcessingModal
