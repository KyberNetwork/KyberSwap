import React from "react"
import { connect } from "react-redux"
import ReactTable from 'react-table'
import { getTranslate } from 'react-localize-redux'
import * as actions from "../../actions/marketActions"
import * as converters from "../../utils/converter"
import {Line} from 'react-chartjs-2';
import * as analytics from "../../utils/analytics";
import { getAssetUrl } from "../../utils/common";

@connect((store, props) => {
  var data = props.data
  return {
    translate: getTranslate(store.locale),
    data: data,
    makeSort: props.makeSort,
    sortType: props.sortType,
    handle24hChange: props.handle24hChange,
    drawChart: props.drawChart
  }
})

export default class MarketMobile extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      currentActive: {}
    }
  }

  changeState = (pair) => {
    const state = {...this.state.currentActive}
    if (!state[pair] || state[pair] == false) {
      state[pair] = true
    } else {
      state[pair] = false
    }
    
    this.setState({
      currentActive: state
    })
  }
  
  getTableBody = () => {
    return this.props.data.map((value, key) => {
      return (
        <div key={key} className={`table-row ${this.state.currentActive[value.market] ? 'full-info' : ''}`} onClick={(e) => {this.changeState(value.market)}}>
          {!this.state.currentActive[value.market] ? 
            <div className={"grid-x"}>
              <div className={"cell small-6 token-pair"}>
                <img src={getAssetUrl(`tokens/${value.info.symbol.toLowerCase()}.svg`)} />
                {value.market}
              </div>
              <div className={"cell small-6 sell-price"}>
                <div>
                  <div className={"price-eth"}>{value.ETH.sellPrice} ETH</div>
                  <div className={"price-usd"}>= USD {value.USD.sellPrice}</div>
                </div>
              </div>
            </div>
            : 
            <div className="full-info-mobile">
              <div className={"row-1"}>
                <div className={"token-pair"}>
                  <img src={getAssetUrl(`tokens/${value.info.symbol.toLowerCase()}.svg`)} />
                  {value.market}
                </div>
                <div className={`change-24h`}>
                  <div>{this.props.handle24hChange ? this.props.handle24hChange(value.change) : "---"}</div>
                </div>
              </div>
              <div className={"in-24h"}>in 24h</div>
              <div className={"row-2"}>
                <div className={"price-info sell-info"}>
                  <div>Sell price</div>
                  <div className={"price-eth"}>{value.ETH.sellPrice} <span>ETH</span></div>
                  <div className={"price-usd"}>= USD {value.USD.sellPrice}</div>
                </div>
                <div className={"split-div"}></div>
                <div className={"price-info buy-info"}>
                  <div>Buy price</div>
                  <div className={"price-eth"}>{value.ETH.buyPrice} <span>ETH</span></div>
                  <div className={"price-usd"}>= USD {value.USD.buyPrice}</div>
                </div>
              </div>
              <div className={"row-3"}>
                {this.props.drawChart(value)}
              </div>
              <div className={"row-4"}>
                <div className={"volume"}>Volume: {value.volume} ETH</div>
                <div className={"market-cap"}>Market Cap: {value.market_cap} ETH</div>
              </div>
            </div>
          }
        </div>
      )
    })
  }

  sortData = (key) => {
    this.props.makeSort(key)
  }

  getClass = (key) => {
    return this.props.sortType[key] ?  this.props.sortType[key] : ''
  }

  render() {
    // const 
    return (
      <div className={"market-mobile"}>
        <div className={"table-header grid-x"}>
          <div className={`cell small-6 th-token-pair ${this.getClass("market")}`} 
            onClick={(e) => this.sortData("market")}>
            <img src={require("../../../assets/img/landing/sort.svg")} />
            {this.props.translate("market.market") || "Market"}
          </div>
          <div className={`cell small-6 th-sell-price ${this.getClass("sellPrice")}`} 
            onClick={(e) => this.sortData("sellPrice")}>
            <img src={require("../../../assets/img/landing/sort.svg")} />
            {this.props.translate("market.sell_price") || "Sell price"}
          </div>
        </div>
        <div className={"table-body"}>
          {this.getTableBody()}
        </div>
      </div>
    )
  }
}
