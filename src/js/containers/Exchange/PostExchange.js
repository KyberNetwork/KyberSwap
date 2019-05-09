import React from "react"
import { connect } from "react-redux"
import * as validators from "../../utils/validators"
import * as converters from "../../utils/converter"
import * as exchangeActions from "../../actions/exchangeActions"
import * as utilActions from "../../actions/utilActions"
import * as constants from "../../services/constants"
import { Modal } from "../../components/CommonElement"
import { PassphraseModal, ConfirmTransferModal, ApproveModal } from "../../components/Transaction"
import { PostExchangeBtn } from "../../components/Exchange"
import { getTranslate } from 'react-localize-redux';
import { getAssetUrl, isUserEurope, getParameterByName } from "../../utils/common";
import BLOCKCHAIN_INFO from "../../../../env";

@connect((store, props) => {
  var sourceTokenSymbol = store.exchange.sourceTokenSymbol
  var tokens = store.tokens.tokens
  var sourceBalance = 0
  var sourceDecimal = 18
  var sourceName = "Ether"
  var sourceIcon = "eth.svg"

  var rateSourceToEth = 0
  if (tokens[sourceTokenSymbol]) {
    sourceBalance = tokens[sourceTokenSymbol].balance
    sourceDecimal = tokens[sourceTokenSymbol].decimals
    sourceName = tokens[sourceTokenSymbol].name
    sourceIcon = sourceTokenSymbol + '.svg';
    rateSourceToEth = tokens[sourceTokenSymbol].rate
  }

  var destTokenSymbol = store.exchange.destTokenSymbol
  var destBalance = 0
  var destDecimal = 18
  var destName = "Kybernetwork"
  var destIcon = "knc.svg"
  if (tokens[destTokenSymbol]) {
    destBalance = tokens[destTokenSymbol].balance
    destDecimal = tokens[destTokenSymbol].decimals
    destName = tokens[destTokenSymbol].name
    destIcon = destTokenSymbol + '.svg';
  }

  return {
    form: {
      ...store.exchange, sourceBalance, sourceDecimal, destBalance, destDecimal,
      sourceName, destName, sourceIcon, destIcon, rateSourceToEth
    },
    snapshot: store.exchange.snapshot,
    account: store.account.account,
    ethereum: store.connection.ethereum,
    tokens: store.tokens,
    keyService: props.keyService,
    translate: getTranslate(store.locale),
    analytics: store.global.analytics,
    global: store.global,
    exchange: store.exchange
  }
})

export default class PostExchange extends React.Component {
  constructor() {
    super()
    this.state = { form: {} }
  }
  clickExchange = () => {
    this.props.analytics.callTrack("trackClickSwapButton");

    // Track swapping time
    const currentTimeMillisecond = Math.round(new Date().getTime());
    this.props.dispatch(exchangeActions.setSwappingTime(currentTimeMillisecond));

    if (this.props.account === false) {
      this.props.dispatch(exchangeActions.openImportAccount())
      return
    }
    if (this.props.form.errorNotPossessKgt) {
      return
    }
    if (this.props.form.isSelectToken) {
      return
    }
    if (this.props.form.customRateInput.value === "" && this.props.form.customRateInput.isDirty) {
      this.props.dispatch(exchangeActions.setCustomRateInputError(true));
      return
    }
    if (this.props.form.maxCap == 0) {
      let titleModal = this.props.translate('transaction.notification') || 'Notification'
      let contentModal = this.props.translate('transaction.not_enable_exchange') || 'Your address is not enabled for exchange'
      this.props.dispatch(utilActions.openInfoModal(titleModal, contentModal))
      return
    }
    if (validators.anyErrors(this.props.form.errors)) return;
    if (this.props.form.step == 1) {
      if (!validators.anyErrors(this.props.form.errors)) {
        this.props.dispatch(exchangeActions.goToStep(2))
      }
    } else if (this.props.form.step == 2) {
      if (this.validateExchange()) {
        if (!this.props.form.termAgree) {
          let titleModal = this.props.translate('layout.terms_of_service') || 'Terms of Service'
          let contentModal = this.props.translate('error.term_error') || 'You must agree terms and services!'
          return this.props.dispatch(utilActions.openInfoModal(titleModal, contentModal))
        }

        this.props.dispatch(exchangeActions.setSnapshot(this.props.form))
        this.props.dispatch(exchangeActions.updateRateSnapshot(this.props.ethereum))

        switch (this.props.account.type) {
          case "keystore":
            this.props.dispatch(exchangeActions.fetchGasSnapshot())
            this.props.dispatch(exchangeActions.openPassphrase())
            break
          case "privateKey":
          case "promo":
            this.props.dispatch(exchangeActions.fetchGasSnapshot())
            this.props.dispatch(exchangeActions.showConfirm())
            break
          case "trezor":
          case "ledger":
          case "metamask":
            if (this.props.form.sourceTokenSymbol === "ETH") {
              this.props.dispatch(exchangeActions.fetchGasSnapshot())
              this.props.dispatch(exchangeActions.showConfirm())
            } else {
              this.checkTokenBalanceOfColdWallet()
            }
            break
        }
      }
    }
  }

  clickCheckbox = (value) => {
    this.props.dispatch(exchangeActions.setTermAndServices(value))
  }

  validateExchange = () => {
    if (this.props.form.offeredRate === "0") {
      this.props.dispatch(utilActions.openInfoModal(this.props.translate("error.error_occurred"),
        this.props.translate("error.source_amount_rate_error")))
      return false
    }

    //check source amount
    var check = true
    var validateAmount = validators.verifyAmount(this.props.form.sourceAmount,
      this.props.form.sourceBalance,
      this.props.form.sourceTokenSymbol,
      this.props.form.sourceDecimal,
      this.props.form.rateSourceToEth,
      this.props.form.destDecimal,
      this.props.form.maxCap)
    var sourceAmountErrorKey
    switch (validateAmount) {
      case "not a number":
        sourceAmountErrorKey = "error.source_amount_is_not_number"
        break
      case "too high":
        sourceAmountErrorKey = "error.source_amount_too_high"
        break
      case "too high cap":
        sourceAmountErrorKey = "error.source_amount_too_high_cap"
        break
      case "too small":
        sourceAmountErrorKey = "error.source_amount_too_small"
        break
      case "too high for reserve":
        sourceAmountErrorKey = "error.source_amount_too_high_for_reserve"
        break
    }

    if (this.props.form.sourceAmount) {
      var validateWithFee = validators.verifyBalanceForTransaction(this.props.tokens.tokens['ETH'].balance, this.props.form.sourceTokenSymbol,
        this.props.form.sourceAmount, this.props.form.gas + this.props.form.gas_approve, this.props.form.gasPrice)

      if (validateWithFee) {
        this.props.dispatch(exchangeActions.thowErrorEthBalance("error.eth_balance_not_enough_for_fee"))
        check = false
      }
    }

    if (sourceAmountErrorKey) {
      this.props.dispatch(exchangeActions.thowErrorSourceAmount(sourceAmountErrorKey))
      check = false
    }
    var testGasPrice = parseFloat(this.props.form.gasPrice)
    if (isNaN(testGasPrice)) {
      this.props.dispatch(exchangeActions.thowErrorGasPrice("error.gas_price_not_number"))
      check = false
    } else {
      if (parseFloat(this.props.form.gasPrice) > this.props.form.maxGasPrice) {
        this.props.dispatch(exchangeActions.thowErrorGasPrice("error.gas_price_limit"))
        check = false
      }
    }

    var testRate = parseFloat(this.props.form.minConversionRate)
    if (isNaN(testRate)) {
      this.props.dispatch(exchangeActions.thowErrorRate(this.props.translate("error.rate_not_number") || "Rate is not number"))
      check = false
    }
    return check
  }

  createRecap = () => {
    if (!this.props.snapshot || !Object.keys(this.props.snapshot).length) return
  
    const isPromoPayment = this.props.account.type === "promo" && this.props.account.info && this.props.account.info.promoType === "payment";

    let expiredYear;
    if (this.props.account.info) {
      try {
        expiredYear = new Date(this.props.account.info.expiredDate).getFullYear();
      } catch (error) {
        expiredYear = new Date().getFullYear() + 1;
      }
    } else {
      expiredYear = new Date().getFullYear() + 1;
    }

    var sourceAmount = this.props.snapshot.sourceAmount.toString();
    var destAmount = this.props.snapshot.destAmount.toString()
    var sourceTokenSymbol = this.props.snapshot.sourceTokenSymbol
    var destTokenSymbol = this.props.snapshot.destTokenSymbol
    var sourceIcon = this.props.form.sourceIcon
    var destIcon = this.props.form.destIcon

    var minRate = this.props.snapshot.minConversionRate
    var offeredRate = this.props.snapshot.offeredRate

    const { isOnMobile } = this.props.global;

    if (converters.compareRate(minRate, offeredRate) === 1) {
      return (
        <div className="confirm-exchange-modal">
          {!isPromoPayment && 
            <React.Fragment>
              {!isOnMobile ? (
                // On desktop
                <React.Fragment>
                  <div className="title-container">
                    <div className="title-description">
                      <div>{this.props.translate("address.your_wallet") || "Your Wallet"}</div>
                      <div className="title-description-wallet-address">
                        <span>{this.props.account.address.slice(0, 7)}</span>
                        <span>...</span>
                        <span>{this.props.account.address.slice(-6)}</span>
                      </div>
                    </div>
                    <div className="title-description">
                      <div>{this.props.translate("transaction.kyber_network_proxy") || "Kyber Network Proxy"}</div>
                      <div className="title-description-wallet-address">
                        <span>{BLOCKCHAIN_INFO.network.slice(0, 7)}</span>
                        <span>...</span>
                        <span>{BLOCKCHAIN_INFO.network.slice(-6)}</span>
                      </div>
                    </div>
                  </div>
                  {this.props.account.type === "promo" && <div className="title-description-expired-notification">
                    <img src={require("../../../assets/img/v3/info_blue.svg")} />{' '}
                    <span>{`${this.props.translate("transaction.promo_expired_notification") || "After swapping please transfer your token to your personal wallet before"} ${expiredYear}` }</span>
                  </div>}
                </React.Fragment>
              ) : (
                // On mobile
                  <div className="title-description">
                    <div>{this.props.translate("address.your_wallet") || "Your Wallet"}</div>
                    <div className="title-description-wallet-address">
                      {this.props.account.address}
                    </div>
                    {this.props.account.type === "promo" && <div className="title-description-expired-notification">
                      <img src={require("../../../assets/img/v3/info_blue.svg")} />{' '}
                      <span>{`${this.props.translate("transaction.promo_expired_notification") || "After swapping please transfer your token to your personal wallet before"} ${expiredYear}` }</span>
                    </div>}
                  </div>
                )
              }
              <div className="amount">
                <div className="amount-item amount-left">                         
                  <div className={"rc-label"}>{this.props.translate("transaction.exchange_from") || "From"}</div>
                  <div className={"rc-info"}>
                    <div>
                      {sourceAmount}
                    </div>
                    <div>
                      {sourceTokenSymbol}
                    </div>  
                  </div>
                </div>
                <div className="space space--padding"><img src={require("../../../assets/img/exchange/arrow-right-orange.svg")} /></div>
                <div className="amount-item amount-right">
                  <div className={"rc-label"}>{this.props.translate("transaction.exchange_to") || "To"}</div>
                  <div className={"rc-info"}>
                    <div>
                      {this.props.snapshot.isFetchingRate ?
                        <img src={require('../../../assets/img/waiting-white.svg')} />
                        : destAmount}
                    </div>
                    <div className="item-icon">
                      <img src={getAssetUrl(`tokens/${destIcon}`)} />
                    </div>
                  </div>
                </div>
              </div>
            </React.Fragment>
          }
          {/* For Promo payment */}
          {isPromoPayment && 
            <React.Fragment>
              <div className="title-description-promo-payment">{this.props.translate("transaction.swap_for_gift") || "You are swapping to receive a gift"}</div>
              <div className="amount amount-promo-payment amount-promo-payment-with-icon">
                <div className="amount-item amount-left amount-item-promo-balance">
                  <div className={"rc-label"}>{this.props.translate("transaction.exchange_from") || "From"}</div>
                  <div className={"rc-info rc-info-promo-balance"}>
                    <div>
                      {sourceAmount}
                    </div>
                    <div>
                      {sourceTokenSymbol}
                    </div>  
                  </div>
                </div>
                <div className="space-container">
                  <div className="text-above">{this.props.translate("transaction.swap") || "Swap"}</div>
                  <div className="space space-arrow-icon" ><img src={require("../../../assets/img/exchange/arrow-right-orange-long.svg")} /></div>
                  <div className="text-below">{this.props.translate("transaction.send_to_organizer") || "Send to the Organizer"}</div>
                </div>
                <div className="amount-item amount-right amount-item-icon">
                  <div className={"rc-label rc-label-icon"}>{this.props.translate("transaction.exchange_to") || "To"}</div>
                  <div className={"rc-info"}>
                    <div>
                      {this.props.snapshot.isFetchingRate ?
                        <img src={require('../../../assets/img/waiting-white.svg')} />
                        : destAmount}
                    </div>
                    <div className="item-icon">
                      <img src={getAssetUrl(`tokens/${destIcon}`)} />
                    </div>
                  </div>
                </div>
                <div className="space-container space-container-grid-align">
                  <div className="space space-arrow-icon" ><img src={require("../../../assets/img/exchange/arrow-right-orange-long.svg")} /></div>
                </div>
                <div className="amount-item amount-right">
                  <div>
                    <div className={"rc-label"}>{this.props.translate("transaction.exchange_receive") || "Receive" }</div>
                    <div className={"rc-info rc-info-promo-balance"}>
                      1 {this.props.translate("transaction.gift") || "Gift"}
                    </div> 
                  </div>
                </div>
              </div>
            </React.Fragment>
          }
          {!this.props.snapshot.isFetchingRate &&
            <div className="description error">
              <span className="error-text">
                {this.props.translate("error.min_rate_greater_expected_rate") || "Your configured minimal exchange rate is higher than what is recommended by KyberNetwork. Your exchange has high chance to fail"}
              </span>
            </div>
          }
        </div>
      )
    } else {
      var slippagePercent = converters.calculatePercentRate(minRate, offeredRate)
      return (
        <div className="confirm-exchange-modal">
          {!isPromoPayment && 
            <React.Fragment>
              {!isOnMobile ? (
                // On desktop
                <React.Fragment>
                  <div className="title-container">
                    <div className="title-description">
                      <div>{this.props.translate("address.your_wallet") || "Your Wallet"}</div>
                      <div className="title-description-wallet-address">
                        <span>{this.props.account.address.slice(0, 7)}</span>
                        <span>...</span>
                        <span>{this.props.account.address.slice(-6)}</span>
                      </div>
                    </div>
                    <div className="title-description">
                      <div>{this.props.translate("transaction.kyber_network_proxy") || "Kyber Network Proxy"}</div>
                      <div className="title-description-wallet-address">
                        <span>{BLOCKCHAIN_INFO.network.slice(0, 7)}</span>
                        <span>...</span>
                        <span>{BLOCKCHAIN_INFO.network.slice(-6)}</span>
                      </div>
                    </div>
                  </div>
                  {this.props.account.type === "promo" && <div className="title-description-expired-notification">
                    <img src={require("../../../assets/img/v3/info_blue.svg")} />{' '}
                    <span>{`${this.props.translate("transaction.promo_expired_notification") || "After swapping please transfer your token to your personal wallet before"} ${expiredYear}` }</span>
                  </div>}
                </React.Fragment>
              ) : (
                // On mobile
                <div className="title-description">
                  <div>{this.props.translate("address.your_wallet") || "Your Wallet"}</div>
                  <div className="title-description-wallet-address">
                    {this.props.account.address}
                  </div>
                  {this.props.account.type === "promo" && <div className="title-description-expired-notification">
                    <img src={require("../../../assets/img/v3/info_blue.svg")} />{' '}
                    <span>{`${this.props.translate("transaction.promo_expired_notification") || "After swapping please transfer your token to your personal wallet before"} ${expiredYear}` }</span>
                  </div>}
                </div>
              )
            }
              <div className="amount">
                <div className="amount-item amount-left">                         
                  <div className={"rc-label"}>{this.props.translate("transaction.exchange_from") || "From"}</div>
                  <div className={"rc-info"}>
                    <div>
                      {sourceAmount}
                    </div>
                    <div>
                      {sourceTokenSymbol}
                    </div>  
                  </div>
                </div>
                <div className="space space--padding"><img src={require("../../../assets/img/exchange/arrow-right-orange.svg")} /></div>
                <div className="amount-item amount-right">
                  <div className={"rc-label"}>{this.props.translate("transaction.exchange_to") || "To"}</div>
                  <div className={"rc-info"}>
                    <div>
                      {this.props.snapshot.isFetchingRate ? <img src={require('../../../assets/img/waiting-white.svg')} /> : destAmount}
                    </div>
                    <div>
                      {destTokenSymbol}
                    </div>
                  </div> 
                </div>
              </div>

              {/* Warning message */}
              {this.props.exchange.percentChange >= 10 && 
                <div className="description error">
                  <span className="error-text">
                    {this.props.translate("error.percent_change_error", { percentChange: this.props.exchange.percentChange}) || `There is a ${this.props.exchange.percentChange}% difference in price for the requested quantity and the default 0.5 ETH quantity.`}
                  </span>
                </div>
              }

            </React.Fragment>
          }
          {/* For Promo payment */}
          {isPromoPayment && 
            <React.Fragment>
              <div className="title-description-promo-payment">{this.props.translate("transaction.swap_for_gift") || "You are swapping to receive a gift"}</div>
              <div className="amount amount-promo-payment">
                <div className="amount-item amount-left amount-item-promo-balance">              
                  <div className={"rc-label"}>{this.props.translate("transaction.exchange_from") || "From"}</div>
                  <div className={"rc-info rc-info-promo-balance"}>
                    <div>
                      {sourceAmount}
                    </div>
                    <div>
                      {sourceTokenSymbol}
                    </div>
                  </div>
                </div>
                <div className="space-container">
                  <div className="text-above">{this.props.translate("transaction.swap") || "Swap"}</div>
                  <div className="space space-arrow-icon"><img src={require("../../../assets/img/exchange/arrow-right-orange-long.svg")} /></div>
                  <div className="text-below">{this.props.translate("transaction.send_to_organizer") || "Send to the Organizer"}</div>
                </div>
                <div className="amount-item amount-right amount-item-promo-balance">
                  <div className={"rc-label"}>{this.props.translate("transaction.exchange_to") || "To"}</div>
                  <div className={"rc-info rc-info-promo-balance"}>
                    <div>
                      {this.props.snapshot.isFetchingRate ? <img src={require('../../../assets/img/waiting-white.svg')} /> : destAmount}
                    </div>
                    <div>
                      {destTokenSymbol}
                    </div>
                  </div> 
                </div>
                <div className="space-container space-container-grid-align">
                  <div className="space space-arrow-icon"><img src={require("../../../assets/img/exchange/arrow-right-orange-long.svg")} /></div>
                </div>
                <div className="amount-item amount-right">
                  <div>
                    <div className={"rc-label"}>{this.props.translate("transaction.exchange_receive") || "Receive" }</div>
                    <div className={"rc-info"}>
                      1 {this.props.translate("transaction.gift") || "Gift"}
                    </div> 
                  </div>
                </div>
              </div>
            </React.Fragment>
          }
        </div>
      )
    }

  }
  getDesAmount = () => {
    return this.props.form.sourceAmount * converters.toT(this.props.form.offeredRate)
  }

  recap = () => {
    var sourceAmount = this.props.snapshot.sourceAmount;
    var sourceTokenSymbol = this.props.snapshot.sourceTokenSymbol;
    var destAmount = this.props.snapshot.destAmount
    var destTokenSymbol = this.props.snapshot.destTokenSymbol;
    return {
      sourceAmount, sourceTokenSymbol, destAmount, destTokenSymbol
    }
  }

  closeModal = (event) => {
    this.props.dispatch(exchangeActions.hidePassphrase())
    this.props.dispatch(exchangeActions.resetSignError())
    this.props.analytics.callTrack("trackClickCloseModal", "Passphrase Modal");
  }
  closeModalConfirm = (event) => {
    this.props.analytics.callTrack("trackClickCloseModal", "ConfirmTransferModal");
    if (this.props.form.isConfirming) return
    this.props.dispatch(exchangeActions.hideConfirm())
    this.props.dispatch(exchangeActions.resetSignError())
  }
  closeModalApprove = (event) => {
    this.props.analytics.callTrack("trackClickCloseModal", "Approve Modal");
    if (this.props.form.isApproving) return
    this.props.dispatch(exchangeActions.hideApprove())
    this.props.dispatch(exchangeActions.resetSignError())
  }

  closeModalApproveZero = (event) => {
    this.props.analytics.callTrack("trackClickCloseModal", "Approve Zero Modal")
    if (this.props.form.isApprovingZero) return
    this.props.dispatch(exchangeActions.hideApproveZero())
    this.props.dispatch(exchangeActions.resetSignError())
  }

  changePassword = (event) => {
    this.props.dispatch(exchangeActions.changePassword())
  }

  getReferAddr = (blockNo) => {
    var refAddr = getParameterByName("ref")
    if (!validators.verifyAccount(refAddr)) {
      return refAddr
    }
    return constants.COMMISSION_ADDR
  }

  formParams = () => {
    var selectedAccount = this.props.account.address
    var sourceToken = this.props.form.sourceToken
    var sourceAmount = converters.stringToHex(this.props.form.sourceAmount, this.props.form.sourceDecimal)
    var destToken = this.props.form.destToken

    var minConversionRate = converters.toTWei(this.props.form.minConversionRate)
    minConversionRate = converters.numberToHex(minConversionRate)

    var destAddress = this.props.account.type === "promo" && this.props.account.info && this.props.account.info.promoType === "payment"
       ? this.props.account.info.receiveAddr : this.props.account.address;

    var maxDestAmount = converters.biggestNumber()
    var throwOnFailure = this.props.form.throwOnFailure
    var nonce = validators.verifyNonce(this.props.account.getUsableNonce())
    // should use estimated gas
    var gas = converters.numberToHex(this.props.form.gas)
    var gas_approve = converters.numberToHex(this.props.form.gas_approve)
    // should have better strategy to determine gas price
    var gasPrice = Math.round(this.props.form.gasPrice * 10) / 10
    gasPrice = converters.numberToHex(converters.gweiToWei(gasPrice))

    var sourceTokenSymbol = this.props.form.sourceTokenSymbol
    var balanceData = {
      sourceName: this.props.form.sourceName,
      sourceSymbol: this.props.form.sourceTokenSymbol,
      sourceDecimal: this.props.form.sourceDecimal,
      //source: this.props.form.sourceBalance.toString(),
      destName: this.props.form.destName,
      destDecimal: this.props.form.destDecimal,
      destSymbol: this.props.form.destTokenSymbol,
      //dest: this.props.form.destBalance.toString()
      sourceAmount: this.props.form.balanceData.sourceAmount,
      destAmount: this.props.form.balanceData.destAmount,
    }
    return {
      selectedAccount, sourceToken, sourceAmount, destToken,
      minConversionRate, destAddress, maxDestAmount,
      throwOnFailure, nonce, gas, gas_approve, gasPrice, balanceData, sourceTokenSymbol
    }
  }

  formParamOfSnapshot = () => {
    var selectedAccount = this.props.account.address
    var sourceToken = this.props.snapshot.sourceToken
    var sourceAmount = converters.stringToHex(this.props.snapshot.sourceAmount, this.props.snapshot.sourceDecimal)
    var destToken = this.props.snapshot.destToken

    var minConversionRate = converters.toTWei(this.props.snapshot.minConversionRate)
    minConversionRate = converters.numberToHex(minConversionRate)

    //var blockNo = converters.numberToHexAddress(this.props.snapshot.blockNo)
    // check wallet type
    var walletType = this.props.account.type
    // console.log("wallet_type")
    //console.log(walletType)
    //alert(walletType)
    var blockNo = this.props.snapshot.blockNo
    if (walletType === "metamask") {
      blockNo = this.props.account.keystring.getWalletId(blockNo)
    } else {
      blockNo = this.getReferAddr(blockNo)
    }
    //var blockNo =  getWalletId (walletType, this.props.snapshot.blockNo)
    //alert(blockNo)

    var destAddress = this.props.account.type === "promo" && this.props.account.info && this.props.account.info.promoType === "payment"
       ? this.props.account.info.receiveAddr : this.props.account.address;

    var maxDestAmount = converters.biggestNumber()
    var throwOnFailure = this.props.snapshot.throwOnFailure
    var nonce = validators.verifyNonce(this.props.account.getUsableNonce())
    // should use estimated gas
    var gas = converters.numberToHex(this.props.snapshot.gas)
    var gas_approve = converters.numberToHex(this.props.snapshot.gas_approve)
    // should have better strategy to determine gas price
    var gasPrice = Math.round(this.props.snapshot.gasPrice * 10) / 10
    gasPrice = converters.numberToHex(converters.gweiToWei(gasPrice))

    var sourceTokenSymbol = this.props.snapshot.sourceTokenSymbol
    var balanceData = {
      sourceName: this.props.snapshot.sourceName,
      sourceSymbol: this.props.snapshot.sourceTokenSymbol,
      sourceDecimal: this.props.snapshot.sourceDecimal,
      // source: this.props.snapshot.sourceBalance.toString(),
      destName: this.props.snapshot.destName,
      destDecimal: this.props.snapshot.destDecimal,
      destSymbol: this.props.snapshot.destTokenSymbol,
      //  dest: this.props.snapshot.destBalance.toString(),

      sourceAmount: this.props.form.balanceData.sourceAmount,
      destAmount: this.props.form.balanceData.destAmount,
    }
    return {
      selectedAccount, sourceToken, sourceAmount, destToken,
      minConversionRate, destAddress, maxDestAmount,
      throwOnFailure, nonce, gas, gas_approve, gasPrice, balanceData, sourceTokenSymbol, blockNo
    }
  }
  checkTokenBalanceOfColdWallet = () => {
    const password = ""
    const params = this.formParams()
    const account = this.props.account
    const ethereum = this.props.ethereum

    const formId = "exchange"
    const data = this.recap()
    this.props.dispatch(exchangeActions.checkTokenBalanceOfColdWallet(formId, ethereum, account.address, params.sourceToken,
      params.sourceAmount, params.destToken, params.destAddress,
      params.maxDestAmount, params.minConversionRate,
      params.throwOnFailure, params.nonce, params.gas,
      params.gasPrice, account.keystring, account.type, password, account, data, this.props.keyService))
  }

  processExchangeAfterApprove = () => {
    const params = this.formParamOfSnapshot()
    console.log(params)
    const account = this.props.account
    const ethereum = this.props.ethereum
    this.props.dispatch(exchangeActions.doApprove(ethereum, params.sourceToken, params.sourceAmount, params.nonce, params.gas_approve, params.gasPrice,
      account.keystring, account.password, account.type, account, this.props.keyService, params.sourceTokenSymbol))
    this.props.analytics.callTrack("trackClickApproveToken", params.sourceTokenSymbol);
  }

  processExchangeAfterApproveZero = () => {
    const params = this.formParamOfSnapshot()
    console.log(params)
    const account = this.props.account
    const ethereum = this.props.ethereum
    this.props.dispatch(exchangeActions.doApproveZero(ethereum, params.sourceToken, 0, params.nonce, params.gas_approve, params.gasPrice,
      account.keystring, account.password, account.type, account, this.props.keyService, params.sourceTokenSymbol))
      
    this.props.analytics.callTrack("trackClickApproveTokenZero" ,params.sourceTokenSymbol)
  }

  processTx = () => {
    try {
      var password = ""
      if (this.props.account.type === "keystore") {
        password = document.getElementById("passphrase").value
        document.getElementById("passphrase").value = ''
      }
      const params = this.formParamOfSnapshot()
      //check nonce
      params.nonce = validators.verifyNonce(this.props.account.getUsableNonce())

      var account = this.props.account
      var ethereum = this.props.ethereum

      var formId = "exchange"
      var data = this.recap()
      this.props.dispatch(exchangeActions.processExchange(formId, ethereum, account.address, params.sourceToken,
        params.sourceAmount, params.destToken, params.destAddress,
        params.maxDestAmount, params.minConversionRate,
        params.throwOnFailure, params.nonce, params.gas,
        params.gasPrice, account.keystring, account.type, password, account, data, this.props.keyService, params.balanceData, params.sourceTokenSymbol, params.blockNo))


    } catch (e) {
      console.log(e)
      this.props.dispatch(exchangeActions.throwPassphraseError(this.props.translate("error.passphrase_error")))
    }
    this.props.analytics.callTrack("trackConfirmTransaction", "swap", this.props.form.sourceTokenSymbol);
  }

  content = () => {
    var minRate = this.props.snapshot.minConversionRate
    var offeredRate = this.props.snapshot.offeredRate
    var slippagePercent = converters.calculatePercentRate(minRate, offeredRate)
    return (
      <PassphraseModal
        recap={this.createRecap()}
        onChange={this.changePassword}
        onClick={this.processTx}
        onCancel={this.closeModal}
        passwordError={this.props.form.errors.passwordError || this.props.form.bcError.message}
        translate={this.props.translate}
        isFetchingGas={this.props.form.snapshot.isFetchingGas}
        gasPrice={this.props.form.snapshot.gasPrice}
        gas={this.props.form.snapshot.gas + this.props.form.snapshot.gas_approve}
        isFetchingRate={this.props.snapshot.isFetchingRate}
        title={this.props.translate('modal.confirm_swap') || "Swap Confirm"}
        slippagePercent={slippagePercent}
        analytics={this.props.analytics}
        type="exchange"
      />
    )
  }
  contentConfirm = () => {
    var minRate = this.props.snapshot.minConversionRate
    var offeredRate = this.props.snapshot.offeredRate
    var slippagePercent = converters.calculatePercentRate(minRate, offeredRate)
    return (
      <ConfirmTransferModal
        recap={this.createRecap()}
        onCancel={this.closeModalConfirm}
        onExchange={this.processTx}
        gasPrice={this.props.form.snapshot.gasPrice}
        gas={this.props.account.type === "privateKey" ? this.props.form.snapshot.gas + this.props.form.snapshot.gas_approve : this.props.form.snapshot.gas}
        isConfirming={this.props.form.isConfirming}
        isFetchingGas={this.props.form.snapshot.isFetchingGas}
        isFetchingRate={this.props.form.snapshot.isFetchingRate}
        type="exchange"
        translate={this.props.translate}
        title={this.props.translate('modal.confirm_swap') || "Swap Confirm"}
        errors={this.props.form.signError}
        walletType={this.props.account.type}
        slippagePercent={slippagePercent}
      />
    )
  }
  contentApprove = () => {
    var addressShort = this.props.account.address.slice(0, 8) + "..." + this.props.account.address.slice(-6)
    return (
      <ApproveModal 
        title={ this.props.translate("modal.approve_token") || "Approve token"}
        message={`You need to grant permission for Kyber Swap to interact with ${this.props.form.sourceTokenSymbol} with this address`}
        recap="Please approve"
        onCancel={this.closeModalApprove}
        isApproving={this.props.form.isApproving}
        token={this.props.form.sourceTokenSymbol}
        onSubmit={this.processExchangeAfterApprove.bind(this)}
        translate={this.props.translate}
        address={this.props.account.address}
        gasPrice={this.props.form.snapshot.gasPrice}
        gas={this.props.form.snapshot.gas_approve}
        isFetchingGas={this.props.form.snapshot.isFetchingGas}
        errors={this.props.form.signError}
        walletType={this.props.account.type}
      />
    )
  }


  contentApproveZero = () => {
    var addressShort = this.props.account.address.slice(0, 8) + "..." + this.props.account.address.slice(-6)
    return (
      <ApproveModal 
        title={ "Approve token"}
        message={`You need reset allowance ${this.props.form.sourceTokenSymbol} of Kyber Swap with this address`}
        recap="Please approve"
        onCancel={this.closeModalApproveZero}
        isApproving={this.props.form.isApprovingZero}
        token={this.props.form.sourceTokenSymbol}
        onSubmit={this.processExchangeAfterApproveZero.bind(this)}
        translate={this.props.translate}
        address={this.props.account.address}
        gasPrice={this.props.form.snapshot.gasPrice}
        gas={this.props.form.snapshot.gas_approve}
        isFetchingGas={this.props.form.snapshot.isFetchingGas}
        errors={this.props.form.signError}
        walletType={this.props.account.type}
      />
    )
  }

  openConfig = () => {
    this.props.dispatch(exchangeActions.toggleAdvance());
  }

  render() {

    var modalExchange = ""
    if (this.props.account !== false) {
      var modalPassphrase = ""
      var modalConfirm = ""
      var modalApprove = ""
      var modalApproveZero = ""
      if (this.props.account.type === "keystore") {
        modalPassphrase = (<Modal
          className={{
            base: 'reveal medium confirm-modal',
            afterOpen: 'reveal medium confirm-modal'
          }}
          isOpen={this.props.form.passphrase}
          onRequestClose={this.closeModal}
          contentLabel="password modal"
          content={this.content()}
          size="medium"
        />)
      } else {
        modalConfirm = (<Modal
          className={{
            base: 'reveal medium confirm-modal',
            afterOpen: 'reveal medium confirm-modal'
          }}
          isOpen={this.props.form.confirmColdWallet}
          onRequestClose={this.closeModalConfirm}
          contentLabel="confirm modal"
          content={this.contentConfirm()}
          size="medium"
        />)
        modalApprove = (
          <Modal className={{
            base: 'reveal medium confirm-modal',
            afterOpen: 'reveal medium confirm-modal'
          }}
            isOpen={this.props.form.confirmApprove}
            onRequestClose={this.closeModalApprove}
            contentLabel="approve modal"
            content={this.contentApprove()}
            size="medium"
          />
        )
        modalApproveZero = (
          <Modal className={{
            base: 'reveal medium confirm-modal',
            afterOpen: 'reveal medium confirm-modal'
          }}
            isOpen={this.props.form.confirmApproveZero}
            onRequestClose={this.closeModalApproveZero}
            contentLabel="approve modal"
            content={this.contentApproveZero()}
            size="medium"
          />
        )
      }
      modalExchange = <div>{modalPassphrase} {modalConfirm} {modalApprove} {modalApproveZero}</div>
    }

    let activeButtonClass = ""
    if (!this.props.form.errorNotPossessKgt && !validators.anyErrors(this.props.form.errors) && this.props.form.termAgree && !this.props.form.isSelectToken) {
      activeButtonClass += " active"
    }

    return (
      <PostExchangeBtn
        isHaveAccount={this.props.account === false ? false : true}
        submit={this.clickExchange}
        modalExchange={modalExchange}
        activeButtonClass={activeButtonClass}
        isConfirming={this.props.form.isConfirming}
        isApproving={this.props.form.isApproving}
        translate={this.props.translate}
        isChangingWallet={this.props.isChangingWallet}
      />
    )
  }
}
