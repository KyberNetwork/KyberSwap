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
    this.props.dispatch(actions.updateHistoryExchange(ethereum, range, true))    
  }
  showNext = (e) => {
    if(toBlock - range < 1){
      return
    }
    var ethereum = this.props.ethereum
    var toBlock = this.props.global.history.toBlock
    var range = this.props.global.history.range
    this.props.dispatch(actions.updateHistoryExchange(ethereum, range, false, toBlock - range))  
  }
  showPrevious = (e) => {
    if(this.props.global.history.isFirstPage){
      return
    }
    var ethereum = this.props.ethereum
    var toBlock = this.props.global.history.toBlock
    var range = this.props.global.history.range
    var currentBlock = this.props.global.history.currentBlock
    if (toBlock + range >= currentBlock){
      this.props.dispatch(actions.updateHistoryExchange(ethereum, range, true))    
    }else{
      this.props.dispatch(actions.updateHistoryExchange(ethereum, range, false, toBlock + range))  
    }    
  }

  render() {
    return (
      <HistoryExchange fromBlock={this.props.global.history.fromBlock}
        toBlock={this.props.global.history.toBlock}
        range = {this.props.global.history.range}
        isFirstPage = {this.props.global.history.isFirstPage}
        logs={this.props.global.history.logs}
        lastBlock={this.props.global.history.currentBlock}
        averageTime={BLOCKCHAIN_INFO.averageBlockTime} 
        tokens = {this.props.tokens}
        first = {this.showFirst}
        next = {this.showNext}
        previous = {this.showPrevious}
        />
    )
  }
}