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
    this.props.dispatch(openTokenModal("transfer"))
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

  render() {
    if (this.props.account.isStoreReady) {
      if (!!!this.props.account.account.address) {
        this.props.dispatch(push("/"))
        return (
          <div></div>
        )
      }
    }

    var balance = ""
    var token = this.props.tokens[this.props.transfer.tokenSymbol]
    if(token){
      balance = toT(token.balance,8)
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


    // var showAdvanceBtn = (
    //   <button onClick={this.showAdvanceOption}>Advance</button>
    // )
    // var destAddress = (
    //   <input value={this.props.destAddress} onChange={this.onAddressReceiveChange.bind(this)} />
    // )
    // var amount = (
    //   <input value={this.props.amount} onChange={this.onAmountChange.bind(this)} />
    // )
    // var errorDestAddress = (
    //   <div>{this.props.errors.destAddress}</div>
    // )
    // var errorAmount = (
    //   <div>{this.props.errors.amountTransfer}</div>
    // )
    var token = (
      <Token type="transfer"
        token={this.props.transfer.tokenSymbol}
        onSelected={this.openTokenChoose}
      />
    )
    var tokenModal = (
      <SelectTokenModal chooseToken={this.chooseToken} type="transfer" />
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
      <TransactionLoading tx={this.props.transfer.txHash} makeNewTransaction={this.makeNewTransfer} />
    )

    return (
      <TransferForm step={this.props.transfer.step}
        token={token}
        tokenSymbol={this.props.transfer.tokenSymbol}
        tokenModal={tokenModal}
        changeGasModal={changeGasModal}
        transferButton={transferButton}
        trasactionLoadingScreen={trasactionLoadingScreen}
        recap={this.createRecap()}
        button={button}
        input={input}
        errors={errors}
        balance = {balance}
      />
    )
  }
}
