import React from "react"

const PendingOverlay = (props)=> {
  return (
      props.isEnable ? <div id="waiting" class="pending"></div> : ''
  )
  
}
export default PendingOverlay