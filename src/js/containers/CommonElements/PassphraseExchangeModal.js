import React from "react"
import { connect } from "react-redux"
import * as ethUtil from 'ethereumjs-util'

//import Key from "./Elements/Key"
//import { TokenSelect } from '../../components/Token'
//import { hideGasModal } from "../../actions/utilActions"
//import {TransactionConfig} from "../../components/Forms/Components"
import { numberToHex, toTWei, gweiToWei, weiToGwei } from "../../utils/converter"
import { verifyAccount, verifyToken, verifyAmount, verifyNonce, verifyNumber, anyErrors } from "../../utils/validators"
import constants from "../../services/constants"
import { etherToOthersFromAccount, tokenToOthersFromAccount, sendEtherFromAccount, sendTokenFromAccount, exchangeFromWallet, sendEtherFromWallet, sendTokenFromWallet } from "../../services/exchange"

import { hidePassphrase, changePassword, throwPassphraseError, finishExchange } from "../../actions/exchangeActions"
import { updateAccount, incManualNonceAccount } from "../../actions/accountActions"
import { addTx } from "../../actions/txActions"
import Tx from "../../services/tx"

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
    account: store.account,
    ethereum: store.connection.ethereum
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

export default class PassphraseExchangeModal extends React.Component {

  closeModal = (event) => {
  	this.props.dispatch(hidePassphrase())
  }
  changePassword = (event) =>{
    this.props.dispatch(changePassword())
  }
  formParams = () => {
    var selectedAccount = this.props.account.address
    var sourceToken = this.props.form.sourceToken
    var sourceAmount = numberToHex(toTWei(this.props.form.sourceAmount))
    var destToken = this.props.form.destToken
    var minConversionRate = numberToHex(this.props.form.minConversionRate)
    var destAddress = this.props.account.address
    var maxDestAmount = numberToHex(this.props.form.maxDestAmount)
    var throwOnFailure = this.props.form.throwOnFailure

    var nonce = verifyNonce(this.props.account.getUsableNonce())
    // should use estimated gas
    var gas = numberToHex(this.props.form.gas)
    // should have better strategy to determine gas price
    var gasPrice = numberToHex(gweiToWei(this.props.form.gasPrice))
    return {
      selectedAccount, sourceToken, sourceAmount, destToken,
      minConversionRate, destAddress, maxDestAmount,
      throwOnFailure, nonce, gas, gasPrice
    }
  }

  processTx = (event) => {
   // var errors = {}
    try {
  	  var password = document.getElementById("passphrase").value    
      const params = this.formParams()
      // sending by wei
      var account = this.props.account
      var ethereum = this.props.ethereum  
    
      var call = params.sourceToken == constants.ETHER_ADDRESS ? etherToOthersFromAccount : tokenToOthersFromAccount
      var dispatch = this.props.dispatch
      var sourceAccount = account
      var formId = "exchange"
      var recap = this.props.recap;
      call(
        formId, ethereum, account.address, params.sourceToken,
        params.sourceAmount, params.destToken, params.destAddress,
        params.maxDestAmount, params.minConversionRate,
        params.throwOnFailure, params.nonce, params.gas,
        params.gasPrice, account.keystring, password, (ex, trans) => {
          const tx = new Tx(
            ex, sourceAccount.address, ethUtil.bufferToInt(trans.gas),
            weiToGwei(ethUtil.bufferToInt(trans.gasPrice)),
            ethUtil.bufferToInt(trans.nonce), "pending", "exchange", {
              sourceToken: params.sourceToken,
              sourceAmount: params.sourceAmount,
              destToken: params.destToken,
              minConversionRate: params.minConversionRate,
              destAddress: params.destAddress,
              maxDestAmount: params.maxDestAmount,
              recap: recap
            })
          dispatch(incManualNonceAccount(account.address))
          dispatch(updateAccount(ethereum, account))
          dispatch(addTx(tx))
        })
      document.getElementById("passphrase").value = ''
      dispatch(finishExchange())
    } catch (e) {
      console.log(e)
      this.props.dispatch(throwPassphraseError("Key derivation failed"))
      //errors["passwordError"] = e.message
    }
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
	        <input type="password" id="passphrase" onChange={this.changePassword}/>
	        <button onClick={this.processTx}>Exchange</button>
          {this.props.form.errors.passwordError}
	      </Modal>
      
    )
  }
}
