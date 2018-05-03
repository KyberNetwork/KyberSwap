import React from "react"
import { connect } from "react-redux"

import { AccountBalanceLayout } from '../../components/TransactionCommon'
import { selectTokenAsync } from '../../actions/exchangeActions'
import { selectToken } from '../../actions/transferActions'
import { hideSelectToken } from "../../actions/utilActions"

import { getTranslate } from 'react-localize-redux';

@connect((store) => {
  var location = store.router.location.pathname
  var sourceActive = 'ETH'
  var brocastStep = false
  if (location === "/exchange") {
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

  constructor() {
    super()
    this.state = {
      expanded: false,
      showZeroBalance: true,
      
    }
  }

  toggleBalances() {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  toggleZeroBalance(){
    this.setState({
      showZeroBalance: !this.state.showZeroBalance
    })
  }

  selectToken(e, symbol, address) {
    if(this.props.brocastStep){
      return
    }
    if (this.props.location === "/exchange") {
      this.props.dispatch(selectTokenAsync(symbol, address, "source", this.props.ethereum))
    } else {
      this.props.dispatch(selectToken(symbol, address))
      this.props.dispatch(hideSelectToken())
    }
    this.setState({
      expanded: false
    })
  }

  render() {
    return (
      <AccountBalanceLayout
        tokens={this.props.tokens}
        expanded={this.state.expanded}
        toggleBalances={this.toggleBalances.bind(this)}
        translate={this.props.translate}
        sourceActive={this.props.sourceActive}
        selectToken={this.selectToken.bind(this)}
        showBalance = {this.props.showBalance}
        showZeroBalance={this.state.showZeroBalance}
        toggleZeroBalance={this.toggleZeroBalance.bind(this)}
      />
    )
  }
}

