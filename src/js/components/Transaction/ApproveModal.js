import React from "react"

const ApproveModal = (props) => {  
  return (
    <div>
        <div>{props.recap}</div>
        <button onClick={(e) => props.onCancel(e)}>Cancel</button>
        <button onClick={(e)=>props.onSubmit(e)}>Approve</button>
      </div>
  )
}

export default ApproveModal
