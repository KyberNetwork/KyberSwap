import React from "react"
import { Link } from 'react-router-dom'

const TransactionLayout = (props) => {
  return (
    <div class="frame">
      <h1 class="title">
        <Link to="/exchange" className= {props.location === "/exchange"?"disable":""}>{props.translate("transaction.exchange") || "Exchange"}</Link>
        <Link to="/transfer" className= {props.location === "/transfer"?"disable":""}>{props.translate("transaction.transfer") || "Transfer"}</Link>
      </h1>
      <div>
          {props.balance}
          {props.content}
          {props.advance}
      </div>
    </div>
  )
}

export default TransactionLayout
