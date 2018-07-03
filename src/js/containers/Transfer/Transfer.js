import React from "react"
import { connect } from "react-redux"
import {TransferBody} from "../Transfer"
//import {GasConfig} from "../TransactionCommon"
import {AdvanceConfigLayout, GasConfig} from "../../components/TransactionCommon"


import {TransactionLayout} from "../../components/TransactionCommon"
import { getTranslate } from 'react-localize-redux'

import * as converter from "../../utils/converter"
import * as validators from "../../utils/validators"
import * as transferActions from "../../actions/transferActions"
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
    window.location.href = `/swap?lang=${currentLang}`
  }
  var translate = getTranslate(store.locale)
  const tokens = store.tokens.tokens
  const transfer = store.transfer
  return {
      translate, transfer, tokens, currentLang
    }  
})


export default class Exchange extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      selectedGas: props.transfer.gasPrice <= 20? "f": "s", 
    }
  }

  validateSourceAmount = (value, gasPrice) => {
    var checkNumber
    if (isNaN(parseFloat(value))) {
      // this.props.dispatch(transferActions.thowErrorAmount("error.amount_must_be_number"))
    } else {
      var amountBig = converters.stringEtherToBigNumber(this.props.transfer.amount, this.props.transfer.decimal)
      if (amountBig.isGreaterThan(this.props.transfer.balance)) {
        this.props.dispatch(transferActions.thowErrorAmount("error.amount_transfer_too_hign"))
        return
      }

      var testBalanceWithFee = validators.verifyBalanceForTransaction(this.props.tokens['ETH'].balance,
        this.props.transfer.tokenSymbol, this.props.transfer.amount, this.props.transfer.gas, gasPrice)
      if (testBalanceWithFee) {
        this.props.dispatch(transferActions.thowErrorEthBalance("error.eth_balance_not_enough_for_fee"))
      }
    }
   

  }

  lazyUpdateValidateSourceAmount = _.debounce(this.validateSourceAmount, 500)



  // specifyGasPrice = (value) => {
  //   this.props.dispatch(transferActions.specifyGasPrice(value))

  //   this.lazyUpdateValidateSourceAmount(this.props.transfer.amount, value)
  // }


  specifyGasPrice = (value) => {
    this.props.dispatch(transferActions.specifyGasPrice(value))

    this.lazyUpdateValidateSourceAmount(this.props.transfer.amount, value)
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
    var gasPrice = converter.stringToBigNumber(converter.gweiToEth(this.props.transfer.gasPrice))
    var totalGas = gasPrice.multipliedBy(this.props.transfer.gas)
    var page = "transfer"
    var gasConfig = (
      <GasConfig 
        gas={this.props.transfer.gas}
        gasPrice={this.props.transfer.gasPrice}
        maxGasPrice={this.props.transfer.maxGasPrice}
        gasHandler={this.specifyGas}
        inputGasPriceHandler={this.inputGasPriceHandler}
        selectedGasHandler={this.selectedGasHandler}
        gasPriceError={this.props.transfer.errors.gasPriceError}
        gasError={this.props.transfer.errors.gasError}
        totalGas={totalGas.toString()}
        translate={this.props.translate}        
        gasPriceSuggest={this.props.transfer.gasPriceSuggest}    
        selectedGas = {this.state.selectedGas}
        page = {page}
      />
    )

    var advanceConfig = <AdvanceConfigLayout gasConfig = {gasConfig} translate = {this.props.translate}/>
    var transferBody = <TransferBody advanceLayout = {advanceConfig}/>
    return (
      <TransactionLayout 
        endSession = {this.handleEndSession}
        translate = {this.props.translate}
        //location = {this.props.location}
       
       // advance = {advanceConfig}
        content = {transferBody}
        page = {page}
        currentLang = {this.props.currentLang}
      />
    )
  }
}
