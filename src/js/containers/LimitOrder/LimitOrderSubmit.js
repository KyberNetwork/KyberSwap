import React from "react"
import { connect } from "react-redux"
import * as limitOrderActions from "../../actions/limitOrderActions"

import * as converters from "../../utils/converter"
import { getTranslate } from 'react-localize-redux'


import BLOCKCHAIN_INFO from "../../../../env"

import ApproveZeroModal from "./LimitOrderModals/ApproveZeroModal"
import ApproveMaxModal from "./LimitOrderModals/ApproveMaxModal"
import WrapETHModal from "./LimitOrderModals/WrapETHModal"
import ConfirmModal from "./LimitOrderModals/ConfirmModal"
import SubmitStatusModal from "./LimitOrderModals/SubmitStatusModal"


import { isUserLogin } from "../../utils/common"
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
  constructor() {
    super()
    this.state = {
      step: 0,
      networkError: "",
      isOpen: false
    }
  }



  getUserBalance = () => {
    if (this.props.limitOrder.sourceTokenSymbol === BLOCKCHAIN_INFO.wrapETHToken) {
      return this.props.tokens[this.props.limitOrder.sourceTokenSymbol].balance + this.props.tokens["ETH"].balance
    } else {
      return this.props.tokens[this.props.limitOrder.sourceTokenSymbol].balance
    }
  }

  getSourceAmount = () => {
    var sourceAmount = this.props.limitOrder.sourceAmount
    this.props.limitOrder.listOrder.map(value => {
      if (value.status === "active" && value.source === this.props.limitOrder.sourceTokenSymbol && value.address.toLowerCase() === this.props.account.address.toLowerCase()) {
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
    if (this.props.tokens[this.props.limitOrder.sourceTokenSymbol].rate == 0) {
      this.props.dispatch(limitOrderActions.throwError("rateETHEqualZero", "This pair is under maintenance"))
      isValidate = false
    }


    var rateBig = converters.toTWei(this.props.tokens[this.props.limitOrder.sourceTokenSymbol].rate, 18)
    var ethEquivalentValue = converters.calculateDest(this.props.limitOrder.sourceAmount, rateBig, 6)

    if (ethEquivalentValue < 0.5) {
      this.props.dispatch(limitOrderActions.throwError("sourceAmountTooSmall", "Source Amount is too smalll. Limit order only support min 0.5 ETH equivalent order"))
      isValidate = false
    }

    if (ethEquivalentValue > 10) {
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
    if (percentChange > constants.LIMIT_ORDER_CONFIG.maxPercentTriggerRate) {
      this.props.dispatch(limitOrderActions.throwError("triggerRateError", "Trigger rate is to high, only allow 50% greater than the current rate"))
      isValidate = false
    }

    //check balance
    var userBalance = this.getUserBalance()
    var srcAmount = this.getSourceAmount()
    if (converters.compareTwoNumber(userBalance, srcAmount) < 0) {
      this.props.dispatch(limitOrderActions.throwError("balanceError", "Your balance is insufficent for the order"))
      isValidate = false
    }


    if (isValidate) {
      return
    }

    // find path for order
    this.findPathOrder()

  }

  getMaxGasApprove = () => {
    var tokens = this.props.tokens
    var sourceSymbol = this.props.limitOrder.sourceTokenSymbol
    if (tokens[sourceSymbol] && tokens[sourceSymbol].gasApprove) {
      return tokens[sourceSymbol].gasApprove
    } else {
      return this.props.limitOrder.max_gas_approve
    }
  }

  getMaxGasExchange = () => {
    const tokens = this.props.tokens
    var destTokenSymbol = BLOCKCHAIN_INFO.wrapETHToken
    var destTokenLimit = tokens[destTokenSymbol] && tokens[destTokenSymbol].gasLimit ? tokens[destTokenSymbol].gasLimit : this.props.limitOrder.max_gas    
    return destGasLimit
  
  }

  getMaxGasLimit = (orderPath) => {
    var gasLimit = 0
    for (var i = 0; i <orderPath.length; i++){
      switch(orderPath[i]){
        case constants.LIMIT_ORDER_CONFIG.orderPath.approveZero:
        case constants.LIMIT_ORDER_CONFIG.orderPath.approveMax:
          gasLimit += this.getMaxGasApprove()
          break
        case constants.LIMIT_ORDER_CONFIG.orderPath.wrapETH:
          gasLimit += this.getMaxGasExchange()
          break
      }
    }
    return gasLimit
  }

  validateBalance = (orderPath) =>{
    var gasLimit = this.getMaxGasLimit(orderPath)
    var totalFee = converters.calculateGasFee(this.props.limitOrder.gasPrice, gasLimit)
    var totalFeeBig = converters.toTWei(totalFee, 18)
    var ethBalance = this.props.tokens["ETH"].balance
    
    var compareValue
    if (this.props.limitOrder.sourceTokenSymbol === BLOCKCHAIN_INFO.wrapETHToken){
      var srcAmount = this.getSourceAmount()
      var wrapETHTokenBalance = this.props.tokens[BLOCKCHAIN_INFO.wrapETHToken].balance
      compareValue = converters.sumOfTwoNumber(totalFeeBig, converters.subOfTwoNumber(srcAmount, wrapETHTokenBalance))
    }else{
      compareValue = totalFeeBig      
    }    
    return converters.compareTwoNumber(ethBalance, compareValue) < 0 ? false: true          
  }

  async findPathOrder() {
    try {
      var orderPath = []
      // var currentPath = constants.LIMIT_ORDER_CONFIG.orderPath.confirmSubmitOrder
      var ethereum = this.props.ethereum
      // check wrapped eth
      var allowance = await ethereum.call("getAllowanceAtLatestBlock", this.props.limitOrder.sourceToken, this.props.account.address, BLOCKCHAIN_INFO.kyberswapAddress)
      if (allowance == 0) {
        orderPath = [constants.LIMIT_ORDER_CONFIG.orderPath.approveMax]
        // currentPath = constants.LIMIT_ORDER_CONFIG.orderPath.approveMax
      }
      if (allowance != 0 && allowance < Math.pow(10, 28)) {
        orderPath = [constants.LIMIT_ORDER_CONFIG.orderPath.approveZero, constants.LIMIT_ORDER_CONFIG.orderPath.approveMax]
        // currentPath = constants.LIMIT_ORDER_CONFIG.orderPath.approveZero
      }

      if (this.props.limitOrder.sourceTokenSymbol === BLOCKCHAIN_INFO.wrapETHToken) {
        var sourceToken = this.getSourceAmount()
        var userBalance = this.props.tokens[this.props.limitOrder.sourceTokenSymbol].balance
        if (converters.compareTwoNumber(userBalance, sourceToken) < 0) {
          orderPath.push(constants.LIMIT_ORDER_CONFIG.orderPath.wrapETH)
        }
      }
      orderPath.push(constants.LIMIT_ORDER_CONFIG.orderPath.confirmSubmitOrder)
      orderPath.push(constants.LIMIT_ORDER_CONFIG.orderPath.submitStatusOrder)

      //check balance eth is enough
     
      if (this.validateBalance(orderPath)){
        this.props.dispatch(limitOrderActions.updateOrderPath(orderPath, 0))
      }else{
        console.log("Your eth balance is not enough for transactions")
        this.setState({
          balanceError: "Your eth balance is not enough for transactions",
          isOpen: true
        })
      }
      
    } catch (err) {
      console.log(err)
      this.setState({
        networkError: "Cannot connect to ethereum node",
        isOpen: true
      })
    }
  }


  submitOrder = () => {
    if (isUserLogin() && this.props.account !== false) {
      // check to go to step
      this.validateOrder()

    } else {
      window.location.href = "/users/sign_in"
    }
  }


  render() {
    return (
      <div className={"limit-order-submit"}>
        <button className="accept-button" onClick={this.submitOrder}>
          {isUserLogin() ? "Submit" : "Login to Submit Order"}
        </button>
        <div>
          {this.props.limitOrder.orderPath[this.props.limitOrder.currentPathIndex] === constants.LIMIT_ORDER_CONFIG.orderPath.approveZero && <ApproveZeroModal getMaxGasApprove= {this.getMaxGasApprove.bind(this)}/>}
          {this.props.limitOrder.orderPath[this.props.limitOrder.currentPathIndex] === constants.LIMIT_ORDER_CONFIG.orderPath.approveMax && <ApproveMaxModal getMaxGasApprove= {this.getMaxGasApprove.bind(this)}/>}
          {this.props.limitOrder.orderPath[this.props.limitOrder.currentPathIndex] === constants.LIMIT_ORDER_CONFIG.orderPath.wrapETH && <WrapETHModal />}
          {this.props.limitOrder.orderPath[this.props.limitOrder.currentPathIndex] === constants.LIMIT_ORDER_CONFIG.orderPath.confirmSubmitOrder && <ConfirmModal />}
          {this.props.limitOrder.orderPath[this.props.limitOrder.currentPathIndex] === constants.LIMIT_ORDER_CONFIG.orderPath.submitStatusOrder && <SubmitStatusModal />}
        </div>
      </div>
    )
  }
}
