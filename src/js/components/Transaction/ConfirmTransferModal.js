import React from "react"

const ConfirmTransferModal = (props) => {  
  return (
    <div>
        <div>{props.recap}</div>
        <button onClick={(e) => props.onCancel(e)}>Cancel</button>
        <button onClick={(e)=>props.onExchange(e)}>Exchange</button>
      </div>
  )
}

export default ConfirmTransferModal
