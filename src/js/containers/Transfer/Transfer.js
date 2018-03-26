import React from "react"
import { connect } from "react-redux"
import { push } from 'react-router-redux';

//import { gweiToWei, toT, roundingNumber, gweiToEth, toPrimitiveNumber, stringToBigNumber } from "../../utils/converter"
import * as converters from "../../utils/converter"
import * as validators from "../../utils/validators"

import { TransferForm, TransactionConfig } from "../../components/Transaction"
import { PostTransferWithKey } from "../Transfer"
import { TokenSelector, TransactionLoading } from "../CommonElements"

import { hideSelectToken } from "../../actions/utilActions"
import { verifyAccount } from "../../utils/validators"
// import { specifyAddressReceive, specifyAmountTransfer, selectToken, errorSelectToken, goToStep, showAdvance, openPassphrase, throwErrorDestAddress, thowErrorAmount, makeNewTransfer } from '../../actions/transferActions';
import * as transferActions from "../../actions/transferActions"
import { specifyGas as specifyGasTransfer, specifyGasPrice as specifyGasPriceTransfer, hideAdvance as hideAdvanceTransfer } from "../../actions/transferActions"
import { getTranslate } from 'react-localize-redux'
import { default as _ } from 'underscore'

@connect((store, props) => {
  const tokens = store.tokens.tokens
  const tokenSymbol = store.transfer.tokenSymbol
  var balance = 0
  var decimal = 18
  var tokenName = "kyber"
  if (tokens[tokenSymbol]) {
    balance = tokens[tokenSymbol].balance
    decimal = tokens[tokenSymbol].decimal
    tokenName = tokens[tokenSymbol].name
  }

  return {
    transfer: { ...store.transfer, balance, decimal, tokenName },
    account: store.account,
    tokens: tokens,
    translate: getTranslate(store.locale),
  }
})

export default class Transfer extends React.Component {

  validateSourceAmount = (value, gasPrice) => {
    var checkNumber
    if (isNaN(parseFloat(value))) {
      // this.props.dispatch(transferActions.thowErrorAmount("error.amount_must_be_number"))
    } else {
      var amountBig = converters.stringEtherToBigNumber(this.props.transfer.amount, this.props.transfer.decimal)
      if (amountBig.isGreaterThan(this.props.transfer.balance)) {
        this.props.dispatch(transferActions.thowErrorAmount("error.amount_transfer_too_hign"))
        return
      }

      var testBalanceWithFee = validators.verifyBalanceForTransaction(this.props.tokens['ETH'].balance,
        this.props.transfer.tokenSymbol, this.props.transfer.amount, this.props.transfer.gas, gasPrice)
      if (testBalanceWithFee) {
        this.props.dispatch(transferActions.thowErrorEthBalance("error.eth_balance_not_enough_for_fee"))
      }
    }
   

  }

  lazyUpdateValidateSourceAmount = _.debounce(this.validateSourceAmount, 500)


  onAddressReceiveChange = (event) => {
    var value = event.target.value
    this.props.dispatch(transferActions.specifyAddressReceive(value));
  }


  onAmountChange = (event) => {
    var value = event.target.value
    this.props.dispatch(transferActions.specifyAmountTransfer(value))

    this.lazyUpdateValidateSourceAmount(value, this.props.transfer.gasPrice)
  }
  chooseToken = (symbol, address, type) => {
    this.props.dispatch(transferActions.selectToken(symbol, address))
    this.props.dispatch(hideSelectToken())
  }

  makeNewTransfer = () => {
    this.props.dispatch(transferActions.makeNewTransfer());
  }

  specifyGas = (event) => {
    var value = event.target.value
    this.props.dispatch(transferActions.specifyGas(value))
  }

  specifyGasPrice = (value) => {
    this.props.dispatch(transferActions.specifyGasPrice(value))

    this.lazyUpdateValidateSourceAmount(this.props.transfer.amount, value)
  }

  setAmount = () => {
    var tokenSymbol = this.props.transfer.tokenSymbol
    var token = this.props.tokens[tokenSymbol]
    if (token) {
      var balanceBig = converters.stringToBigNumber(token.balance)
      if (tokenSymbol === "ETH") {
        var gasLimit = this.props.transfer.gas
        var gasPrice = converters.stringToBigNumber(converters.gweiToWei(this.props.transfer.gasPrice))
        var totalGas = gasPrice.multipliedBy(gasLimit)

        if (!balanceBig.isGreaterThanOrEqualTo(totalGas)) {
          return false
        }
        balanceBig = balanceBig.minus(totalGas)
      }
      var balance = balanceBig.div(Math.pow(10, token.decimal)).toString()
      balance = converters.toPrimitiveNumber(balance)
      this.props.dispatch(transferActions.specifyAmountTransfer(balance))
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
        value: converters.toT(token.balance, token.decimal),
        roundingValue: converters.roundingNumber(converters.toT(token.balance, token.decimal)),
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
      amountTransfer: this.props.transfer.errors.amountTransfer || this.props.transfer.errors.ethBalanceError || ''
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

    // var balance = {
    //   prev: converters.toT(this.props.transfer.balanceData.prev, this.props.transfer.balanceData.tokenDecimal),
    //   next: converters.toT(this.props.transfer.balanceData.next, this.props.transfer.balanceData.tokenDecimal)
    // }
    var balanceInfo = {
      tokenName: this.props.transfer.balanceData.tokenName,
      amount: this.props.transfer.balanceData.amount,
      tokenSymbol: this.props.transfer.balanceData.tokenSymbol
      // tokenSymbol: this.props.transfer.tokenSymbol
    }
    var destAdressShort = this.props.transfer.destAddress.slice(0, 8) + "..." + this.props.transfer.destAddress.slice(-6)
    var transactionLoadingScreen = (
      <TransactionLoading tx={this.props.transfer.txHash}
        makeNewTransaction={this.makeNewTransfer}
        tempTx={this.props.transfer.tempTx}
        type="transfer"
        balanceInfo={balanceInfo}
        broadcasting={this.props.transfer.broadcasting}
        broadcastingError={this.props.transfer.bcError}
        address={destAdressShort}
      />
    )

    var gasPrice = converters.stringToBigNumber(converters.gweiToEth(this.props.transfer.gasPrice))
    var totalGas = gasPrice.multipliedBy(this.props.transfer.gas)
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
        gasPriceSuggest={this.props.transfer.gasPriceSuggest}
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
