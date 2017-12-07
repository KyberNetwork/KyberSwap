import React from "react"
import { connect } from "react-redux"
import {pickRandomProperty} from "../../utils/tokens"
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
      />
    )
  }
}
