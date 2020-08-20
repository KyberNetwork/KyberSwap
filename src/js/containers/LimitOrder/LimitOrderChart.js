import React from "react"
import { connect } from "react-redux"
import TradingView from "./TradingView"
import { getTokenHighestAndLowestPrice } from "../../services/tokenService";
import { formatNumber, roundingRateNumber, sumOfTwoNumber } from "../../utils/converter";
import { getTranslate } from "react-localize-redux";
import constants from "../../services/constants"

@connect((store) => {
  const translate = getTranslate(store.locale);
  const limitOrder = store.limitOrder;
  const baseSymbol = limitOrder.sourceTokenSymbol;
  const quoteSymbol = limitOrder.destTokenSymbol;
  const isLoadingData = limitOrder.isFetchingRate || limitOrder.isSelectToken;
  const marketToken = store.market.tokens[`${quoteSymbol}_${baseSymbol}`];
  let token24hChange, lastPrice, tokenVolume = '---';
  
  if (marketToken) {
    token24hChange = marketToken.change;
    lastPrice = roundingRateNumber(marketToken.buy_price);
    tokenVolume = marketToken.volume;
  }
  
  if (quoteSymbol === 'WETH') {
    const ETHPair = store.market.tokens[`ETH_${baseSymbol}`];
    tokenVolume = ETHPair ? sumOfTwoNumber(tokenVolume, ETHPair.volume) : tokenVolume;
  }
  
  tokenVolume = formatNumber(tokenVolume, 4);

  return {
    translate, baseSymbol, quoteSymbol, lastPrice, token24hChange, tokenVolume, isLoadingData
  }
})
export default class LimitOrderChart extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      highestPrice: 0,
      lowestPrice: 0,
      loadingHighLowPrice: true
    }
  }
  
  componentDidMount() {
    this.fetchHighAndLowPrice();
  }
  
  componentDidUpdate(prevProps, prevState) {
    if (this.props.baseSymbol !== prevProps.baseSymbol || this.props.quoteSymbol !== prevProps.quoteSymbol) {
      this.fetchHighAndLowPrice();
    }
  }
  
  async fetchHighAndLowPrice() {
    this.setState({ loadingHighLowPrice: true });
  
    const pair = `${this.props.baseSymbol}_${this.props.quoteSymbol}`;
    const currentTimestamp =  Math.round(Date.now() / 1000);
    const lastDayTimestamp = Math.round(+(new Date(new Date().setDate(new Date().getDate() - 1))) / 1000);
  
    try {
      const { highestPrice, lowestPrice } = await getTokenHighestAndLowestPrice(pair, lastDayTimestamp, currentTimestamp);
  
      this.setState({
        highestPrice: roundingRateNumber(highestPrice),
        lowestPrice: roundingRateNumber(lowestPrice),
        loadingHighLowPrice: false
      });
    } catch (e) {
      console.log(e);
      this.setState({ loadingHighLowPrice: false });
    }
  }
  
  getColorClass = () => {
    if (this.props.isLoadingData) return '';
    
    if (this.props.token24hChange > 0) {
      return 'trading-view__header--green';
    } else if (this.props.token24hChange < 0) {
      return 'trading-view__header--red';
    }
    
    return '';
  };
  
  renderHeaderData = (data, postfix = '') => {
    if (!data) return '---';
    return `${data}${postfix}`;
  };
  
  render() {
    const displayBaseSymbol = this.props.baseSymbol === 'WETH' ? constants.WETH_SUBSTITUTE_NAME : this.props.baseSymbol;
    const displayQuoteSymbol = this.props.quoteSymbol === 'WETH' ? constants.WETH_SUBSTITUTE_NAME : this.props.quoteSymbol;
    const isLoading = this.props.isLoadingData || this.state.loadingHighLowPrice;
    
    return (
      <div className="theme__background-2">
        <div className={`trading-view__header ${this.getColorClass()}`}>
          <div className="trading-view__header-pair theme__text-8">{displayBaseSymbol}/{displayQuoteSymbol}</div>
          <div className="trading-view__header-item">
            <div className="trading-view__header-title">
              {this.props.translate('limit_order.24h_change') || '24h Change'}
            </div>
            <div className="trading-view__header-value with-color theme__text-8">
              {isLoading ? '---' : this.renderHeaderData(this.props.token24hChange, '%')}
            </div>
          </div>
          <div className="trading-view__header-item">
            <div className="trading-view__header-title">
              {this.props.translate('limit_order.last_price') || 'Last Price'}
            </div>
            <div className="trading-view__header-value with-color theme__text-8">
              {isLoading ? '---' : this.renderHeaderData(this.props.lastPrice)}
            </div>
          </div>
          <div className="trading-view__header-item">
            <div className="trading-view__header-title">
              {this.props.translate('limit_order.24h_high') || '24h High'}
            </div>
            <div className="trading-view__header-value with-color theme__text-8">
              {isLoading ? '---' : this.renderHeaderData(this.state.highestPrice)}
            </div>
          </div>
          <div className="trading-view__header-item">
            <div className="trading-view__header-title">
              {this.props.translate('limit_order.24h_low') || '24h Low'}
            </div>
            <div className="trading-view__header-value with-color theme__text-8">
              {isLoading ? '---' : this.renderHeaderData(this.state.lowestPrice)}
            </div>
          </div>
          <div className="trading-view__header-item">
            <div className="trading-view__header-title">
              {this.props.translate('limit_order.24h_volume') || '24h Volume'}
            </div>
            <div className="trading-view__header-value theme__text-8">
              {isLoading ? '---' : this.renderHeaderData(this.props.tokenVolume, ` ${displayQuoteSymbol}`)}
            </div>
          </div>
        </div>
        <TradingView
          baseSymbol={this.props.baseSymbol}
          quoteSymbol={this.props.quoteSymbol}
        />
      </div>
    )
  }
}
