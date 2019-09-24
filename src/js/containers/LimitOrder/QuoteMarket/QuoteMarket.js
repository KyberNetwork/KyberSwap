import React from "react"
import * as common from "../../../utils/common"
import * as converter from "../../../utils/converter"
import { connect } from "react-redux"
import * as limitOrderActions from "../../../actions/limitOrderActions"
import { SortableComponent } from "../../../components/CommonElement"
import limitOrderServices from "../../../services/limit_order";
import * as converters from "../../../utils/converter"
import { QuoteList, Search } from "../QuoteMarket"
import { sortQuotePriority } from "../../../utils/sorters";

@connect((store, props) => {
  const tokens = store.tokens.tokens
  const currentQuote = store.limitOrder.currentQuote
  const pairs = store.market.tokens.reduce((result, pair) => { Object.assign(result, {[pair.pair]: pair}); return result},{})
  return {
    tokens, currentQuote, global: store.global, pairs
  }
})
export default class QuoteMarket extends React.Component{
  constructor() {
    super()
    this.state = {
      quotes: {},
      pairs: {},
      favorite_pairs: [],
      current_search: "", 
      current_sort_index: "base", 
      current_sort_dsc: true
    }
  }

  onQuoteClick = (quote) => {
    this.props.dispatch(limitOrderActions.updateCurrentQuote(quote))
    this.props.global.analytics.callTrack("trackLimitOrderClickChooseMarket", quote)
  }

  onSearch = (text) => {
    this.setState((state, props) => ({current_search: text}))
  }

  onSort = (i, isDsc) => {
    this.setState((state, props)=>({current_sort_index: i, current_sort_dsc: isDsc}))
  }
  
  search(quotes){
    const { current_search, current_sort_index, current_sort_dsc } = this.state
    const { currentQuote } = this.props
    return (
      currentQuote === "FAV" ?
        Object.keys(quotes).reduce((res, key) => res.concat(quotes[key]),[]).filter((pair) => pair["is_favorite"]) : 
        quotes[currentQuote]
    )
    .filter(pair => (pair["base"].toLowerCase().includes(current_search.toLowerCase())))
    .sort(function(a,b){return (current_sort_dsc ? 1 : -1)*(a[current_sort_index] > b[current_sort_index] ? -1 : 1)})
  }


  renderQuotes(){
    const { tokens, pairs } = this.props
    const fav = this.props.favorite_pairs

    const quotes = Object.keys(tokens).filter((key)=> (tokens[key]["is_quote"] && key !== "ETH"))
    .sort((first, second) => {
      return sortQuotePriority(tokens, first, second);
    });

    const result = quotes.reduce((res, quote) => {
        res[quote] = Object.keys(tokens).filter((key)=> (tokens[key]["sp_limit_order"])).filter(key => {
          // if quote A priority < other quote priorities, remove other quotes from list token of quote A
          const quotePriority = tokens[quote].quote_priority;
          const tokenPriority = tokens[key].quote_priority;

          if (quotePriority && tokenPriority && quotePriority < tokenPriority) {
            // remove from list
            return false;
          }
          return true;
        })
          .reduce((vt, key) =>{
            const pair = key+"_"+quote
            const pairReversed = `${quote}_${key}`
            const isExisted = (pairReversed in pairs)
            return key == quote ? vt : vt.concat({   
                id: pair,
                base: key, quote: quote,
                price: ((pairReversed in pairs) ? converters.formatNumber(pairs[pairReversed].buy_price, 5, '') : "0"),
                is_favorite: fav.includes(pair),
                volume: ((pairReversed in pairs) ? pairs[pairReversed].volume : "-" ),
                change: ((pairReversed in pairs) ? pairs[pairReversed].change : "0" )
            });
          }, []); 
        return res
      },{});
    return result;
  }

  renderTh = () => {
    return [
      { html: "Pair", field: "base" }, 
      { html: "Price", field: "price" }, 
      { html: "Volume", field: "volume" }, 
      { html: "Change", field: "change" }
    ].map((i, index) => (
      <div className={`c${index+1}`}>
        <SortableComponent 
          Wrapper={"span"}
          key={i["html"]} 
          text={i["html"]}
          onClick={(is_dsc) => this.onSort(i["field"], is_dsc)}
          isActive={this.state.current_sort_index == i["field"]} />
      </div>
    ))
  }

  onPairClick = (base, quote) => {
    quote = quote == "ETH" ? "WETH" : quote
    this.props.selectSourceAndDestToken(quote, base);
    this.props.global.analytics.callTrack("trackLimitOrderClickSelectPair", base + "/" + quote)
  }
  render(){
    const quotes = this.renderQuotes()
    const { tokens, currentQuote } = this.props
    const list = Object.keys(quotes).length > 0 ? this.search(quotes) : []
    return (
      <div id="quote-market" className="theme__background-2"> 
          { Object.keys(tokens).length > 0 ? 
            <div id="container">
              <div id="panel" className="theme__text-4 theme__border">
                <Search onSearch={this.onSearch}/>
                <QuoteList onClick={this.onQuoteClick} currentQuote={currentQuote} quotes={["FAV"].concat(Object.keys(quotes))}/>
              </div>
              <div className="table">
                <div className="table__header">
                  <div className="table__row">
                    <div className="c0"></div>
                    {this.renderTh()}
                  </div>
                </div>
                <div className="table__body">
                  {list.map(pair => <div key={pair["id"]} className="table__row">
                    <div className="overlay" onClick={() => this.onPairClick(pair["base"], pair["quote"])}></div>
                    <div className={"c0"} onClick={() => this.props.onFavoriteClick(pair["base"], pair["quote"], !pair["is_favorite"])}>
                      <div className={pair["is_favorite"] ? "star active" : "star" } />
                    </div>
                    <div className={"c1"} >{`${pair["base"]}/${pair["quote"] == "WETH" ? "ETH*" : pair["quote"]}`}</div>
                    <div className={"c2"} >{pair["price"]}</div>
                    <div className={"c3"} >{converters.formatNumber(pair["volume"], 5, '')}</div>
                    <div className={`${pair["change"] > 0 ? "up" : "down"} c4`}>{Math.abs(pair["change"])}%</div>
                  </div>)}
                </div>
              </div>
            </div> : 
            <div className="rate-loading"> <img src={require('../../../../assets/img/waiting-white.svg')} /></div>}
      </div>
    )
  }
}
