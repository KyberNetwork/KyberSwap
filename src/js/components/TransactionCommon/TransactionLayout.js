import React from "react"
import { Link } from 'react-router-dom'
import constansts from "../../services/constants"


const TransactionLayout = (props) => {
  var gotoRoot = (e) => {
    // if (props.currentLang === 'en') {
    //   window.location.href = "/"
    // } else {
    //   window.location.href = `/?lang=${props.currentLang}`
    // }
  }
  var transfer = props.translate("transaction.transfer") || "Transfer"
  var swap = props.translate("transaction.swap") || "Swap"
  return (
    <div class="frame exchange-frame">
      <div className="swap-navigation">        
        <div>
          <a onClick={(e)=>gotoRoot(e)}>{props.translate("home") || "Home"}</a>
        </div>
        <div className="seperator">/</div>
        <div>
          <Link onClick={(e) => props.endSession(e)} to={constansts.BASE_HOST }>KyberSwap</Link>
        </div>
        <div className="seperator">/</div>
        <div className="active">
          <a>{props.page === "exchange" ? swap : transfer}</a>
        </div>
      </div>
      <h1 class="title frame-tab">
        <div className="back-home" onClick={(e) => props.endSession(e)}>
          <img src={require("../../../assets/img/arrow_left.svg")} className="back-arrow"/>
          <span>{props.translate("transaction.back") || "Back"}</span>
        </div>
        <div className="switch-button">
          <Link to={constansts.BASE_HOST + "/swap/eth_knc"} className={props.page === "exchange" ? "disable" : ""}>{swap}</Link>
          <Link to={constansts.BASE_HOST + "/transfer/eth"} className={props.page === "transfer" ? "disable" : ""}>{transfer}</Link>
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
