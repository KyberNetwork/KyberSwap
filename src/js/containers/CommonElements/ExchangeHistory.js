import React from "react"
import { connect } from "react-redux"
import { HistoryExchange } from '../../components/CommonElement'
import BLOCKCHAIN_INFO from "../../../../env"
import * as actions from "../../actions/globalActions"

@connect((store) => {
  return { 
    ethereum: store.connection.ethereum,
    global: store.global,
    tokens: store.tokens.tokens}
})

export default class ExchangeHistory extends React.Component {
  showFirst = (e) =>{
    var ethereum = this.props.ethereum
    var range = this.props.global.history.range
    var itemPerPage = this.props.global.history.itemPerPage
    this.props.dispatch(actions.updateHistoryExchange(ethereum, 0, itemPerPage, false))    
  }
  showNext = (e) => {
    var page = this.props.global.history.page
    var itemPerPage = this.props.global.history.itemPerPage
    var eventsCount = this.props.global.history.eventsCount
    var maxPage = Math.round(eventsCount/itemPerPage)  
    if(page >= maxPage - 1){
      return
    }
    var ethereum = this.props.ethereum
    this.props.dispatch(actions.updateHistoryExchange(ethereum, page + 1, itemPerPage, false))  
  }
  showPrevious = (e) => {
    var page = this.props.global.history.page
    if(page === 0){
      return
    }
    var ethereum = this.props.ethereum
    var itemPerPage = this.props.global.history.itemPerPage
    this.props.dispatch(actions.updateHistoryExchange(ethereum, page - 1, itemPerPage, false)) 
  }

  render() {
    return (
      <HistoryExchange 
        isFetching = {this.props.global.history.isFetching}
        logs={this.props.global.history.logs}
        tokens={this.props.tokens}
        lastBlock={this.props.global.history.currentBlock}
        currentPage = {this.props.global.history.page}
        itemPerPage = {this.props.global.history.itemPerPage}
        eventsCount = {this.props.global.history.eventsCount}
        averageTime={BLOCKCHAIN_INFO.averageBlockTime} 
        tokens = {this.props.tokens}
        first = {this.showFirst}
        next = {this.showNext}
        previous = {this.showPrevious}
        />
    )
  }
}