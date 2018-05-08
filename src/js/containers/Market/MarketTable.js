import React from "react"
import { connect } from "react-redux"

import { default as _ } from 'underscore'
import { getTranslate } from 'react-localize-redux'

import {Selector} from "../CommonElements"

@connect((store) => {
  
  var tokens = [
    {
      symbol :"KNC",
      change:"3%",
      increase:true,
      volumn_24h:230,
      market_cap:230,
      circulating_supply:230,
      last_price:120,
      sell_price:120,
      buy_price:120
    },
    {
      symbol :"OMG",
      change:"3%",
      increase:false,
      volumn_24h:230,
      market_cap:230,
      circulating_supply:230,
      last_price:120,
      sell_price:120,
      buy_price:120
    },
    {
      symbol :"DGD",
      change:"36%",
      increase:false,
      volumn_24h:230,
      market_cap:230,
      circulating_supply:230,
      last_price:120,
      sell_price:120,
      buy_price:120
    }
  ]

  return {
    translate: getTranslate(store.locale),
  }
})

export default class MarketTable extends React.Component {
  constructor() {
		super();
		this.state = {
      search_word: "",
      currency: {        
         listItem : {
           "ETH" : "ETH",
           "USD" : "USD"
         },
          focus:"ETH"
      },
      sort: {
        support : [
          {name : "Highest price", code : 0},
          {name : "Lowest price", code : 1},
        ],
        active: 0
      },
      column: {
        display: {
          support : [
            {name : "Normal", code : 0},
          ],
          active: 0
        },
        shows : {
          last_7d:{
            name : "last 7d",
            active: true
          },
          change:{
            name : "% change",
            active: true
          },
          last_price:{
            name : "Last price",
            active: true
          },
          volume:{
            name : "Volume",
            active: true
          }
        }
      }
		}
  } 
  



  // setSearchWord = (value) => {
  //   this.setState({search_word:value})
  // }
  // lazySearchWord = _.debounce(this.setSearchWord, 500)
  changeSearch = (e) => {
    var value  = e.target.value
    this.setState({search_word:value})
  }  

  getSearchTokensFragment = () =>{
    return <div>
      <label>Search</label>
      <input placeholder="Try Searching for Token" value ={this.state.search_word} onChange={(e) => this.changeSearch(e)}/>
    </div>
  }

  getCurrencyFragment = () =>{
    return <div>
      <label>Currency</label>
      <Selector 
        defaultItem = {this.state.currency.listItem[this.state.currency.focus]}
        listItem = {this.state.currency.listItem}
      />
    </div>
  }
  getSortFragment = () =>{
    return <div>Sort fragment</div>
  }
  getColumnFragment = () =>{
    return <div>Column fragment</div>
  }

  getTableFragment = () => {
    return <div>Table fragment</div>
  }

  render() {
    return <div>
      <h2>Ethereum Markets</h2>
      <div>
        <div>
          {this.getSearchTokensFragment()}
          {this.getCurrencyFragment()}
          {this.getSortFragment()}
        </div>
        <div>
          {this.getColumnFragment()}
        </div>
      </div>
      <div>
        {this.getTableFragment()}
      </div>
    </div>
  }
}