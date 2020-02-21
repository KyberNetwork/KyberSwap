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
import LimitOrderMobileHeader from "./MobileElements/LimitOrderMobileHeader";
import LimitOrderForm2 from "./LimitOrderForm2";
import LimitOrderNotification from "./LimitOrderNotification";

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
    this.LimitOrderForm2 = withSourceAndBalance(LimitOrderForm2);
    this.QuoteMarket = withFavorite(withSourceAndBalance(QuoteMarket));
    this.LimitOrderMobileHeader = withFavorite(LimitOrderMobileHeader)

    this.state = {
      mobileOpenChart: false
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

  desktopLayout = () => {
    const LimitOrderForm2 = this.LimitOrderForm2
    const QuoteMarket = this.QuoteMarket

    return (
      <div className={"limit-order theme__background"}>
        <div className={"limit-order__container limit-order__container--left"}>
          <LimitOrderChart />
          <LimitOrderNotification translate={this.props.translate} />
          <LimitOrderList srcInputElementRef={this.srcInputElementRef} />
        </div>
        <div className={"limit-order__container limit-order__container--right"}>
          {this.props.account === false &&
            <div className={"limit-order-account"}>
              <ImportAccount
                tradeType="limit_order"
                noTerm={true}
              />
            </div>
          }
          <QuoteMarket />
  
          <div className="common__flexbox-between">
            <LimitOrderForm2
              submitHandler={this.submitHandler}
              setSubmitHandler={this.setSubmitHandler}
              formType="buy"
            />
    
            <LimitOrderForm2
              submitHandler={this.submitHandler}
              setSubmitHandler={this.setSubmitHandler}
              formType="sell"
            />
          </div>
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

        {this.state.mobileOpenChart && !this.props.limitOrder.mobileState.showQuoteMarket && (
          <LimitOrderChart/>
        )}

        {!this.state.mobileOpenChart && !this.props.limitOrder.mobileState.showQuoteMarket && (
          <div>
            <div className={"limit-order__container limit-order__container--right"}>
              {/*<LimitOrderForm
                setSrcInputElementRef={this.setSrcInputElementRef}
                submitHandler={this.submitHandler}
                setSubmitHandler={this.setSubmitHandler}
                setFormType={this.setFormType}
              />*/}

              {this.props.account === false &&
                <div className={"limit-order-account"}>
                  <ImportAccount
                    tradeType="limit_order"
                    noTerm={true}
                  />
                </div>
              }
            </div>
            
            <LimitOrderListModal srcInputElementRef={this.props.srcInputElementRef}/>
          </div>
        )}
      </div>
    )
  };

  render() {
    if (this.props.global.isOnMobile) {
      return this.mobileLayout()
    } else {
      return this.desktopLayout()
    }
  }
}
