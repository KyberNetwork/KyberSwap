import React, { Fragment } from "react"
import { connect } from "react-redux"
import { withRouter } from "react-router";
import * as limitOrderActions from "../../actions/limitOrderActions"
import { getTranslate } from 'react-localize-redux'
import * as converter from "../../utils/converter"
import * as constants from "../../services/constants";
import SlideDown, { SlideDownContent, SlideDownTrigger } from "../../components/CommonElement/SlideDown";

@connect((store) => {
  const account = store.account.account;
  const translate = getTranslate(store.locale);
  const tokens = store.tokens.tokens;
  const limitOrder = store.limitOrder;

  return { translate, limitOrder, tokens, account, theme: store.global.theme }
})

class LimitOrderFee extends React.Component {
  constructor(props) {
    super(props);

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
      const src = this.props.tokens[this.props.srcTokenSymbol].address;
      const dest = this.props.tokens[this.props.destTokenSymbol].address;
      const srcAmount = this.props.sourceAmount;
      const destAmount = this.props.destAmount;

      this.props.dispatch(limitOrderActions.fetchFee(userAddr, src, dest, srcAmount, destAmount, shouldLoading))
    } else {
      this.props.dispatch(limitOrderActions.fetchFeeComplete(constants.LIMIT_ORDER_CONFIG.maxFee, constants.LIMIT_ORDER_CONFIG.maxFee, 0))
    }
  };
  
  renderTotalText = () => {
    const amount = this.props.isBuyForm ? this.props.sourceAmount : this.props.destAmount;
    return `${amount ? converter.formatNumber(amount, 6) : 0} ${this.props.quoteSymbol}`;
  };
  
  renderFee = (displaySrcSymbol, orderFeeAfterDiscount) => {
    let orderNetFeeText = <img src={require(`../../../assets/img/${this.props.theme === 'dark' ? 'waiting-black' : 'waiting-white'}.svg`)}/>;
    
    if (!this.props.limitOrder.isFetchingFee) {
      orderNetFeeText = <span>{converter.formatNumber(orderFeeAfterDiscount, 5, '')} {displaySrcSymbol}</span>
    }
    
    return (
      <div>
        <span className={"common__mr-5"}>{this.props.translate("limit_order.fee") || "Fee"}:</span>
        <span>{orderNetFeeText}</span>
      </div>
    )
  };
  
  renderDiscountFee = (displaySrcSymbol, displayDiscountInfo, orderFeeDiscountPercentage) => {
    const orderFee = converter.multiplyOfTwoNumber(this.props.sourceAmount, converter.divOfTwoNumber(this.props.limitOrder.orderFee, 100));
    let orderFeeText = '';
    let orderDiscountFeeText = '';
  
    if (!this.props.limitOrder.isFetchingFee && displayDiscountInfo) {
      orderDiscountFeeText = <span>{converter.formatNumber(orderFeeDiscountPercentage, 2)}% {this.props.translate("off") || "OFF"}</span>
      orderFeeText = <span>{converter.formatNumber(orderFee, 5)} {displaySrcSymbol}</span>
    }
    
    return (
      <div>
        <span className={"limit-order-fee__line-through-text theme__text-3"}>{orderFeeText}</span>
        <span className={"limit-order-fee__discount theme__background-3"}>{orderDiscountFeeText}</span>
      </div>
    )
  };
  
  renderLearnMoreLink = () => {
    return (
      <a className={"limit-order-fee__learn"} href='/faq#I-have-KNC-in-my-wallet-Do-I-get-any-discount-on-trading-fees' target="_blank" rel="noopener noreferrer">
        {this.props.translate("learn_more") || "Learn More"}
      </a>
    )
  };

  render() {
    const displaySrcSymbol = this.props.srcTokenSymbol === 'WETH' ? constants.WETH_SUBSTITUTE_NAME : this.props.srcTokenSymbol;
    const displayDestSymbol = this.props.destTokenSymbol === 'WETH' ? constants.WETH_SUBSTITUTE_NAME : this.props.destTokenSymbol;
    const orderFeeAfterDiscount = converter.multiplyOfTwoNumber(this.props.sourceAmount, converter.divOfTwoNumber(this.props.limitOrder.orderFeeAfterDiscount, 100));
    const sourceAmountAfterFee = converter.formatNumber(converter.subOfTwoNumber(this.props.sourceAmount, orderFeeAfterDiscount), 6, '');
    const orderFeeDiscountPercentage = this.props.limitOrder.orderFeeDiscountPercentage;
    const isDiscount = converter.compareTwoNumber(orderFeeDiscountPercentage, 0) === 1;
    const displayDiscountInfo = this.props.sourceAmount && isDiscount;
    const feeText = this.renderFee(displaySrcSymbol, orderFeeAfterDiscount);
    const discountFeeText = this.renderDiscountFee(displaySrcSymbol, displayDiscountInfo, orderFeeDiscountPercentage);
    const learnMoreLink = this.renderLearnMoreLink();

    return (
      <div className={"limit-order-fee"}>
        {this.props.account && (
          <SlideDown className={"limit-order-fee__content theme__border-2"} active={this.state.isFeeOpened && displayDiscountInfo}>
            <div className={"theme__text-4"}>
              {displayDiscountInfo &&
                <SlideDownTrigger className={"limit-order-fee__net"} toggleContent={this.toggleFeeContent}>
                  {feeText}
                  <div className={"common__triangle theme__border-top"}/>
                </SlideDownTrigger>
              }

              {!displayDiscountInfo && (
                <div className={"common__flexbox"}>
                  {feeText}
                  {learnMoreLink}
                </div>
              )}
            </div>

            <SlideDownContent className={"limit-order-fee__slide-content"}>
              {discountFeeText}

              {this.props.sourceAmount > 0 &&
                <Fragment>
                  <div className={"limit-order-fee__info"}>
                    {this.props.translate("limit_order.fee_info", {
                      sourceTokenSymbol: displaySrcSymbol,
                      destTokenSymbol: displayDestSymbol,
                      sourceAmount: sourceAmountAfterFee
                    }) || `Upon execution, fee is deducted from source token and remaining ${sourceAmountAfterFee} ${displaySrcSymbol} is converted to ${displayDestSymbol}`}
                  </div>
    
                  {learnMoreLink}
                </Fragment>
              }
            </SlideDownContent>
          </SlideDown>
        )}

        <div className={"limit-order-fee__total"}>
          <span className={"theme__text-4"}>{this.props.translate("limit_order.total")}:</span>
          <span className={"theme__text"}>{this.renderTotalText()}</span>
        </div>
      </div>
    )
  }
}

export default withRouter(LimitOrderFee);
