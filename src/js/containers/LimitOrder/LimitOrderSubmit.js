import React from "react"
import { connect } from "react-redux"
import * as limitOrderActions from "../../actions/limitOrderActions"

import * as converters from "../../utils/converter"

import BLOCKCHAIN_INFO from "../../../../env"

import {isUserLogin} from "../../utils/common"
import constants from "../../services/constants"

@connect((store, props) => {
  const account = store.account.account
  const translate = getTranslate(store.locale)
  const tokens = store.tokens.tokens
  const limitOrder = store.limitOrder
  const ethereum = store.connection.ethereum

  return {
      translate, limitOrder, tokens, account, ethereum,
      global: store.global

  }
})




export default class LimitOrderSubmit extends React.Component {
  constructor () {
    super() 
    this.state = {
      step: 0,
      networkError: "",
      isOpen: false
    }
  }

  getUserBalance = () =>{
    if (this.props.limitOrder.sourceTokenSymbol === BLOCKCHAIN_INFO.wrapETHToken){
      return this.props.tokens[this.props.limitOrder.sourceTokenSymbol].balance + this.props.tokens["ETH"].balance
    }else{
      return this.props.tokens[this.props.limitOrder.sourceTokenSymbol].balance
    }
  }

  getSourceAmount = () => {
    var sourceAmount = this.props.limitOrder.sourceAmount
    this.props.listOrder.map(value => {
      if(value.status === "active" && value.source === this.props.limitOrder.sourceTokenSymbol && value.address.toLowerCase() === this.props.account.address.toLowerCase()){
        sourceAmount += sourceAmount
      }
    })
    var sourceAmountBig = converters.toTWei(sourceAmount, this.props.tokens[this.props.limitOrder.sourceTokenSymbol].decimals)
    return sourceAmountBig.toString()
  }
  

  validateOrder = () => {
    // check source amount is zero
    var sourceAmount = parseFloat(this.props.sourceAmount)
    var isValidate = true
    if (isNaN(sourceAmount)) {
      this.props.dispatch(limitOrderActions.throwError("sourceAmountError", "Source amount is not number"))
      isValidate = false
    }

     //verify min source amount
    if (this.props.tokens[this.props.limitOrder.sourceTokenSymbol].rate == 0){
      this.props.dispatch(limitOrderActions.throwError("rateETHEqualZero", "This pair is under maintenance"))
      isValidate = false
    }

    
    var rateBig = converters.toTWei(this.props.tokens[this.props.limitOrder.sourceTokenSymbol].rate, 18)
    var ethEquivalentValue = converters.calculateDest(this.props.limitOrder.sourceAmount, rateBig, 6)
    
    if(ethEquivalentValue < 0.5){
      this.props.dispatch(limitOrderActions.throwError("sourceAmountTooSmall", "Source Amount is too smalll. Limit order only support min 0.5 ETH equivalent order"))
      isValidate = false
    }

    if(ethEquivalentValue > 10){
      this.props.dispatch(limitOrderActions.throwError("sourceAmountTooBig", "Source Amount is too big. Limit order only support max 10 ETH equivalent order"))
      isValidate = false
    }

    // check rate is zero
    var triggerRate = parseFloat(this.props.triggerRate)
    if (isNaN(triggerRate)) {
      this.props.dispatch(limitOrderActions.throwError("triggerRateError", "Trigger rate is not number"))
      isValidate = false
    }
    // check rate is too big
    var percentChange = converters.percentChange(triggerRate, this.props.limitOrder.offeredRate)
    if (percentChange > constants.LIMIT_ORDER_CONFIG.maxPercentTriggerRate){
      this.props.dispatch(limitOrderActions.throwError("triggerRateError", "Trigger rate is to high, only allow 50% greater than the current rate"))
      isValidate = false
    }

    //check balance
    var userBalance = this.getUserBalance()
    var srcAmount = this.getSourceAmount()
    if (converters.compareTwoNumber(userBalance, srcAmount) < 0){
      this.props.dispatch(limitOrderActions.throwError("balanceError", "Your balance is insufficent for the order"))
      isValidate = false
    }

    
    if (isValidate){
      return
    }

    // find path for order
    this.findPathOrder()

  }

  async findPathOrder(){
    try{
      var orderPath = []
      var currentPath = 0
      var ethereum = this.prpps.ethereum
      var allowance = ethereum.call("getAllowanceAtLatestBlock", this.props.limitOrder.sourceToken, this.props.account.address)
      if (allowance == 0){
        orderPath.push(1)
        currentPath = 1
      }
      if (allowance == 0){

      }
    }catch{
      this.setState({
        networkError: "Cannot connect to ethereum node",
        isOpen: true
      })
    }
  } 


  submitOrder = () => {
    if (isUserLogin() && this.props.account !== false){
      // check to go to step
      this.validateOrder()

    }else{
      window.location.href = "/users/sign_in"
    }
  }


    render() {
      return (
        <div className={"limit-order-form"} onClick={this.submitOrder}>
            {isUserLogin()? "Submit": "Login to Submit Order"}
        </div>
      )
    }
  }
