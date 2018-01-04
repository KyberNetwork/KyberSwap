import React from "react"
import { connect } from "react-redux"

import { AccountBalanceView } from '../../components/Header'
import { selectTokenAsync } from '../../actions/exchangeActions'
import { selectToken } from '../../actions/transferActions'
import { hideSelectToken } from "../../actions/utilActions"

import { getTranslate } from 'react-localize-redux';

@connect((store) => {
  var location = store.router.location.pathname
  var sourceActive = 'ETH'
  if (location === "/exchange") {
    sourceActive = store.exchange.sourceTokenSymbol
  } else {
    sourceActive = store.transfer.tokenSymbol
  }
  return {
    tokens: store.tokens.tokens,
    translate: getTranslate(store.locale),
    ethereum: store.connection.ethereum,
    sourceActive,
    location 
  }
})

export default class AccountBalance extends React.Component {

  constructor() {
    super()
    this.state = {
      expanded: false,
    }
  }

  toggleBalances() {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  selectToken(e, symbol, address) {
    if (this.props.location === "/exchange") {
      this.props.dispatch(selectTokenAsync(symbol, address, "source", this.props.ethereum))
    } else {
      this.props.dispatch(selectToken(symbol, address))
      this.props.dispatch(hideSelectToken())
    }
    this.setState({
      expanded: !this.state.expanded
    })
  }

  render() {
    return (
      <AccountBalanceView
        tokens={this.props.tokens}
        expanded={this.state.expanded}
        toggleBalances={this.toggleBalances.bind(this)}
        translate={this.props.translate}
        sourceActive={this.props.sourceActive}
        selectToken={this.selectToken.bind(this)}
      />
    )
  }
}

