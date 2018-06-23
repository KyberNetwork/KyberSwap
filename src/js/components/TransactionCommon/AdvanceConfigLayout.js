
import React from "react"

const AdvanceConfigLayout = (props) => {

  var toggleShowAdvance = (e) => {
    var advanceContent = document.getElementById("advance-content");
    if (advanceContent.className === "show-advance") {
        advanceContent.className = "";
    } else {
        advanceContent.className = "show-advance";
    }
  }
  return (
    <div className="advance-config">
      <div className="title advance-title-desktop">Advanced</div>
      <div className="advance-title-mobile title" onClick={(e) => toggleShowAdvance()}>
        <div>
          Advanced
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