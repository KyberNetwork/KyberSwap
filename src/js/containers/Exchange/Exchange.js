import React from "react"
import { connect } from "react-redux"

//import TokenDest from "./TokenDest"
//import {TokenDest, MinRate} from "../ExchangeForm"
import {Token} from "../Exchange"
import {SelectTokenModal, ChangeGasModal} from "../CommonElements"

import {openTokenModal, hideSelectToken} from "../../actions/utilActions"
import { selectToken } from "../../actions/tokenActions"
import {errorSelectToken, goToStep} from "../../actions/exchangeActions"

@connect((store) => {
  if (!!!store.account.address){
    window.location.href = "/"
  }
  return {...store.exchange}
})

export default class Exchange extends React.Component {
  openSourceToken = (e) =>{
    this.props.dispatch(openTokenModal("source"))
  }
  openDesToken = (e) =>{
    this.props.dispatch(openTokenModal("des"))

  }
  chooseToken = (symbol, type) => {
    //console.log(type)
    //console.log(symbol)
    this.props.dispatch(selectToken(symbol, type))
    this.props.dispatch(hideSelectToken())
    // if (this.props.token_source === this.props.token_des){
    //   this.props.dispatch(errorSelectToken("Cannot exchange to the same token"))
    // }else{
    //   this.props.dispatch(errorSelectToken(""))
    // }
  }
  proccessSelectToken = () => {
    if (this.props.token_source === this.props.token_des){
      this.props.dispatch(errorSelectToken("Cannot exchange to the same token"))
    }else{
      this.props.dispatch(goToStep(2))
    }
  }
  showAdvanceOption = () => {

  }
  changeSourceAmount = () => {

  }
  getRate = () => {
    return 0
  }
  clickExchange = () =>{
    console.log("click exchange")
  }
  render() {    
    return (
      <div class="k-exchange-page">
       	<div class="page-1" class={this.props.step!==1?'visible-hide':''}>
       		<div>
	       		<Token type="source"
	       				token={this.props.sourceTokenSymbol}
                onSelected={this.openSourceToken}
                 />
                
	       		 <span>to</span>
	       		 <Token type="des"
	       				token={this.props.desTokenSymbol} 
                onSelected={this.openDesToken}
                />
       		</div>
          <div>{this.props.error_select_token}</div>
       		<button onClick = {this.proccessSelectToken}>Continue</button>
       	</div>
        <div class="page-2" class={this.props.step!==2?'visible-hide':''}>
          <div>
            <button onClick={this.showAdvanceOption}>Advance</button>
          </div>
          <h1>Exchange from</h1>
          <div>
            <div>
              <input value={this.props.sourceAmount} onChange={(e)=>this.changeSourceAmount.bind(e)}/>
              <Token type="source"
                token={this.props.sourceTokenSymbol}
                onSelected={this.openSourceToken}
                 />              
            </div>
             <span> to</span>
            <div>
              <input />
              <Token type="des"
                token={this.props.desTokenSymbol} 
                onSelected={this.openDesToken}
                />  
            </div>
          </div>
          <div>
            1 {this.props.token_source} = {this.getRate} {this.props.token_des}
          </div>
          <div>
            <button onClick={this.clickExchange}>Exchange</button>
          </div>

        </div>
        <div class="page-3"  class={this.props.step!==3?'visible-hide':''}>
          step 3
        </div>

        <SelectTokenModal chooseToken ={this.chooseToken}/>
        <ChangeGasModal type="exchange"
                        gas={this.props.gas}
                        gasPrice={this.props.gasPrice} 
                        open = {this.props.advance}
                        gasPriceError = {this.props.errors.gasPriceError}
                        gasError = {this.props.errors.gasError}                        
                        />
      </div>
    )
  }
}
