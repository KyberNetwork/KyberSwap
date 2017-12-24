import React from "react"
import { connect } from "react-redux"

import {AccountBalanceView} from '../../components/Header'

@connect((store) => {
  return { 
    tokens: store.tokens.tokens
  }
})

export default class AccountBalance extends React.Component {
  render() {
    return (
      <AccountBalanceView tokens = {this.props.tokens}/>
    )
  }
}
