import React from "react"
import { connect } from "react-redux"
import {Rate, Address} from "../Header"

import { Transactions } from "../Transaction"

@connect((store) => {
  return {...store.transactions}
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
  }
	render() {
    const transactionsNum = this.props.transactions.length;
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
