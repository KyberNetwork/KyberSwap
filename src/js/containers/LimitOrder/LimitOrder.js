import React from "react"
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'
import {HeaderTransaction} from "../TransactionCommon"

import {LimitOrderBody} from "../LimitOrder"


@connect((store, props) => {
  const account = store.account.account
  const translate = getTranslate(store.locale)
  const tokens = store.tokens.tokens
  const exchange = store.exchange
  const ethereum = store.connection.ethereum

  return {
    translate, exchange, tokens, account, ethereum,
    params: {...props.match.params},

  }
})

export default class LimitOrder extends React.Component {



  render() {
    return (
      <div className={"limit-order-container"}>
        <HeaderTransaction page="limit_order"/>
        <LimitOrderBody page="limit_order"/>        
      </div>
    )
  }
}
