import React from "react"

const ApproveModal = (props) => {  
  return (
    <div>
      <div class="title text-center">ETH token exchange</div>
      <a class="x" onClick={(e) => props.onCancel(e)}>&times;</a>
      <div class="content with-overlap">
        <div class="row">
          <div class="column">
            <center>
              <p class="message">Kyber need your approve to do exchange with&nbsp;<strong>ETH</strong>&nbsp;on your Trezor address. Press&nbsp;<strong>Apprrove</strong>&nbsp;button below to open Trezor utility.</p>
            </center>
          </div>
        </div>
      </div>
      <div class="overlap"><a className = {props.isApproving?"button accent waiting": "button accent"} onClick={(e)=>props.onSubmit(e)}>Approve</a></div>
    </div>
    // <div>
    //     <div>{props.recap}</div>
    //     <button onClick={(e) => props.onCancel(e)}>Cancel</button>
    //     <button onClick={(e)=>props.onSubmit(e)}>Approve</button>
    //   </div>
  )
}

export default ApproveModal
