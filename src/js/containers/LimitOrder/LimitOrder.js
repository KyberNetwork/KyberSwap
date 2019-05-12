import React from "react"
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'
import {HeaderTransaction} from "../TransactionCommon"

import * as limitOrderActions from "../../actions/limitOrderActions"

import {LimitOrderBody} from "../LimitOrder"


@connect((store, props) => {
  const account = store.account.account
  const translate = getTranslate(store.locale)
  const tokens = store.tokens.tokens
  const limitOrder = store.limitOrder
  const ethereum = store.connection.ethereum

  

  return {
    translate, limitOrder, tokens, account, ethereum,
    params: {...props.match.params},

  }
})

export default class LimitOrder extends React.Component {

  constructor(){
    super()
    this.state = {
      invervalProcess: null
    }
  }
  fetchCurrentRate = () => {
    var source = this.props.limitOrder.sourceToken
    var dest = this.props.limitOrder.destToken
    var sourceAmount = this.props.limitOrder.sourceAmount
    var sourceTokenSymbol = this.props.limitOrder.sourceTokenSymbol
    var isManual = false

    if (this.props.ethereum){
      this.props.dispatch(limitOrderActions.updateRate(source, dest, sourceAmount, sourceTokenSymbol, isManual));
    }
    
  }

  setInvervalProcess = () => {
    var invervalFunc = () => {
      this.fetchCurrentRate()
    }
    invervalFunc()
    this.invervalProcess =  setInterval(invervalFunc, 10000)
  }

  componentWillUnmount = () => {
    clearInterval(this.invervalProcess)
  }

  componentDidMount = () =>{
    // set interval process
    this.setInvervalProcess()

    if ((this.props.params.source.toLowerCase() !== this.props.limitOrder.sourceTokenSymbol.toLowerCase()) ||
      (this.props.params.dest.toLowerCase() !== this.props.limitOrder.destTokenSymbol.toLowerCase()) ){

      var sourceSymbol = this.props.params.source.toUpperCase()
      var sourceAddress = this.props.tokens[sourceSymbol].address

      var destSymbol = this.props.params.dest.toUpperCase()
      var destAddress = this.props.tokens[destSymbol].address

      this.props.dispatch(limitOrderActions.selectTokenAsync(sourceSymbol, sourceAddress, "source"))
      this.props.dispatch(limitOrderActions.selectTokenAsync(destSymbol, destAddress, "dest"))
    }
  }


  render() {
    return (
      <div className={"limit-order-container"}>
        <HeaderTransaction page="limit_order"/>
        <LimitOrderBody page="limit_order"/>        
      </div>
    )
  }
}
