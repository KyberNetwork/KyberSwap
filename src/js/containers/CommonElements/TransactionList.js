//import "Components/transaction_list/transaction_list.scss";

import React from 'react';
import { connect } from "react-redux"
import { TransactionListView } from '../../components/CommonElement'
import BLOCKCHAIN_INFO from "../../../../env"

@connect((store) => {
  return { 
    global: store.global,
    tokens: store.tokens.tokens}
})

class TransactionList extends React.Component {
  render() {
    if (this.props.global.history.logsEth.length ===0 && this.props.global.history.logsToken.length ===0){
      return ""
    }
    return (
      <TransactionListView tokens = {this.props.tokens}
                          logsEth = {this.props.global.history.logsEth}
                          logsToken = {this.props.global.history.logsToken}
                          averageTime={BLOCKCHAIN_INFO.averageBlockTime}  
                          lastBlock={this.props.global.history.currentBlock}/>
    )
  }
}

export default TransactionList;