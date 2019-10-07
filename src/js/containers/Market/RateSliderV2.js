import React from "react"
import { connect } from "react-redux"
import { roundingNumber, sumOfTwoNumber, divOfTwoNumber } from "../../utils/converter"
import BLOCKCHAIN_INFO from "../../../../env";

@connect((store) => {
  const marketTokens = store.market.tokens.filter(token => {
      return !token.pair.includes(BLOCKCHAIN_INFO.wrapETHToken) && (token.buy_price !== "0" || token.sell_price !== "0");
    });

  return { marketTokens }
})
export default class RateSliderV2 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      numDisplay: 7,
      page: 0,
      intervalUpdatePage: false,
      intervalTime: 7000
    }
  }

  componentDidMount = () => {
    if(window.innerWidth < 992){
      this.setState({
        numDisplay: 5
      })
    }
    this.intervalUpdatePage = setInterval(() => {
      this.increasePage()
    }, this.state.intervalTime)
  };

  componentWillUnmount = () => {
    clearInterval(this.intervalUpdatePage)
    this.intervalUpdatePage = false
  };

  clickIncreasePage = () => {
    this.increasePage()
    clearInterval(this.intervalUpdatePage)
    this.intervalUpdatePage = setInterval(() => {
      this.increasePage()
    }, this.state.intervalTime)
  };

  increasePage = () => {
    if (this.state.page >= this.props.marketTokens.length / this.state.numDisplay - 1) {
      this.setState({
        page: 0
      })
    } else {
      this.setState({
        page: this.state.page + 1
      })
    }
  };

  getMarketTokenList = () => {
    const currentPage = this.state.page;
    let marketTokenList = [];
    const marketTokens = this.props.marketTokens;

    for (let i = currentPage * this.state.numDisplay; i < (currentPage + 1) * this.state.numDisplay; i++) {
      if (i < marketTokens.length) {
        if (marketTokens[i]) marketTokenList.push(marketTokens[i])
      } else {
        if (marketTokens[i - marketTokens.length]) marketTokenList.push(marketTokens[i - marketTokens.length])
      }
    }

    return marketTokenList;
  };

  getTokenRate = (token) => {
    const buyPrice = token.buy_price;
    const sellPrice = token.sell_price;
    let rate = buyPrice;

    if (buyPrice && sellPrice) {
      rate = divOfTwoNumber(sumOfTwoNumber(buyPrice, sellPrice), 2);
    } else if (!buyPrice) {
      rate = sellPrice;
    }

    return rate;
  };

  render() {
    const marketTokenList = this.getMarketTokenList();

    const rateContent = marketTokenList.map((value, index) => {
      const rateChange = value.change;
      const pair = value.pair.split('_');
      const rate = this.getTokenRate(value);

      return (
        <div key={index}>
          <div className="rate-item">
            {rateChange > 0 && (
              <div className="change-positive rate-item__percent-change"/>
            )}
            {rateChange < 0 && (
              <div className="change-negative rate-item__percent-change"/>
            )}
            <div>
              <div className="pair">{pair[1]} / {pair[0]}</div>
              <div className="value up">
                {roundingNumber(rate)}
              </div>
              <div className="percent-change">{rateChange === 0 ? "---" : Math.abs(rateChange)}%</div>
            </div>
          </div>
        </div>
      )
    });

    return (
      <div id="rate-bar">
        <div className="rate" onClick={this.clickIncreasePage}>
          {rateContent}
        </div>
      </div>
    )
  }
}
