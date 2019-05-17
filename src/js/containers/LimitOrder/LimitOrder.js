import React from "react"
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'
import {HeaderTransaction} from "../TransactionCommon"

import EthereumService from "../../services/ethereum/ethereum"

import * as limitOrderActions from "../../actions/limitOrderActions"

import {LimitOrderBody} from "../LimitOrder"
import * as limitOrderServices from "../../services/limit_order";
import { isUserLogin } from "../../utils/common";

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

  getEthereumInstance = () => {
    var ethereum = this.props.ethereum
    if (!ethereum){
      ethereum = new EthereumService()
    }
    return ethereum
  }
  
  fetchCurrentRate = () => {
    var source = this.props.limitOrder.sourceToken
    var dest = this.props.limitOrder.destToken
    var sourceAmount = this.props.limitOrder.sourceAmount
    var sourceTokenSymbol = this.props.limitOrder.sourceTokenSymbol
    var isManual = false

    var ethereum = this.getEthereumInstance()
    this.props.dispatch(limitOrderActions.updateRate(ethereum, source, dest, sourceAmount, sourceTokenSymbol, isManual));
    
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

  async getOrders() {
    try {
      const results = await limitOrderServices.getOrders();
      this.props.dispatch(limitOrderActions.addListOrder(results));
    } catch (err) {
      console.log(err);
    }
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

      // var ethereum = this.getEthereumInstance()
      this.props.dispatch(limitOrderActions.selectTokenAsync(sourceSymbol, sourceAddress, "source"))
      this.props.dispatch(limitOrderActions.selectTokenAsync(destSymbol, destAddress, "dest"))
    }

    // Get list orders
    if (isUserLogin()) {
      this.getOrders();
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
