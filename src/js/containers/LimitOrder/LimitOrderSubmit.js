import React from "react"
import { connect } from "react-redux"
import * as limitOrderActions from "../../actions/limitOrderActions"

import * as converters from "../../utils/converter"

import BLOCKCHAIN_INFO from "../../../../env"

import {isUserLogin} from "../../utils/common"

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
      step: 0
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
    if (isNaN(sourceAmount)) {
      this.props.dispatch(limitOrderActions.throwError("sourceAmountError", "Source amount is not number"))
      return
    }
    

    // check rate is zero
    var triggerRate = parseFloat(this.props.triggerRate)
    if (isNaN(triggerRate)) {
      this.props.dispatch(limitOrderActions.throwError("sourceAmountError", "Trigger rate is not number"))
      return
    }

    //check balance
    var userBalance = this.getUserBalance()
    var srcAmount = this.getSourceAmount()
    if (converters.compareTwoNumber(userBalance, srcAmount) < 0){
      this.props.dispatch(limitOrderActions.throwError("sourceAmountError", "Your balance is insufficent for the order"))
      return
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
