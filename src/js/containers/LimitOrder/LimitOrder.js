import React from "react"
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'
import {HeaderTransaction} from "../TransactionCommon"

import EthereumService from "../../services/ethereum/ethereum"

import * as limitOrderActions from "../../actions/limitOrderActions"

import constants from "../../services/constants"

import {LimitOrderBody} from "../LimitOrder"
import * as limitOrderServices from "../../services/limit_order";
import { isUserLogin, getCookie } from "../../utils/common";

import BLOCKCHAIN_INFO from "../../../../env";

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
      intervalGroup: []
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

  setInterValGroup = (callback, intervalTime) => {    
    var intevalProcess = setInterval(callback, intervalTime)
    this.state.intervalGroup.push(intevalProcess)
  }

  setInvervalProcess = () => {
   
    this.setInterValGroup(this.fetchCurrentRate, 10000)

    this.setInterValGroup(this.fetchOpenOrders.bind(this), 10000)

  }

  componentWillUnmount = () => {
    for (var i= 0; i<this.state.intervalGroup.length; i++ ){
      clearInterval(this.state.intervalGroup[i])  
    }
    this.setState({intervalGroup: []})    
  }

  async fetchOpenOrders() {   
    // requuest update order
    this.props.dispatch(limitOrderActions.updateOpenOrderStatus())
  }

  async getOrders() {
    try {
      const totalOrders = getCookie("order_count");
      if (totalOrders <= constants.LIMIT_ORDER_CONFIG.pageSize) {
        const orders = await limitOrderServices.getOrders();
        this.props.dispatch(limitOrderActions.addListOrder(orders));
        this.props.dispatch(limitOrderActions.setOrdersCount(orders.length));
        this.props.dispatch(limitOrderActions.setFilterMode("client"));
      } else {
        const { itemsCount, orders } = await limitOrderServices.getOrdersByFilter(
          this.props.limitOrder.addressFilter,
          this.props.limitOrder.pairFilter,
          this.props.limitOrder.statusFilter,
          this.props.limitOrder.timeFilter,
          this.props.limitOrder.dateSort
        );
        this.props.dispatch(limitOrderActions.addListOrder(orders));
        this.props.dispatch(limitOrderActions.setOrdersCount(itemsCount));
        this.props.dispatch(limitOrderActions.setFilterMode("server"));
      }

      this.props.dispatch(limitOrderActions.getListFilter());

      // const { pairs, addresses, orderStats } = await limitOrderServices.getUserStats();

      // this.props.dispatch(limitOrderActions.getListFilterComplete(pairs, addresses));

      // const totalOrders = orderStats.open + orderStats.in_progress + orderStats.invalidated + orderStats.cancelled + orderStats.filled;
      
    } catch (err) {
      console.log(err);
    }
  }

  getTokenInit = () => {
    var sourceTokenSymbol = this.props.params.source.toUpperCase()
    if(sourceTokenSymbol === "ETH") {
      sourceTokenSymbol = BLOCKCHAIN_INFO.wrapETHToken
    }
    var sourceToken = this.props.tokens[sourceTokenSymbol].address

    var destTokenSymbol = this.props.params.dest.toUpperCase()
    if(destTokenSymbol === "ETH") {
      destTokenSymbol = BLOCKCHAIN_INFO.wrapETHToken
    }
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

    this.fetchCurrentRateInit()

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
