import React from "react"
import {default as pairRateServices} from "../../services/pair_rate/pair_rate_mock"
import * as utils from "../../utils/common"
import { connect } from "react-redux"
import * as limitOrderActions from "../../actions/limitOrderActions"
import { ProcessingModal } from "../CommonElement"
import BigNumber from "bignumber.js"
import limitOrderServices from "../../services/limit_order";
// import PairRateQuoteList from './PairRateQuoteList'
// import PairRateSearch from './PairRateSearch'
@connect((store, props) => {
    // const account = store.account.account
    // const translate = getTranslate(store.locale)
    // const transfer = store.transfer
    // const ethereum = store.connection.ethereum
    const tokens = store.tokens.tokens
    const favorite_pairs_anonymous = store.limitOrder.favorite_pairs_anonymous
    const current_quote = store.limitOrder.current_quote
    return {
        tokens, favorite_pairs_anonymous, current_quote
    }
})
class PairRateLayout extends React.Component{

	constructor(){
		super()
		this.state={quotes: {}, pairs: {}, favorite_pairs: [],
					current_search: "", 
					current_sort_index: "base", 
					current_sort_asc: true}
	}

	componentDidMount(){
		let i = 1
		this.intervalId = setInterval(() => { 
			this.updateVolume()
		}, 2000);

		if (utils.isUserLogin()){
			limitOrderServices.getFavoritePairs()
			.then((res) => this.setState({favorite_pairs: res}))
		} 
	}

	componentWillUnmount(){
	   clearInterval(this.intervalId);
	}

	updateVolume =()=>{
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
		// this.setState((state, props) => ({pairs: {}}))
	}

	onFavoriteClick = (base, quote, to_fav) => {
		if (utils.isUserLogin()){
			limitOrderServices.updateFavoritePairs()
			.then((res) => {
				  const {favorite_pairs} = this.state
				  const index = favorite_pairs.indexOf(base+"_"+quote)
			      if (index == -1){
			        favorite_pairs.push(base+"_"+quote)
			      }else {
			        favorite_pairs.splice(index, 1)
			      }
			      this.setState({favorite_pairs: favorite_pairs})
			} )
		}else {
			this.props.dispatch(limitOrderActions.updateFavoriteAnonymous(base, quote, to_fav))
		} 
	}

	onSort = (i, is_asc) => {
		this.setState((state, props)=>({current_sort_index: i, current_sort_asc: is_asc}))
	}

	renderTh = () => {
		return [{html: "Pair", field: "base"}, 
				{html: "Price", field: "price"}, 
				{html: "Volume", field: "volume"}, 
				{html: "Change", field: "change"}].map((i, index) => <SortableTh key={i["html"]} 
																				  id={i["field"]}
																				  onSort={(is_asc) => this.onSort(i["field"], is_asc)}
																				  isEnable={this.state.current_sort_index == i["field"]} >{i["html"]}
																	</SortableTh>) 
	}
	
	search(quotes){
      const {current_search, current_sort_index, current_sort_asc, pairs} = this.state
      const {current_quote} = this.props

      return (current_quote == "FAV" ? Object.keys(quotes).reduce((res, key) => res.concat(quotes[key]),[]).filter((pair) => pair["is_favorite"]) : quotes[current_quote])
						.filter(pair => (pair["base"].toLowerCase().includes(current_search.toLowerCase())))
						.map(pair => ({...pair, 
										volume: (Object.keys(pairs).includes(pair.id) ? pairs[pair.id].volume : "-" ), 
										change: (Object.keys(pairs).includes(pair.id) ? pairs[pair.id].change : "0" )
									}))
						.sort(function(a,b){return (current_sort_asc ? -1 : 1)*(a[current_sort_index] > b[current_sort_index] ? -1 : 1)})
	}

	renderQuotes(){
	  	const {tokens, favorite_pairs_anonymous} = this.props
	  	const {favorite_pairs} = this.state
	  	const fav = (utils.isUserLogin() ? favorite_pairs : favorite_pairs_anonymous)
		console.log("{}", utils.isUserLogin, fav, favorite_pairs, favorite_pairs_anonymous)

	  	const pairs = {}
      	const quotes = Object.keys(tokens).filter((key)=> (("is_quote" in tokens[key]) && tokens[key]["is_quote"]))
                  .reduce((res, quote) => {
                    res[quote] = Object.keys(tokens)
                                .reduce((vt, key) =>{ 
                                  return key == quote ? vt : vt.concat(
                                    {   id: key+"_"+quote, 
	                                    base: key, quote: quote, 
	                                    price: (BigNumber(tokens[key].rate) /(quote == "ETH" ? new BigNumber(1000000000000000000) : BigNumber(tokens[quote].rate))).toFixed(5), 
	                                    is_favorite: fav.includes(key+"_"+quote),
	                                    volume: "-",
	                                    change: "0"
	                                });
                                }, []); 
                    return res
                  },{})
        return {quotes: quotes};

	}

	render(){
		console.log("[]", this.state)
		const {quotes} = this.renderQuotes()
		const {tokens, current_quote} = this.props
		const list = Object.keys(quotes).length >0 ? this.search(quotes) : []
		return (<div id="pair_rate"> 
					{Object.keys(tokens).length >0 ? <div id="container">
						<div id="panel">
									<PairRateQuoteList onClick={this.onQuoteClick} currentQuote={current_quote} quotes={["FAV"].concat(Object.keys(quotes))}/>
									<PairRateSearch onSearch={this.onSearch}/>
								</div>
								<table>
									<thead>
										<tr>
											<th width="10%"></th>
											{this.renderTh()}
										</tr>
									</thead>
									<tbody>
										{list.map(pair => <tr key={pair["id"]}>
												<td onClick={() => this.onFavoriteClick(pair["base"], pair["quote"], !pair["is_favorite"])}>{pair["is_favorite"] ? <i className="material-icons active">star</i>
				 : <i className="material-icons">star_border</i>}</td>
												<td>{pair["base"] + "/" + pair["quote"]}</td>
												<td>{pair["price"]}</td>
												<td>{pair["volume"]}</td>
												<td className={pair["change"] > 0 ? "up" : "down"}>{Math.abs(pair["change"])}%</td>
											</tr>)} 
									</tbody>
								</table>
					</div> : <div className="rate-loading"> <img src={require('../../../assets/img/waiting-white.svg')} /></div>}
			</div>)
	}
}

class SortableTh extends React.Component {
	constructor(){
		super()
		this.state = {is_asc: true}
	}
	onSort = (isAsc) => {
		const {isEnable} = this.props
		this.props.onSort(isEnable ? !this.state.is_asc : true)
		this.setState((state, props) => ({is_asc: (isEnable ? !state.is_asc : true)}))
	}
	render() {
		const {children, isEnable} = this.props
		const {is_asc} = this.state
		return <th width="20%" onClick={() => this.onSort(is_asc)}> 
				{children} 
				<img src={isEnable ? (is_asc ? "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE0IDE4Ij4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPHBhdGggZD0iTS01LTNoMjR2MjRILTV6Ii8+CiAgICAgICAgPHBhdGggZmlsbD0iIzVBNUU2NyIgZD0iTTExIDE0LjAxVjdIOXY3LjAxSDZMMTAgMThsNC0zLjk5aC0zeiIvPgogICAgICAgIDxwYXRoIGZpbGw9IiNGRjkwMDgiIGQ9Ik00IDBMMCAzLjk5aDNWMTFoMlYzLjk5aDN6Ii8+CiAgICA8L2c+Cjwvc3ZnPgo=" : 
					"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE0IDE4Ij4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPHBhdGggZD0iTS01LTNoMjR2MjRILTV6Ii8+CiAgICAgICAgPHBhdGggZmlsbD0iI0ZGOTAwOCIgZD0iTTExIDE0LjAxVjdIOXY3LjAxSDZMMTAgMThsNC0zLjk5aC0zeiIvPgogICAgICAgIDxwYXRoIGZpbGw9IiM1QTVFNjciIGQ9Ik00IDBMMCAzLjk5aDNWMTFoMlYzLjk5aDN6Ii8+CiAgICA8L2c+Cjwvc3ZnPgo="):""}/>
			</th>
	} 
}


class PairRateQuoteList extends React.Component{
	render(){
		const {currentQuote, quotes, onClick} = this.props
		return <div id="quote_panel">{quotes.map(i => <span key={i} className={currentQuote == i ? "active" :""} onClick={() => onClick(i)}>
					{i == "FAV" ? <i className="material-icons">{currentQuote == i ? "star" : "star_border"}</i> : i}
			</span>)}</div>;
	}
}

class PairRateSearch extends React.Component{
	constructor(){
		super()
		this.state = {text: ""} 
	}
	onChange = (e) => {
		const {onSearch} = this.props
		onSearch(e.target.value)
		this.setState({text: e.target.value})
	}	
	render(){
		return <div id="search_panel"> 
			<input type="text" value={this.state.text} onChange={this.onChange} />
		</div>
	}
}

export default PairRateLayout