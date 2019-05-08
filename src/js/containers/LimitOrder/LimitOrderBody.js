import React from "react"
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'

import {LimitOrderForm, LimitOrderSubmit, LimitOrderFee, LimitOrderList} from "../LimitOrder"



@connect((store, props) => {
  const account = store.account.account
  const translate = getTranslate(store.locale)
  const tokens = store.tokens.tokens
  const limitOrder = store.limitOrder
  const ethereum = store.connection.ethereum

  return {
    translate, limitOrder, tokens, account, ethereum

  }
})

export default class LimitOrderBody extends React.Component {



    render() {
      return (
        <div className={"limit-order-container"}>
            <div>
                <div>
                    <LimitOrderForm />
                </div>
                <div>
                    <div>import account</div>
                    <div>
                        <LimitOrderFee />
                    </div>
                </div>
            </div>
            <div>
                <LimitOrderSubmit />
            </div>
            <div>
                <LimitOrderList />
            </div>
        </div>
      )
    }
  }
