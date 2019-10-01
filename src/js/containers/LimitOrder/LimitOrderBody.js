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

import { MobileChart } from "./MobileElements"
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

    this.state = {
      mobileOpenChart: true
    }

  }

  toggleMobileChart = () => {
    this.setState({ mobileOpenChart: !this.state.mobileOpenChart })
  }

  setSrcInputElementRef = (element) => {
    this.srcInputElementRef = element;
  }

  setSubmitHandler = (func) => {
    this.submitHandler = func;
  }

  desktopLayout = () => {
    const LimitOrderForm = this.LimitOrderForm
    const QuoteMarket = this.QuoteMarket
    const LimitOrderMobileHeader = this.LimitOrderMobileHeader
    return (
      <div className={"limit-order theme__background"}>
        <div className={"limit-order__container limit-order__container--left"}>
          <LimitOrderChart />
          <LimitOrderList srcInputElementRef={this.srcInputElementRef} />
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
          <QuoteMarket />
          <LimitOrderForm
            setSrcInputElementRef={this.setSrcInputElementRef}
            submitHandler={this.submitHandler}
            setSubmitHandler={this.setSubmitHandler}
          />
        </div>
      </div>
    )
  }


  mobileLayout = () => {
    const LimitOrderForm = this.LimitOrderForm
    const QuoteMarket = this.QuoteMarket
    const LimitOrderMobileHeader = this.LimitOrderMobileHeader
    return (
      <div className={"limit-order theme__background"}>


        <LimitOrderMobileHeader toggleMobileChart = {this.toggleMobileChart}/>

        {this.state.mobileOpenChart && (
          <MobileChart toggleMobileChart = {this.toggleMobileChart}/>
        )}

        {!this.state.mobileOpenChart && (
          <div>
            <div className={"limit-order__container limit-order__container--right"}>


              <LimitOrderForm
                setSrcInputElementRef={this.setSrcInputElementRef}
                submitHandler={this.submitHandler}
                setSubmitHandler={this.setSubmitHandler}
              />

              {this.props.account === false &&
                <div className={"limit-order-account"}>
                  <ImportAccount
                    tradeType="limit_order"
                    isAgreedTermOfService={this.props.global.termOfServiceAccepted}
                    isAcceptConnectWallet={this.props.global.isAcceptConnectWallet}
                  />
                </div>
              }

            </div>

            <LimitOrderListModal srcInputElementRef={this.props.srcInputElementRef} />
          </div>
        )}


      </div>
    )
  }

  render() {
    if (this.props.global.isOnMobile) {
      return this.mobileLayout()
    } else {
      return this.desktopLayout()
    }
  }
}
