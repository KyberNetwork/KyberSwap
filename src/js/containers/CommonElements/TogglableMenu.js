import React, { Fragment } from 'react'
import { connect } from "react-redux";
import { Modal } from "../../components/CommonElement"
import { getTranslate } from "react-localize-redux";
import { formatAddress, formatNumber } from "../../utils/converter";
import { sortBy, filter, map } from "underscore";
import BLOCKCHAIN_INFO from "../../../../env"
import * as globalActions from "../../actions/globalActions";
import { findTokenBySymbol } from "../../utils/common";

@connect((store) => {
  const translate = getTranslate(store.locale);

  return {
    translate,
    global: store.global,
    marketTokens: store.market.tokens,
    tokens: store.tokens.tokens,
    totalBalanceInETH: store.account.totalBalanceInETH,
    address: store.account.account.address,
  };
})
export default class ToggleableMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isAdvanceTokenVisible: false,
      isReimport: false,
      trendingTokens: []
    }

    this.fetchingInterval = null;

    if (window.kyberBus) {
      window.kyberBus.on('wallet.view', () => {this.setState({isAdvanceTokenVisible: true})});
      window.kyberBus.on('wallet.change', () => {this.setState({isAdvanceTokenVisible: true, isReImport: true})});
    }
  }

  componentDidMount() {
    this.getTrendingList();

    this.fetchingInterval = setInterval(() => {
      this.getTrendingList();
    }, 10000);
  }

  componentWillUnmount() {
    clearInterval(this.fetchingInterval);
  }

  toggleAdvanceTokeBalance = () => {
    this.setState({
      isAdvanceTokenVisible: !this.state.isAdvanceTokenVisible
    });
    this.props.global.analytics.callTrack("trackClickShowWalletBalance", this.state.isAdvanceTokenVisible);
  }

  openReImport = () => {
    this.setState({ isReImport: true });
  }

  closeReImport = () => {
    this.setState({ isReImport: false });
  }

  clearSession = () => {
    this.setState({ isReImport: false, isAdvanceTokenVisible: false });
    this.props.clearSession();
    this.props.dispatch(globalActions.acceptTermOfService());
  }

  reImportModal = () => {
    return (
      <div className="reimport-modal p-a-20px">
        <div className="x" onClick={this.closeReImport}>&times;</div>
        <div className="title">{this.props.translate("import.do_you_want_to_connect_other_wallet") || "Do you want to connect other Wallet?"}</div>
        <div className="content">
          <div className="button confirm-btn" onClick={this.clearSession}>{this.props.translate("import.yes") || "Yes"}</div>
          <div className="button cancel-btn" onClick={this.closeReImport}>{this.props.translate("import.no") || "No"}</div>
        </div>
      </div>
    )
  }

  getTrendingList() {
    if (this.props.marketTokens.length === 0) {
      setTimeout(() => {
        this.getTrendingList();
      }, 1000)
      return;
    }

    const maxTrendingTokens = 10;

    let newListingTokens = filter(this.props.tokens, token => {
      const marketToken = this.props.marketTokens[`${BLOCKCHAIN_INFO.indexForTrending}_${token.symbol}`];
      return token.isNew && marketToken && marketToken.buy_price !== "0";
    }).slice(0, maxTrendingTokens);
    newListingTokens = map(newListingTokens, token => {
      const indexPair = `${BLOCKCHAIN_INFO.indexForTrending}_${token.symbol}`;
      const marketToken = this.props.marketTokens[indexPair];
      token.pair = indexPair;
      token.change = marketToken.change;
      token.buy_price = marketToken.buy_price;
      return token;
    });

    let remainingSlots = maxTrendingTokens - newListingTokens.length;
    let topGainers = [];

    if (remainingSlots) {
      topGainers = filter(this.props.marketTokens, token => {
        if (+token.change <= 0 || token.pair.indexOf(BLOCKCHAIN_INFO.indexForTrending) === -1) return false;

        const tokenSymbol = token.pair.split('_')[1];
        const alreadyList = findTokenBySymbol(newListingTokens, tokenSymbol);

        return !alreadyList;
      });
      topGainers = sortBy(topGainers, token => {
        return -token.change;
      }).slice(0, remainingSlots);
    }

    const trendingTokens = newListingTokens.concat(topGainers);

    this.setState({ trendingTokens: trendingTokens });
  }

  getChangeClass(change) {
    if (change > 0) {
      return "positive";
    } else if (change < 0) {
      return "negative"
    }

    return '';
  }

  renderTrendingTokens() {
    return this.state.trendingTokens.map((token, index) => {
      return (
        <div className={`rate-item ${this.getChangeClass(token.change)}`} key={index}>
          <div className={`change-${this.getChangeClass(token.change)} rate-item__percent-change`}/>
          <div className="rate-item__container theme__text-3">
            <div className={`pair ${token.isNew ? 'pair--new' : ''}`}>
              <span>{token.pair.replace(`${BLOCKCHAIN_INFO.indexForTrending}_`, '')}</span>
            </div>
            <div className="value up">${formatNumber(token.buy_price, 4)}</div>
            <div className="percent-change">{token.change}%</div>
          </div>
        </div>
      )
    })
  }
  
  render() {
    const showTrending = !this.props.hideTrending && this.state.trendingTokens.length !== 0;
    const showRightSidePanel = this.props.address || showTrending;

    return (
        <div className={"limit-order-account"}>
          <div onClick={this.toggleAdvanceTokeBalance} className={"right-slide-panel " + (this.state.isAdvanceTokenVisible || this.props.global.isOnMobile || !showRightSidePanel ? "hide" : "")}>
            <div className="right-slide-panel__more theme__slide-menu">More</div>

            {this.props.address && (
              <div className="right-slide-panel__wallet theme__background-5">
                <div className="theme__text-3 common__mb-5">
                  {formatAddress(this.props.address, 5, -3)}
                </div>
                <div className="account-balance__total theme__text-9">
                  <span>{this.props.totalBalanceInETH ? formatNumber(this.props.totalBalanceInETH, 4) : 0} ETH</span>
                </div>
              </div>
            )}

            {showTrending && (
              <Fragment>
                <div className="right-slide-panel__trending theme__slide-panel">Trending</div>
                <div className="right-slide-panel__tokens theme__background-5">
                  {this.renderTrendingTokens()}
                </div>
              </Fragment>
            )}
          </div>

          {this.state.isAdvanceTokenVisible && (
            <div className="limit-order-account__advance theme__background-7">
              <div className="limit-order-account__advance--bg" onClick={() => this.setState({ isAdvanceTokenVisible: false })}/>
              <div className="advance-close theme__slide-menu" onClick={this.toggleAdvanceTokeBalance}>
                <div>Hide</div>
              </div>
              <div className="limit-order-account__title">
                <div className="reimport-msg">
                  <Modal
                    className={{
                      base: 'reveal tiny reimport-modal',
                      afterOpen: 'reveal tiny reimport-modal reimport-modal--tiny'
                    }}
                    isOpen={this.state.isReImport}
                    onRequestClose={this.closeReImport}
                    contentLabel="advance modal"
                    content={this.reImportModal()}
                    size="tiny"
                  />
                </div>
              </div>

              {React.cloneElement(this.props.children, {
                openReImport: this.openReImport,
                fullHeightTokenList: !showTrending
              })}

              {showTrending && (
                <div className="right-slide-unlocked">
                  <div className="right-slide-panel__trending theme__slide-panel">Trending</div>
                  <div className={`right-slide-panel__tokens theme__background-5 ${!this.props.address ? 'full-height' : ''}`}>
                    {this.renderTrendingTokens()}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      );
  }
}