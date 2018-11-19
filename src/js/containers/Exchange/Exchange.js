import React from "react"
import { connect } from "react-redux"
import {ExchangeBody} from "../Exchange"
import { getTranslate } from 'react-localize-redux'
import * as converter from "../../utils/converter"
import * as validators from "../../utils/validators"
import * as exchangeActions from "../../actions/exchangeActions"
import {setIsChangingPath} from "../../actions/globalActions"
import { clearSession } from "../../actions/globalActions"
import {HeaderTransaction} from "../TransactionCommon"
import * as analytics from "../../utils/analytics"

@connect((store, props) => {
  const account = store.account.account
  const translate = getTranslate(store.locale)
  const tokens = store.tokens.tokens
  const exchange = store.exchange
  const ethereum = store.connection.ethereum

  return {
    translate, exchange, tokens, account, ethereum,
    params: {...props.match.params},

  }
})

export default class Exchange extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      isAnimation: false
    }
  }

  setAnimation = () => {
    this.setState({isAnimation: true})
  }

  componentDidMount = () =>{
    if ((this.props.params.source.toLowerCase() !== this.props.exchange.sourceTokenSymbol.toLowerCase()) ||
      (this.props.params.dest.toLowerCase() !== this.props.exchange.destTokenSymbol.toLowerCase()) ){

      var sourceSymbol = this.props.params.source.toUpperCase()
      var sourceAddress = this.props.tokens[sourceSymbol].address

      var destSymbol = this.props.params.dest.toUpperCase()
      var destAddress = this.props.tokens[destSymbol].address

      this.props.dispatch(exchangeActions.selectTokenAsync(sourceSymbol, sourceAddress, "source", this.props.ethereum))
      this.props.dispatch(exchangeActions.selectTokenAsync(destSymbol, destAddress, "des", this.props.ethereum))
    }
  }

  render() {
    return (
      <div className={"exchange-container"}>
        <HeaderTransaction page="exchange"/>
        <ExchangeBody/>
      </div>
    )
  }
}
