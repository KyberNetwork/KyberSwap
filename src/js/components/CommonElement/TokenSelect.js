import React from "react"
import {toT, displayBalance} from "../../utils/converter"

const TokenSelect = (props) => {  
  var handleOnClick = (e) => {
    if(props.inactive){
      e.preventDefault();
    } else {
      props.onClick(e, props.symbol, props.address, props.type)
    }
  }
  return (
    <div class="column gutter-15">
      <a className={"token-stamp " + (props.inactive? "empty": (props.selected?"selected":""))} onClick={(e)=> {handleOnClick(e)}}>
        <img src={props.icon}/><span class="name">{props.name}</span>
        <div class="balance" title={displayBalance(props.balance, props.decimal)}>{displayBalance(props.balance, props.decimal ,8)}</div>
      </a>
    </div>
  )
}

export default TokenSelect
