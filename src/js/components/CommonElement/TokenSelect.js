import React from "react"
import {toT} from "../../utils/converter"

const TokenSelect = (props) => {  
  var handleOnClick = (e) => {
    if(props.inactive){
      e.preventDefault();
    } else {
      props.onClick(e, props.symbol, props.address, props.type)
    }
  }
  console.log(props.name)
  return (
    // <div class="column gutter-15"><a class="token-stamp selected" href="#"><img src="/assets/img/eth.svg"/><span class="name">Ethereum</span>
    // <div class="balance">12.345678</div></a></div>


    <div class="column gutter-15">
      <a class={"token-stamp " + (props.inactive? "empty": (props.selected?"selected":""))} href="#" onClick={(e)=> {handleOnClick(e)}}>
        <img src="/assets/img/eth.svg"/><span class="name">{props.name}</span>
        <div class="balance">{toT(props.balance, 8)}</div>
      </a>
    </div>




  //  <div onClick={(e) => {
  //   if(props.inactive){
  //     e.preventDefault();
  //   } else {
  //     props.onClick(e, props.symbol, props.address, props.type)
  //   }
  //    }}>
  //  	<span>{props.symbol}</span>
  //  	<img src={props.icon} />
  //  	<span>{props.balance}</span>
  //  </div>
  )
}

export default TokenSelect
