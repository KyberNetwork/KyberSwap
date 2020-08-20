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
import LimitOrderNotification from "./LimitOrderNotification";
import LimitOrderTopToken from "./LimitOrderTopToken";

@connect((store) => {
  const account = store.account.account;
  const translate = getTranslate(store.locale);
  const baseSymbol = store.limitOrder.sourceTokenSymbol;
  const isOnMobile = store.global.isOnMobile;

  return {
    translate, account, isOnMobile, baseSymbol
  }
})
export default class LimitOrderBody extends React.Component {
  constructor(props) {
    super(props);
    
    this.srcInputElementRef = null;
    this.LimitOrderForm = withSourceAndBalance(LimitOrderForm);
    this.QuoteMarket = withFavorite(withSourceAndBalance(QuoteMarket));
    this.LimitOrderMobileHeader = withFavorite(LimitOrderMobileHeader)

    this.state = {
      mobileOpenChart: false,
      mobileFormType: 'buy'
    }
  }

  toggleMobileChart = () => {
    this.setState({ mobileOpenChart: !this.state.mobileOpenChart })
  };
  
  setMobileFormType = (formType) => {
    this.setState({ mobileFormType: formType })
  };

  setSrcInputElementRef = (element) => {
    this.srcInputElementRef = element;
  };

  desktopLayout = () => {
    const LimitOrderForm = this.LimitOrderForm;
    const QuoteMarket = this.QuoteMarket;

    return (
      <div className={"limit-order theme__background"}>
        <div className={"limit-order__container limit-order__container--left"}>
          <LimitOrderChart />
          {/*<LimitOrderNotification translate={this.props.translate} />*/}
          <LimitOrderList srcInputElementRef={this.srcInputElementRef} />
        </div>
        <div className={"limit-order__container limit-order__container--right"}>
          {this.props.account === false &&
            <div className={"limit-order-account"}>
              <ImportAccount tradeType="limit_order" isAgreedTermOfService />
            </div>
          }
          
          <QuoteMarket />
  
          <div className="common__flexbox-between">
            <LimitOrderForm formType="buy" />
            <LimitOrderForm formType="sell" />
          </div>
          
          <LimitOrderTopToken />
        </div>
      </div>
    )
  };

  mobileLayout = () => {
    const LimitOrderForm = this.LimitOrderForm;
    const LimitOrderMobileHeader = this.LimitOrderMobileHeader;
    
    return (
      <div className={"limit-order limit-order--mobile theme__background"}>
        <LimitOrderMobileHeader toggleMobileChart={this.toggleMobileChart} />

        {this.state.mobileOpenChart && (
          <LimitOrderChart />
        )}
  
        <div>
          <div className="limit-order-form__header theme__background-2 theme__border-2">
            <div className={`limit-order-form__tab ${this.state.mobileFormType === 'buy' ? 'limit-order-form__tab--active' : ''}`} onClick={() => this.setMobileFormType('buy')}>
              {this.props.translate("limit_order.buy", { symbol: this.props.baseSymbol })}
            </div>
            <div className={`limit-order-form__tab ${this.state.mobileFormType === 'sell' ? 'limit-order-form__tab--active' : ''}`} onClick={() => this.setMobileFormType('sell')}>
              {this.props.translate("limit_order.sell", { symbol: this.props.baseSymbol })}
            </div>
          </div>
          
          <LimitOrderForm formType={this.state.mobileFormType} isMobile />
        </div>

        <div>
          <div className={"limit-order__container limit-order__container--right"}>
            {this.props.account === false &&
              <div className={"limit-order-account"}>
                <ImportAccount tradeType="limit_order" isAgreedTermOfService />
              </div>
            }
          </div>
          
          <LimitOrderListModal srcInputElementRef={this.props.srcInputElementRef}/>
        </div>
      </div>
    )
  };

  render() {
    if (this.props.isOnMobile) {
      return this.mobileLayout()
    } else {
      return this.desktopLayout()
    }
  }
}
