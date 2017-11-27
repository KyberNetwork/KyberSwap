import React from "react"

const PendingOverlay = (props)=> {
  return (
    <div>
      {props.isEnable ? <div id="waiting" class="pending"></div> : ''}
    </div>
  )
  
}
export default PendingOverlay