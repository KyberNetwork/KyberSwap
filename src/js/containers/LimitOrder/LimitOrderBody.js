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
import * as constants from "../../services/constants";
import * as limitOrderActions from "../../actions/limitOrderActions";
import * as globalActions from "../../actions/globalActions";

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
  };

  setSrcInputElementRef = (element) => {
    this.srcInputElementRef = element;
  };

  setSubmitHandler = (func) => {
    this.submitHandler = func;
  };

  setFormType = (type, targetSymbol, quoteSymbol) => {
    if (this.props.limitOrder.sideTrade === type) return;

    this.props.dispatch(limitOrderActions.setSideTrade(type));

    this.props.dispatch(limitOrderActions.changeFormType(
      this.props.tokens[this.props.limitOrder.sourceTokenSymbol],
      this.props.tokens[this.props.limitOrder.destTokenSymbol]
    ));

    const realQuoteSymbol = quoteSymbol === "ETH*" ? "WETH" : quoteSymbol;
    const realTargetSymbol = targetSymbol === "ETH*" ? "WETH" : targetSymbol;
    let path;

    if (type === "buy") {
      path = constants.BASE_HOST +  "/limit_order/" + realQuoteSymbol.toLowerCase() + "-" + realTargetSymbol.toLowerCase();
    } else {
      path = constants.BASE_HOST +  "/limit_order/" + realTargetSymbol.toLowerCase() + "-" + realQuoteSymbol.toLowerCase();
    }

    this.props.dispatch(globalActions.goToRoute(path))
    this.props.global.analytics.callTrack("trackLimitOrderClickChooseSideTrade", type, targetSymbol, quoteSymbol)
  };

  desktopLayout = () => {
    const LimitOrderForm = this.LimitOrderForm
    const QuoteMarket = this.QuoteMarket

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
            setFormType={this.setFormType}
          />
        </div>
      </div>
    )
  };

  mobileLayout = () => {
    const LimitOrderForm = this.LimitOrderForm
    const LimitOrderMobileHeader = this.LimitOrderMobileHeader
    return (
      <div className={"limit-order theme__background"}>
        <LimitOrderMobileHeader toggleMobileChart = {this.toggleMobileChart}/>

        {this.state.mobileOpenChart && (
          <MobileChart
            toggleMobileChart = {this.toggleMobileChart}
            setFormType = {this.setFormType}
          />
        )}

        {!this.state.mobileOpenChart && (
          <div>
            <div className={"limit-order__container limit-order__container--right"}>
              <LimitOrderForm
                setSrcInputElementRef={this.setSrcInputElementRef}
                submitHandler={this.submitHandler}
                setSubmitHandler={this.setSubmitHandler}
                setFormType={this.setFormType}
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
