import React from "react"
import { connect } from "react-redux"

//import Key from "./Elements/Key"
//import { TokenSelect } from '../../components/Token'
//import { hideGasModal } from "../../actions/utilActions"
//import {TransactionConfig} from "../../components/Forms/Components"
import { numberToHex, gweiToWei, weiToGwei } from "../../utils/converter"
import { verifyAccount, verifyToken, verifyAmount, verifyNonce, verifyNumber, anyErrors } from "../../utils/validators"

import { hidePassphrase as hidePassphraseExchange } from "../../actions/exchangeActions"
//import { specifyGas as specifyGasTransfer, specifyGasPrice as specifyGasPriceTransfer, hideAdvance as hideAdvanceTransfer } from "../../actions/transferActions"


import Modal from 'react-modal'

const customStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(139, 87, 42, 0.55)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }
}

@connect((store, props) => {
	return {
    modal: props,
    form: store.exchange,
    account: store.account
  }
   // return {
   // 		open : props.open,
   // 		type: props.type,
   // 		gas: props.gas,
   // 		gasPrice: props.gasPrice,
   // 		gasPriceError : props.gasPriceError,
   //      gasError : props.gasError
   // 	}
  //return store.utils
})

export default class PassphraseModal extends React.Component {

  closeModal = (event) => {
  	if(this.props.type === "exchange"){
  		this.props.dispatch(hidePassphraseExchange())
  	}else{
  		//this.props.dispatch(hideAdvanceTransfer(value))
  	}
  }

  formParams = () => {
    var selectedAccount = this.props.account.address
    var sourceToken = this.props.form.sourceToken
    var sourceAmount = numberToHex(this.props.form.sourceAmount)
    var destToken = this.props.form.destToken
    var minConversionRate = numberToHex(this.props.form.minConversionRate)
    var destAddress = this.props.account.address
    var maxDestAmount = numberToHex(this.props.form.maxDestAmount)
    var throwOnFailure = this.props.throwOnFailure
    var nonce = verifyNonce(this.props.form.nonce)
    // should use estimated gas
    var gas = numberToHex(this.props.form.gas)
    // should have better strategy to determine gas price
    var gasPrice = numberToHex(this.props.form.gasPrice)
    return {
      selectedAccount, sourceToken, sourceAmount, destToken,
      minConversionRate, destAddress, maxDestAmount,
      throwOnFailure, nonce, gas, gasPrice
    }
  }

  processTx = (event) => {
  	//var password = document.getElementById("passphrase").value
    const params = this.formParams()
    console.log(params)
  	//this.props.callAction(password)
  }

  render() {
    return (
    	<Modal  
	     	 style={customStyles}    
	         isOpen={this.props.modal.open}
	          onRequestClose={this.closeModal}
             contentLabel ="change gas"
            >
	        <div>{this.props.modal.recap}</div>
	        <input type="password" id="passphrase"/>
	        <button onClick={this.processTx}>Exchange</button>
	      </Modal>
      
    )
  }
}
