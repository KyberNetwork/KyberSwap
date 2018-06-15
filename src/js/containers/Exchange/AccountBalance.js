import React from "react"
import { connect } from "react-redux"

import { AccountBalanceLayout } from '../../components/Exchange'
import { selectTokenAsync } from '../../actions/exchangeActions'
import { selectToken } from '../../actions/transferActions'
import { hideSelectToken } from "../../actions/utilActions"

import { getTranslate } from 'react-localize-redux';

@connect((store) => {
  var location = store.router.location.pathname
  var sourceActive = 'ETH'
  var brocastStep = false
  // alert(location)
  let location_ = location.split("/");
  if (location_.slice(-1).pop() && location_.slice(-1).pop() === "exchange") {
    sourceActive = store.exchange.sourceTokenSymbol
    brocastStep = store.exchange.step === 3? true: false
  } else {
    sourceActive = store.transfer.tokenSymbol
    brocastStep = store.transfer.step === 2? true: false
  }
  return {
    tokens: store.tokens.tokens,
    translate: getTranslate(store.locale),
    ethereum: store.connection.ethereum,
    showBalance: store.global.showBalance,
    brocastStep,
    sourceActive,
    location 
  }
})

export default class AccountBalance extends React.Component {

  constructor(){
    super()
    this.state = {
      searchWord: ""
    }
  }
  changeSearchBalance = (e) => {
    var value = e.target.value
    this.setState({searchWord:value})
  }
  selectToken(e, symbol, address) {
    if(this.props.brocastStep){
      return
    }
    // alert(this.props.location)
    let location = this.props.location.split("/");
    if (location.slice(-1).pop() && location.slice(-1).pop() === "exchange") {
      this.props.dispatch(selectTokenAsync(symbol, address, "source", this.props.ethereum))
    } else {
      this.props.dispatch(selectToken(symbol, address))
      this.props.dispatch(hideSelectToken())
    }
  }

  render() {
    return (
      <AccountBalanceLayout
        tokens={this.props.tokens}
        translate={this.props.translate}
        sourceActive={this.props.sourceActive}
        selectToken={this.selectToken.bind(this)}
        showBalance = {this.props.showBalance}
        changeSearchBalance = {this.changeSearchBalance}
        searchWord = {this.state.searchWord}
      />
    )
  }
}

