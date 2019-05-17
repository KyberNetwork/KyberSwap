import React from "react"
import { connect } from "react-redux"
import {ExchangeBody} from "../Exchange"
import { getTranslate } from 'react-localize-redux'
import * as converter from "../../utils/converter"
import * as validators from "../../utils/validators"

import * as exchangeActions from "../../actions/exchangeActions"
import {setIsChangingPath, clearSession} from "../../actions/globalActions"
import { updateApproveTxsData } from "../../actions/txActions"

import {HeaderTransaction} from "../TransactionCommon"
import * as analytics from "../../utils/analytics"
import EthereumService from "../../services/ethereum/ethereum"
import constants from "../../services/constants"

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
      intervalGroup : []
      
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
    this.props.dispatch(exchangeActions.checkKyberEnable())
  }

  fetchExchangeEnable = () => {
    var account = this.props.account
    if (this.props.account == false) {
      return
    }
    var ethereum = this.getEthereumInstance()
    this.props.dispatch(exchangeActions.fetchExchangeEnable(ethereum))
  }

  fetchRateExchange = () => {    
    var ethereum = this.getEthereumInstance()
    var source = this.props.exchange.sourceToken
    var dest = this.props.exchange.destToken
    
    var sourceAmount = this.props.exchange.sourceAmount
    var sourceTokenSymbol = this.props.exchange.sourceTokenSymbol
    
    let refetchSourceAmount = false;
    
    if (sourceTokenSymbol === "ETH") {
      if (converter.compareTwoNumber(sourceAmount, constants.ETH.MAX_AMOUNT) === 1) {
        this.props.dispatch(exchangeActions.throwErrorHandleAmount());
        return;
      }
    } 

    //check input focus
    if (this.props.exchange.inputFocus !== "source"){
      //calculate source amount by dest amount
      var destAmount = state.exchange.destAmount
      var destTokenSymbol = state.exchange.destTokenSymbol    
      // relative source amount 
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
    

    this.props.dispatch(exchangeActions.updateRateExchange(ethereum, source, dest, sourceAmount, sourceTokenSymbol, false, refetchSourceAmount));
  }

  fetchGasExchange = () =>{    
    if (!this.props.account) {
      return
    }
    this.props.dispatch(exchangeActions.estimateGasNormal())
  }

  async fetchMaxGasPrice(){
    var ethereum = this.getEthereumInstance()
    try{
      var gasPrice = await ethereum.call("getMaxGasPrice")
      var maxGasPriceGwei = converter.weiToGwei(gasPrice)
      this.props.dispatch(exchangeActions.setMaxGasPriceComplete(maxGasPriceGwei))
    }catch(err){
      console.log(err)
    }
  }

  fetchApproveTxsData = () => {
    this.props.dispatch(updateApproveTxsData())
  }

  verifyExchange = () => {
    if (!this.props.account) {
      return
    }
    this.props.dispatch(exchangeActions.verifyExchange())
    this.props.dispatch(exchangeActions.caculateAmount())
  }

  setInvervalProcess = () => {
    this.setInterValGroup( this.checkKyberEnable, 10000)
    this.setInterValGroup( this.fetchExchangeEnable, 10000)
    this.setInterValGroup( this.fetchRateExchange, 10000)
    this.setInterValGroup( this.fetchGasExchange, 10000)
    this.setInterValGroup( this.fetchMaxGasPrice.bind(this), 10000)
    this.setInterValGroup( this.fetchApproveTxsData, 10000)    

    this.setInterValGroup( this.verifyExchange, 3000)
  }

  componentWillUnmount = () => {
    for (var i= 0; i<this.state.intervalGroup.length; i++ ){
      clearInterval(this.state.intervalGroup[i])  
    }
    this.setState({intervalGroup: []})    
  }

  componentDidMount = () =>{
    // set interval process
    this.setInvervalProcess()

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
