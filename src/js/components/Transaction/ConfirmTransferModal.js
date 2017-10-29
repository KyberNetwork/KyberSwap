import React from "react"

const ConfirmTransferModal = (props) => {  
  return (
    <div>
      <div class="title text-center">{props.type} Confirm</div>
      <a class="x" onClick={(e) => props.onCancel(e)}>&times;</a>
        <div class="content with-overlap">
          <div class="row">
            <div class="column">
              <center>
                {props.recap}
                {/* <p>You are about to exchange<br/><strong>1.234567 ETH</strong>&nbsp;for&nbsp;<strong>12.345678 KNC</strong></p> */}
                <p>Press confirm if you really want to do this.</p>
              </center>
            </div>
          </div>
        </div>
        <div class="overlap"><a className = {props.isConfirming?"button accent waiting": "button accent"} onClick={(e)=>props.onExchange(e)}>Confirm</a></div>
    </div>



    // <div>
    //   <div>{props.recap}</div>
    //   <button onClick={(e) => props.onCancel(e)}>Cancel</button>
    //   <button onClick={(e)=>props.onExchange(e)}>Exchange</button>
    // </div>
  )
}

export default ConfirmTransferModal
