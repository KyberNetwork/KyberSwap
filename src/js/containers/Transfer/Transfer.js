import React from "react"
import { connect } from "react-redux"

import {calculateMinAmount, toTWei, toEther} from "../../utils/converter"
//import TokenDest from "./TokenDest"
//import {TokenDest, MinRate} from "../ExchangeForm"
import {Token, ExchangeRate} from "../Exchange"
import {SelectTokenModal, ChangeGasModal, PassphraseTransferModal} from "../CommonElements"

//import {toT, toTWei} from "../../utils/converter"
import {openTokenModal, hideSelectToken} from "../../actions/utilActions"
// import { selectToken } from "../../actions/exchangeActions"


import { specifyAddressReceive, specifyAmountTransfer, selectToken, errorSelectToken, goToStep, showAdvance, openPassphrase } from '../../actions/transferActions';


@connect((store, props) => {
  if (!!!store.account.address){
    props.history.push('/');
  }
  return {...store.transfer}
})

export default class Transfer extends React.Component {
  
  openTokenChoose = (e) =>{
    this.props.dispatch(openTokenModal("transfer"))
  }
  onAddressReceiveChange = (event) => {
    var value = event.target.value
    this.props.dispatch(specifyAddressReceive(value));
  }
  onAmountChange = (event) => {
    var value = event.target.value
    this.props.dispatch(specifyAmountTransfer(value));
  }
  chooseToken = (symbol,address, type) => {
    
    // this.props.dispatch(selectToken(symbol, address, type))
    this.props.dispatch(selectToken(symbol, address))
    this.props.dispatch(hideSelectToken())
  }
  proccessSelectToken = () => {
    if (this.props.sourceTokenSymbol === this.props.desTokenSymbol){
      this.props.dispatch(errorSelectToken("Cannot exchange to the same token"))
    }else{
      this.props.dispatch(goToStep(2))
    }
  }
  showAdvanceOption = () => {
    this.props.dispatch(showAdvance())
  }
  clickExchange = () =>{
    if(this.validateExchange){
      this.props.dispatch(openPassphrase())
    }
  }
  validateExchange = () =>{
    return true
  }
  getDesAmount = () => {
    return 0
  }
  createRecap = () => {
    return "create reacap"
  }  

  render() {
    return (
       <div class="k-exchange-page">
       	<div class="page-1" class={this.props.step!==1?'visible-hide':''}>
          <div>
            <button onClick={this.showAdvanceOption}>Advance</button>
          </div>
          <h1>Transfer to</h1>
          <input value={this.props.destAddress} onChange={this.onAddressReceiveChange.bind(this)} />
          <h1>Amount</h1>
          <input value={this.props.amount} onChange={this.onAmountChange.bind(this)} />
          <Token type="transfer"
          token={this.props.tokenSymbol} 
          onSelected={this.openTokenChoose}
          />
          <div>
            <ExchangeRate rate={this.props.rate}/>
          </div>
          <div>{this.props.error_select_token}</div>
          <button onClick = {this.clickExchange}>Transfer</button>
        </div>

        <div class="page-2"  class={this.props.step!==2?'visible-hide':''}>
          step finish broadcasted
        </div>

        <SelectTokenModal chooseToken ={this.chooseToken} type="exchange"/>
        <ChangeGasModal type="exchange"
                        gas={this.props.gas}
                        gasPrice={this.props.gasPrice} 
                        open = {this.props.advance}
                        gasPriceError = {this.props.errors.gasPriceError}
                        gasError = {this.props.errors.gasError}                        
                        />
        <PassphraseTransferModal   type="transfer"
                          open={this.props.passphrase}
                          recap = {this.createRecap} />
      </div>
    )
  }
}
