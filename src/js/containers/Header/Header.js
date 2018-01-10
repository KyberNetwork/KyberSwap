import React from "react"
import { Link } from 'react-router-dom'
import { connect } from "react-redux"
import { Rate, Address, Notify, AccountBalance, InfoLink } from "../Header"
import { getTranslate } from 'react-localize-redux';

import HeaderView from '../../components/Header/HeaderView'

@connect((store) => {

  var location = "/"
  if (store.router.location){
    location = store.router.location.pathname
  }
  return { 
    location: location,
    txs: store.txs,
    account: store.account.account,
    translate: getTranslate(store.locale)
  }
})

export default class Header extends React.Component {

  render() {
  var infoMenu = this.props.location === "/"? <InfoLink />:""
  var balance = this.props.account?<AccountBalance />:false 
    return (
      <HeaderView 
        account={this.props.account}
        address={<Address 
          path={this.props.location.pathname}
          translate={this.props.translate}
          />}
        rate={<Rate />}
        balance = {balance}
        infoMenu = {infoMenu}

      />
    )
  }
}
