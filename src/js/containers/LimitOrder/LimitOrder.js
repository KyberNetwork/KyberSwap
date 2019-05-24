import React from "react"
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'
import {HeaderTransaction} from "../TransactionCommon"

import EthereumService from "../../services/ethereum/ethereum"

import * as limitOrderActions from "../../actions/limitOrderActions"

import constants from "../../services/constants"

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
    var sourceToken = this.props.limitOrder.sourceToken
    var destToken = this.props.limitOrder.destToken
    var sourceAmount = this.props.limitOrder.sourceAmount
    var sourceTokenSymbol = this.props.limitOrder.sourceTokenSymbol
    var destTokenSymbol = this.props.limitOrder.destTokenSymbol
    var isManual = false

    var ethereum = this.getEthereumInstance()
    this.props.dispatch(limitOrderActions.updateRate(ethereum, sourceTokenSymbol, sourceToken, destTokenSymbol, destToken, sourceAmount, isManual));
    
  }

  fetchCurrentRateInit = () => {
    var {sourceTokenSymbol, sourceToken, destTokenSymbol, destToken} = this.getTokenInit()
    var sourceAmount = 0
    var ethereum = this.getEthereumInstance()
    this.props.dispatch(limitOrderActions.updateRate(ethereum, sourceTokenSymbol, sourceToken, destTokenSymbol, destToken, sourceAmount, true, constants.LIMIT_ORDER_CONFIG.updateRateType.selectToken));
  }

  setInvervalProcess = () => {
    var invervalFunc = () => {
      this.fetchCurrentRate()
    }
    this.fetchCurrentRateInit()
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

  getTokenInit = () => {
    var sourceTokenSymbol = this.props.params.source.toUpperCase()
    var sourceToken = this.props.tokens[sourceTokenSymbol].address

    var destTokenSymbol = this.props.params.dest.toUpperCase()
    var destToken = this.props.tokens[destTokenSymbol].address

    return {sourceTokenSymbol, sourceToken, destTokenSymbol, destToken}
  }

  componentDidMount = () =>{
    // set interval process
    this.setInvervalProcess()

    var {sourceTokenSymbol, sourceToken, destTokenSymbol, destToken} = this.getTokenInit()

    if ((sourceTokenSymbol !== this.props.limitOrder.sourceTokenSymbol) ||
      (destTokenSymbol !== this.props.limitOrder.destTokenSymbol) ){

      this.props.dispatch(limitOrderActions.selectToken(sourceTokenSymbol, sourceToken, destTokenSymbol, destToken, "default"));

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
