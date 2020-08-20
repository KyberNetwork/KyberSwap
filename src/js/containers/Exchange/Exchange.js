import React from "react"
import { connect } from "react-redux"
import {ExchangeBody} from "../Exchange"
import { getTranslate } from 'react-localize-redux'
import * as converter from "../../utils/converter"
import * as exchangeActions from "../../actions/exchangeActions"
import EthereumService from "../../services/ethereum/ethereum"
import constants from "../../services/constants"
import * as globalActions from "../../actions/globalActions";
import * as common from "../../utils/common";

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
      isAnimation: false,
      intervalGroup : [],
      isFirstTime: true,
    }
  }

  getEthereumInstance = () => {
    var ethereum = this.props.ethereum
    if (!ethereum){
      ethereum = new EthereumService()
    }
    return ethereum
  }

  setAnimation = () => {
    this.setState({isAnimation: true})
  }

  setInterValGroup = (callback, intervalTime) => {
    callback()
    var intevalProcess = setInterval(callback, intervalTime)
    this.state.intervalGroup.push(intevalProcess)
  }

  checkKyberEnable = () => {
    var ethereum = this.getEthereumInstance()
    this.props.dispatch(exchangeActions.checkKyberEnable(ethereum))
  }

  fetchRateExchange = () => {

    var ethereum = this.getEthereumInstance()
    var {sourceTokenSymbol, sourceToken, destTokenSymbol, destToken} = this.getTokenInit()
    var sourceAmount = this.props.exchange.sourceAmount
    let refetchSourceAmount = false;
    
    if (sourceTokenSymbol === "ETH") {
      if (converter.compareTwoNumber(sourceAmount, constants.ETH.MAX_AMOUNT) === 1) {
        this.props.dispatch(exchangeActions.throwErrorSourceAmount(constants.EXCHANGE_CONFIG.sourceErrors.rate, this.props.translate("error.handle_amount")))
        return;
      }
    }

    if (this.props.exchange.inputFocus !== "source"){
      var destAmount = this.props.exchange.destAmount
      var tokens = this.props.tokens
      var rateSourceEth = sourceTokenSymbol === "ETH" ? 1: tokens[sourceTokenSymbol].rate / Math.pow(10,18)
      var rateEthDest = destTokenSymbol === "ETH" ? 1: tokens[destTokenSymbol].rateEth / Math.pow(10,18)
      
      if (rateSourceEth != 0 && rateEthDest != 0){
        sourceAmount = destAmount / (rateSourceEth * rateEthDest)
      }else{
        sourceAmount = 0
      }
      refetchSourceAmount = true;
    }    
    
    var isManual = this.state.isFirstTime ? true: false
    this.setState({isFirstTime: false})

    this.props.dispatch(exchangeActions.updateRate(ethereum, sourceTokenSymbol, sourceToken, destTokenSymbol, destToken, sourceAmount, isManual, refetchSourceAmount, constants.EXCHANGE_CONFIG.updateRateType.interval));
  }

  fetchGasExchange = () =>{    
    if (!this.props.account) {
      return
    }
    this.props.dispatch(exchangeActions.estimateGasNormal(false))
  }

  fetchMaxGasPrice() {
    const ethereum = this.getEthereumInstance();
    this.props.dispatch(exchangeActions.fetchMaxGasPrice(ethereum));
  }

  verifyExchange = () => {
    if (!this.props.account) {
      return
    }

    var { sourceTokenDecimals, destTokenDecimals } = this.getTokenInit();

    this.props.dispatch(exchangeActions.verifyExchange())
    this.props.dispatch(exchangeActions.caculateAmount(sourceTokenDecimals, destTokenDecimals))
  }

  setIntervalProcess = () => {
    this.setInterValGroup( this.checkKyberEnable, 10000)
    this.setInterValGroup( this.fetchRateExchange, 10000)
    this.setInterValGroup( this.fetchGasExchange, 10000)
    this.setInterValGroup( this.fetchMaxGasPrice.bind(this), 10000)
    this.setInterValGroup( this.verifyExchange, 3000)
  }

  componentWillUnmount = () => {
    for (var i= 0; i<this.state.intervalGroup.length; i++ ){
      clearInterval(this.state.intervalGroup[i])  
    }
    this.setState({intervalGroup: []})    
  }

  getTokenInit = () => {
    var sourceTokenSymbol = this.props.params.source.toUpperCase()
    var sourceToken = this.props.tokens[sourceTokenSymbol].address
    var sourceTokenDecimals = this.props.tokens[sourceTokenSymbol].decimals
    var destTokenSymbol = this.props.params.dest.toUpperCase()
    var destToken = this.props.tokens[destTokenSymbol].address
    var destTokenDecimals = this.props.tokens[destTokenSymbol].decimals

    return {sourceTokenSymbol, sourceToken, destTokenSymbol, destToken, sourceTokenDecimals, destTokenDecimals}
  }

  componentDidMount = () =>{
    this.setIntervalProcess()

    var {sourceTokenSymbol, sourceToken, destTokenSymbol, destToken} = this.getTokenInit()

    if ((sourceTokenSymbol !== this.props.exchange.sourceTokenSymbol) ||
      (destTokenSymbol !== this.props.exchange.destTokenSymbol) ){
      this.props.dispatch(exchangeActions.selectToken(sourceTokenSymbol, sourceToken, destTokenSymbol, destToken, "default"));
    }
  }

  updateGlobal = (srcSymbol, srcAddress, destSymbol, destAddress, srcAmount = null) => {
    let path = constants.BASE_HOST +  "/swap/" + srcSymbol.toLowerCase() + "-" + destSymbol.toLowerCase();
    path = common.getPath(path, constants.LIST_PARAMS_SUPPORTED);

    this.props.dispatch(globalActions.goToRoute(path))
    this.props.dispatch(globalActions.updateTitleWithRate());

    const sourceAmount = srcAmount ? srcAmount : this.props.exchange.sourceAmount;
    const refetchSourceAmount = this.props.exchange.inputFocus !== "source";

    this.props.dispatch(exchangeActions.updateRate(this.props.ethereum, srcSymbol, srcAddress, destSymbol, destAddress, sourceAmount, true, refetchSourceAmount, constants.EXCHANGE_CONFIG.updateRateType.selectToken));
  };

  setSrcAndDestToken = (srcSymbol, destSymbol, srcAmount = null) => {
    const srcAddress = this.props.tokens[srcSymbol].address;
    const destAddress = this.props.tokens[destSymbol].address;

    this.props.dispatch(exchangeActions.selectToken(srcSymbol, srcAddress, destSymbol, destAddress, "swap"));
    this.updateGlobal(srcSymbol, srcAddress, destSymbol, destAddress, srcAmount);
  };

  render() {
    return (
      <div className={"exchange__container"}>
        <ExchangeBody
          setSrcAndDestToken={this.setSrcAndDestToken}
          updateGlobal={this.updateGlobal}
        />
      </div>
    )
  }
}
