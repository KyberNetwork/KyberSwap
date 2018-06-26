import React from "react"
import { Link } from 'react-router-dom'
import constansts from "../../services/constants"


const TransactionLayout = (props) => {
  var gotoRoot = (e) => {
    window.location.href = "/"
  }
  return (
    <div class="frame">
      <div className="swap-navigation">        
        <div>
          <a onClick={(e)=>gotoRoot(e)}>{props.translate("home") || "Home"}</a>
        </div>
        <div className="seperator">/</div>
        <div>
          <Link to={constansts.BASE_HOST }>KyberSwap</Link>
        </div>
        <div className="seperator">/</div>
        <div className="active">
          <a>{props.page === "exchange" ? "Swap": "Transfer"}</a>
        </div>
      </div>
      <h1 class="title frame-tab">
        <div className="back-home" onClick={(e) => props.endSession(e)}>
          <img src={require("../../../assets/img/arrow_left.svg")} className="back-arrow"/>
          <span>{props.translate("transaction.back") || "Back"}</span>
        </div>
        <div className="switch-button">
          <Link to={constansts.BASE_HOST + "/swap"} className={props.page === "exchange" ? "disable" : ""}>{props.translate("transaction.swap") || "Swap"}</Link>
          <Link to={constansts.BASE_HOST + "/transfer"} className={props.page === "transfer" ? "disable" : ""}>{props.translate("transaction.transfer") || "Transfer"}</Link>
        </div>
      </h1>
      <div className="row">
        {props.content}
        {/* <div className="columns large-9 frame-left">
          {props.content}          
        </div>
        <div className="columns large-3 frame-right">
          {props.advance}
        </div> */}
      </div>
    </div>
  )
}

export default TransactionLayout
