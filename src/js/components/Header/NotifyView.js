
import React from "react"

const Notify = (props) => {
  return(
    <div>
      <div>
        <a onClick={props.displayTransactions}>Notify ({props.transactionsNum})</a>
      </div>
      <div className="transaction">
        {props.displayTrans ? props.transactions : ''}    
      </div>
    </div>
  )
}

export default Notify