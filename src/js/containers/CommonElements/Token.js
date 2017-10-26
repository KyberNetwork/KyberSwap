import React from "react"
import { connect } from "react-redux"

//import TokenDest from "./TokenDest"
//import {TokenDest, MinRate} from "../ExchangeForm"
//import Token from "../Exchange"
import {toT} from "../../utils/converter"
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
    //console.log(this.props.symbol)
    //console.log(this.props.tokens)
    var tokenRender
    var token = this.props.tokens[this.props.symbol]
    if (token){
      if(this.props.type == 'transfer'){
        return (
          <label>Select Token
            <div onClick={this.props.onSelected} class="token-select" data-open="transfer-from-token-modal"><img src="/assets/img/omg.svg"/><span class="name">{token.name}</span></div>
          </label>
  
          // <div>
          //   <div onClick={this.props.onSelected}>
          //     <img src={token.icon} />
          //     <span>{token.symbol}</span>
          //   </div>      	
          //   {balance}
          // </div>
        )
      } else if(this.props.type == 'source'){
        var balance = this.props.type === 'source'?(<div>Address Balance: <span>{toT(token.balance, 8)}</span></div>):''
        return (
          <div class="info" onClick={this.props.onSelected} data-open="exchange-from-token-modal"><img src="/assets/img/eth.svg"/><span class="name">{this.props.symbol}</span></div>
        )
      } else if(this.props.type == 'des'){
        return (
          <div class="info" onClick={this.props.onSelected} data-open="exchange-to-token-modal"><img src="/assets/img/omg.svg"/><span class="name">{this.props.symbol}</span></div>
        )
      }
      
    }
  	  	
    return (
      <div>
        {tokenRender}
      </div>      
    )
  }
}
