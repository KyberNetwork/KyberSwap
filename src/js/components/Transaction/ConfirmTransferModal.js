import React from "react"

const ConfirmTransferModal = (props) => {
  return (
    <div>
      <div className="title text-center">{props.title}</div>
      <a className="x" onClick={(e) => props.onCancel(e)}>&times;</a>
      <div className="content with-overlap">
        <div className="row">
          <div className="column">
            <center>
              {props.recap}
              {props.isConfirming ? (
                  <p>{props.translate("modal.waiting_for_confirmation") || "Waiting for confirmation from your wallet"}</p>
                )
                :(
                  <p>{props.translate("modal.press_confirm_if_really_want") || "Press confirm to continue"}</p>
                )
              }
              
            </center>
          </div>
        </div>
      </div>
      <div className="overlap">
        <a className={"button accent process-submit " + (props.isConfirming ? "waiting" : "next")} onClick={(e) => props.onExchange(e)}>{props.translate("modal.confirm") || "Confirm"}</a>
      </div>
    </div>
  )
}

export default ConfirmTransferModal
