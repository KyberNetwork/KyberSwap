import React from "react"
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'
import {
  LimitOrderForm,
  LimitOrderChart,
  LimitOrderList,
  QuoteMarket,
  withSourceAndBalance,
  withFavorite,
  LimitOrderListModal
} from "../LimitOrder"
import { ImportAccount } from "../ImportAccount";
import LimitOrderMobileHeader from "./LimitOrderMobileHeader";

@connect((store, props) => {
  const global = store.global;
  const account = store.account.account
  const translate = getTranslate(store.locale)
  const tokens = store.tokens.tokens
  const limitOrder = store.limitOrder
  const ethereum = store.connection.ethereum;

  return {
    translate, limitOrder, tokens, account, ethereum, global
  }
})

export default class LimitOrderBody extends React.Component {
  constructor(props) {
    super(props);
    this.srcInputElementRef = null;
    this.submitHandler = null;
    this.LimitOrderForm = withSourceAndBalance(LimitOrderForm);
    this.QuoteMarket = withFavorite(withSourceAndBalance(QuoteMarket));
    this.LimitOrderMobileHeader = withFavorite(LimitOrderMobileHeader)

  }

  setSrcInputElementRef = (element) => {
    this.srcInputElementRef = element;
  }

  setSubmitHandler = (func) => {
    this.submitHandler = func;
  }

  render() {
    const LimitOrderForm = this.LimitOrderForm
    const QuoteMarket = this.QuoteMarket
    const LimitOrderMobileHeader = this.LimitOrderMobileHeader

    return (
      <div className={"limit-order theme__background"}>
        {this.props.global.isOnMobile &&
          <LimitOrderListModal srcInputElementRef={this.props.srcInputElementRef}/>
        }

        <div className={"limit-order__container limit-order__container--left"}>
          {!this.props.global.isOnMobile && (
            <LimitOrderChart/>
          )}

          {!this.props.global.isOnMobile &&
            <LimitOrderList srcInputElementRef={this.srcInputElementRef}/>
          }
        </div>

        <div className={"limit-order__container limit-order__container--right"}>
          {this.props.account === false &&
            <div className={"limit-order-account"}>
              <ImportAccount
                tradeType="limit_order"
                isAgreedTermOfService={this.props.global.termOfServiceAccepted}
                isAcceptConnectWallet={this.props.global.isAcceptConnectWallet}
              />
            </div>
          }
          {!this.props.global.isOnMobile && (
            <QuoteMarket/>
          )}

          <LimitOrderForm
              setSrcInputElementRef={this.setSrcInputElementRef}
              submitHandler={this.submitHandler}
              setSubmitHandler={this.setSubmitHandler}/>
          {this.props.global.isOnMobile &&
            <LimitOrderMobileHeader/>
          }
        </div>
      </div>
    )
  }
}
