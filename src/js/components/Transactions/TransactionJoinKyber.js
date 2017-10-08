import React from "react"

const TransactionJoinKyber = (props) => {  
  return (
    <div id="tx-modal">
      <div class="modal-title">
        <div class="left">
          <i class="k-icon k-icon-tx"></i>
          Transaction Details
        </div>
        <div class="right">
          <button onClick={props.click}>
            <i class="k-icon k-icon-close"></i>
          </button>                
        </div>
      </div>
      <div class="modal-info">
        <div>
          <label>Nonce</label>
          <span id="nonce">{props.data.nonce}</span>
        </div>
         <div>
          <label>Hash</label>
          <span id="hash">
            <a href={"https://kovan.etherscan.io/tx/" + props.data.hash}>
              {props.data.hash}
            </a>
          </span>
        </div>
        <div>
          <label>From</label>
          <span>
            <span id="from">
              {props.data.from}
            </span>
          </span>
        </div>             
      </div>
      <div class="modal-detail">
        <div class="row">
          <div class="item">
            <label>Gas Price</label>
            <span>{props.data.gasPrice} Gwei</span>
          </div>               
          <div class="item">
            <label>Gas</label>
            <span>{props.data.gas}</span>
          </div>
        </div>              
      </div>
    </div>
  )
}

export default TransactionJoinKyber
