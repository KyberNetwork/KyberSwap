import React from "react"

const ProcessingModal = (props)=> {
  return (
    <div>{props.isEnable? 
        <div id="waiting">
          <div class="caption">Processing</div>
        </div> : ''}
    </div>
  )
  
}
export default ProcessingModal