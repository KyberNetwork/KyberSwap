import React from "react"
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'


import { ImportAccount } from "../ImportAccount";
import { TopBalance } from "../TransactionCommon"

import * as limitOrderActions from "../../actions/limitOrderActions"

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

export default class LimitOrderAccount extends React.Component {

    selectTokenBalance = () => {
        this.props.dispatch(limitOrderActions.setIsSelectTokenBalance(true));
      }

    render() {

        if (this.props.account === false) {
            return (
                <div className={"limit-order-account"}>
                            <ImportAccount
                                    tradeType="order_limit"                                                                                    
                                    />
                </div>
              )
        }else{
            return (
                <div className={"limit-order-account"}>
                          <TopBalance 
                            showMore={this.toggleAdvanceContent}
                            chooseToken={this.props.chooseToken}
                            activeSymbol={this.props.limitOrder.sourceTokenSymbol}
                            screen="limit_order"
                            selectTokenBalance={this.selectTokenBalance}
                            changeAmount={limitOrderActions.inputChange}               
                            />             
                </div>
              )
        }
        
      
    }
  }
