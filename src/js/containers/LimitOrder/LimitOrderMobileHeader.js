import React from "react";
import { connect } from "react-redux";
import { getTranslate } from 'react-localize-redux';
import QuoteMarket from "./QuoteMarket/QuoteMarket";
import LimitOrderChart from "./LimitOrderChart";
import * as constants from "../../services/constants";
import BLOCKCHAIN_INFO from "../../../../env";
import {withFavorite, withSourceAndBalance} from "./index";

@connect((store, props) => {
  const translate = getTranslate(store.locale);
  const global = store.global;
  const tokens = store.tokens.tokens;
  const marketTokens = store.market.tokens;
  const limitOrder = store.limitOrder;
  const marketDestToken = marketTokens[limitOrder.destTokenSymbol];

  return { translate, limitOrder, tokens, global, marketDestToken }
})
export default class LimitOrderMobileHeader extends React.Component {
  constructor(props) {
    super(props);

    this.QuoteMarket = withFavorite(withSourceAndBalance(QuoteMarket));
    this.state = {
      isChartOpened: false,
      isQuoteMarketOpened: false,
      isFavorite: false
    }
  }

  toggleChart = () => {
    this.setState({ isChartOpened: !this.state.isChartOpened });
  };

  toggleQuoteMarket = () => {
    this.setState({ isQuoteMarketOpened: !this.state.isQuoteMarketOpened });
  };

  render() {
    const QuoteMarket = this.QuoteMarket;
    const srcTokenSymbol = this.props.limitOrder.sourceTokenSymbol === BLOCKCHAIN_INFO.wrapETHToken ? constants.WETH_SUBSTITUTE_NAME : this.props.limitOrder.sourceTokenSymbol;
    const destTokenSymbol = this.props.limitOrder.destTokenSymbol === BLOCKCHAIN_INFO.wrapETHToken ? constants.WETH_SUBSTITUTE_NAME : this.props.limitOrder.destTokenSymbol;
    const marketDestTokenByETH = this.props.marketDestToken.ETH;
    const marketDestTokenByUSD = this.props.marketDestToken.USD;

    const isFav = this.props.favorite_pairs.includes(`${this.props.limitOrder.destTokenSymbol}_${this.props.limitOrder.sourceTokenSymbol}`)
    return (
      <div className={"limit-order-header"}>
        <div className={"limit-order-header__wrapper"}>
          <div className={"limit-order-header__column"} onClick={this.toggleQuoteMarket}>
            <div className={"limit-order-header__pair"}>
              <span>{destTokenSymbol}/{srcTokenSymbol}</span>
              <span className={`common__triangle ${this.state.isQuoteMarketOpened ? 'up' : ''}`}/>
            </div>
            <div className={"limit-order-header__rate"}>
              <span>{marketDestTokenByETH.buyPrice} ETH = ${marketDestTokenByUSD.buyPrice}</span>

              {marketDestTokenByUSD.change && marketDestTokenByUSD.change !== -9999 &&
                <span className={`${marketDestTokenByUSD.change > 0 ? 'common__text-green' : 'common__text-red'}`}>
                  {marketDestTokenByUSD.change}%
                </span>
              }
            </div>
            <div className={"limit-order-header__volume theme__text-3"}>Vol {marketDestTokenByETH.volume} ETH</div>
          </div>

          <div className={"limit-order-header__column"}>
            <div className={`limit-order-header__star ${ isFav ? 'limit-order-header__star--active' : ''}`}
                 onClick={() => this.props.onFavoriteClick(this.props.limitOrder.destTokenSymbol, this.props.limitOrder.sourceTokenSymbol, !isFav)} />
            <div className={"limit-order-header__chart"} onClick={this.toggleChart}/>
          </div>
        </div>

        {this.state.isChartOpened && (
          <div className={"common__slide-up"}>
            <LimitOrderChart/>
          </div>
        )}

        {this.state.isQuoteMarketOpened && (
          <div className={"common__slide-up"}>
            <QuoteMarket/>
          </div>
        )}
      </div>
    )
  }
}
