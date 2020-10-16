import React from "react"
import { connect } from "react-redux"
import { withRouter } from "react-router";
import { getTranslate } from 'react-localize-redux'
import * as converter from "../../utils/converter"
import * as constants from "../../services/constants";

@connect((store) => {
  const account = store.account.account;
  const translate = getTranslate(store.locale);

  return { translate, account }
})

class LimitOrderFee extends React.Component {
  renderTotalText = () => {
    const amount = this.props.isBuyForm ? this.props.sourceAmount : this.props.destAmount;
    return `${amount ? converter.formatNumber(amount, 6) : 0} ${this.props.quoteSymbol}`;
  };
  
  renderFee = () => {
    const displaySrcSymbol = this.props.srcTokenSymbol === 'WETH' ? constants.WETH_SUBSTITUTE_NAME : this.props.srcTokenSymbol;
    const orderFee = converter.multiplyOfTwoNumber(this.props.sourceAmount, this.props.fee);
    const orderNetFeeText = <span>{converter.formatNumber(orderFee, 5, '')} {displaySrcSymbol}</span>

    return (
      <div>
        <span className={"common__mr-5"}>{this.props.translate("limit_order.fee") || "Fee"}:</span>
        <span>{orderNetFeeText}</span>
      </div>
    )
  };

  render() {
    return (
      <div className={"limit-order-fee"}>
        {this.props.account && (
          <div className="limit-order-fee__content theme__border-2">
            <div className={"theme__text-4"}>
              <div className={"common__flexbox"}>
                {this.renderFee()}
                <a
                  className={"limit-order-fee__learn"}
                  href='https://support.kyberswap.com/support/solutions/articles/47001142525-what-are-the-limit-order-trading-fees-do-i-need-to-pay-gas-fees-for-token-swaps-'
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {this.props.translate("learn_more") || "Learn More"}
                </a>
              </div>
            </div>
          </div>
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
