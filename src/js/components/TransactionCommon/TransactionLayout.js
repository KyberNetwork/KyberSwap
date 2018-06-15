import React from "react"
import { Link } from 'react-router-dom'
import constansts from "../../services/constants"


const TransactionLayout = (props) => {
  return (
    <div class="frame">
      <h1 class="title frame-tab">
        <div>
          <Link to={constansts.BASE_HOST + "/exchange"} className={props.page === "exchange" ? "disable" : ""}>{props.translate("transaction.exchange") || "Exchange"}</Link>
          <Link to={constansts.BASE_HOST + "/transfer"} className={props.page === "transfer" ? "disable" : ""}>{props.translate("transaction.transfer") || "Transfer"}</Link>
        </div>
      </h1>
      <div className="exchange-content row">
        <div className="columns large-10 frame-left">
          {props.content}
          {/* <div className="columns large-4">
            {props.balance}
          </div>
          <div className="columns large-8">
            {props.content}
          </div> */}
        </div>
        <div className="columns large-2 frame-right">
          {props.advance}
        </div>
      </div>
    </div>
  )
}

export default TransactionLayout
