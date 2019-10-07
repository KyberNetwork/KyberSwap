import React from "react"
import { connect } from "react-redux"
import ReactTable from 'react-table'
import { getTranslate } from 'react-localize-redux'
import * as actions from "../../actions/marketActions"
import * as converters from "../../utils/converter"

@connect((store, props) => {
  var listTokens = props.listTokens
  var currency = props.currency
  var sortType = props.sortType
  const isRussia = store.locale.languages[0] && store.locale.languages[0].active && store.locale.languages[0].code === "ru"

  return {
    translate: getTranslate(store.locale),
    currency,
    quoteTokenSymbol: store.market.configs.currency.focus,
    sort: store.market.configs.sort.focus,
    displayColumn: store.market.configs.column.display.active,
    showActive: store.market.configs.column.shows.active,
    listShowColumn: store.market.configs.column.shows.listItem,
    isLoading: store.market.configs.isLoading,
    listTokens: listTokens,
    sortType: sortType,
    searchWordLayout: props.searchWordLayout,
    currencyLayout: props.currencyLayout,
    isRussia: isRussia,
    isOnMobile: store.global.isOnMobile,
    global: store.global,
    tokens: store.tokens.tokens
  }
})

export default class MarketTable extends React.Component {
  addClassChange = (input, buyPrice, sellPrice) => {
    if (input === -9999 || (!buyPrice && !sellPrice && !input)) {
      return (
        <span>---</span>
      )
    }

    if (input < 0) {
      return (
        <span className = "negative">{input}%</span>
      )
    }

    if (input === 0) {
      return (
        <span>{input}%</span>
      )
    }

    if (input > 0) {
      return (
        <span className = "positive">{input}%</span>
      )
    }     
  };

  formatNumber = (number, groupSeparator = '') => {
    if (number > 1000) {
      return converters.formatNumber(number, 3, groupSeparator)
    }

    return converters.formatNumber(number, 6, groupSeparator)
  };

  addUnit = (input, currency, groupSeparator = '') => {
    return (
      <div className="symbol-price">
        <span className="value">{input === 0 ? "---" : this.formatNumber(input, groupSeparator)}</span>
        <span className="unit">{input === 0 ? '' : currency}</span>
      </div>
    )
  };

  getTranslateFromKey = (key) => {
    switch (key) {
      case "pair": {
        return "limit_order.pair"
      }
      case "sell_price": {
        return "market.sell_price"
      }
      case "buy_price": {
        return "market.buy_price"
      }
      case "change": {
        return "market.change"
      }
      case "volume": {
        return "market.volume"
      }
    }
  }
  
  getSortHeader = (title, key) => {
    return (
      <div className="rt-th-img">
        <img src={require("../../../assets/img/landing/sort.svg")} />
        <span>{this.props.translate(this.getTranslateFromKey(key)) || title}</span>
      </div>
    )
  }

  addIcon = (input) => {
    const pair = input.split('_');

    return (
      <div className="token-pair">
        {pair[1]}/{pair[0]}
      </div>
    )
  }

  compareString() {
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

  compareNum(sortKey) {
    return function(tokenA, tokenB) {
      return tokenA[sortKey] - tokenB[sortKey]
    }
  }

  getSortArray = (sortKey, sortType) => {
    var listTokens = this.props.listTokens
    var searchWord = this.props.searchWord

    if (sortKey === 'pair') {
      listTokens.sort(this.compareString())
    } else if (sortKey) {
      listTokens.sort(this.compareNum(sortKey))
    }
    
    var sortedTokens = []
    listTokens.forEach((value) => {
      const symbol = value.pair.split("_")[1];
      if (!symbol.toLowerCase().includes(searchWord.toLowerCase())) return;
      sortedTokens.push(value)
    })
    
    if (sortType === '-sort-desc') {
      sortedTokens.reverse()
    }
  }

  updateSortState = (key, sortType) => {
    this.props.dispatch(actions.updateSortState(key, sortType))
    this.props.global.analytics.callTrack("trackSortETHMarket", key, sortType);
  }

  getSortType = (key) => {
    var sortType = this.props.sortType
    var newSortType = ''
    if (key !== 'pair') {
      if ((sortType[key] && sortType[key] === '-sort-asc') || !sortType[key]) {
        newSortType = '-sort-desc'
      } else {
        newSortType = '-sort-asc'
      }
    } else if (key != '') {
      if ((sortType[key] && sortType[key] === '-sort-desc') || !sortType[key]) {
        newSortType = '-sort-asc'
      } else {
        newSortType = '-sort-desc'
      }
    }
    return newSortType
  }

  makeSort = (key) => {
    this.getSortArray(key, this.getSortType(key))
    this.updateSortState(key, this.getSortType(key))
  }

  getColumn = () => {
    const columns = [
      {
        Header: this.getSortHeader("Pair", "pair"),
        accessor: 'pair',
        Cell: props => this.addIcon(props.value),
        minWidth: 160,
        getHeaderProps: () => {
          return {
            className: this.props.sortType["pair"] ?  (this.props.sortType["pair"] + ' -cursor-pointer') :'-cursor-pointer',
            onClick: () => {
              this.getSortArray("pair", this.getSortType("pair"))
              this.updateSortState("pair", this.getSortType("pair"))
            }
          }
        }
      },
      {
        Header: this.getSortHeader("Sell Price", "sell_price"),
        accessor: 'sell_price',
        Cell: props => this.addUnit(props.value, this.props.currency),
        minWidth: 150,
        getHeaderProps: () => {
          return {
            className: this.props.sortType["sell_price"] ?  (this.props.sortType["sell_price"] + ' -cursor-pointer') :'-cursor-pointer',
            onClick: (e) => {
              this.getSortArray("sell_price", this.getSortType("sell_price"))
              this.updateSortState("sell_price", this.getSortType("sell_price"))
            }
          }
        }
      },
      {
        Header: this.getSortHeader("Buy Price", "buy_price"),
        accessor: 'buy_price',
        Cell: props => this.addUnit(props.value, this.props.currency),
        minWidth: 150,
        getHeaderProps: () => {
          return {
            className: this.props.sortType["buy_price"] ?  (this.props.sortType["buy_price"] + ' -cursor-pointer') :'-cursor-pointer',
            onClick: (e) => {
              this.getSortArray("buy_price", this.getSortType("buy_price"))
              this.updateSortState("buy_price", this.getSortType("buy_price"))
            }
          }
        }
      }
    ];

    Object.keys(this.props.listShowColumn).map((key, i) => {
      var item = this.props.listShowColumn[key]
      var index = this.props.showActive.indexOf(key)
      if (index !== -1) {
        switch (item.type){
          default: {
            switch (key) {
              case "change": {
                columns.push({
                  Header: this.getSortHeader(item.title, key),
                  accessor: key,
                  Cell: props => this.addClassChange(props.value, props.row.buy_price, props.row.sell_price),
                  minWidth: 180,
                  getHeaderProps: () => {
                    return {
                      className: this.props.sortType[key] ?  (this.props.sortType[key] + ' -cursor-pointer') :'-cursor-pointer',
                      onClick: (e) => {
                        this.getSortArray(key, this.getSortType(key))
                        this.updateSortState(key, this.getSortType(key))
                      }
                    }
                  }
                })
                break
              }
              case "volume": {
                columns.push({
                  Header: this.getSortHeader(item.title, key),
                  accessor: key,
                  Cell: props => this.addUnit(props.value, this.props.currency, ','),
                  minWidth: 150,
                  getHeaderProps: () => {
                    return {
                      className: this.props.sortType[key] ?  (this.props.sortType[key] + ' -cursor-pointer') :'-cursor-pointer',
                      onClick: (e) => {
                        this.getSortArray(key, this.getSortType(key))
                        this.updateSortState(key, this.getSortType(key))
                      }
                    }
                  }
                })
                break
              }
            }
            break
          }
        }
      }
    })
    return columns
  }

  onPairClicked = (rowInfo) => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    const pairs = rowInfo.original.pair.split("_");
    const srcSymbol = pairs[1];
    const quoteSymbol = pairs[0];

    if (this.props.screen === 'swap') {
      this.props.setTokens(srcSymbol, quoteSymbol);
    } else if (this.props.screen === 'transfer') {
      this.props.setTokens(srcSymbol, this.props.tokens[srcSymbol].address, 'chart');
    }

    this.props.closeMarketModal();
    this.props.global.analytics.callTrack("tokenForCharting", srcSymbol);
  };

  render() {
    const columns = this.getColumn()

    return (
      <div className="market-wrapper">
        {this.props.currencyLayout}
        <div className="market-control">
          {this.props.searchWordLayout}
        </div>
        <ReactTable
          data={this.props.listTokens}
          columns={columns}
          showPagination = {false}
          minRows = {0}
          defaultPageSize={this.props.listTokens.length}
          getTrProps={(state, rowInfo) => {
            return { onClick: () => this.onPairClicked(rowInfo) }
          }}
          // getPaginationProps={() => {
          //   return {
          //     previousText: (<img src={require("../../../assets/img/market/arrow-left.png")} />),
          //     nextText:  (<img src={require("../../../assets/img/market/arrow-right.svg")} />)
          //   }
          // }}
          getNoDataProps={(state, rowInfo) => {
            if(!this.props.listTokens.length) return { style: { border: 'none' ,top:'75%',padding:'0px', backgroundColor:'transparent'} };
            return {};
          }}
          sortable={false}
        />
      </div>
    )
  }
}
