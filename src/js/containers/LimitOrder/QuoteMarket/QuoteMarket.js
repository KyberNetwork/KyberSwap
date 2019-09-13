import React from "react"
import * as common from "../../../utils/common"
import * as converter from "../../../utils/converter"
import { connect } from "react-redux"
import * as limitOrderActions from "../../../actions/limitOrderActions"
import { ProcessingModal, SortableComponent } from "../../../components/CommonElement"
import limitOrderServices from "../../../services/limit_order";
import { QuoteList, Search } from "../QuoteMarket"

@connect((store, props) => {
  const tokens = store.tokens.tokens
  const favorite_pairs_anonymous = store.limitOrder.favorite_pairs_anonymous
  const currentQuote = store.limitOrder.currentQuote
  return {
    tokens, favorite_pairs_anonymous, currentQuote
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

  componentDidMount() {
    let i = 1
    this.intervalId = setInterval(() => { 
      this.updateVolume()
    }, 2000);
    if (common.isUserLogin()) {
      limitOrderServices.getFavoritePairs().then(
        (res) => { 
          this.setState({favorite_pairs: res.map(obj => `${obj.base.toUpperCase()}_${obj.quote.toUpperCase()}`)}) 
        } 
      )
    } 
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  updateVolume = () => {
    limitOrderServices.getVolumeAndChange()
    .then((res) => { 
      this.setState((state, props) => ({pairs: res}))
    })
  }

  onQuoteClick = (quote) => {
    this.props.dispatch(limitOrderActions.updateCurrentQuote(quote))
  }

  onSearch = (text) => {
    this.setState((state, props) => ({current_search: text}))
  }

  onFavoriteClick = (base, quote, to_fav) => {
    if (common.isUserLogin()) {
      const {favorite_pairs} = this.state
      const index = favorite_pairs.indexOf(base+"_"+quote)
      if (index == -1){
        favorite_pairs.push(base+"_"+quote)
      }else {
        favorite_pairs.splice(index, 1)
      }
      this.setState({favorite_pairs: favorite_pairs})
      limitOrderServices.updateFavoritePairs(base, quote, to_fav)
    }else {
      this.props.dispatch(limitOrderActions.updateFavoriteAnonymous(base, quote, to_fav))
    } 
  }

  onSort = (i, isDsc) => {
    this.setState((state, props)=>({current_sort_index: i, current_sort_dsc: isDsc}))
  }
  
  search(quotes){
    const { current_search, current_sort_index, current_sort_dsc, pairs } = this.state
    const { currentQuote } = this.props

    return (
      currentQuote === "FAV" ?
        Object.keys(quotes).reduce((res, key) => res.concat(quotes[key]),[]).filter((pair) => pair["is_favorite"]) : 
        quotes[currentQuote]
    )
    .filter(pair => (pair["base"].toLowerCase().includes(current_search.toLowerCase())))
    .map(pair => ({
      ...pair, 
      volume: (Object.keys(pairs).includes(pair.id) ? pairs[pair.id].volume : "-" ), 
      change: (Object.keys(pairs).includes(pair.id) ? pairs[pair.id].change : "0" )
    }))
    .sort(function(a,b){return (current_sort_dsc ? 1 : -1)*(a[current_sort_index] > b[current_sort_index] ? -1 : 1)})
  }


  renderQuotes(){
    const { tokens, favorite_pairs_anonymous } = this.props
    const { favorite_pairs } = this.state
    const fav = common.isUserLogin() ? favorite_pairs : favorite_pairs_anonymous
    const quotes = Object.keys(tokens).filter((key)=> (("is_quote" in tokens[key]) && tokens[key]["is_quote"]))
      .reduce((res, quote) => {
        res[quote] = Object.keys(tokens)
          .reduce((vt, key) =>{ 
            return key == quote ? vt : vt.concat({   
                id: key+"_"+quote, 
                base: key, quote: quote, 
                price: (+converter.divOfTwoNumber(tokens[key].rate, quote == "ETH" ? '1000000000000000000' : tokens[quote].rate)).toFixed(5), 
                is_favorite: fav.includes(key+"_"+quote),
                volume: "-",
                change: "0"
            });
          }, []); 
        return res
      },{})
    return quotes;
  }

  renderTh = () => {
    return [
      { html: "Pair", field: "base" }, 
      { html: "Price", field: "price" }, 
      { html: "Volume", field: "volume" }, 
      { html: "Change", field: "change" }
    ].map((i, index) => (
      <div>
        <SortableComponent 
          Wrapper={"span"}
          key={i["html"]} 
          text={i["html"]}
          onClick={(is_dsc) => this.onSort(i["field"], is_dsc)}
          isActive={this.state.current_sort_index == i["field"]} />
      </div>
    ))
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
                <QuoteList onClick={this.onQuoteClick} currentQuote={currentQuote} quotes={["FAV"].concat(Object.keys(quotes))}/>
                <Search onSearch={this.onSearch}/>
              </div>
              <div className="table-th">
                {this.renderTh()}
              </div> 
              <table >
                <tbody>
                  {list.map(pair => <tr key={pair["id"]}>
                      <td width="20px" onClick={() => this.onFavoriteClick(pair["base"], pair["quote"], !pair["is_favorite"])}>
                        <div className={pair["is_favorite"] ? "star active" : "star" } /> 
                      </td>
                      <td width="82px">{pair["base"] + "/" + pair["quote"]}</td>
                      <td width="82px">{pair["price"]}</td>
                      <td width="82px">{pair["volume"]}</td>
                      <td width="82px" className={pair["change"] > 0 ? "up" : "down"}>{Math.abs(pair["change"])}%</td>
                    </tr>)} 
                </tbody>
              </table>
            </div> : 
            <div className="rate-loading"> <img src={require('../../../../assets/img/waiting-white.svg')} /></div>}
      </div>
    )
  }
}
