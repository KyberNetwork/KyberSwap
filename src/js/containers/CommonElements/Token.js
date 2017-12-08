import React from "react"
import { connect } from "react-redux"
import {pickRandomProperty} from "../../utils/tokens"
import { TokenView } from "../../components/CommonElement"
import { getTranslate } from 'react-localize-redux'

@connect((store, props) => {  
  return {
      type: props.type,     
      tokens:store.tokens.tokens,
      symbol: props.token,
      onSelected: props.onSelected,
      translate: getTranslate(store.locale),
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
        translate={this.props.translate}
      />
    )
  }
}
