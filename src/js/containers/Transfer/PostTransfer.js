import React from "react"
import { connect } from "react-redux"
import * as ethUtil from 'ethereumjs-util'

import constants from "../../services/constants"
import { numberToHex, toTWei, toT, gweiToWei, weiToGwei } from "../../utils/converter"
import { verifyAccount, verifyToken, verifyAmount, verifyNonce, verifyNumber, anyErrors } from "../../utils/validators"

import { etherToOthersFromAccount, tokenToOthersFromAccount, sendEtherFromAccount, sendTokenFromAccount, exchangeFromWallet, sendEtherFromWallet, sendTokenFromWallet } from "../../services/exchange"

import { hidePassphrase, changePassword, throwPassphraseError, finishTransfer, hideConfirm } from "../../actions/transferActions"
import { openPassphrase ,throwErrorDestAddress, thowErrorAmount, doTransaction} from '../../actions/transferActions';

import { updateAccount, incManualNonceAccount } from "../../actions/accountActions"
import { addTx } from "../../actions/txActions"
import Tx from "../../services/tx"

//import Passphrase from '../../components/Forms/Components/Passphrase'
import {Modal} from "../../components/CommonElement"

@connect((store, props) => {
  const tokens = store.tokens
  const tokenSymbol = store.transfer.tokenSymbol
  var balance = 0
  if (tokens[tokenSymbol]){
    balance = tokens[tokenSymbol].balance
  }  
  return {
    account: store.account.account,
    form: {...store.transfer, balance},
    ethereum: store.connection.ethereum
  };
	
})


export default class PostTransfer extends React.Component {
  clickTransfer = () =>{
    if(this.validateTransfer()){
        //check account type
        switch(this.props.account.type){
            case "keystore":
                this.props.dispatch(openPassphrase())
                break
            case "trezor":
            case "ledger":
                this.processTx()
                break
        }
        
    }

}
  validateTransfer = () =>{
    //check dest address is an ethereum address
    if (verifyAccount(this.props.form.destAddress) !== null){
      this.props.dispatch(throwErrorDestAddress("This is not an address"))
      return false
    }
    if(isNaN(this.props.form.amount)){
      this.props.dispatch(thowErrorAmount("amount must be a number"))
      return false
    }
    else if(parseFloat(this.props.form.amount) > parseFloat(toT(this.props.form.balance, 8))){
      this.props.dispatch(thowErrorAmount("amount is too high"))
      return false
    }        
    return true
  }

      content = () =>{
          return (
            <div>
              <div>{this.createRecap()}</div>
              <input type="password" id="passphrase" onChange={this.changePassword}/>
              <button onClick={this.processTx}>Transfer</button>
              {this.props.form.errors.passwordError}
            </div>
          )
      }
      contentConfirm = () => {
        return (
          <div>
            <div>{this.createRecap()}</div>
            <button onClick={this.closeModal}>Cancel</button>
            <button onClick={this.broacastTx}>Transfer</button>
          </div>
        )
      }
      broacastTx = () =>{
        const id =  "transfer"
        const ethereum = this.props.ethereum
        const tx = this.props.form.txRaw
        this.props.dispatch(doTransaction(id, ethereum, tx, (ex, trans)=>{
          this.runAfterBroacastTx(ex, trans)
          this.props.dispatch(finishTransfer())
        }))      
      }
      createRecap = () => {
        var form = this.props.form;
        return `transfer ${form.amount.toString().slice(0,7)}${form.amount.toString().length > 7?'...':''} ${form.tokenSymbol} to ${form.destAddress.slice(0,7)}...${form.destAddress.slice(-5)}`
      } 

      recap = () => {
        var amount = this.props.form.amount.toString();
        var tokenSymbol = this.props.form.tokenSymbol;
        var destAddress = this.props.form.destAddress;
        return {
          amount, tokenSymbol, destAddress
        }
      }
      closeModal = (event) => {
        switch(this.props.account.type){
          case "keystore":
              this.props.dispatch(hidePassphrase())
              break
          case "trezor":
              this.props.dispatch(hideConfirm())
              break
        }
        
    }
    changePassword = (event) =>{
      this.props.dispatch(changePassword())
    }
    formParams = () => {
      var selectedAccount = this.props.account.address
      var token = this.props.form.token
      var amount = numberToHex(toTWei(this.props.form.amount))
      var destAddress = this.props.form.destAddress
      var throwOnFailure = this.props.form.throwOnFailure
      var nonce = verifyNonce(this.props.account.getUsableNonce())
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
        var password = ""        
        if (this.props.account.type === "keystore"){
          password = document.getElementById("passphrase").value
          document.getElementById("passphrase").value = ''
        }        
        const params = this.formParams()
        console.log(params)
        //return
        // sending by wei
        var account = this.props.account
        var ethereum = this.props.ethereum  
      
        var call = params.token == constants.ETHER_ADDRESS ? sendEtherFromAccount : sendTokenFromAccount
      
        var dispatch = this.props.dispatch
        //var sourceAccount = account
        var formId = "transfer"
        call(
          formId, ethereum, account.address,
          params.token, params.amount,
          params.destAddress, params.nonce, params.gas,
          params.gasPrice, account.keystring, account.type, password, (ex, trans) => {
            this.runAfterBroacastTx(ex, trans)
            dispatch(finishTransfer())

            // const tx = new Tx(
            //   ex, account.address, ethUtil.bufferToInt(trans.gas),
            //   weiToGwei(ethUtil.bufferToInt(trans.gasPrice)),
            //   ethUtil.bufferToInt(trans.nonce), "pending", "send", {
            //     sourceToken: params.token,
            //     sourceAmount: params.amount,
            //     destAddress: params.destAddress,
            //   })
            // dispatch(incManualNonceAccount(account.address))
            // dispatch(updateAccount(ethereum, account))
            // dispatch(addTx(tx))
          })
        //document.getElementById("passphrase").value = ''
        //dispatch(finishTransfer())
      } catch (e) {
        console.log(e)
        this.props.dispatch(throwPassphraseError("Key derivation failed"))
        //errors["passwordError"] = e.message
      }
    }
    runAfterBroacastTx =(ex, trans)=>{
      const account = this.props.account
      const params = this.formParams()
      const ethereum = this.props.ethereum
      const dispatch = this.props.dispatch
      var recap = this.createRecap()       
      const tx = new Tx(
        ex, account.address, ethUtil.bufferToInt(trans.gas),
        weiToGwei(ethUtil.bufferToInt(trans.gasPrice)),
        ethUtil.bufferToInt(trans.nonce), "pending", "send", this.recap())
      dispatch(incManualNonceAccount(account.address))
      dispatch(updateAccount(ethereum, account))
      dispatch(addTx(tx))
    }
    render (){
      var modalPassphrase = this.props.account.type ==="keystore"?(
        <Modal  
            isOpen={this.props.form.passphrase}
            onRequestClose={this.closeModal}
            contentLabel="password modal"
            content = {this.content()}       
            />
        ): <Modal 
            isOpen={this.props.form.confirmColdWallet}
            onRequestClose={this.closeModal}
            contentLabel="confirm modal"
            content = {this.contentConfirm()}    
        />
        return (          
            <div>
            <button onClick={this.clickTransfer}>Transfer</button>
                {modalPassphrase}
               </div>            
        )
    }
}