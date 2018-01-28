import React from "react"

const ProcessingModal = (props) => {
  return (
    <div>{props.isEnable ?
      <div id="waiting" class={props.checkTimeImportLedger ? 'ledger' : ''}>
        <div class="caption">
          {props.translate("transaction.processing") || "Processing"}
          {props.checkTimeImportLedger ?
            <div>
              Please make sure: <br />
              <div class="text-left">
                - Your Ledger is properly plugged in.<br />
                - You have logged into your Ledger.<br />
              </div>
            </div>
            : ''}

        </div>
      </div>
      : ''}
    </div>
  )

}
export default ProcessingModal