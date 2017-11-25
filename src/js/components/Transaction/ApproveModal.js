import React from "react"

const ApproveModal = (props) => {
  return (
    <div>
      <div class="title text-center">ETH token exchange</div>
      <a className="x" onClick={(e) => props.onCancel(e)}>&times;</a>
      <div class="content with-overlap">
        <div class="row">
          <div class="column">
            <center>
              <p class="message">Kyber need your approve to do exchange with&nbsp;<strong>ETH</strong>&nbsp;on your Trezor address. Press&nbsp;<strong>Apprrove</strong>&nbsp;button below to open Trezor utility.</p>
            </center>
          </div>
        </div>
      </div>
      <div class="overlap">
        <a className={"button accent submit-approve " + (props.isApproving ? "waiting" : "")}
          onClick={(e) => props.onSubmit(e)}
        >Approve</a>
      </div>
    </div>
  )
}

export default ApproveModal
