import React from "react"
import { connect } from "react-redux"

import { numberToHex, gweiToWei, weiToGwei } from "../../utils/converter"
import { verifyAccount, verifyToken, verifyAmount, verifyNonce, verifyNumber, anyErrors } from "../../utils/validators"

import { hidePassphrase as hidePassphraseTransfer } from "../../actions/transferActions"

import Passphrase from '../../components/Forms/Components/Passphrase'

@connect((store, props) => {
  return {
    modal: props,
    account: store.account,
    form: store.transfer
  };
	
})

export default class PassphraseTransferModal extends React.Component {

  closeModal = (event) => {
  	this.props.dispatch(hidePassphraseTransfer())
  }

  formParams = () => {
    var selectedAccount = this.props.account.address
    var token = this.props.form.token
    var amount = numberToHex(this.props.form.amount)
    var destAddress = this.props.account.address
    var throwOnFailure = this.props.throwOnFailure
    var nonce = verifyNonce(this.props.account.nonce)
    // should use estimated gas
    var gas = numberToHex(this.props.form.gas)
    // should have better strategy to determine gas price
    var gasPrice = numberToHex(this.props.form.gasPrice)
    return {
      selectedAccount, token, amount, destAddress, 
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
