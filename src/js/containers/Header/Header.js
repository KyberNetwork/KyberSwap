import React from "react"
import { Link } from 'react-router-dom'
import { connect } from "react-redux"
import { Rate, Address, Notify, AccountBalance, InfoLink } from "../Header"
import { getTranslate } from 'react-localize-redux';
import exchangeActions from "../../actions/exchangeActions"
import * as globalActions from "../../actions/globalActions"

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
    global: store.global,
    translate: getTranslate(store.locale)
  }
})

export default class Header extends React.Component {

  analyze = (txHash) => {
    this.props.dispatch(exchangeActions.analyzeError(this.props.ethereum, txHash))
  }

  toggleModal = () => {
    this.props.dispatch(globalActions.toggleAnalyze())
}


  render() {
//  var infoMenu = this.props.location === "/"? <InfoLink />:""
  //var balance = this.props.account?<AccountBalance />:false 

  var analyze = {
    action: this.analyze,
    isAnalize: this.props.global.isAnalize,
    isAnalizeComplete: this.props.global.isAnalizeComplete,
    analizeError : this.props.global.analizeError,
    selectedAnalyzeHash: this.props.global.selectedAnalyzeHash
  }

    return (
      <HeaderView 
        account={this.props.account}
        address={<Address 
          path={this.props.location.pathname}
          translate={this.props.translate}
          />}                
     //   infoMenu = {infoMenu}

        analyze={analyze} 
        onRequestClose={this.toggleModal}
        isOpen={this.props.global.isOpenAnalyze}
        translate={this.props.translate}
      />
    )
  }
}
