import React from "react"
import { connect } from "react-redux"


import {calculateMinAmount, toTWei, toT, toEther} from "../../utils/converter"
//import TokenDest from "./TokenDest"
//import {TokenDest, MinRate} from "../ExchangeForm"
import {Token, ExchangeRate, PostExchange} from "../Exchange"
import {ExchangeForm} from "../../components/Forms"
import {SelectTokenModal, ChangeGasModal, PassphraseExchangeModal, TransactionLoading} from "../CommonElements"

import { verifyAccount, verifyToken, verifyAmount, verifyNonce, verifyNumber, anyErrors } from "../../utils/validators"
//import {toT, toTWei} from "../../utils/converter"
import {openTokenModal, hideSelectToken} from "../../actions/utilActions"
import { selectTokenAsync, thowErrorSourceAmount } from "../../actions/exchangeActions"
import {errorSelectToken, goToStep, showAdvance, changeSourceAmout, openPassphrase, makeNewExchange} from "../../actions/exchangeActions"


@connect((store) => {
  if (!!!store.account.address){
    window.location.href = "/"
  }  
  const tokens = store.tokens
  const sourceTokenSymbol = store.exchange.sourceTokenSymbol
  const balance = tokens[sourceTokenSymbol].balance

  const ethereum = store.connection.ethereum
  return {...store.exchange, ethereum, balance}
})

export default class Exchange extends React.Component {
  openSourceToken = (e) =>{
    this.props.dispatch(openTokenModal("source"))
  }
  openDesToken = (e) =>{
    this.props.dispatch(openTokenModal("des"))

  }
  chooseToken = (symbol,address, type) => {
    
    this.props.dispatch(selectTokenAsync(symbol, address, type, this.props.ethereum))
    //this.props.dispatch(hideSelectToken())
    // if (this.props.sourceTokenSymbol === this.props.desTokenSymbol){
    //   this.props.dispatch(errorSelectToken("Cannot exchange to the same token"))
    // }
    // if (this.props.token_source === this.props.token_des){
    //   this.props.dispatch(errorSelectToken("Cannot exchange to the same token"))
    // }else{
    //   this.props.dispatch(errorSelectToken(""))
    // }
  }
  proccessSelectToken = () => {
    //console.log(anyErrors(this.props.errors))
    if (anyErrors(this.props.errors)){

    }else{
      this.props.dispatch(goToStep(2))
    }    
  }
  showAdvanceOption = () => {
    this.props.dispatch(showAdvance())
  }
  changeSourceAmount = (e) => {
    var value = e.target.value
    this.props.dispatch(changeSourceAmout(value))
  }
  // clickExchange = () =>{
  //   if(this.validateExchange()){
  //     this.props.dispatch(openPassphrase())
  //   }

  // }
  // validateExchange = () =>{
  //   //check source amount
  //   if(isNaN(this.props.sourceAmount)){
  //     this.props.dispatch(thowErrorSourceAmount("Source amount must be a number"))
  //     return false
  //   }
  //   else if(this.props.sourceAmount > toT(this.props.balance, 8)){
  //     this.props.dispatch(thowErrorSourceAmount("Source amount is too high"))
  //     return false
  //   }    
  //   return true
  // }
  getDesAmount = () => {
    return this.props.sourceAmount * toT(this.props.offeredRate,6)
    // var rate = this.props.rate[0]
    // var sourceAmount = this.props.sourceAmount
    // return calculateMinAmount(sourceAmount, rate).toNumber()
  }
  createRecap = () => {
    var recap = `exchange ${this.props.sourceAmount.toString().slice(0,7)}${this.props.sourceAmount.toString().length > 7?'...':''} ${this.props.sourceTokenSymbol} for ${this.getDesAmount().toString().slice(0,7)}${this.getDesAmount().toString().length > 7?'...':''} ${this.props.destTokenSymbol}`
    return recap
  }

  makeNewExchange = () => {
    this.props.dispatch(makeNewExchange());
  }

  render() {    
    //console.log(this.props.ethereum)
    var tokenSource = (
      <Token type="source"
	       				token={this.props.sourceTokenSymbol}
                onSelected={this.openSourceToken}
                 />
    )
    var tokenDest = (
      <Token type="des"
        token={this.props.destTokenSymbol} 
      onSelected={this.openDesToken}
      />
    )
    
    var errorSelectSameToken = this.props.errors.selectSameToken ===""?"":(
      <div>{this.props.errors.selectSameToken}</div>
    )
    var errorSelectTokenToken = this.props.errors.selectTokenToken ===""?"":(
      <div>{this.props.errors.selectTokenToken}</div>
    )
    var errorSourceAmount = this.props.errors.sourceAmountError === ""?"":(
      <div>{this.props.errors.sourceAmountError}</div>
    )
    //console.log(errorSelectSameToken)
    var buttonStep1 = (
      <button onClick = {this.proccessSelectToken}>Continue</button>
    )
    var buttonShowAdvance = (
      <button onClick={this.showAdvanceOption}>Advance</button>
    )
    var sourceAmount = (
      <input type="text" value={this.props.sourceAmount} onChange={this.changeSourceAmount}/>
    )
    var destAmount = (
      <input value={this.getDesAmount()}/>
    )
    var selectTokenModal = (
      <SelectTokenModal chooseToken ={this.chooseToken} type="exchange"/>
    )
    var changeGasModal = (
      <ChangeGasModal type="exchange"
      gas={this.props.gas}
      gasPrice={this.props.gasPrice} 
      open = {this.props.advanced}
      gasPriceError = {this.props.errors.gasPriceError}
      gasError = {this.props.errors.gasError}                        
      />
    )
    var passphraseModal = (
      <PassphraseExchangeModal   type="exchange"
      open={this.props.passphrase}
      recap={this.createRecap()} />
    )
    var exchangeRate = (
      <ExchangeRate />
    )
    var exchangeButton = (
      <PostExchange />      
    )
    var trasactionLoadingScreen = (
      <TransactionLoading tx={this.props.txHash} makeNewTransaction={this.makeNewExchange}/>
    )
    return (
     <ExchangeForm step = {this.props.step}
                    tokenSource = {tokenSource}
                    tokenDest = {tokenDest}
                    buttonStep1 = {buttonStep1}
                    buttonShowAdvance = {buttonShowAdvance}
                    sourceAmount = {sourceAmount}
                    destAmount= {destAmount}
                    selectTokenModal= {selectTokenModal}
                    changeGasModal= {changeGasModal}
                    exchangeRate = {exchangeRate}
                    exchangeButton= {exchangeButton}
                    errorSelectSameToken = {errorSelectSameToken}
                    errorSelectTokenToken = {errorSelectTokenToken}
                    errorSourceAmount = {errorSourceAmount}
                    trasactionLoadingScreen = {trasactionLoadingScreen}
                    recap = {this.createRecap()}/>
    )
  }
}
