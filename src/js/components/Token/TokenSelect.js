import React from "react"

const TokenSelect = (props) => {  
  return (
   <div onClick={(e) => props.onClick(e, props.symbol, props.address, props.type)}>
   	<span>{props.symbol}</span>
   	<img src={props.icon} />
   	<span>{props.balance}</span>
   </div>
  )
}

export default TokenSelect
