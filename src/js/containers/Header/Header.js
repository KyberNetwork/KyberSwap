import React from "react"
import { connect } from "react-redux"
import {Rate, Address, Notify} from "../Header"

@connect((store) => {
  return {txs: store.txs}
})

export default class Header extends React.Component {
  
	render() {
    // const transactionsNum = Object.keys(this.props.txs).length;
    return (
      
        <div>
          <div>Icon</div>
          <Rate />
          <Address />
          <Notify />
        </div>
    )
  }
}
