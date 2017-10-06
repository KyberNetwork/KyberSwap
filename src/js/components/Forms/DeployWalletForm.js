import React from "react"

import {UserSelect} from "../../containers/CommonElements"
import {TransactionConfig, Credential} from "./Components"

const DeployWalletForm = (props) => {  
 	function focusNext(value, event){         
    if(event.key === 'Enter'){
      event.preventDefault()
      if(document.getElementsByName(value)[0]){
        document.getElementsByName(value)[0].focus();        
      }      
    }
  }
  return (
    <div class="form">
      <div className="row">
        <div className="large-12 columns">
          <UserSelect />
        </div>
      </div>
      <div className="row">
        <div className="large-12 columns">
          <label>Wallet name</label>
          <input onKeyPress = {(event) => focusNext('gas_limit', event)} type="text" value={props.name} onChange={props.onChange} placeholder="Give your wallet a name"/>
        </div>
      </div>
      <div className="row">
        <div className="large-12 columns">
          <TransactionConfig
            gas={props.gas}
            gasPrice={props.gasPrice}
            gasHandler={props.gasHandler}
            gasPriceHandler={props.gasPriceHandler} 
            onGasPress = {(event) => focusNext('gas_price', event)}
            onGasPricePress = {(event) => focusNext('password', event)}
            />
        </div>
      </div>            
      <div className="row">
        <div className="large-12 columns">
          <Credential onKeyPress = {props.onKeyPress} passphraseID={props.passphraseID} error={props.passwordError}/>
        </div>
      </div>
      <div className="row">
        <div className="large-12 columns submit-button">
          <button class="button" onClick={props.action} >Create Kyber Wallet</button>
        </div>
      </div>
    </div>
  )
 }

export default DeployWalletForm
