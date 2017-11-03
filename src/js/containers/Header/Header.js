import React from "react"
import { Link } from 'react-router-dom'
import { connect } from "react-redux"
import { Rate, Address, Notify } from "../Header"

import HeaderView from '../../components/Header/HeaderView'

@connect((store) => {
  return { 
    txs: store.txs,
    account: store.account.account
  }
})

export default class Header extends React.Component {

  render() {
    return (
      <HeaderView account={this.props.account}
        address={<Address path={this.props.location.pathname}/>}
        rate={<Rate />}
      />
    )
  }
}
