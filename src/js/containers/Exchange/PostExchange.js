import React from "react"
import { connect } from "react-redux"

import * as ethUtil from 'ethereumjs-util'

//import Key from "./Elements/Key"
//import { TokenSelect } from '../../components/Token'
//import { hideGasModal } from "../../actions/utilActions"
//import {TransactionConfig} from "../../components/Forms/Components"
import { numberToHex, toTWei, gweiToWei, toT, weiToGwei } from "../../utils/converter"
import { verifyAccount, verifyToken, verifyAmount, verifyNonce, verifyNumber, anyErrors } from "../../utils/validators"
import constants from "../../services/constants"
import { etherToOthersFromAccount, tokenToOthersFromAccount, sendEtherFromAccount, sendTokenFromAccount, exchangeFromWallet, sendEtherFromWallet, sendTokenFromWallet } from "../../services/exchange"

import { hidePassphrase, changePassword, throwPassphraseError, finishExchange, hideConfirm } from "../../actions/exchangeActions"
import { thowErrorSourceAmount, openPassphrase, doTransaction } from "../../actions/exchangeActions"

import { updateAccount, incManualNonceAccount } from "../../actions/accountActions"
import { addTx } from "../../actions/txActions"
import Tx from "../../services/tx"

//import { specifyGas as specifyGasTransfer, specifyGasPrice as specifyGasPriceTransfer, hideAdvance as hideAdvanceTransfer } from "../../actions/transferActions"

import {Modal} from "../../components/CommonElement"


@connect((store) => {
    const tokens = store.tokens
    const sourceTokenSymbol = store.exchange.sourceTokenSymbol
    const sourceBalance = tokens[sourceTokenSymbol].balance
	return {
   // modal: props,
    form: {...store.exchange, sourceBalance},
    account: store.account,
    ethereum: store.connection.ethereum
  }
})

export default class PostExchange extends React.Component {
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
                <div>{this.createRecap}</div>
                <input type="password" id="passphrase" onChange={this.changePassword}/>
                <button onClick={this.processTx}>Exchange</button>
                {this.props.form.errors.passwordError}
            </div>
          )
      }
      contentConfirm = () => {
        return (
          <div>
            <div>{this.createRecap}</div>
            <button onClick={this.closeModal}>Cancel</button>
            <button onClick={this.broacastTx}>Exchange</button>
          </div>
        )
      }
      broacastTx = () =>{
        var id = "exchange"
        var ethereum = this.props.ethereum
        var tx = this.props.form.rawTx
        this.props.dispatch(doTransaction(id, ethereum, tx, callback))
      }
      createRecap = () =>{
          return "Create recap"
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
    broacastTx =()=>{
      const id =  "exchange"
      const ethereum = this.props.ethereum
      const tx = this.props.form.txRaw
      this.props.dispatch(doTransaction(id, ethereum, tx, (ex, trans)=>{
        this.runAfterBroacastTx(ex, trans)
        this.props.dispatch(finishExchange())
      }))      
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
      //try {        
        var password = ""        
        if (this.props.account.type === "keystore"){
          password = document.getElementById("passphrase").value
          document.getElementById("passphrase").value = ''
        }
        console.log(password)
        const params = this.formParams()
        // sending by wei
        var account = this.props.account
        var ethereum = this.props.ethereum  
      
        var call = params.sourceToken == constants.ETHER_ADDRESS ? etherToOthersFromAccount : tokenToOthersFromAccount
        var dispatch = this.props.dispatch
        var formId = "exchange"
        call(
          formId, ethereum, account.address, params.sourceToken,
          params.sourceAmount, params.destToken, params.destAddress,
          params.maxDestAmount, params.minConversionRate,
          params.throwOnFailure, params.nonce, params.gas,
          params.gasPrice, account.keystring, account.type, password, (ex, trans) => {
            // const tx = new Tx(
            //   ex, account.address, ethUtil.bufferToInt(trans.gas),
            //   weiToGwei(ethUtil.bufferToInt(trans.gasPrice)),
            //   ethUtil.bufferToInt(trans.nonce), "pending", "exchange", {
            //     sourceToken: params.sourceToken,
            //     sourceAmount: params.sourceAmount,
            //     destToken: params.destToken,
            //     minConversionRate: params.minConversionRate,
            //     destAddress: params.destAddress,
            //     maxDestAmount: params.maxDestAmount,
            //   })
            // dispatch(incManualNonceAccount(account.address))
            // dispatch(updateAccount(ethereum, account))
            // dispatch(addTx(tx))
            this.runAfterBroacastTx(ex, trans)
            dispatch(finishExchange())
          })
       
        
      // } catch (e) {
      //   console.log(e)
      //   this.props.dispatch(throwPassphraseError("Key derivation failed"))
      //   //errors["passwordError"] = e.message
      // }
    }
    
    runAfterBroacastTx =(ex, trans)=>{
      const account = this.props.account
      const params = this.formParams()
      const ethereum = this.props.ethereum
      const dispatch = this.props.dispatch
      const tx = new Tx(
        ex, account.address, ethUtil.bufferToInt(trans.gas),
        weiToGwei(ethUtil.bufferToInt(trans.gasPrice)),
        ethUtil.bufferToInt(trans.nonce), "pending", "exchange", {
          sourceToken: params.sourceToken,
          sourceAmount: params.sourceAmount,
          destToken: params.destToken,
          minConversionRate: params.minConversionRate,
          destAddress: params.destAddress,
          maxDestAmount: params.maxDestAmount,
        })
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
            <button onClick={this.clickExchange}>Exchange</button>
                {modalPassphrase}
               </div>            
        )
    }
}