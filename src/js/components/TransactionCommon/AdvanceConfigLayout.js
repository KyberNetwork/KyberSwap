import React from "react"

const AdvanceConfigLayout = (props) => {
  return (
    <div className="advance-config">
      <div className="title advance-title-desktop">{props.translate("transaction.advanced") || "Advanced"}</div>
      <div id="advance-content">
        <div className="advance-content">
          <div>{props.minRate}</div>
          <div>{props.gasConfig}</div>
        </div>
      </div>
    </div>
  )
}

export default AdvanceConfigLayout
