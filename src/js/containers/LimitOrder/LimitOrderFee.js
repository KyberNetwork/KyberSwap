import React from "react"
import { connect } from "react-redux"
import { withRouter } from "react-router";
import * as limitOrderActions from "../../actions/limitOrderActions"
import * as common from "../../utils/common"
import { getTranslate } from 'react-localize-redux'
import * as converter from "../../utils/converter"
import BLOCKCHAIN_INFO from "../../../../env";
import * as constants from "../../services/constants"

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
    this.fetchFee()
    this.intervalFetchFee = setInterval(this.fetchFee, 10000)
  }

  componentWillUnmount = () => {
    clearInterval(this.intervalFetchFee)
  }

  fetchFee = () => {
    if (common.isUserLogin() && this.props.account !== false){
      var userAddr = this.props.account.address
      var src = this.props.tokens[this.props.limitOrder.sourceTokenSymbol].address
      var dest = this.props.tokens[this.props.limitOrder.destTokenSymbol].address
      var srcAmount = this.props.limitOrder.sourceAmount
      var destAmount = this.props.limitOrder.destAmount
      this.props.dispatch(limitOrderActions.fetchFee(userAddr, src, dest, srcAmount, destAmount))
    }
  }

  redirectToSwap = () => {
    this.props.history.push("/swap/eth-knc");
  }


  render() {
    var calculateFee = (this.props.limitOrder.orderFee * this.props.limitOrder.sourceAmount) / 100
    // calculateFee = Math.round(calculateFee * 10000)/ 10000


    var sourceTokenSymbol = this.props.limitOrder.sourceTokenSymbol === BLOCKCHAIN_INFO.wrapETHToken ? constants.WETH_SUBSTITUTE_NAME : this.props.limitOrder.sourceTokenSymbol

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
            Fee: <span title={calculateFee}>{converter.displayNumberWithDot(calculateFee)}</span> {sourceTokenSymbol} ({this.props.limitOrder.orderFee}% of <span title={this.props.limitOrder.sourceAmount}>{converter.displayNumberWithDot(this.props.limitOrder.sourceAmount)}</span> {sourceTokenSymbol})
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
