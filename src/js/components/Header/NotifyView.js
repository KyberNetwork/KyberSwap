
import React from "react"

const Notify = (props) => {
  var classNotify = ""
  var counter = ""
  if (props.transactionsNum !== 0){
    counter = <span class="counter">{props.transactionsNum}</span>
  }else{
    classNotify = "empty"
  }  
  return(
    <div class="column small-2 text-right">
      <a class="notifications-toggle" href="#notifications" onClick={(e)=>props.displayTransactions(e)}>
        <img src="/assets/img/menu.svg"/>{counter}
      </a>
      <ul className = {"notifications hide animated fadeIn " + classNotify}>
        {props.transactions} 
        {/* <li><a class="pending" href="https://etherscan.io/tx/0x031bcfded7d6100ee32b0369c78b3791780e6a4a0e05b40a929426964569d086" target="_blank">
              <div class="title"><span class="amount">0.123456 ETH&nbsp;</span>for<span class="amount">&nbsp;12.345678 KNC</span></div>
              <div class="link">0xe7e52f01 ... d8be12</div>
            </a>
        </li>
        <li><a class="success" href="https://etherscan.io/tx/0x031bcfded7d6100ee32b0369c78b3791780e6a4a0e05b40a929426964569d086" target="_blank">
              <div class="title"><span class="amount">0.123456 ETH&nbsp;</span>for<span class="amount">&nbsp;12.345678 KNC</span></div>
              <div class="link">0xe7e52f01 ... d8be12</div>
            </a>
        </li>
        <li><a class="failed" href="https://etherscan.io/tx/0x031bcfded7d6100ee32b0369c78b3791780e6a4a0e05b40a929426964569d086" target="_blank">
              <div class="title"><span class="amount">0.123456 ETH&nbsp;</span>for<span class="amount">&nbsp;12.345678 KNC</span></div>
              <div class="link">0xe7e52f01 ... d8be12</div>
              <div class="reason">Out of gas or Bad jump destination</div>
            </a>
        </li> */}
      </ul>
    </div>


    // <div>
    //   <div>
    //     <a onClick={props.displayTransactions}>Notify ({props.transactionsNum})</a>
    //   </div>
    //   <div className="transaction">
    //     {props.displayTrans ? props.transactions : ''}    
    //   </div>
    // </div>
  )
}

export default Notify