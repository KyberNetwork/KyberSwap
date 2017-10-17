import React from "react"
import { connect } from "react-redux"

//import TokenDest from "./TokenDest"
//import {TokenDest, MinRate} from "../ExchangeForm"
//import Token from "../Exchange"
import {pickRandomProperty} from "../../utils/tokens"
//import SUPPORTED_TOKENS from "../../services/supported_tokens"

@connect((store, props) => {
  return {
      type: props.type,     
      tokens:store.tokens,
      symbol: props.token,
      onSelected: props.onSelected
    } 
})

export default class Token extends React.Component {
  render() {  	
    //console.log(pickRandomProperty(this.props.tokens))
    //var token = !!this.props.symbol?this.props.tokens[this.props.symbol]: this.props.tokens[pickRandomProperty(this.props.tokens)]
    var token = this.props.tokens[this.props.symbol]
  	var balance = this.props.type === 'source'?(<div>Address Balance: <span>{token.balance.toString()}</span></div>):''
  	
    return (
      <div>
      	<div onClick={this.props.onSelected}>
	      	<img src={token.icon} />
	      	<span>{token.symbol}</span>
      	</div>      	
      	{balance}
      </div>
    )
  }
}
