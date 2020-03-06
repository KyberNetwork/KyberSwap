import React from "react"
import { connect } from "react-redux";
import { getTranslate } from "react-localize-redux";
import { getTopTokensIn1Hour } from "../../services/tokenService";
import { formatNumber } from "../../utils/converter";

@connect((store) => {
  const translate = getTranslate(store.locale);
  return { translate }
})
export default class LimitOrderTopToken extends React.Component {
  constructor(props) {
    super(props);
    
    this.fetchingInterval = null;
    
    this.state = {
      topTokens: [],
      isLoading: true
    }
  }
  
  componentDidMount() {
    this.fetchTopTokens();
  
    this.fetchingInterval = setInterval(() => {
      this.fetchTopTokens(false);
    }, 10000)
  }
  
  componentWillUnmount() {
    clearInterval(this.fetchingInterval);
  }
  
  async fetchTopTokens(shouldLoading = true) {
    this.setState({ isLoading: shouldLoading });
    
    try {
      const topTokens = await getTopTokensIn1Hour();
      this.setState({ topTokens: topTokens, isLoading: false });
    } catch (e) {
      console.log(e);
      this.setState({ isLoading: false });
    }
  }
  
  renderArrowChange(change) {
    if (change > 0) {
      return <div className={`change-positive rate-item__percent-change`}/>
    } else if (change < 0) {
      return <div className={`change-negative rate-item__percent-change`}/>
    }
    
    return '';
  }
  
  render() {
    const hasData = this.state.topTokens.length !== 0;
    
    return (
      <div className="limit-order-top-token theme__background-2">
        <div className="limit-order-top-token__title">
          {this.props.translate('limit_order.top_token') || 'Top Gainers in Last 1 Hour'}
        </div>
        
        {(!this.state.isLoading && hasData) && (
          <div id="rate-bar">
            <div className="rate">
              {this.state.topTokens.map((token, index) => {
                return (
                  <div className="rate-item" key={index}>
                    {this.renderArrowChange(token.change_usd_1h)}
                    <div>
                      <div className="pair">{token.token_symbol}</div>
                      <div className="value up">${formatNumber(token.rate_usd_now, 6)}</div>
                      <div className="percent-change">{token.change_usd_1h}%</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
  
        {(!this.state.isLoading && !hasData) && (
          <div className="limit-order-top-token__text">No data at the moment...</div>
        )}
  
        {this.state.isLoading && (
          <div className="limit-order-top-token__text">Loading...</div>
        )}
      </div>
    )
  }
};
