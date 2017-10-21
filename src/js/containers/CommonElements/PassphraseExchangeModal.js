import React from "react"
import { connect } from "react-redux"

import { numberToHex, gweiToWei, weiToGwei } from "../../utils/converter"
import { verifyAccount, verifyToken, verifyAmount, verifyNonce, verifyNumber, anyErrors } from "../../utils/validators"

import { hidePassphrase as hidePassphraseExchange } from "../../actions/exchangeActions"

import Passphrase from '../../components/Forms/Components/Passphrase'


@connect((store, props) => {
  return {
    modal: props,
    account: store.account,
    form: store.exchange
  };
})

export default class PassphraseExchangeModal extends React.Component {

  closeModal = (event) => {
  	if(this.props.type === "exchange"){
  		this.props.dispatch(hidePassphraseExchange())
    }
    // else if(this.props.type === "transfer"){
    //   this.props.dispatch(hidePassphraseExchange())
    // }
    else{
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
    console.log("process tx__________________________");
    const params = this.formParams()
    
    console.log(params)
  	//this.props.callAction(password)
  }

  render() {
    return (
    	<Passphrase
        isOpen={this.props.modal.open}
        onRequestClose={this.closeModal}
        contentLabel ="change gas" 
        recap={this.props.modal.recap}
        processTx={this.processTx}
        type={this.props.type }
        />
      
    )
  }
}
