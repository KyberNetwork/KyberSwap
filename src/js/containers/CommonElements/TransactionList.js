//import "Components/transaction_list/transaction_list.scss";

import React from 'react';
import { connect } from "react-redux"
import { TransactionListView } from '../../components/CommonElement'
import BLOCKCHAIN_INFO from "../../../../env"
import { getTranslate } from 'react-localize-redux';

@connect((store) => {
  return { 
    global: store.global,
    tokens: store.tokens.tokens,
    translate: getTranslate(store.locale),
    logsEth: store.global.history.logs.slice(0, 5), 
    logsToken: store.global.history.logs.slice(5, 10)
  }
})

class TransactionList extends React.Component {
  render() {
    if (!this.props.global.history || !this.props.global.history.logs || (this.props.global.history.logs.length ===0)){
      return ""
    }
    return (
      <TransactionListView tokens = {this.props.tokens}
                          logsEth = {this.props.logsEth}
                          logsToken = {this.props.logsToken}
                          averageTime={BLOCKCHAIN_INFO.averageBlockTime}  
                          lastBlock={this.props.global.history.currentBlock}
                          translate={this.props.translate}
                          />
    )
  }
}

export default TransactionList;