import React from "react"
import { connect } from "react-redux"
import { withRouter } from "react-router";

import * as limitOrderActions from "../../actions/limitOrderActions"
import * as common from "../../utils/common"
import { getTranslate } from 'react-localize-redux'
import * as converter from "../../utils/converter"

@connect((store, props) => {
  const account = store.account.account
  const translate = getTranslate(store.locale)
  const tokens = store.tokens.tokens
  const limitOrder = store.limitOrder
  const ethereum = store.connection.ethereum

  return {
    translate, limitOrder, tokens, account, ethereum,
    global: store.global

  }
})

class LimitOrderFee extends React.Component {

  componentDidMount = () =>{
    if (common.isUserLogin() && this.props.account !== false){
      this.props.dispatch(limitOrderActions.fetchFee(this.props.account.address, this.props.limitOrder.sourceTokenSymbol, this.props.limitOrder.destTokenSymbol))
    }

  }

  redirectToSwap = () => {
    this.props.history.push("/swap/eth-knc");
  }


  render() {
    var calculateFee = (this.props.limitOrder.orderFee * this.props.limitOrder.sourceAmount) / 100
    calculateFee = Math.round(calculateFee * 10000)/ 10000
    var sourceAmount = parseFloat(this.props.limitOrder.sourceAmount)
    sourceAmount = isNaN(sourceAmount)? 0:  Math.round(sourceAmount * 100)/ 100

    if (this.props.limitOrder.isFetchingFee) {
      return (
        <div className={"limit-order-fee"}>
          <div>
            Fee: <img src={require('../../../assets/img/waiting-white.svg')} />
          </div>
          <div>
            <a onClick={e => this.redirectToSwap()}>Buy 3000KNC</a>{' '}
            <span>to discount 50% for 20 orders</span>
          </div>
        </div>
      )
    }else{
      return (
        <div className={"limit-order-fee"}>
          <div className="limit-order-fee__text">
            Fee: {calculateFee} {this.props.limitOrder.sourceTokenSymbol === 'WETH' ? 'ETH*' : this.props.limitOrder.sourceTokenSymbol} ({this.props.limitOrder.orderFee}% of {sourceAmount} {this.props.limitOrder.destTokenSymbol === 'WETH' ? 'ETH*' : this.props.limitOrder.destTokenSymbol})
          </div>
          <div>
            <a onClick={e => this.redirectToSwap()}>Buy 3000KNC</a>{' '}
            <span>to discount 50% for 20 orders</span>
          </div>
        </div>
      )

    }

  }
}

export default withRouter(LimitOrderFee);
