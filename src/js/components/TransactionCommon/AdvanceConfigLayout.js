
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
      <div className="title hide-for-small-only">
        Advanced
      </div>
      <div className="advance-title-mobile title show-for-small-only" onClick={(e) => toggleShowAdvance()}>
        <div>
          Advanced
          <img src={require("../../../assets/img/exchange/arrow-down-swap.svg")}/> 
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