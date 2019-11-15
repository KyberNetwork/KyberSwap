import React from "react"
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'
import { Currency, MarketTable, SearchWord, RateSliderV2 } from "../Market"
import * as marketActions from "../../actions/marketActions"
import { Modal } from "../../components/CommonElement"
import BLOCKCHAIN_INFO from "../../../../env"

function compareString() {
  return function (tokenA, tokenB) {
    const tokenASymbol = tokenA.pair.split("_")[1];
    const tokenBSymbol = tokenB.pair.split("_")[1];

    if (tokenASymbol < tokenBSymbol)
      return -1;
    if (tokenASymbol > tokenBSymbol)
      return 1;
    return 0;
  }
}

function compareNum(sortKey) {
  return function (tokenA, tokenB) {
    return tokenA[sortKey] - tokenB[sortKey]
  }
}

@connect((store) => {
  var searchWord = store.market.configs.searchWord

  if (typeof searchWord === "undefined") searchWord = ""

  var currency = store.market.configs.currency.focus
  var originalTokens = store.market.tokens
  var sortedTokens = store.market.sortedTokens
  var listTokens = []
  var sortKey = store.market.configs.sortKey
  var sortType = store.market.configs.sortType
  const tokens = store.tokens.tokens

  if (sortedTokens.length > 0) {
    listTokens = sortedTokens
  } else {
    originalTokens.forEach((value) => {
      const pairs = value.pair.split("_");
      const tokenSymbol = pairs[1];
      const quoteSymbol = pairs[0];

      if (!tokenSymbol.toLowerCase().includes(searchWord.toLowerCase())) return;

      if (quoteSymbol.toLowerCase() !== currency.toLowerCase()) return;

      if (tokenSymbol == BLOCKCHAIN_INFO.wrapETHToken) return;

      if (value.buy_price === '0' && value.sell_price === '0') {
        value.change = -999;
      }
      
      if (tokens[tokenSymbol] && tokens[tokenSymbol].isNew === true) {
        value.isNew = true;
      }

      listTokens.push(value)
    });

    if (sortKey === 'pair') {
      listTokens.sort(compareString())
    } else if (sortKey) {
      listTokens.sort(compareNum(sortKey))
    }

    if (sortType[sortKey] && sortType[sortKey] === '-sort-desc') {
      listTokens.reverse()
    }
  
    if (!sortKey) {
      listTokens = listTokens.reduce((list, item) => {
        if (item.isNew === true) {
          return [item, ...list];
        }
        return [...list, item];
      }, []);
    }
  }

  return {
    translate: getTranslate(store.locale),
    listTokens: listTokens,
    currency: currency,
    originalTokens: originalTokens,
    searchWord: searchWord,
    sortType: sortType,
    showSearchInput: store.market.configs.showSearchInput,
    global: store.global
  }
})

export default class Market extends React.Component {
  constructor() {
    super();

    this.state = {
      modalState: false
    }
  }

  componentDidMount = () => {
    if (window.kyberBus) {
      window.kyberBus.on("swap.open.market", this.setShowMarket.bind(this));
    }   
  };

  setShowMarket = () => {
    this.setState({ modalState: true })
  };

  changeSearch = (e) => {
    var value = e.target.value
    this.props.dispatch(marketActions.changeSearchWord(value))
    this.props.dispatch(marketActions.resetListToken(value))
  };

  getContentMarket = () => {
    return (
      <div className="market" id="market-eth">
        <a className="x" onClick={this.closeModal}>
          <img src={require("../../../assets/img/v3/Close-3.svg")} />
        </a>
        <div className="market-table">
          <MarketTable
            currency={this.props.currency}
            listTokens={this.props.listTokens}
            originalTokens={this.props.originalTokens}
            searchWord={this.props.searchWord}
            sortType={this.props.sortType}
            searchWordLayout={<SearchWord />}
            currencyLayout={<Currency currentCurrency={this.props.currency} />}
            screen={this.props.screen}
            setTokens={this.props.setTokens}
            closeMarketModal={this.closeModal}
          />
        </div>
      </div>
    )
  };

  closeModal = () => {
    this.setState({ modalState: false });
    this.props.dispatch(marketActions.changeSearchWord(''));
    this.props.dispatch(marketActions.resetListToken(''));
    this.props.global.analytics.callTrack("trackClickCloseMarket");
  };

  openModal = () => {
    this.setState({ modalState: true })
    this.props.global.analytics.callTrack("trackClickOpenMarket")
  };

  render() {
    if (!this.props.originalTokens.length) return null;

    return (
      <div className="market-wrapper-container">
        {!this.props.global.isOnMobile && (
          <div className="rate-container">
            <div className="rate-container__slider">
              <RateSliderV2/>
            </div>
            <div className="rate-container__more">
              <a onClick={this.openModal}>{this.props.translate("market.more") || "More"}</a>
            </div>
          </div>
        )}
        <Modal
          className={{
            base: 'reveal large confirm-modal market-modal',
            afterOpen: 'reveal large confirm-modal'
          }}
          overlayClassName={"market-modal-scroll"}
          isOpen={this.state.modalState}
          onRequestClose={this.closeModal}
          contentLabel="Market modal"
          content={this.getContentMarket()}
          size="large"
        />
      </div>
    )
  }
}
