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

@connect((store) => {
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
            <LimitOrderForm formType="buy" />
            <LimitOrderForm formType="sell" />
          </div>
        </div>
      </div>
    )
  };

  mobileLayout = () => {
    const baseSymbol = this.props.limitOrder.sourceTokenSymbol;
    const LimitOrderForm = this.LimitOrderForm;
    const LimitOrderMobileHeader = this.LimitOrderMobileHeader;
    
    return (
      <div className={"limit-order theme__background"}>
        <LimitOrderMobileHeader toggleMobileChart={this.toggleMobileChart} />

        {this.state.mobileOpenChart && (
          <LimitOrderChart/>
        )}
  
        <div>
          <div className="limit-order-form__header theme__background-2 theme__border-2">
            <div className={`limit-order-form__tab ${this.state.mobileFormType === 'buy' ? 'limit-order-form__tab--active' : ''}`} onClick={() => this.setMobileFormType('buy')}>
              {this.props.translate("limit_order.buy", { symbol: baseSymbol })}
            </div>
            <div className={`limit-order-form__tab ${this.state.mobileFormType === 'sell' ? 'limit-order-form__tab--active' : ''}`} onClick={() => this.setMobileFormType('sell')}>
              {this.props.translate("limit_order.sell", { symbol: baseSymbol })}
            </div>
          </div>
          
          <LimitOrderForm formType={this.state.mobileFormType} isMobile />
        </div>

        <div>
          <div className={"limit-order__container limit-order__container--right"}>
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
