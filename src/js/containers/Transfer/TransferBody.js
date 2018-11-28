import React from "react"
import { connect } from "react-redux"
import { push } from 'react-router-redux';
import * as converters from "../../utils/converter"
import * as validators from "../../utils/validators"
import { TransferForm } from "../../components/Transaction"
import { TransactionLoading } from "../CommonElements"
import { AdvanceConfigLayout, GasConfig } from "../../components/TransactionCommon"
import { TokenSelector, AccountBalance } from "../TransactionCommon"
import { hideSelectToken } from "../../actions/utilActions"
import { verifyAccount } from "../../utils/validators"
import * as common from "../../utils/common"
import * as globalActions from "../../actions/globalActions"
import constansts from "../../services/constants"
import * as analytics from "../../utils/analytics"
import * as transferActions from "../../actions/transferActions"
import { getTranslate } from 'react-localize-redux'
import { default as _ } from 'underscore'
import BLOCKCHAIN_INFO from "../../../../env";
import * as web3Package from "../../services/web3"
import { importAccountMetamask } from "../../actions/accountActions"

@connect((store, props) => {
  const langs = store.locale.languages
  var currentLang = common.getActiveLanguage(langs)

  const tokens = store.tokens.tokens
  const tokenSymbol = store.transfer.tokenSymbol
  var balance = 0
  var decimals = 18
  var tokenName = "kyber"
  if (tokens[tokenSymbol]) {
    balance = tokens[tokenSymbol].balance
    decimals = tokens[tokenSymbol].decimals
    tokenName = tokens[tokenSymbol].name
  }

  return {
    transfer: { ...store.transfer, balance, decimals, tokenName },
    account: store.account,
    tokens: tokens,
    global: store.global,
    translate: getTranslate(store.locale),
    advanceLayout: props.advanceLayout,
    currentLang
  }
})

export default class Transfer extends React.Component {
  constructor() {
    super()
    this.state = {
      focus: "transfer"
    }
  }

  componentDidMount = () => {
    if (this.props.global.changeWalletType !== "") this.props.dispatch(globalActions.closeChangeWallet())

    const web3Service = web3Package.newWeb3Instance();

    if (web3Service !== false) {
      const walletType = web3Service.getWalletType();
      const isDapp = (walletType !== "metamask") && (walletType !== "modern_metamask");

      if (isDapp) {
        this.props.dispatch(importAccountMetamask(web3Service, BLOCKCHAIN_INFO.networkId,
          this.props.ethereum, this.props.tokens, this.props.translate, walletType))
      }
    }
  }

  validateSourceAmount = (value, gasPrice) => {
    var checkNumber
    if (isNaN(parseFloat(value))) {
      // this.props.dispatch(transferActions.thowErrorAmount("error.amount_must_be_number"))
    } else {
      var amountBig = converters.stringEtherToBigNumber(this.props.transfer.amount, this.props.transfer.decimals)
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

    if (this.props.account.account !== false) {
      this.lazyUpdateValidateSourceAmount(value, this.props.transfer.gasPrice)
    }
  }

  chooseToken = (symbol, address, type) => {
    this.props.dispatch(transferActions.selectToken(symbol, address))
    this.props.dispatch(hideSelectToken())

    var path = constansts.BASE_HOST + "/transfer/" + symbol.toLowerCase()

    path = common.getPath(path, constansts.LIST_PARAMS_SUPPORTED)

    this.props.dispatch(globalActions.goToRoute(path))
    analytics.trackChooseToken(type, symbol)
  }

  makeNewTransfer = () => {
    this.props.dispatch(transferActions.makeNewTransfer());
    analytics.trackClickNewTransaction("Transfer")
  }

  onFocus = () => { 
    this.setState({focus:"source"})
    analytics.trackClickInputAmount("transfer")
  }

  onFocusAddr = () => { 
    this.setState({focus:"to-addr"})
    analytics.trackClickInputRecieveAddress()
  }

  onBlur = () => {
    this.setState({ focus: "" })
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
      var balance = balanceBig.div(Math.pow(10, token.decimals)).toString()
      balance = converters.toPrimitiveNumber(balance)
      this.props.dispatch(transferActions.specifyAmountTransfer(balance))

      this.onFocus()
    }
    analytics.trackClickAllIn("Transfer", tokenSymbol)
  }

  toggleBalanceContent = (value) => {
    this.props.dispatch(transferActions.toggleBalanceContent(value))    
  }

  specifyGasPrice = (value) => {
    this.props.dispatch(transferActions.specifyGasPrice(value))

    if (this.props.account !== false && !this.props.isChangingWallet) {
      this.lazyUpdateValidateSourceAmount(this.props.transfer.amount, value)
    }
  }

  inputGasPriceHandler = (value) => {
    this.specifyGasPrice(value)
  }

  selectedGasHandler = (value, level) => {
    this.props.dispatch(transferActions.seSelectedGas(level))
    this.specifyGasPrice(value)
  }

  getAdvanceLayout = () => {
    return (
      <AdvanceConfigLayout
        selectedGas={this.props.transfer.selectedGas}
        selectedGasHandler={this.selectedGasHandler}
        gasPriceSuggest={this.props.transfer.gasPriceSuggest}
        translate={this.props.translate}
        isBalanceActive = {this.props.transfer.isBalanceActive}
        toggleBalanceContent={this.toggleBalanceContent}
      />
    )
  }

  getBalanceLayout = () => {
    return (
      <AccountBalance
        chooseToken={this.chooseToken}
        sourceActive={this.props.transfer.tokenSymbol}
        destTokenSymbol='ETH'
        onToggleBalanceContent={this.toggleBalanceContent}
        isBalanceActive = {this.props.transfer.isBalanceActive}
        tradeType = "transfer"
      />)
  }

  closeChangeWallet = () => {
    this.props.dispatch(globalActions.closeChangeWallet())
  }

  clearSession = (e) => {
    this.props.dispatch(globalActions.clearSession())
    // this.props.dispatch(globalActions.setGasPrice(this.props.ethereum))
  }

  render() {
    var addressBalance = ""
    var token = this.props.tokens[this.props.transfer.tokenSymbol]
    if (token) {
      addressBalance = {
        value: converters.toT(token.balance, token.decimals),
        roundingValue: converters.roundingNumber(converters.toT(token.balance, token.decimals)),
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

    var balanceInfo = {
      tokenName: this.props.transfer.balanceData.tokenName,
      amount: this.props.transfer.balanceData.amount,
      tokenSymbol: this.props.transfer.balanceData.tokenSymbol
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
        isOpen={this.props.transfer.step === 2}
      />
    )

    return (
      <TransferForm
        account={this.props.account.account}
        chooseToken={this.chooseToken}
        sourceActive={this.props.transfer.tokenSymbol}
        step={this.props.transfer.step}
        tokenSymbol={this.props.transfer.tokenSymbol}
        tokenTransferSelect={tokenTransferSelect}
        transactionLoadingScreen={transactionLoadingScreen}
        input={input}
        errors={errors}
        translate={this.props.translate}
        onBlur={this.onBlur}
        onFocus={this.onFocus}
        focus={this.state.focus}
        onFocusAddr={this.onFocusAddr}
        advanceLayout={this.getAdvanceLayout()}
        balanceLayout={this.getBalanceLayout()}
        networkError={this.props.global.network_error}
        isChangingWallet = {this.props.global.isChangingWallet}
        changeWalletType = {this.props.global.changeWalletType}
        closeChangeWallet = {this.closeChangeWallet}
        global={this.props.global}
        addressBalance={addressBalance}
        clearSession={this.clearSession}
        walletName={this.props.account.walletName}
      />
    )
  }
}
