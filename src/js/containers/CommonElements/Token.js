import React from "react"
import { connect } from "react-redux"

//import TokenDest from "./TokenDest"
//import {TokenDest, MinRate} from "../ExchangeForm"
//import Token from "../Exchange"
import {toT} from "../../utils/converter"
import {pickRandomProperty} from "../../utils/tokens"
//import SUPPORTED_TOKENS from "../../services/supported_tokens"
import { TokenView } from "../../components/CommonElement"

@connect((store, props) => {  
  return {
      type: props.type,     
      tokens:store.tokens.tokens,
      symbol: props.token,
      onSelected: props.onSelected
    } 
})

export default class Token extends React.Component {
  render() {  	

    var token = this.props.tokens[this.props.symbol]  	
    return (
      <TokenView
        token={token}
        symbol={this.props.symbol}
        onSelected={this.props.onSelected}
        type={this.props.type}
        balance={toT(token.balance, 8)}
      />
    )
  }
}
