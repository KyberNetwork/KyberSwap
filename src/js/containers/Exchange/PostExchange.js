import React from "react"
import { connect } from "react-redux"
import * as validators from "../../utils/validators"
import * as converters from "../../utils/converter"
import * as exchangeActions from "../../actions/exchangeActions"
import * as utilActions from "../../actions/utilActions"
import * as constants from "../../services/constants"
import { PostExchangeBtn } from "../../components/Exchange"
import { getTranslate } from 'react-localize-redux';
import { getAssetUrl, isUserEurope, getParameterByName } from "../../utils/common";
import BLOCKCHAIN_INFO from "../../../../env";

import TermAndServices from "../CommonElements/TermAndServices";

import {ApproveZeroModal, ApproveMaxModal, ConfirmModal, BroadCastModal} from "./ExchangeModals"

@connect((store, props) => {

  return {
    exchange: store.exchange,
    tokens: store.tokens.tokens,    
    account: store.account.account,
    ethereum: store.connection.ethereum,
    translate: getTranslate(store.locale),
    global: store.global
  }
})

export default class PostExchange extends React.Component {
  constructor() {
    super()
    this.state = { form: {} }
  }

  getMaxGasApprove = () => {    
    var exchange =  this.props.exchange
    var tokens = this.props.tokens
    var sourceSymbol = exchange.sourceTokenSymbol
    if (tokens[sourceSymbol] && tokens[sourceSymbol].gasApprove) {
      return tokens[sourceSymbol].gasApprove
    } else {
      return exchange.max_gas_approve
    }
  }

  clickExchange = () => {
    this.props.global.analytics.callTrack("trackClickSwapButton");

    if (this.props.account === false) {
      this.props.dispatch(exchangeActions.openImportAccount())
      return
    }

    if (Object.keys(this.props.exchange.errors.sourceAmount).length !== 0) {
      return
    }
    if (Object.keys(this.props.exchange.errors.slippageRate).length !== 0) {
      return
    }
    
    if (this.props.exchange.maxCap == 0) {
      let titleModal = this.props.translate('transaction.notification') || 'Notification'
      let contentModal = this.props.translate('transaction.not_enable_exchange') || 'Your address is not enabled for exchange'
      this.props.dispatch(utilActions.openInfoModal(titleModal, contentModal))
      return
    }

    if (this.props.exchange.customRateInput.value === "" && this.props.exchange.customRateInput.isDirty) {
      this.props.dispatch(exchangeActions.setCustomRateInputError(true));
      return;
    }

    if  (this.validateExchange()) {
      this.props.dispatch(exchangeActions.setSnapshot(this.props.exchange))
      this.findPathExchange()
    }
  }

  async findPathExchange() {
    try {
      var exchangePath = []
      if (this.props.exchange.sourceTokenSymbol === "ETH"){
        exchangePath = [constants.EXCHANGE_CONFIG.exchangePath.confirm, constants.EXCHANGE_CONFIG.exchangePath.broadcast]
      }else{
        var ethereum = this.props.ethereum
        var allowance = await ethereum.call("getAllowanceAtLatestBlock", this.props.exchange.sourceToken, this.props.account.address, BLOCKCHAIN_INFO.network)
        if (allowance == 0) {
          exchangePath = [constants.EXCHANGE_CONFIG.exchangePath.approveMax]
        }
        if (allowance != 0 && allowance < Math.pow(10, 28)) {
          exchangePath = [constants.EXCHANGE_CONFIG.exchangePath.approveZero, constants.EXCHANGE_CONFIG.exchangePath.approveMax]         
        }
        exchangePath.push(constants.EXCHANGE_CONFIG.exchangePath.confirm)
        exchangePath.push(constants.EXCHANGE_CONFIG.exchangePath.broadcast)
      }

      this.props.dispatch(exchangeActions.updateExchangePath(exchangePath, 0))
      
    } catch (err) {
      console.log(err)
      this.setState({
        networkError: "Cannot connect to ethereum node",
        isOpen: true
      })
    }
  }

  validateExchange = () => {
    if (this.props.exchange.expectedRate === "0") {
      this.props.dispatch(utilActions.openInfoModal(this.props.translate("error.error_occurred"),
        this.props.translate("error.source_amount_rate_error")))
      return false
    }

    //check source amount
    var check = true
    var sourceAmount = this.props.exchange.sourceAmount
    var sourceTokenSymbol = this.props.exchange.sourceTokenSymbol
    var sourceBalance = this.props.tokens[sourceTokenSymbol].balance
    var sourceDecimal = this.props.tokens[sourceTokenSymbol].decimals
    var rateSourceToEth = this.props.tokens[sourceTokenSymbol].rate
    var destTokenSymbol = this.props.exchange.destTokenSymbol
    var destDecimal = this.props.tokens[destTokenSymbol].decimals
    var maxCap = this.props.exchange.maxCap

    if (sourceAmount) {
      var validateWithFee = validators.verifyBalanceForTransaction(this.props.tokens['ETH'].balance, sourceTokenSymbol,
      sourceAmount, this.props.exchange.gas + this.props.exchange.gas_approve, this.props.exchange.gasPrice)

      if (validateWithFee) {
        this.props.dispatch(exchangeActions.throwErrorSourceAmount(constants.EXCHANGE_CONFIG.sourceErrors.balance, this.props.translate("error.eth_balance_not_enough_for_fee")))
        check = false
      }
    }

    var validateAmount = validators.verifyAmount(sourceAmount, sourceBalance, sourceTokenSymbol, sourceDecimal, rateSourceToEth, destDecimal, maxCap)
    var sourceAmountErrorKey
    switch (validateAmount) {
      case "not a number":        
        this.props.dispatch(exchangeActions.throwErrorSourceAmount(constants.EXCHANGE_CONFIG.sourceErrors.input, this.props.translate("error.source_amount_is_not_number")))
        check = false
        break
      case "too high":
        this.props.dispatch(exchangeActions.throwErrorSourceAmount(constants.EXCHANGE_CONFIG.sourceErrors.input, this.props.translate("error.source_amount_too_high")))
        check = false        
        break
      case "too high cap":
        var maxCap = this.props.exchange.maxCap
        if (this.props.exchange.sourceTokenSymbol !== "ETH"){
          maxCap = maxCap * constants.EXCHANGE_CONFIG.MAX_CAP_PERCENT
        }
        this.props.dispatch(exchangeActions.throwErrorSourceAmount(constants.EXCHANGE_CONFIG.sourceErrors.input, this.props.translate("error.source_amount_too_high_cap", { cap: maxCap })))
        check = false                
        break
      case "too small":        
        this.props.dispatch(exchangeActions.throwErrorSourceAmount(constants.EXCHANGE_CONFIG.sourceErrors.input, this.props.translate("error.source_amount_too_small", { minAmount: converters.toEther(constants.EXCHANGE_CONFIG.EPSILON)})))
        check = false        
        break
      case "too high for reserve":
        this.props.dispatch(exchangeActions.throwErrorSourceAmount(constants.EXCHANGE_CONFIG.sourceErrors.input, this.props.translate("error.source_amount_too_high_for_reserve")))
        check = false           
        break
    }

    if(!validateAmount){
      this.props.dispatch(exchangeActions.clearErrorSourceAmount(constants.EXCHANGE_CONFIG.sourceErrors.input))
    }

    var testRate = parseFloat(this.props.exchange.slippageRate)
    if (isNaN(testRate)) {
      this.props.dispatch(exchangeActions.throwErrorSlippageRate( constants.EXCHANGE_CONFIG.slippageRateErrors.input,this.props.translate("error.rate_not_number") || "Rate is not number"))
      check = false
    }
    return check
  }

  render() {

    let activeButtonClass = ""

    if (Object.keys(this.props.exchange.errors.sourceAmount).length == 0 && Object.keys(this.props.exchange.errors.slippageRate).length == 0) {
      activeButtonClass += " active"
    }

    return (

      <div className="exchange-button">
      <div>
        {this.props.account !== false &&
          <div>
            <a className={activeButtonClass + " exchange-button__button"} onClick={this.clickExchange}>
              {this.props.translate("transaction.swap_now") || "Swap Now"}
            </a>
            <TermAndServices tradeType="swap"/>
            <div>
              {this.props.exchange.exchangePath[this.props.exchange.currentPathIndex] === constants.EXCHANGE_CONFIG.exchangePath.approveZero && <ApproveZeroModal getMaxGasApprove= {this.getMaxGasApprove.bind(this)}/>}
              {this.props.exchange.exchangePath[this.props.exchange.currentPathIndex] === constants.EXCHANGE_CONFIG.exchangePath.approveMax && <ApproveMaxModal getMaxGasApprove= {this.getMaxGasApprove.bind(this)}/>}
              {this.props.exchange.exchangePath[this.props.exchange.currentPathIndex] === constants.EXCHANGE_CONFIG.exchangePath.confirm && <ConfirmModal />}
              {this.props.exchange.exchangePath[this.props.exchange.currentPathIndex] === constants.EXCHANGE_CONFIG.exchangePath.broadcast && <BroadCastModal />}              
            </div>
          </div>
        }
      </div>            
    </div>

    )
  }
}
