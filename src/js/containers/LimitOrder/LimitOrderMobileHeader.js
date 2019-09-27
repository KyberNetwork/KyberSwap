import React from "react";
import { connect } from "react-redux";
import { getTranslate } from 'react-localize-redux';
import QuoteMarket from "./QuoteMarket/QuoteMarket";
import LimitOrderChart from "./LimitOrderChart";
import BLOCKCHAIN_INFO from "../../../../env";
import { withFavorite, withSourceAndBalance } from "./index";
import {formatNumber, sumOfTwoNumber} from "../../utils/converter";

@connect((store, props) => {
  const translate = getTranslate(store.locale);
  const global = store.global;
  const tokens = store.tokens.tokens;
  const limitOrder = store.limitOrder;

  const baseSymbol = limitOrder.sideTrade === 'buy' ? limitOrder.destTokenSymbol : limitOrder.sourceTokenSymbol;
  const quoteSymbol = limitOrder.sideTrade === 'buy' ? limitOrder.sourceTokenSymbol : limitOrder.destTokenSymbol;

  const marketBaseTokenByWETH = store.market.tokens.find(token => {
    return token.pair === `WETH_${baseSymbol}`;
  });

  const marketBaseTokenByETH = store.market.tokens.find(token => {
    return token.pair === `ETH_${baseSymbol}`;
  });

  return { translate, limitOrder, tokens, global, marketBaseTokenByWETH, marketBaseTokenByETH, baseSymbol, quoteSymbol }
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
    const isFav = this.props.favorite_pairs.includes(`${this.props.quoteSymbol}_${this.props.baseSymbol}`);
    const tokenETHBuyPrice = this.props.marketBaseTokenByWETH ? formatNumber(this.props.marketBaseTokenByWETH.buy_price, 6) : '---';
    const tokenETHVolume = this.props.marketBaseTokenByWETH || this.props.marketBaseTokenByETH  ? formatNumber(sumOfTwoNumber(this.props.marketBaseTokenByWETH.volume, this.props.marketBaseTokenByETH.volume), 3) : '---';
    const tokenUSDBuyPrice = tokenETHBuyPrice && this.props.tokens[this.props.baseSymbol] ? this.props.tokens[this.props.baseSymbol].rateUSD : 0;
    const tokenUSDChange = this.props.marketBaseTokenByWETH ? this.props.marketBaseTokenByWETH.change : '---';
    const displayQuoteSymbol = this.props.quoteSymbol === BLOCKCHAIN_INFO.wrapETHToken ? 'ETH*' : this.props.quoteSymbol;

    return (
      <div className={"limit-order-header"}>
        <div className={"limit-order-header__wrapper"}>
          <div className={"limit-order-header__column"} onClick={this.toggleQuoteMarket}>
            <div className={"limit-order-header__pair"}>
              <span>{this.props.baseSymbol}/{displayQuoteSymbol}</span>
              <span className={`common__triangle ${this.state.isQuoteMarketOpened ? 'up' : ''}`}/>
            </div>
            <div className={"limit-order-header__rate"}>
              <span>{tokenETHBuyPrice} ETH* = ${tokenUSDBuyPrice}</span>

              {(tokenUSDChange !== '---' && tokenUSDChange !== 0) &&
                <span className={`${tokenUSDChange > 0 ? 'common__text-green' : 'common__text-red'}`}>
                  {tokenUSDChange}%
                </span>
              }
            </div>
            <div className={"limit-order-header__volume theme__text-3"}>Vol {tokenETHVolume} ETH*</div>
          </div>

          <div className={"limit-order-header__column"}>
            <div className={`limit-order-header__star ${ isFav ? 'limit-order-header__star--active' : ''}`}
                 onClick={() => this.props.onFavoriteClick(this.props.baseSymbol, this.props.quoteSymbol, !isFav)} />
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
