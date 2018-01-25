import React from "react"
import { connect } from "react-redux"
import { push } from 'react-router-redux';

import { toT, roundingNumber, gweiToEth, toPrimitiveNumber, stringToBigNumber } from "../../utils/converter"

import { TransferForm, TransactionConfig } from "../../components/Transaction"
import { PostTransferWithKey } from "../Transfer"
import { TokenSelector, TransactionLoading } from "../CommonElements"

import { openTokenModal, hideSelectToken } from "../../actions/utilActions"
import { verifyAccount } from "../../utils/validators"
import { specifyAddressReceive, specifyAmountTransfer, selectToken, errorSelectToken, goToStep, showAdvance, openPassphrase, throwErrorDestAddress, thowErrorAmount, makeNewTransfer } from '../../actions/transferActions';
import { specifyGas as specifyGasTransfer, specifyGasPrice as specifyGasPriceTransfer, hideAdvance as hideAdvanceTransfer } from "../../actions/transferActions"
import { getTranslate } from 'react-localize-redux';

@connect((store, props) => {
  return {
    transfer: store.transfer,
    account: store.account,
    tokens: store.tokens.tokens,
    translate: getTranslate(store.locale),
  }
})

export default class Transfer extends React.Component {

  onAddressReceiveChange = (event) => {
    var value = event.target.value
    this.props.dispatch(specifyAddressReceive(value));
  }
  onAmountChange = (event) => {
    var value = event.target.value
    this.props.dispatch(specifyAmountTransfer(value));
  }
  chooseToken = (symbol, address, type) => {
    this.props.dispatch(selectToken(symbol, address))
    this.props.dispatch(hideSelectToken())
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
      var balanceBig = stringToBigNumber(token.balance)
      if (tokenSymbol === "ETH") {
        if (!balanceBig.greaterThanOrEqualTo(Math.pow(10, 17))) {
          return false
        }
        balanceBig = balanceBig.minus(Math.pow(10, 17))
      }
      var balance = balanceBig.div(Math.pow(10, token.decimal)).toString()
      balance = toPrimitiveNumber(balance)
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
    } else {
      return (
        <div></div>
      )
    }

    var addressBalance = ""
    var token = this.props.tokens[this.props.transfer.tokenSymbol]
    if (token) {
      addressBalance = {
        value: toT(token.balance, token.decimal),
        roundingValue: roundingNumber(toT(token.balance, token.decimal)),
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
      destAddress: this.props.transfer.errors.destAddress || '',
      amountTransfer: this.props.transfer.errors.amountTransfer || ''
    }

    var tokenTransferSelect = (
      <TokenSelector 
        type="transfer"
        focusItem={this.props.transfer.tokenSymbol}
        listItem={this.props.tokens}
        chooseToken={this.chooseToken}
      />
    )

    var transferButton = (
      <PostTransferWithKey />
    )

    var balance = {
      prev: toT(this.props.transfer.balanceData.prev, this.props.transfer.balanceData.tokenDecimal),
      next: toT(this.props.transfer.balanceData.next, this.props.transfer.balanceData.tokenDecimal)
    }
    var balanceInfo = {
      tokenName: this.props.transfer.balanceData.tokenName,
      amount: balance,
      tokenSymbol: this.props.transfer.balanceData.tokenSymbol
     // tokenSymbol: this.props.transfer.tokenSymbol
    }
    var destAdressShort = this.props.transfer.destAddress.slice(0, 8) + "..." +  this.props.transfer.destAddress.slice(-6)
    var transactionLoadingScreen = (
      <TransactionLoading tx={this.props.transfer.txHash}
        makeNewTransaction={this.makeNewTransfer}
        tempTx={this.props.transfer.tempTx}
        type="transfer"
        balanceInfo={balanceInfo}
        broadcasting={this.props.transfer.broadcasting}
        broadcastingError={this.props.transfer.bcError}
        address = {destAdressShort}
      />
    )

    var gasPrice = stringToBigNumber(gweiToEth(this.props.transfer.gasPrice))
    var totalGas = gasPrice.mul(this.props.transfer.gas)
    var gasConfig = (
      <TransactionConfig gas={this.props.transfer.gas}
        gasPrice={this.props.transfer.gasPrice}
        gasHandler={this.specifyGas}
        gasPriceHandler={this.specifyGasPrice}
        gasPriceError={this.props.transfer.errors.gasPrice}
        gasError={this.props.transfer.errors.gas}
        totalGas={totalGas.toString()}
        translate={this.props.translate}
        advanced={this.props.transfer.advanced}
      />
    )

    return (
      <TransferForm step={this.props.transfer.step}
        tokenSymbol={this.props.transfer.tokenSymbol}
        tokenTransferSelect={tokenTransferSelect}
        gasConfig={gasConfig}
        transferButton={transferButton}
        transactionLoadingScreen={transactionLoadingScreen}
        input={input}
        errors={errors}
        balance={addressBalance}
        setAmount={this.setAmount}
        translate={this.props.translate}
      />
    )
  }
}
