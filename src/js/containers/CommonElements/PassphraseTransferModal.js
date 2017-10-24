import React from "react"
import { connect } from "react-redux"
import * as ethUtil from 'ethereumjs-util'

import constants from "../../services/constants"
import { numberToHex, toTWei, gweiToWei, weiToGwei } from "../../utils/converter"
import { verifyAccount, verifyToken, verifyAmount, verifyNonce, verifyNumber, anyErrors } from "../../utils/validators"

import { etherToOthersFromAccount, tokenToOthersFromAccount, sendEtherFromAccount, sendTokenFromAccount, exchangeFromWallet, sendEtherFromWallet, sendTokenFromWallet } from "../../services/exchange"
import { hidePassphrase, changePassword, throwPassphraseError, finishTransfer } from "../../actions/transferActions"

import { updateAccount, incManualNonceAccount } from "../../actions/accountActions"
import { addTx } from "../../actions/txActions"
import Tx from "../../services/tx"

//import Passphrase from '../../components/Forms/Components/Passphrase'
import {Modal} from "../../components/CommonElement"

@connect((store, props) => {
  return {
    modal: props,
    account: store.account,
    form: store.transfer,
    ethereum: store.connection.ethereum
  };
	
})

export default class PassphraseTransferModal extends React.Component {

  closeModal = (event) => {
  	this.props.dispatch(hidePassphrase())
  }

  changePassword = (event) =>{
    this.props.dispatch(changePassword())
  }
  formParams = () => {
    var selectedAccount = this.props.account.address
    var token = this.props.form.token
    var amount = numberToHex(toTWei(this.props.form.amount))
    var destAddress = this.props.form.destAddress
    var throwOnFailure = this.props.throwOnFailure
    var nonce = verifyNonce(this.props.account.nonce)
    // should use estimated gas
    var gas = numberToHex(this.props.form.gas)
    // should have better strategy to determine gas price
    var gasPrice = numberToHex(gweiToWei(this.props.form.gasPrice))
    return {
      selectedAccount, token, amount, destAddress, 
      throwOnFailure, nonce, gas, gasPrice
    }
  }

  processTx = (event) => {
    try {
  	  var password = document.getElementById("passphrase").value    
      const params = this.formParams()
      // sending by wei
      var account = this.props.account
      var ethereum = this.props.ethereum  
    
      var call = params.sourceToken == constants.ETHER_ADDRESS ? sendEtherFromAccount : sendTokenFromAccount
      var dispatch = this.props.dispatch
      //var sourceAccount = account
      var formId = "transfer"
      var recap = this.props.recap;
      call(
        formId, ethereum, account.address,
        params.token, params.amount,
        params.destAddress, params.nonce, params.gas,
        params.gasPrice, account.keystring, password, (ex, trans) => {
          const tx = new Tx(
            ex, account.address, ethUtil.bufferToInt(trans.gas),
            weiToGwei(ethUtil.bufferToInt(trans.gasPrice)),
            ethUtil.bufferToInt(trans.nonce), "pending", "send", {
              sourceToken: params.token,
              sourceAmount: params.amount,
              destAddress: params.destAddress,
              recap: recap
            })
          dispatch(incManualNonceAccount(account.address))
          dispatch(updateAccount(ethereum, account))
          dispatch(addTx(tx))
        })
      document.getElementById("passphrase").value = ''
      dispatch(finishTransfer())
    } catch (e) {
      console.log(e)
      this.props.dispatch(throwPassphraseError("Key derivation failed"))
      //errors["passwordError"] = e.message
    }
  }

  content = () => {
    return (
      <div>
        <div>{this.props.modal.recap}</div>
        <input type="password" id="passphrase" onChange={this.changePassword}/>
        <button onClick={this.processTx}>Transfer</button>
        {this.props.form.errors.passwordError}
      </div>
    )
  }
  render() {
    return (
      <Modal  
        isOpen={this.props.modal.open}
        onRequestClose={this.closeModal}
        contentLabel="select token"
        content = {this.content()}      
           />         

    )
  }
}
