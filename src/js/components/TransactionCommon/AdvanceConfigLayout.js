
import React from "react"

const AdvanceConfigLayout = (props) => {

  var toggleShowAdvance = (e) => {
    var advanceContent = document.getElementById("advance-content");
    var advanceArrow = document.getElementById("advance-arrow");
    if (advanceContent.className === "show-advance") {
        advanceContent.className = "";
        advanceArrow.className = "";
    } else {
        advanceContent.className = "show-advance";
        advanceArrow.className = "advance-arrow-up";
    }
  }
  return (
    <div className="advance-config">
      <div className="title advance-title-desktop">{props.translate("transaction.advanced") || "Advanced"}</div>
      <div className="advance-title-mobile title" onClick={(e) => toggleShowAdvance()}>
        <div>
          {props.translate("transaction.advanced") || "Advanced"}
          <img src={require("../../../assets/img/exchange/arrow-down-swap.svg")} id="advance-arrow"/>
        </div>        
      </div>
      <div id="advance-content">
        <div className="advance-content">
          <div>
              {props.minRate}
          </div>
          <div>
              {props.gasConfig}
          </div>
        </div>
      </div>
    </div>
  )
}
export default AdvanceConfigLayout