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
    this.intervalFetchFee = setInterval(() => {
      this.fetchFee(false);
    }, 10000)
  }

  componentWillUnmount = () => {
    clearInterval(this.intervalFetchFee)
  }

  fetchFee = (shouldLoading = true) => {
    if (common.isUserLogin() && this.props.account !== false){
      var userAddr = this.props.account.address
      var src = this.props.tokens[this.props.limitOrder.sourceTokenSymbol].address
      var dest = this.props.tokens[this.props.limitOrder.destTokenSymbol].address
      var srcAmount = this.props.limitOrder.sourceAmount
      var destAmount = this.props.limitOrder.destAmount
      this.props.dispatch(limitOrderActions.fetchFee(userAddr, src, dest, srcAmount, destAmount, shouldLoading))
    } else {
      this.props.dispatch(limitOrderActions.fetchFeeComplete(constants.LIMIT_ORDER_CONFIG.maxFee, constants.LIMIT_ORDER_CONFIG.maxFee, 0))
    }
  }

  redirectToSwap = () => {
    this.props.history.push("/swap/eth-knc");
  }

  render() {
    var sourceTokenSymbol = this.props.limitOrder.sourceTokenSymbol === BLOCKCHAIN_INFO.wrapETHToken ? constants.WETH_SUBSTITUTE_NAME : this.props.limitOrder.sourceTokenSymbol
    const orderFee = converter.divOfTwoNumber(converter.multiplyOfTwoNumber(this.props.limitOrder.orderFee, this.props.limitOrder.sourceAmount), 100);
    const orderFeeDiscountPercentage = this.props.limitOrder.orderFeeDiscountPercentage;
    const discountFee = converter.multiplyOfTwoNumber(orderFee, converter.divOfTwoNumber(orderFeeDiscountPercentage, 100));
    const orderFeeAfterDiscount = converter.subOfTwoNumber(orderFee, converter.multiplyOfTwoNumber(orderFee, converter.divOfTwoNumber(orderFeeDiscountPercentage, 100)));
    const sourceAmountAfterFee = converter.subOfTwoNumber(this.props.limitOrder.sourceAmount, orderFeeAfterDiscount);

    let orderFeeText = <img src={require('../../../assets/img/waiting-white.svg')}/>;
    let orderDiscountFeeText = `0 ${sourceTokenSymbol}`;
    let orderNetFeeText = <img src={require('../../../assets/img/waiting-white.svg')}/>;

    if (!this.props.limitOrder.isFetchingFee) {
      orderFeeText = <span><span title={orderFee}>{converter.formatNumber(orderFee, 5, '')}</span> {sourceTokenSymbol} ({this.props.limitOrder.orderFee}% of <span title={this.props.limitOrder.sourceAmount}>{converter.displayNumberWithDot(this.props.limitOrder.sourceAmount)}</span> {sourceTokenSymbol})</span>
      orderNetFeeText = <span className={"limit-order__bold-text"}>{converter.formatNumber(orderFeeAfterDiscount, 5, '')} {sourceTokenSymbol}</span>;

      if (this.props.limitOrder.sourceAmount && orderFeeDiscountPercentage) {
        orderDiscountFeeText = <span><span className={"limit-order__percent limit-order__percent--positive"}>- {converter.formatNumber(discountFee, 5, '')} {sourceTokenSymbol}</span> ({orderFeeDiscountPercentage}% of Fee)</span>
      }
    }

    return (
      <div className={"limit-order-fee"}>
        <div className={"limit-order-fee__item"}>
          <div className={"limit-order-fee__item-title"}>{this.props.translate("limit_order.fee") || "Fee"}:</div>
          <div className={"limit-order-fee__item-value"}>{orderFeeText}</div>
          <a className={"limit-order-fee__item-link"} href="/faq#I-have-KNC-in-my-wallet-Do-I-get-any-discount-on-trading-fees" target="_blank" rel="noopener noreferrer">
            {this.props.translate("more_info") || "More Info"}
          </a>
        </div>
        <div className={"limit-order-fee__item"}>
          <div className={"limit-order-fee__item-title"}>{this.props.translate("discount") || "Discount"}:</div>
          <div className={"limit-order-fee__item-value"}>{orderDiscountFeeText}</div>
        </div>
        <div className={"limit-order-fee__item"}>
          <div className={"limit-order-fee__item-title"}>{this.props.translate("net_fee") || "Net Fee"}:</div>
          <div className={"limit-order-fee__item-value"}>{orderNetFeeText}</div>
        </div>

        {this.props.limitOrder.sourceAmount &&
          <div className={"limit-order-fee__info"}>
            {this.props.translate("limit_order.fee_info", {
              sourceTokenSymbol: this.props.limitOrder.sourceTokenSymbol,
              destTokenSymbol: this.props.limitOrder.destTokenSymbol,
              sourceAmount: converter.formatNumber(sourceAmountAfterFee, 5, '')
            }) || `Upon execution, fee is deducted from source token and remaining ${converter.formatNumber(sourceAmountAfterFee, 5, '')} ${this.props.limitOrder.sourceTokenSymbol} is converted to ${this.props.limitOrder.destTokenSymbol}`}
          </div>
        }
      </div>
    )
  }
}

export default withRouter(LimitOrderFee);
