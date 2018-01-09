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
              {/* <p>You are about to exchange<br/><strong>1.234567 ETH</strong>&nbsp;for&nbsp;<strong>12.345678 KNC</strong></p> */}
              <p>{props.translate("modal.press_confirm_if_really_want") || "Press confirm if you really want to do this."}</p>
            </center>
          </div>
        </div>
      </div>
      <div className="overlap">
        <a className={"button accent process-submit " + (props.isConfirming ? "waiting" : "")} onClick={(e) => props.onExchange(e)}>{props.translate("modal.confirm") || "Confirm"}</a>
      </div>
    </div>



    // <div>
    //   <div>{props.recap}</div>
    //   <button onClick={(e) => props.onCancel(e)}>Cancel</button>
    //   <button onClick={(e)=>props.onExchange(e)}>Exchange</button>
    // </div>
  )
}

export default ConfirmTransferModal
