import React from "react"
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'
import EthereumService from "../../services/ethereum/ethereum"
import * as limitOrderActions from "../../actions/limitOrderActions"
import constants from "../../services/constants"
import {LimitOrderBody} from "../LimitOrder"
import limitOrderServices from "../../services/limit_order";
import * as common from "../../utils/common";
import BLOCKCHAIN_INFO from "../../../../env";
import { LimitOrderAccount, withSourceAndBalance } from "../../containers/LimitOrder"

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
    this.LimitOrderAccount = withSourceAndBalance(LimitOrderAccount)
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

  fetchPendingBalance = () => {
    if (!this.props.account) {
      return
    }
    this.props.dispatch(limitOrderActions.getPendingBalances(this.props.account.address))
  }

  setInterValGroup = (callback, intervalTime) => {    
    var intevalProcess = setInterval(callback, intervalTime)
    this.state.intervalGroup.push(intevalProcess)
  }

  setInvervalProcess = () => {
    this.setInterValGroup(this.fetchCurrentRate, 10000)
    this.setInterValGroup(this.fetchOpenOrders.bind(this), 10000)
    this.setInterValGroup(this.fetchListOrders.bind(this), 10000)    
    this.setInterValGroup(this.fetchPendingBalance.bind(this), 10000)    
  }

  componentWillUnmount = () => {
    for (var i= 0; i<this.state.intervalGroup.length; i++ ){
      clearInterval(this.state.intervalGroup[i])  
    }
    this.setState({intervalGroup: []})    
  }

  async fetchOpenOrders() {
    this.props.dispatch(limitOrderActions.updateOpenOrderStatus())
  }

  async fetchListOrders() {
    if (!common.isUserLogin()) {
      return
    }
    try {
      const limitOrderMode = limitOrderServices.getModeLimitOrder();
      if (limitOrderMode === "client") {
        this.props.dispatch(limitOrderActions.setFilterMode("client"));

        const orders = await limitOrderServices.getOrders();
        this.props.dispatch(limitOrderActions.addListOrder(orders));
        this.props.dispatch(limitOrderActions.setOrdersCount(orders.length));
      } else {
        this.props.dispatch(limitOrderActions.setFilterMode("server"));
        this.props.dispatch(limitOrderActions.getOrdersByFilter({}));
      }

      this.props.dispatch(limitOrderActions.getListFilter());
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
  async fetchFavoritePairsIfLoggedIn(){
    if (common.isUserLogin) {
      let res = await limitOrderServices.getFavoritePairs()
      this.props.dispatch(limitOrderActions.addListFavoritePairs(res.map(obj => `${obj.base.toUpperCase()}_${obj.quote.toUpperCase()}`)));
    }
  }
  componentDidMount = () => {
    this.setInvervalProcess()

    var {sourceTokenSymbol, sourceToken, destTokenSymbol, destToken} = this.getTokenInit()

    if ((sourceTokenSymbol !== this.props.limitOrder.sourceTokenSymbol) ||
      (destTokenSymbol !== this.props.limitOrder.destTokenSymbol) ){

      this.props.dispatch(limitOrderActions.selectToken(sourceTokenSymbol, sourceToken, destTokenSymbol, destToken, "default"));
    }

    this.fetchCurrentRateInit()
    this.fetchListOrders()
    this.fetchPendingBalance()
    this.fetchFavoritePairsIfLoggedIn()
  }

  render() {
    const LimitOrderAccount = this.LimitOrderAccount;
    return (
      <div>
        <LimitOrderAccount />
        <div className={"limit-order-container"}>
          <LimitOrderBody page="limit_order"/>
        </div>
      </div>
    )
  }
}
