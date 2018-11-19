import React from "react";
import SlideDown, { SlideDownTrigger, SlideDownContent } from "../CommonElement/SlideDown";

const AdvanceConfigLayout = (props) => {
  return (
    <SlideDown active={props.isBalanceActive}>
      <SlideDownTrigger onToggleContent={() => props.toggleBalanceContent()}>
        <div className="slide-down__trigger-container slide-down__trigger-container--align-right">
          <div>
            <span className="slide-down__trigger-bold">Advance - </span>
            <span className="slide-down__trigger-light">Optional</span>
          </div>
          <div className="slide-arrow-container">
            <div className="slide-arrow"></div>
          </div>
        </div>
      </SlideDownTrigger>

      <SlideDownContent>
        <div className="advance-config">
          <div className="title advance-title-desktop">{props.translate("transaction.advanced") || "Advanced"}</div>
          <div id="advance-content">
            <div className="advance-content">
              <div>{props.minRate}</div>
              <div>{props.gasConfig}</div>
            </div>
          </div>
        </div>
      </SlideDownContent>
    </SlideDown>
  )
}

export default AdvanceConfigLayout
