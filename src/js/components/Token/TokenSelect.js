import React from "react"

const TokenSelect = (props) => {  
  return (
   <div onClick={props.onSelected}>
   	<span>{props.symbol}</span>
   	<img src={props.icon} />
   	<span>{props.balance}</span>
   </div>
  )
}

export default TokenSelect
