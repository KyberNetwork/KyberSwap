import React from "react"
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'
import EthereumService from "../../services/ethereum/ethereum"
import * as limitOrderActions from "../../actions/limitOrderActions"
import * as globalActions from "../../actions/globalActions"
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
  const src = props.match.params.source.toUpperCase()
  const dest = props.match.params.dest.toUpperCase()

  return {
    translate, limitOrder, tokens, account, ethereum,
    params: {...props.match.params},
    src, dest
  }
})

export default class LimitOrder extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      intervalGroup: []
    };
    
    this.LimitOrderAccount = withSourceAndBalance(LimitOrderAccount)
  }
  
  componentDidMount = () => {
    this.updatePathOrder()
    this.setIntervalProcess()
    this.fetchCurrentRateInit()
    this.fetchListOrders()
    this.fetchPendingBalance()
    this.fetchFavoritePairsIfLoggedIn()
  }
  
  componentWillUnmount = () => {
    for (var i= 0; i<this.state.intervalGroup.length; i++ ){
      clearInterval(this.state.intervalGroup[i])
    }
    this.setState({intervalGroup: []})
  }
  
  setIntervalProcess = () => {
    this.setInterValGroup(this.fetchCurrentRate, 10000)
    this.setInterValGroup(this.fetchOpenOrders.bind(this), 10000)
    this.setInterValGroup(this.fetchListOrders.bind(this), 10000)
    this.setInterValGroup(this.fetchPendingBalance.bind(this), 10000)
  }
  
  setInterValGroup = (callback, intervalTime) => {
    var intevalProcess = setInterval(callback, intervalTime)
    this.state.intervalGroup.push(intevalProcess)
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
    if (common.isUserLogin()) {
      let res = await limitOrderServices.getFavoritePairs()
      this.props.dispatch(limitOrderActions.addListFavoritePairs(res.map(obj => `${obj.base.toUpperCase()}_${obj.quote.toUpperCase()}`)));
    }
  }

  updatePathOrder = () => {
    var {sourceTokenSymbol, sourceToken, destTokenSymbol, destToken} = this.getTokenInit()
    var tokens = this.props.tokens
    var src = this.props.src
    var dest = this.props.dest
    var currentQuote = sourceTokenSymbol;
    const isSrcAndDestNotQuote = !tokens[src].is_quote && !tokens[dest].is_quote;
    const isSrcAndDestQuote = tokens[src].is_quote && tokens[dest].is_quote;
    const isSrcLessPriority = tokens[src].quote_priority < tokens[dest].quote_priority;
    const isSrcBiggerPriority = tokens[src].quote_priority > tokens[dest].quote_priority;
    const isSrcEqualPriority = tokens[src].quote_priority === tokens[dest].quote_priority;

    if (!tokens[src].is_quote && tokens[dest].is_quote) {
      currentQuote = destTokenSymbol
    }
    
    if (isSrcAndDestNotQuote || (isSrcAndDestQuote && isSrcEqualPriority)) {
      this.props.dispatch(globalActions.goToRoute(constants.BASE_HOST +  "/limit_order/knc-weth"));
      currentQuote = BLOCKCHAIN_INFO.wrapETHToken
    }

    if (isSrcAndDestQuote && isSrcLessPriority) {
      currentQuote = destTokenSymbol
    } else if (isSrcAndDestQuote && isSrcBiggerPriority) {
      this.props.dispatch(globalActions.goToRoute(`${constants.BASE_HOST}/limit_order/${destTokenSymbol.toLowerCase()}-${sourceTokenSymbol.toLowerCase()}`));
      this.props.dispatch(limitOrderActions.selectToken(destTokenSymbol, destToken, sourceTokenSymbol, sourceToken));
      this.props.dispatch(limitOrderActions.updateCurrentQuote(sourceTokenSymbol));
      return;
    }

    this.props.dispatch(limitOrderActions.selectToken(sourceTokenSymbol, sourceToken, destTokenSymbol, destToken));
    this.props.dispatch(limitOrderActions.updateCurrentQuote(currentQuote))
  };
  
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
