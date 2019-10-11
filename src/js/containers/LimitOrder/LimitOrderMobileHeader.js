import React from "react";
import { connect } from "react-redux";
import { getTranslate } from 'react-localize-redux';
import QuoteMarket from "./QuoteMarket/QuoteMarket";
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

  const pairToken = store.market.tokens.find(token => {
    return token.pair === `${quoteSymbol}_${baseSymbol}`;
  });

  let pairVolume = pairToken ? formatNumber(pairToken.volume, 3, ',') : '---';

  if (quoteSymbol === BLOCKCHAIN_INFO.wrapETHToken) {
    const ethPairToken = store.market.tokens.find(token => {
      return token.pair === `ETH_${baseSymbol}`;
    });
    pairVolume = pairToken || ethPairToken ? formatNumber(sumOfTwoNumber(pairToken.volume, ethPairToken.volume), 3, ',') : '---'
  }

  return { translate, limitOrder, tokens, global, pairToken, pairVolume, baseSymbol, quoteSymbol }
})
export default class LimitOrderMobileHeader extends React.Component {
  constructor(props) {
    super(props);

    this.QuoteMarket = withFavorite(withSourceAndBalance(QuoteMarket));
    this.state = {
      isQuoteMarketOpened: false,
      isFavorite: false
    }
  }

  toggleQuoteMarket = () => {
    this.setState({ isQuoteMarketOpened: !this.state.isQuoteMarketOpened });
  };

  render() {
    const QuoteMarket = this.QuoteMarket;
    const isFav = this.props.favorite_pairs.includes(`${this.props.baseSymbol}_${this.props.quoteSymbol}`);
    const pairBuyPrice = this.props.pairToken ? formatNumber(this.props.pairToken.buy_price, 6) : '---';
    const pairUSDBuyPrice = pairBuyPrice && this.props.tokens[this.props.baseSymbol] ? this.props.tokens[this.props.baseSymbol].rateUSD : 0;
    const pairChange = this.props.pairToken ? this.props.pairToken.change : '---';
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
              <span>{pairBuyPrice} {displayQuoteSymbol} = ${pairUSDBuyPrice}</span>

              {(pairChange !== '---' && pairChange !== 0) &&
                <span className={`${pairChange > 0 ? 'common__text-green' : 'common__text-red'}`}>
                  {pairChange}%
                </span>
              }
            </div>
            <div className={"limit-order-header__volume theme__text-3"}>Vol {this.props.pairVolume} {displayQuoteSymbol}</div>
          </div>

          <div className={"limit-order-header__column"}>
            <div className={`limit-order-header__star ${ isFav ? 'limit-order-header__star--active' : ''}`}
                 onClick={() => this.props.onFavoriteClick(this.props.baseSymbol, this.props.quoteSymbol, !isFav)} />
            <div className={"limit-order-header__chart"} onClick={this.props.toggleMobileChart}/>
          </div>
        </div>

        {this.state.isQuoteMarketOpened && (
          <div className={"common__slide-up"}>
            <QuoteMarket/>
          </div>
        )}
      </div>
    )
  }
}
