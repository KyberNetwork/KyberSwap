import React from "react";
import { connect } from "react-redux";
import { getTranslate } from 'react-localize-redux';
import QuoteMarket from "./QuoteMarket/QuoteMarket";
import LimitOrderChart from "./LimitOrderChart";
import * as constants from "../../services/constants";
import BLOCKCHAIN_INFO from "../../../../env";
import {withFavorite, withSourceAndBalance} from "./index";
import {formatNumber} from "../../utils/converter";

@connect((store, props) => {
  const translate = getTranslate(store.locale);
  const global = store.global;
  const tokens = store.tokens.tokens;
  const marketTokens = store.market.tokens.filter(token => {
    return token.pair.split('_')[0] !== BLOCKCHAIN_INFO.wrapETHToken;
  });
  const limitOrder = store.limitOrder;
  let marketDestTokenByETH = null, marketDestTokenByUSD = null;

  if (marketTokens.length) {
    marketDestTokenByETH = marketTokens.find(token => {
      return token.pair === `ETH_${limitOrder.destTokenSymbol}`;
    });

    marketDestTokenByUSD = marketTokens.find(token => {
      return token.pair === `DAI_${limitOrder.destTokenSymbol}`;
    });
  }

  return { translate, limitOrder, tokens, global, marketDestTokenByETH, marketDestTokenByUSD }
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
    const isFav = this.props.favorite_pairs.includes(`${this.props.limitOrder.destTokenSymbol}_${this.props.limitOrder.sourceTokenSymbol}`);
    const isMarketTokenExist = this.props.marketDestTokenByETH && this.props.marketDestTokenByUSD;
    const tokenETHBuyPrice = isMarketTokenExist ? formatNumber(this.props.marketDestTokenByETH.buy_price, 6) : '---';
    const tokenETHVolume = isMarketTokenExist ? formatNumber(this.props.marketDestTokenByETH.volume, 3) : '---';
    const tokenUSDBuyPrice = isMarketTokenExist ? formatNumber(this.props.marketDestTokenByUSD.buy_price, 6) : '---';
    const tokenUSDChange = isMarketTokenExist ? this.props.marketDestTokenByUSD.change : '---';

    return (
      <div className={"limit-order-header"}>
        <div className={"limit-order-header__wrapper"}>
          <div className={"limit-order-header__column"} onClick={this.toggleQuoteMarket}>
            <div className={"limit-order-header__pair"}>
              <span>{destTokenSymbol}/{srcTokenSymbol}</span>
              <span className={`common__triangle ${this.state.isQuoteMarketOpened ? 'up' : ''}`}/>
            </div>
            <div className={"limit-order-header__rate"}>
              <span>{tokenETHBuyPrice} ETH = ${tokenUSDBuyPrice}</span>

              {tokenUSDChange &&
                <span className={`${tokenUSDChange > 0 ? 'common__text-green' : 'common__text-red'}`}>
                  {tokenUSDChange}%
                </span>
              }
            </div>
            <div className={"limit-order-header__volume theme__text-3"}>Vol {tokenETHVolume} ETH</div>
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
