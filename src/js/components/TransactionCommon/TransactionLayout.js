import React from "react"

const TransactionLayout = (props) => {
  return (
    <div>
        {props.balance}
        {props.content}
        {props.advance}
    </div>
  )
}

export default TransactionLayout
