import React from "react"
import { connect } from "react-redux"
import { push } from 'react-router-redux';

import { toT } from "../../utils/converter"

import { TransferForm } from "../../components/Transaction"
import { PostTransfer } from "../Transfer"
import { Token, SelectTokenModal, ChangeGasModal, TransactionLoading } from "../CommonElements"

import { openTokenModal, hideSelectToken } from "../../actions/utilActions"
import { verifyAccount } from "../../utils/validators"
import { specifyAddressReceive, specifyAmountTransfer, selectToken, errorSelectToken, goToStep, showAdvance, openPassphrase, throwErrorDestAddress, thowErrorAmount, makeNewTransfer } from '../../actions/transferActions';

import { specifyGas as specifyGasTransfer, specifyGasPrice as specifyGasPriceTransfer, hideAdvance as hideAdvanceTransfer } from "../../actions/transferActions"
import { TransactionConfig } from "../../components/CommonElement"

@connect((store) => {
  // if (store.account.isStoreReady) {
  //   if (!!!store.account.account.address) {
  //     window.location.href = "/"
  //   }
  // }
  return { transfer: store.transfer, account: store.account, tokens: store.tokens }
})

export default class Transfer extends React.Component {

  openTokenChoose = (e) => {
    this.props.dispatch(openTokenModal("transfer", this.props.transfer.tokenSymbol))
  }
  onAddressReceiveChange = (event) => {
    var value = event.target.value
    this.props.dispatch(specifyAddressReceive(value));
  }
  onAmountChange = (event) => {
    var value = event.target.value
    this.props.dispatch(specifyAmountTransfer(value));
  }
  chooseToken = (symbol, address, type) => {

    // this.props.dispatch(selectToken(symbol, address, type))
    this.props.dispatch(selectToken(symbol, address))
    this.props.dispatch(hideSelectToken())
  }

  showAdvanceOption = () => {
    this.props.dispatch(showAdvance())
  }


  createRecap = () => {
    return `transfer ${this.props.transfer.amount.toString().slice(0, 7)}${this.props.transfer.amount.toString().length > 7 ? '...' : ''} ${this.props.transfer.tokenSymbol} to ${this.props.transfer.destAddress.slice(0, 7)}...${this.props.transfer.destAddress.slice(-5)}`
  }

  makeNewTransfer = () => {
    this.props.dispatch(makeNewTransfer());
  }

  specifyGas = (event) => {
    var value = event.target.value
    this.props.dispatch(specifyGasTransfer(value))
  }

  specifyGasPrice = (event) => {
    var value = event.target.value
    this.props.dispatch(specifyGasPriceTransfer(value))
  }

  setAmount = () => {
    var tokenSymbol = this.props.transfer.tokenSymbol
    var token = this.props.tokens[tokenSymbol]
    if (token) {
      var balanceBig = token.balance
      if (tokenSymbol === "ETH") {
        if (!balanceBig.greaterThanOrEqualTo(Math.pow(10, 15))) {
          return false
        }
        balanceBig = balanceBig.minus(Math.pow(10, 15))
      }
      var balance = toT(balanceBig, 8)
      this.props.dispatch(specifyAmountTransfer(balance))
    }
  }

  render() {
    if (this.props.account.isStoreReady) {
      if (!!!this.props.account.account.address) {
        setTimeout(() => this.props.dispatch(push("/")), 1000)        
        return (
          <div></div>
        )
      }
    }else{
      return (
        <div></div>
      )
    }

    var balance = ""
    var tokenName = ""
    var token = this.props.tokens[this.props.transfer.tokenSymbol]
    if(token){
      balance = toT(token.balance,8)
      tokenName = token.name
    }
    var balanceInfo = {
      tokenName: tokenName,
      amount: balance,
      tokenSymbol: this.props.transfer.tokenSymbol
    }
        

    var button = {
      showAdvance: {
        onClick: this.showAdvanceOption
      }
    }
    var input = {
      destAddress: {
        value: this.props.transfer.destAddress,
        onChange: this.onAddressReceiveChange
      },
      amount: {
        value: this.props.transfer.amount,
        onChange: this.onAmountChange
      }
    }
    var errors = {
      destAddress: this.props.transfer.errors.destAddress,
      amountTransfer: this.props.transfer.errors.amountTransfer
    }

    var token = (
      <Token type="transfer"
        token={this.props.transfer.tokenSymbol}
        onSelected={this.openTokenChoose}
      />
    )
    var tokenModal = (
      <SelectTokenModal chooseToken={this.chooseToken} type="transfer" selectedSymbol = {this.props.transfer.tokenSymbol}/>
    )
    var changeGasModal = (
      <ChangeGasModal type="transfer"
        gas={this.props.transfer.gas}
        gasPrice={this.props.transfer.gasPrice}
        open={this.props.transfer.advance}
        gasPriceError={this.props.transfer.errors.gasPriceError}
        gasError={this.props.transfer.errors.gasError}
      />
    )
    var transferButton = (
      <PostTransfer />
    )
    var trasactionLoadingScreen = (
      <TransactionLoading tx={this.props.transfer.txHash} 
                          makeNewTransaction={this.makeNewTransfer} 
                          type="transfer"
                          balanceInfo = {balanceInfo}
                          />
    )

    var gasConfig = (
      <TransactionConfig gas={this.props.transfer.gas}
              gasPrice={this.props.transfer.gasPrice}
              gasHandler={this.specifyGas}
              gasPriceHandler={this.specifyGasPrice}
              gasPriceError={this.props.transfer.gasPriceError}
              gasError={this.props.transfer.gasError}/>
    )         
    
    return (
     <TransferForm step={this.props.transfer.step}
                    token = {token}
                    tokenSymbol = {this.props.transfer.tokenSymbol}
                    tokenModal = {tokenModal}
                    changeGasModal = {changeGasModal}
                    gasConfig = {gasConfig}
                    transferButton = {transferButton}
                    trasactionLoadingScreen = {trasactionLoadingScreen}
                    recap = {this.createRecap()}
                    button = {button}
                    input = {input}
                    errors = {errors}
                    balance = {balance}
                    setAmount={this.setAmount}
                    />
    ) 
  }
}
