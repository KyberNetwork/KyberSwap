import React from "react"
import { connect } from "react-redux"

import ReactTooltip from 'react-tooltip'

import { withRouter } from 'react-router-dom'
import * as converters from "../../utils/converter"
import * as validators from "../../utils/validators"
import { TransferForm } from "../../components/Transaction"
import { QRCode } from "../CommonElements"
import { AdvanceConfigLayout } from "../../components/TransactionCommon"
import { TokenSelector, AccountBalance, TopBalance } from "../TransactionCommon"
import { hideSelectToken } from "../../actions/utilActions"
import * as common from "../../utils/common"
import * as globalActions from "../../actions/globalActions"
import constansts from "../../services/constants"
import * as transferActions from "../../actions/transferActions"
import { getTranslate } from 'react-localize-redux'
import { debounce } from 'underscore'
import BLOCKCHAIN_INFO from "../../../../env";

import constants from "../../services/constants"

@connect((store, props) => {

  return {
    transfer: store.transfer,
    account: store.account,
    tokens: store.tokens.tokens,
    global: store.global,
    translate: getTranslate(store.locale)
  }
})

class Transfer extends React.Component {
  constructor() {
    super()
    this.state = {
      focus: "transfer"
    }
  }

  componentDidMount = () => {
    if (this.props.global.changeWalletType !== "") this.props.dispatch(globalActions.closeChangeWallet())
    document.title = "Kyber Network | Instant Exchange | No Fees";


    if (Object.keys(this.props.transfer.errors.sourceAmount).length > 0){
      setTimeout(() => {
        ReactTooltip.show(document.getElementById("transfer-amount-error-trigger"))
      }, 300)
    }

    if (Object.keys(this.props.transfer.errors.destAddress).length > 0){
      setTimeout(() => {
        ReactTooltip.show(document.getElementById("transfer-address-error-trigger"))
      }, 300)
    }

  }

  componentDidUpdate(prevProps) {    
    if (Object.keys(this.props.transfer.errors.sourceAmount).length > Object.keys(prevProps.transfer.errors.sourceAmount).length){      
      setTimeout(() => {
        ReactTooltip.show(document.getElementById("transfer-amount-error-trigger"))
      }, 300)
    }

    if (Object.keys(this.props.transfer.errors.destAddress).length > Object.keys(prevProps.transfer.errors.destAddress).length){      
      setTimeout(() => {
        ReactTooltip.show(document.getElementById("transfer-address-error-trigger"))
      }, 300)
    }
  }



  validateSourceAmount = (value, gasPrice) => {
    var checkNumber
    if (isNaN(parseFloat(value))) {
      // this.props.dispatch(transferActions.thowErrorAmount("error.amount_must_be_number"))
    } else {

      var tokenSymbol = this.props.transfer.tokenSymbol
      var token = this.props.tokens[tokenSymbol]

      var amountBig = converters.stringEtherToBigNumber(this.props.transfer.amount, token.decimals)
      if (amountBig.isGreaterThan(token.balance)) {
        this.props.dispatch(transferActions.throwErrorAmount(constants.TRANSFER_CONFIG.sourceErrors.input, this.props.translate("error.amount_transfer_too_hign")))
        return
      }

      var testBalanceWithFee = validators.verifyBalanceForTransaction(this.props.tokens['ETH'].balance,
        this.props.transfer.tokenSymbol, this.props.transfer.amount, this.props.transfer.gas, gasPrice)
      if (testBalanceWithFee) {
        this.props.dispatch(transferActions.throwErrorAmount(constants.TRANSFER_CONFIG.sourceErrors.balance, this.props.translate("error.eth_balance_not_enough_for_fee")))
      }
    }
  }

  dispatchEstimateGas = (value) => {
    this.props.dispatch(transferActions.estimateGasWhenAmountChange(value))
  }

  lazyUpdateValidateSourceAmount = debounce(this.validateSourceAmount, 500)
  lazyEstimateGas = debounce(this.dispatchEstimateGas, 500)

  onAddressReceiveChange = (event) => {
    var value = event.target.value
    this.props.dispatch(transferActions.specifyAddressReceive(value));
  }

  onAmountChange = (event) => {
    var value = event.target.value
    this.props.dispatch(transferActions.specifyAmountTransfer(value))
    if (this.props.account.account) {
      this.lazyEstimateGas(value)
      this.lazyUpdateValidateSourceAmount(value, this.props.transfer.gasPrice)
    }
  }

  chooseToken = (symbol, address, type) => {
    this.props.dispatch(transferActions.selectToken(symbol, address))
    this.props.dispatch(hideSelectToken())

    var path = constansts.BASE_HOST + "/transfer/" + symbol.toLowerCase()

    path = common.getPath(path, constansts.LIST_PARAMS_SUPPORTED)

    this.props.dispatch(globalActions.goToRoute(path))
    this.props.global.analytics.callTrack("trackChooseToken", type, symbol);
  }

  makeNewTransfer = (changeTransactionType = false) => {
    this.props.dispatch(transferActions.makeNewTransfer());

    if (changeTransactionType) {
      var swapLink = constansts.BASE_HOST + "/swap/" + this.props.swapSrcTokenSymbol.toLowerCase() + "_" + this.props.swapDestTokenSymbol.toLowerCase();
      this.props.global.analytics.callTrack("trackClickNewTransaction", "Swap");
      this.props.history.push(swapLink)
    } else {
      this.props.global.analytics.callTrack("trackClickNewTransaction", "Transfer");
    }
  }

  onFocus = () => {
    this.setState({ focus: "source" });
    this.props.dispatch(transferActions.setIsSelectTokenBalance(false));
    this.props.global.analytics.callTrack("trackClickInputAmount", "transfer");
  }

  onFocusAddr = () => {
    this.setState({ focus: "to-addr" })
    this.props.global.analytics.callTrack("trackClickInputRecieveAddress");
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
    this.props.global.analytics.callTrack("trackClickAllIn", "Transfer", tokenSymbol);
  }

  handleErrorQRCode = (err) => {
  }

  handleScanQRCode = (data) => {
    this.props.dispatch(transferActions.specifyAddressReceive(data));
  }



  toggleAdvanceContent = () => {
    if (this.props.transfer.isAdvanceActive) {
      this.props.global.analytics.callTrack("trackClickHideAdvanceOption", "Transfer")
    } else {
      this.props.global.analytics.callTrack("trackClickShowAdvanceOption", "Transfer")
    }
    this.props.dispatch(transferActions.toggleAdvanceContent());

    if (!this.props.transfer.isOpenAdvance) {
      this.props.dispatch(transferActions.setIsOpenAdvance());
    }
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

  selectedGasHandler = (value, level, levelString) => {
    this.props.dispatch(transferActions.setSelectedGasPrice(value, level))
    this.specifyGasPrice(value)
    this.props.global.analytics.callTrack("trackChooseGas", "transfer", value, levelString);
  }

  getAdvanceLayout = () => {
    return (
      <AdvanceConfigLayout
        selectedGas={this.props.transfer.selectedGas}
        selectedGasHandler={this.selectedGasHandler}
        gasPriceSuggest={this.props.transfer.gasPriceSuggest}
        translate={this.props.translate}
        isAdvanceActive={this.props.transfer.isAdvanceActive}
        toggleAdvanceContent={this.toggleAdvanceContent}
        type="transfer"
      />
    )
  }

  getBalanceLayout = () => {
    return (
      <AccountBalance
        // chooseToken={this.chooseToken}
        sourceActive={this.props.transfer.tokenSymbol}
        destTokenSymbol='ETH'
        isBalanceActive={this.props.transfer.isAdvanceActive}
        screen="transfer"
        isOnDAPP={this.props.account.isOnDAPP}
        walletName={this.props.account.walletName}
        
        // changeAmount={transferActions.specifyAmountTransfer}
        // selectTokenBalance={this.selectTokenBalance}
        selectToken={this.selectToken}
      />)
  }

  closeChangeWallet = () => {
    this.props.dispatch(globalActions.closeChangeWallet())
  }

  clearSession = (e) => {
    this.props.dispatch(globalActions.clearSession(this.props.transfer.gasPrice));
    this.props.global.analytics.callTrack("trackClickChangeWallet")
  }


  acceptTerm = (e) => {
    this.props.dispatch(globalActions.acceptTermOfService());
    this.props.dispatch(globalActions.acceptConnectWallet());
  }

  clearIsOpenAdvance = () => {
    this.props.dispatch(transferActions.clearIsOpenAdvance());
  }

  selectTokenBalance = () => {
    this.props.dispatch(transferActions.setIsSelectTokenBalance(true));
  }

  reorderToken = () => {
    var tokens = this.props.tokens
    const orderedTokens = converters.sortEthBalance(tokens);
    return orderedTokens.slice(0, 3)
  }

  selectToken = (sourceSymbol) => {
            this.chooseToken(sourceSymbol, this.props.tokens[sourceSymbol].address, "source")

        var sourceBalance = this.props.tokens[sourceSymbol].balance


        var sourceDecimal = this.props.tokens[sourceSymbol].decimals
        var amount

        if (sourceSymbol !== "ETH") {
            amount = sourceBalance
            amount = converters.toT(amount, sourceDecimal)
            amount = amount.replace(",", "")
        } else {            
            var gasLimit = this.props.transfer.gas
            var totalGas = converters.calculateGasFee(this.props.transfer.gasPrice, gasLimit) * Math.pow(10, 18)

            amount = sourceBalance - totalGas * 120 / 100
            amount = converters.toEther(amount)
            amount = converters.roundingNumber(amount).toString(10)
            amount = amount.replace(",", "")
        }

        if (amount < 0) amount = 0;

        this.props.dispatch(transferActions.specifyAmountTransfer(amount))

        this.selectTokenBalance();
        this.props.global.analytics.callTrack("trackClickToken", sourceSymbol, this.props.screen);
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
        banToken={BLOCKCHAIN_INFO.promo_token}
      />
    )

    var qcCode = common.isMobile.any() ? <QRCode
      onError={this.handleErrorQRCode}
      onScan={this.handleScanQRCode}
      onDAPP={this.props.account.isOnDAPP} /> : ""

    var topBalance = <TopBalance showMore={this.toggleAdvanceContent}
      // chooseToken={this.chooseToken}
      activeSymbol={this.props.transfer.tokenSymbol}
      // selectTokenBalance={this.selectTokenBalance}
      screen="transfer"
      // changeAmount={transferActions.specifyAmountTransfer} 

      selectToken = {this.selectToken}
      orderedTokens = {this.reorderToken(true, 3)}
      />

    return (
      <TransferForm
        transfer = {this.props.transfer}
        account={this.props.account.account}
        chooseToken={this.chooseToken}
        sourceActive={this.props.transfer.tokenSymbol}
        step={this.props.transfer.step}
        tokenSymbol={this.props.transfer.tokenSymbol}
        tokenTransferSelect={tokenTransferSelect}
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
        isChangingWallet={this.props.global.isChangingWallet}
        changeWalletType={this.props.global.changeWalletType}
        closeChangeWallet={this.closeChangeWallet}
        global={this.props.global}
        addressBalance={addressBalance}
        clearSession={this.clearSession}
        walletName={this.props.account.walletName}
        qcCode={qcCode}
        isAgreedTermOfService={this.props.global.termOfServiceAccepted}
        acceptTerm={this.acceptTerm}
        isBalanceActive={this.props.transfer.isBalanceActive}
        isAdvanceActive={this.props.transfer.isAdvanceActive}
        toggleAdvanceContent={this.toggleAdvanceContent}

        isOpenAdvance={this.props.transfer.isOpenAdvance}
        clearIsOpenAdvance={this.clearIsOpenAdvance}

        topBalance={topBalance}
        isAcceptConnectWallet={this.props.global.isAcceptConnectWallet}
        acceptConnectWallet={this.acceptConnectWallet}

        isOnDAPP={this.props.account.isOnDAPP}

        isSelectTokenBalance={this.props.transfer.isSelectTokenBalance}
      />
    )
  }
}

export default withRouter(Transfer)
