
import React from "react"

const AdvanceConfigLayout = (props) => {
  return (
    <div className="advance-config large-2">
      <h2>Advanced</h2>
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