import React from "react"
import { connect } from "react-redux"
import {Rate, Address, Transactions} from "../Header"

import { clearTxs } from "../../actions/txActions"
@connect((store) => {
  return {txs: store.txs}
})

export default class Header extends React.Component {
  constructor(){
    super();
    this.state = {
      displayTrans:false,
    }
  }
  displayTransactions(){
    this.setState({
      displayTrans: !this.state.displayTrans
    })
    if(this.state.displayTrans) this.props.dispatch(clearTxs());
  }
	render() {
    const transactionsNum = Object.keys(this.props.txs).length;
    return (
        <div>
          <div>Icon</div>
          <Rate />
          <Address />
          <div>
            <a onClick={this.displayTransactions.bind(this)}>Notify ({transactionsNum})</a>
          </div>
          <div className="transaction">
            {this.state.displayTrans ? <Transactions /> : ''}    
          </div>
        </div>
    )
  }
}
