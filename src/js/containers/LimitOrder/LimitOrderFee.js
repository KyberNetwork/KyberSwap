import React, { Fragment } from "react"
import { connect } from "react-redux"
import { withRouter } from "react-router";
import * as limitOrderActions from "../../actions/limitOrderActions"
import { getTranslate } from 'react-localize-redux'
import * as converter from "../../utils/converter"
import BLOCKCHAIN_INFO from "../../../../env";
import * as constants from "../../services/constants";
import SlideDown, { SlideDownContent, SlideDownTrigger } from "../../components/CommonElement/SlideDown";

@connect((store) => {
  const account = store.account.account;
  const translate = getTranslate(store.locale);
  const tokens = store.tokens.tokens;
  const limitOrder = store.limitOrder;

  return { translate, limitOrder, tokens, account }
})

class LimitOrderFee extends React.Component {
  constructor() {
    super();

    this.state = {
      isFeeOpened: false
    }
  }

  componentDidMount = () =>{
    this.fetchFee();

    this.intervalFetchFee = setInterval(() => {
      this.fetchFee(false);
    }, 10000)
  };

  componentWillUnmount = () => {
    clearInterval(this.intervalFetchFee)
  };

  toggleFeeContent = () => {
    this.setState({ isFeeOpened: !this.state.isFeeOpened });
  };

  fetchFee = (shouldLoading = true) => {
    if (this.props.account !== false) {
      const userAddr = this.props.account.address;
      const src = this.props.tokens[this.props.limitOrder.sourceTokenSymbol].address;
      const dest = this.props.tokens[this.props.limitOrder.destTokenSymbol].address;
      const srcAmount = this.props.limitOrder.sourceAmount;
      const destAmount = this.props.limitOrder.destAmount;

      this.props.dispatch(limitOrderActions.fetchFee(userAddr, src, dest, srcAmount, destAmount, shouldLoading))
    } else {
      this.props.dispatch(limitOrderActions.fetchFeeComplete(constants.LIMIT_ORDER_CONFIG.maxFee, constants.LIMIT_ORDER_CONFIG.maxFee, 0))
    }
  };

  render() {
    const sourceTokenSymbol = this.props.limitOrder.sourceTokenSymbol === BLOCKCHAIN_INFO.wrapETHToken ? constants.WETH_SUBSTITUTE_NAME : this.props.limitOrder.sourceTokenSymbol;
    const destTokenSymbol = this.props.limitOrder.destTokenSymbol === BLOCKCHAIN_INFO.wrapETHToken ? constants.WETH_SUBSTITUTE_NAME : this.props.limitOrder.destTokenSymbol;
    const orderFee = converter.multiplyOfTwoNumber(this.props.limitOrder.sourceAmount, converter.divOfTwoNumber(this.props.limitOrder.orderFee, 100));
    const orderFeeAfterDiscount = converter.multiplyOfTwoNumber(this.props.limitOrder.sourceAmount, converter.divOfTwoNumber(this.props.limitOrder.orderFeeAfterDiscount, 100));
    const sourceAmountAfterFee = converter.formatNumber(converter.subOfTwoNumber(this.props.limitOrder.sourceAmount, orderFeeAfterDiscount), 5, '');
    const orderFeeDiscountPercentage = this.props.limitOrder.orderFeeDiscountPercentage;
    const isDiscount = converter.compareTwoNumber(orderFeeDiscountPercentage, 0) === 1;
    const displayDiscountInfo = this.props.limitOrder.sourceAmount && isDiscount;
    let orderFeeText = null;
    let orderDiscountFeeText = null;
    let orderNetFeeText = <img src={require('../../../assets/img/waiting-white.svg')}/>;
    const totalText = this.props.formType === 'buy' ? `${this.props.limitOrder.sourceAmount ? this.props.limitOrder.sourceAmount : 0} ${sourceTokenSymbol}` : `${this.props.limitOrder.destAmount ? this.props.limitOrder.destAmount : 0} ${destTokenSymbol}`;

    if (!this.props.limitOrder.isFetchingFee) {
      orderNetFeeText = <span>{converter.formatNumber(orderFeeAfterDiscount, 5, '')} {sourceTokenSymbol}</span>

      if (displayDiscountInfo) {
        orderDiscountFeeText = <span>{converter.formatNumber(orderFeeDiscountPercentage, 2)}% {this.props.translate("off") || "OFF"}</span>
        orderFeeText = <span>{converter.formatNumber(orderFee, 5)} {sourceTokenSymbol}</span>
      }
    }

    const feeTriggerText = (
      <div>
        <span className={"common__mr-15"}>{this.props.translate("limit_order.fee") || "Fee"}:</span>
        <span>{orderNetFeeText}</span>
      </div>
    );

    return (
      <div className={"limit-order-fee"}>
        <SlideDown className={"limit-order-fee__content theme__border-2"} active={this.state.isFeeOpened && displayDiscountInfo}>
          <div className={"theme__text-4"}>
            {displayDiscountInfo &&
              <SlideDownTrigger className={"limit-order-fee__net"} toggleContent={this.toggleFeeContent}>
                {feeTriggerText}
                <div className={"common__triangle theme__border-top"}/>
              </SlideDownTrigger>
            }

            {!displayDiscountInfo && feeTriggerText}
          </div>

          <SlideDownContent className={"limit-order-fee__slide-content"}>
            <div>
              <span className={"limit-order-fee__line-through-text theme__text-3"}>{orderFeeText}</span>
              <span className={"limit-order-fee__discount theme__background-3"}>{orderDiscountFeeText}</span>
            </div>

            {this.props.limitOrder.sourceAmount > 0 &&
              <Fragment>
                <div className={"limit-order-fee__info"}>
                  {this.props.translate("limit_order.fee_info", {
                    sourceTokenSymbol: sourceTokenSymbol,
                    destTokenSymbol: destTokenSymbol,
                    sourceAmount: sourceAmountAfterFee
                  }) || `Upon execution, fee is deducted from source token and remaining ${sourceAmountAfterFee} ${sourceTokenSymbol} is converted to ${this.props.limitOrder.destTokenSymbol}`}
                </div>

                <a className={"limit-order-fee__learn"} href='/faq#I-have-KNC-in-my-wallet-Do-I-get-any-discount-on-trading-fees' target="_blank" rel="noopener noreferrer">
                  {this.props.translate("learn_more") || "Learn More"}
                </a>
              </Fragment>
            }
          </SlideDownContent>
        </SlideDown>

        <div className={"limit-order-fee__total"}>
          <span className={"theme__text-4"}>{this.props.translate("limit_order.total")}:</span>
          <span className={"theme__text-5"}>{totalText}</span>
        </div>
      </div>
    )
  }
}

export default withRouter(LimitOrderFee);
