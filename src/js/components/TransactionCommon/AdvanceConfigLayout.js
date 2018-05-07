
import React from "react"

const AdvanceConfigLayout = (props) => {
  return (
    <div className="advance-config">
      <div>Advanced</div>
      <div>
          {props.minRate}
      </div>
      <div>
          {props.gasConfig}
      </div>
    </div>
  )
}
export default AdvanceConfigLayout