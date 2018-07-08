import React from "react"
import { connect } from "react-redux"
import {ExchangeBody, MinRate} from "../Exchange"
//import {GasConfig} from "../TransactionCommon"
import {AdvanceConfigLayout, GasConfig} from "../../components/TransactionCommon"


import {TransactionLayout} from "../../components/TransactionCommon"
import { getTranslate } from 'react-localize-redux'

import * as converter from "../../utils/converter"
import * as validators from "../../utils/validators"
import * as exchangeActions from "../../actions/exchangeActions"
import { default as _ } from 'underscore'
import { clearSession } from "../../actions/globalActions"

@connect((store) => {
  var langs = store.locale.languages
  const currentLang = langs.map((item) => {
    if (item.active) {
      return item.code
    }
  })
  const account = store.account.account
  if (account === false) {
    if (currentLang[0] === 'en') {
      window.location.href = "/swap"  
    } else {
      window.location.href = `/swap?lang=${currentLang}`
    }
  }
  const translate = getTranslate(store.locale)
  const tokens = store.tokens.tokens
  const exchange = store.exchange
  return {
      translate, exchange, tokens, currentLang
    }  
})


export default class Exchange extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      selectedGas: props.exchange.gasPrice <= 20? "f": "s", 
    }
  }
  validateTxFee = (gasPrice) => {
    var validateWithFee = validators.verifyBalanceForTransaction(this.props.tokens['ETH'].balance, this.props.exchange.sourceTokenSymbol,
    this.props.exchange.sourceAmount, this.props.exchange.gas + this.props.exchange.gas_approve, gasPrice)

    if (validateWithFee) {
      this.props.dispatch(exchangeActions.thowErrorEthBalance("error.eth_balance_not_enough_for_fee"))
      return
      // check = false
    }
  }
  lazyValidateTransactionFee = _.debounce(this.validateTxFee, 500)

  specifyGas = (event) => {
    var value = event.target.value
    this.props.dispatch(exchangeActions.specifyGas(value))
  }

  specifyGasPrice = (value) => {
    this.props.dispatch(exchangeActions.specifyGasPrice(value + ""))
    this.lazyValidateTransactionFee(value)
  }

  inputGasPriceHandler = (value) => {
    this.setState({selectedGas: "undefined"})
    this.specifyGasPrice(value)
  }

  selectedGasHandler = (value, level) => {
    this.setState({selectedGas: level})
    this.specifyGasPrice(value)
  }

  handleEndSession = () => {
    this.props.dispatch(clearSession())
  }

  render() {
    var gasPrice = converter.stringToBigNumber(converter.gweiToEth(this.props.exchange.gasPrice))
    var totalGas = gasPrice.multipliedBy(this.props.exchange.gas + this.props.exchange.gas_approve)
    var page = "exchange"
    var gasConfig = (
      <GasConfig 
        gas={this.props.exchange.gas + this.props.exchange.gas_approve}
        gasPrice={this.props.exchange.gasPrice}
        maxGasPrice={this.props.exchange.maxGasPrice}
        gasHandler={this.specifyGas}
        inputGasPriceHandler={this.inputGasPriceHandler}
        selectedGasHandler={this.selectedGasHandler}
        gasPriceError={this.props.exchange.errors.gasPriceError}
        gasError={this.props.exchange.errors.gasError}
        totalGas={totalGas.toString()}
        translate={this.props.translate}        
        gasPriceSuggest={this.props.exchange.gasPriceSuggest}    
        selectedGas = {this.state.selectedGas}
        page = {page}
      />
    )

    var minRate = <MinRate />    
    var advanceConfig = <AdvanceConfigLayout minRate = {minRate} gasConfig = {gasConfig} translate = {this.props.translate}/>
    var exchangeBody = <ExchangeBody advanceLayout = {advanceConfig} />
    return (
      <TransactionLayout 
        endSession = {this.handleEndSession}
        translate = {this.props.translate}
        // location = {this.props.location}
       
        // advance = {advanceConfig}
        content = {exchangeBody}
        page = {page}
        currentLang = {this.props.currentLang[0]}
      />
    )
  }
}
