import React from "react"
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'
import {
  LimitOrderForm,
  LimitOrderChart,
  LimitOrderList,
  QuoteMarket,
  withSourceAndBalance,
  LimitOrderListModal
} from "../LimitOrder"
import { ImportAccount } from "../ImportAccount";
import { MOBILE_SCREEN_WIDTH } from "../../services/constants";

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

export default class LimitOrderBody extends React.Component {
  constructor(props) {
    super(props);
    this.srcInputElementRef = null;
    this.submitHandler = null;
    this.LimitOrderForm = withSourceAndBalance(
      <LimitOrderForm
        setSrcInputElementRef={this.setSrcInputElementRef}
        submitHandler={this.submitHandler}
        setSubmitHandler={this.setSubmitHandler}
      />
    );
    this.QuoteMarket = withSourceAndBalance(<QuoteMarket/>);
    this.isOnMobileScreen = window.innerWidth < MOBILE_SCREEN_WIDTH;
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
    return (
      <div className={"limit-order theme__background"}>
        {this.isOnMobileScreen &&
          <LimitOrderListModal srcInputElementRef={this.props.srcInputElementRef}/>
        }

        <div className={"limit-order__container limit-order__container--left"}>
          <LimitOrderChart/>

          {!this.isOnMobileScreen &&
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
          <QuoteMarket/>
          <LimitOrderForm />
        </div>
      </div>
    )
  }
}
