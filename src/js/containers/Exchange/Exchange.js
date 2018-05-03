import React from "react"
import { connect } from "react-redux"
import {ExchangeBody, Advance} from "../Exchange"
import {AccountBalance} from "../TransactionCommon"

import {TransactionLayout} from "../../components/TransactionCommon"

export default class Exchange extends React.Component {

  render() {
    return (
      <TransactionLayout 
        balance = {<AccountBalance />}
        advance = {<Advance />}
        content = {<ExchangeBody />}
      />
    )
  }
}
