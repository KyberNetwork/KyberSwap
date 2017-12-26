import React from "react"
import { connect } from "react-redux"

import {AccountBalanceView} from '../../components/Header'
import { getTranslate } from 'react-localize-redux';

@connect((store) => {
  return { 
    tokens: store.tokens.tokens,
    translate: getTranslate(store.locale)
  }
})

export default class AccountBalance extends React.Component {

  constructor(){
    super()
    this.state = {
      expanded: false,
    }
  }

  toggleBalances() {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  render() {
    return (
      <AccountBalanceView 
        tokens = {this.props.tokens}
        expanded={this.state.expanded}
        toggleBalances={this.toggleBalances.bind(this)}  
        translate={this.props.translate}
      />
    )
  }
}
