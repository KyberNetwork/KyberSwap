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


export default class PostTransfer extends React.Component {
    clickExchange = () =>{
        if(this.validateExchange()){
            //check account type
            switch(this.props.account.type){
                case "keystore":
                    this.props.dispatch(openPassphrase())
                    break
                case "trezor":
                    this.processTx()
                    break
            }
            
        }

    }
    validateExchange = () =>{
        //check source amount
      if(isNaN(this.props.form.sourceAmount)){
        this.props.dispatch(thowErrorSourceAmount("Source amount must be a number"))
        return false
      }
      else if(this.props.form.sourceAmount > toT(this.props.form.sourceBalance, 8)){
        this.props.dispatch(thowErrorSourceAmount("Source amount is too high"))
        return false
      }    
      return true
    }
    content = () =>{
        return (
            <div>
              <div>{this.createRecap()}</div>
              <input type="password" id="passphrase" onChange={this.changePassword}/>
              <button onClick={this.processTx}>Exchange</button>
              {this.props.form.errors.passwordError}
          </div>
        )
    }
    createRecap = () => {
      var form = this.props.form;
      return `transfer ${form.amount.toString().slice(0,7)}${form.amount.toString().length > 7?'...':''} ${form.tokenSymbol} to ${form.destAddress.slice(0,7)}...${form.destAddress.slice(-5)}`
    }  
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
  
    processTx = () => {
     // var errors = {}
      try {        
        var password = this.props.account.type === "keystore"?document.getElementById("passphrase").value:""    
        const params = this.formParams()
        // sending by wei
        var account = this.props.account
        var ethereum = this.props.ethereum  
      
        var call = params.sourceToken == constants.ETHER_ADDRESS ? etherToOthersFromAccount : tokenToOthersFromAccount
        var dispatch = this.props.dispatch
        var sourceAccount = account
        var formId = "exchange"
        var recap = this.createRecap()    
        call(
          formId, ethereum, account.address, params.sourceToken,
          params.sourceAmount, params.destToken, params.destAddress,
          params.maxDestAmount, params.minConversionRate,
          params.throwOnFailure, params.nonce, params.gas,
          params.gasPrice, account.keystring, account.type, password, (ex, trans) => {
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
    render (){
        var modalPassphrase = this.props.account.type ==="keystore"?(
            <Modal  
            isOpen={this.props.form.passphrase}
            onRequestClose={this.closeModal}
            contentLabel="password modal"
            content = {this.content()}       
            />
        ):""
        return (
            <div>
            <button onClick={this.clickExchange}>Exchange</button>
                {modalPassphrase}
               </div>            
        )
    }
}