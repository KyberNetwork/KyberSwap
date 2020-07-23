import React from "react"
import { FeeDetail, Modal } from "../../../components/CommonElement"
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'
import * as exchangeActions from "../../../actions/exchangeActions"
import constants from "../../../services/constants"
import * as converter from "../../../utils/converter"
import * as validators from "../../../utils/validators"
import { getReferAddress } from "../../../utils/common";
import BLOCKCHAIN_INFO from "../../../../../env"
import Tx from "../../../services/tx"
import * as accountActions from '../../../actions/accountActions'
import * as converters from "../../../utils/converter";
import { RateBetweenToken } from "../../../containers/Exchange/index";
import { getBigNumberValueByPercentage } from "../../../utils/converter";
import { fetchGasLimit } from "../../../services/cachedServerService";

@connect((store) => {
  const account = store.account.account
  const wallet = store.account.wallet;
  const translate = getTranslate(store.locale)
  const tokens = store.tokens.tokens
  const exchange = store.exchange
  const ethereum = store.connection.ethereum
  const global = store.global
  
  return {
    translate, exchange, tokens, account, wallet, ethereum, global
  }
})
export default class ConfirmModal extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      err: "",
      restrictError: '',
      isFetchGas: true,
      isFetchRate: true,
      gasLimit: 0,
      slippageRate: 0,
      expectedRate: 0,
      startTime: 0,
      isConfirmingTx: false
    };
    
    this.confirmingTimer = null;
  }
  
  componentDidMount = () => {
    this.setState({
      isFetchGas: true,
      isFetchRate: true,
      gasLimit: this.props.exchange.gas,
      expectedRate: this.props.exchange.snapshot.expectedRate,
      slippageRate: converter.toTWei(this.props.exchange.snapshot.minConversionRate, 18),
      startTime: Math.round(new Date().getTime())
    })

    this.getLatestRate()
    this.getGasSwap()
  }
  
  componentWillUnmount() {
    clearTimeout(this.confirmingTimer);
  }
  
  async getLatestRate() {
    try {
      const { ethereum, sourceToken, destToken, sourceAmount, platformFee, slippagePercentage } = this.getFormParams();

      let expectedRate = await ethereum.call("getExpectedRateAfterFee", sourceToken, destToken, sourceAmount, platformFee);

      if (!expectedRate) {
        this.setState({
          isFetchRate: false,
          restrictError: this.props.translate("error.node_error") || "There are some problems with nodes. Please try again in a while."
        })
      } else {
        this.setState({
          isFetchRate: false,
          expectedRate: expectedRate
        })

        if (!this.props.exchange.isEditRate) {
          const slippageRate = getBigNumberValueByPercentage(expectedRate, slippagePercentage).toFixed(0);
          this.setState({ slippageRate: slippageRate })
        }
      }
      
    } catch (err) {
      console.log(err)
      this.setState({
        restrictError: err.toString(),
        isFetchRate: false
      })
    }
  }
  
  getFormParams = () => {
    var formId = "swap"
    var ethereum = this.props.ethereum
    var address = this.props.account.address
    var sourceToken = this.props.exchange.sourceToken
    var sourceTokenSymbol = this.props.exchange.sourceTokenSymbol
    var sourceDecimal = this.props.tokens[sourceTokenSymbol].decimals
    var sourceAmount = converter.stringToHex(this.props.exchange.snapshot.sourceAmount, sourceDecimal)
    var destAmount = this.props.exchange.snapshot.destAmount
    var destTokenSymbol = this.props.exchange.destTokenSymbol
    var destToken = this.props.exchange.destToken
    var destAddress = this.props.account.type === "promo" && this.props.account.info && this.props.account.info.promoType === "payment"
      ? this.props.account.info.receiveAddr : this.props.account.address;
    var maxDestAmount = converter.biggestNumber()
    var slippageRate = this.state.slippageRate      

    var nonce = this.props.account.getUsableNonce()
    var gas = converter.numberToHex(this.state.gasLimit)
    var gasPrice = converter.numberToHex(converter.gweiToWei(this.props.exchange.snapshot.gasPrice))
    var keystring = this.props.account.keystring
    var type = this.props.account.type;
    const slippagePercentage = 100 - (this.props.exchange.customRateInput.value || 3);
    const platformFee = converters.toHex(this.props.exchange.platformFee);
    const walletId = getReferAddress(this.props.account.type);

    return {
      formId, address, ethereum, sourceToken, sourceTokenSymbol, sourceDecimal, sourceAmount, destToken,
      destAddress, maxDestAmount, slippageRate, walletId, nonce, gas, gasPrice, keystring, type, destAmount,
      destTokenSymbol, platformFee, slippagePercentage
    }
  }
  
  async getGasSwap() {
    const {
      ethereum, sourceToken, sourceAmount, destToken, maxDestAmount,
      slippageRate, walletId, destTokenSymbol,sourceTokenSymbol, platformFee
    } = this.getFormParams()
    
    const gasPrice = this.props.exchange.gasPrice;
    const ethBalance = this.props.account.balance;
    const tokens = this.props.tokens;
    const srcToken = tokens[sourceTokenSymbol];
    const desToken = tokens[destTokenSymbol];
    const maxGasLimit = this.props.exchange.max_gas;
    const srcAmountNumber = this.props.exchange.sourceAmount;

    let gas = await fetchGasLimit(srcToken, desToken, maxGasLimit, srcAmountNumber);
    this.setState({ gasLimit: gas });

    try {
      if (srcToken.is_gas_fixed || desToken.is_gas_fixed) {
        this.setState({isFetchGas: false});
        this.validateEthBalance(ethBalance, sourceTokenSymbol, sourceAmount, gas, gasPrice);
        return;
      }

      var data = await ethereum.call(
        "exchangeData", sourceToken, sourceAmount, destToken, this.props.account.address,
        maxDestAmount, slippageRate, walletId, platformFee
      );
      
      var value = '0x0'
      if (sourceTokenSymbol === 'ETH') {
        value = sourceAmount
      }
      
      var txObj = {
        from: this.props.account.address,
        to: BLOCKCHAIN_INFO.network,
        data: data,
        value: value
      }

      let estimatedGas = await ethereum.call("estimateGas", txObj);
      estimatedGas = Math.round(estimatedGas * 120 / 100) + 100000;

      if (estimatedGas < gas) {
        gas = estimatedGas;
        this.setState({ gasLimit: gas })
      }
    } catch (err) {
      console.log(err);
    }
    
    this.setState({isFetchGas: false});
    this.validateEthBalance(ethBalance, sourceTokenSymbol, sourceAmount, gas, gasPrice);
  }
  
  validateEthBalance(ethBalance, srcSymbol, srcAmount, gas, gasPrice) {
    srcAmount = converter.hexToNumber(srcAmount)
    srcAmount = converter.toT(srcAmount, this.props.tokens[srcSymbol].decimal)
    
    const isNotEnoughEth = validators.verifyBalanceForTransaction(
      ethBalance, srcSymbol, srcAmount, gas, gasPrice
    );
    
    if (isNotEnoughEth) {
      this.setState({
        restrictError: this.props.translate("error.eth_balance_not_enough_for_fee") || "Your ETH balance is not enough to pay for the transaction fees"
      })
    }
  }
  
  async onSubmit() {
    const wallet = this.props.wallet;
    var password = ""
    
    if (this.state.restrictError || this.state.isConfirmingTx || this.state.isFetchGas || this.state.isFetchRate) return
    
    this.setState({
      err: "",
      isConfirmingTx: true
    });
    
    if (this.props.account.type === 'walletconnect') {
      this.confirmingTimer = setTimeout(() => {
        this.setState({isConfirmingTx: false})
      }, constants.TX_CONFIRMING_TIMEOUT);
    }
    
    try {
      var {
        formId, address, ethereum, sourceToken, sourceTokenSymbol, sourceAmount,
        destToken, destAddress,maxDestAmount, slippageRate, walletId, nonce, gas,
        gasPrice, keystring, type, destAmount, destTokenSymbol, platformFee
      } = this.getFormParams()
      var callFunc = sourceTokenSymbol === "ETH" ? "etherToOthersFromAccount" : "tokenToOthersFromAccount"
      var txHash = await wallet.broadCastTx(
        callFunc, formId, ethereum, address, sourceToken, sourceAmount, destToken, destAddress, maxDestAmount,
        slippageRate, walletId, nonce, gas, gasPrice, keystring, type, password, platformFee
      )
      
      //submit hash to broadcast server
      try {
        ethereum.call("getInfo", {txHash})
      } catch (err) {
        console.log(err)
      }
      
      //notify server
      try {
        var notiService = this.props.global.notiService
        notiService.callFunc("setNewTx", {hash: txHash})
      } catch (e) {
        console.log(e)
      }
      
      //run after broadcast
      //track complete trade
      var data = {sourceAmount, sourceTokenSymbol, destAmount, destTokenSymbol}
      this.props.global.analytics.callTrack("trackCoinExchange", data);
      this.props.global.analytics.callTrack("completeTrade", txHash, "kyber", "swap");
      this.props.global.analytics.callTrack("trackWalletVolume", wallet.getWalletName(), sourceTokenSymbol, this.props.exchange.snapshot.sourceAmount, destTokenSymbol);
      
      // Track swapping time here
      const startTime = this.state.startTime;
      const currentTime = Math.round(new Date().getTime());
      this.props.global.analytics.callTrack("trackBroadcastedTransaction", currentTime - startTime);
      
      const tx = new Tx(txHash, address, gas, gasPrice, nonce, "pending", "exchange", data);
      
      this.props.dispatch(accountActions.incManualNonceAccount(address))
      this.props.dispatch(accountActions.updateAccount(ethereum, this.props.account))
      this.props.dispatch(exchangeActions.doTransactionComplete(tx))
      this.props.dispatch(exchangeActions.finishExchange())
      
      //go to the next step
      this.props.dispatch(exchangeActions.forwardExchangePath())
    } catch (err) {
      console.log(err)
      this.setState({err: err.toString(), isConfirmingTx: false})
    }
  }
  
  msgHtml = () => {
    if (this.state.isConfirmingTx && this.props.account.type !== 'privateKey') {
      return <div
        className="message-waiting theme__text common__slide-up">{this.props.translate("modal.waiting_for_confirmation") || "Waiting for confirmation from your wallet"}</div>
    }
    
    return "";
  }
  
  errorHtml = () => {
    if (this.state.restrictError || this.state.err) {
      return (
        <div className={`modal-error message-error common__slide-up`}>
          {this.state.restrictError ? this.state.restrictError : this.state.err}
        </div>
      )
    }
    
    return ""
  }
  
  closeModal = () => {
    if (this.state.isConfirmingTx) return
    this.props.dispatch(exchangeActions.resetExchangePath())
  }
  
  recap = () => {
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
    
    var destTokenSymbol = this.props.exchange.destTokenSymbol
    var sourceAmount = this.props.exchange.snapshot.sourceAmount.toString();
    var destDecimal = this.props.tokens[destTokenSymbol].decimal;
    var expectedRate = this.state.expectedRate
    var destAmount = converter.caculateDestAmount(sourceAmount, expectedRate, destDecimal)
    var sourceTokenSymbol = this.props.exchange.sourceTokenSymbol
    const {isOnMobile} = this.props.global;

    return (
      <div className="confirm-exchange-modal">
        {!isPromoPayment &&
          <React.Fragment>
            {!isOnMobile ? (
              <React.Fragment>
                <div className="title-container">
                  <div className="title-description">
                    <div>{this.props.translate("address.your_wallet") || "Your Wallet"}</div>
                    <div className="title-description-wallet-address theme__text-6">
                      <span>{this.props.account.address.slice(0, 7)}</span>
                      <span>...</span>
                      <span>{this.props.account.address.slice(-6)}</span>
                    </div>
                  </div>
                  <div className="title-description">
                    <div>{this.props.translate("transaction.kyber_network_proxy") || "Kyber Network Proxy"}</div>
                    <div className="title-description-wallet-address theme__text-6">
                      <span>{BLOCKCHAIN_INFO.network.slice(0, 7)}</span>
                      <span>...</span>
                      <span>{BLOCKCHAIN_INFO.network.slice(-6)}</span>
                    </div>
                  </div>
                </div>
                {this.props.account.type === "promo" && <div className="title-description-expired-notification">
                  <img src={require("../../../../assets/img/v3/info_blue.svg")}/>{' '}
                  <span>{`${this.props.translate("transaction.promo_expired_notification") || "After swapping please transfer your token to your personal wallet before"} ${expiredYear}`}</span>
                </div>}
              </React.Fragment>
            ) : (
              <div className="title-description">
                <div>{this.props.translate("address.your_wallet") || "Your Wallet"}</div>
                <div className="title-description-wallet-address theme__text-6">
                  {this.props.account.address}
                </div>
                {this.props.account.type === "promo" && <div className="title-description-expired-notification">
                  <img src={require("../../../../assets/img/v3/info_blue.svg")}/>{' '}
                  <span>{`${this.props.translate("transaction.promo_expired_notification") || "After swapping please transfer your token to your personal wallet before"} ${expiredYear}`}</span>
                </div>}
              </div>
            )
            }
            <div className="amount theme__background-22">
              <div className="amount-item amount-left">
                <div
                  className={"rc-label"}>{this.props.translate("transaction.exchange_from") || "From"}</div>
                <div className={"rc-info"}>
                  <div>{sourceAmount}</div>
                  <div>{sourceTokenSymbol}</div>
                </div>
              </div>
              <div className="space space--padding"><img
                src={require("../../../../assets/img/exchange/arrow-right-orange.svg")}/></div>
              <div className="amount-item amount-right">
                <div className={"rc-label"}>{this.props.translate("transaction.exchange_to") || "To"}</div>
                <div className={"rc-info"}>
                  <div>
                    {this.state.isFetchRate ?
                      <img src={require('../../../../assets/img/waiting-white.svg')}/> : destAmount}
                  </div>
                  <div>{destTokenSymbol}</div>
                </div>
              </div>
            </div>
          </React.Fragment>
        }
        
        {isPromoPayment &&
          <React.Fragment>
            <div
              className="title-description-promo-payment theme__text">{this.props.translate("transaction.swap_for_gift") || "You are swapping to receive a gift"}</div>
            <div className="amount amount-promo-payment theme__background-22">
              <div className="amount-item amount-left amount-item-promo-balance">
                <div
                  className={"rc-label"}>{this.props.translate("transaction.exchange_from") || "From"}</div>
                <div className={"rc-info rc-info-promo-balance"}>
                  <div>{sourceAmount}</div>
                  <div>{sourceTokenSymbol}</div>
                </div>
              </div>
              <div className="space-container theme__text">
                <div className="text-above">{this.props.translate("transaction.swap") || "Swap"}</div>
                <div className="space space-arrow-icon"><img
                  src={require("../../../../assets/img/exchange/arrow-right-orange-long.svg")}/></div>
                <div
                  className="text-below">{this.props.translate("transaction.send_to_organizer") || "Send to the Organizer"}</div>
              </div>
              <div className="amount-item amount-right amount-item-promo-balance">
                <div className={"rc-label"}>{this.props.translate("transaction.exchange_to") || "To"}</div>
                <div className={"rc-info rc-info-promo-balance"}>
                  <div>
                    {this.state.isFetchRate ?
                      <img src={require('../../../../assets/img/waiting-white.svg')}/> : destAmount}
                  </div>
                  <div>{destTokenSymbol}</div>
                </div>
              </div>
              <div className="space-container space-container-grid-align">
                <div className="space space-arrow-icon"><img
                  src={require("../../../../assets/img/exchange/arrow-right-orange-long.svg")}/></div>
              </div>
              <div className="amount-item amount-right">
                <div>
                  <div
                    className={"rc-label"}>{this.props.translate("transaction.exchange_receive") || "Receive"}</div>
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
  
  contentModal = () => {
    const warningLowFee = this.props.exchange.sourceTokenSymbol === 'ETH' && converter.compareTwoNumber(0.01, converter.subOfTwoNumber(converter.toT(this.props.tokens['ETH'].balance), this.props.exchange.sourceAmount)) === 1;
    
    return (
      <div className="theme__text">
        <div className="x" onClick={this.closeModal}>
          <img src={require("../../../../assets/img/v3/Close-3.svg")}/>
        </div>
        <div className="content-wrapper">
          <div className="content with-overlap">
            <div className="row">
              <div>
                <div>
                  <div className="title">{this.props.translate("modal.confirm_swap") || "Swap Confirm"}</div>
                  {this.recap()}
                  {this.props.exchange.snapshot.percentChange >= BLOCKCHAIN_INFO.highSlippage && (
                    <div className="modal-content common__mt-15">
                      <div className="common__flexbox">
                        <div className="modal-content__title theme__text-5">{this.props.translate("price") || "Price"}</div>
                        <RateBetweenToken
                          exchangeRate={{
                            sourceToken: this.props.exchange.sourceTokenSymbol,
                            rate: converters.toT(this.state.expectedRate),
                            destToken: this.props.exchange.destTokenSymbol
                          }}
                        />
                      </div>
                      <div className="modal-content__text-warning theme__background-red">
                        {this.props.translate("info.slippage_warning") || "Slippage is high. You may want to reduce your swap amount and do multiple swaps for a better rate."}
                      </div>
                    </div>
                  )}
                  {!this.state.isFetchRate && converter.compareTwoNumber(this.state.slippageRate, this.state.expectedRate) === 1 && (
                    <div className="modal-content common__mt-15">
                      <div className="modal-content__text-warning theme__background-red">
                          {this.props.translate("error.min_rate_greater_expected_rate") || "Your configured minimal rate is higher than what is recommended by KyberNetwork. Your swap has high chance to fail"}
                      </div>
                    </div>
                  )}
                  <FeeDetail
                    translate={this.props.translate}
                    gasPrice={this.props.exchange.snapshot.gasPrice}
                    gas={this.state.gasLimit}
                  />
                  {warningLowFee && (
                    <div className={"tx-fee-warning theme__background-10"}>
                      <img src={require("../../../../assets/img/warning-triangle.svg")}/>
                      <span>{this.props.translate("transaction.tx_fee_warning") || 'After this swap, you will not have enough ETH as fee for further transactions.'}</span>
                    </div>
                  )}
                </div>
                {this.errorHtml()}
              </div>
            </div>
            <div>{this.msgHtml()}</div>
          </div>
          <div className="overlap theme__background-2">
            <div className="input-confirm grid-x">
              <div
                className={"button process-submit cancel-process" + (this.state.isConfirmingTx ? " disabled-button" : "")}
                onClick={this.closeModal}>
                {this.props.translate("modal.cancel" || "Cancel")}
              </div>
              <div
                className={"button process-submit " + (this.state.restrictError || this.state.isFetchGas || this.state.isFetchRate || this.state.isConfirmingTx ? "disabled-button" : "next")}
                onClick={this.onSubmit.bind(this)}>{this.props.translate("modal.confirm") || "Confirm"}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  render() {
    return (
      <Modal
        className={{
          base: 'reveal medium confirm-modal',
          afterOpen: 'reveal medium confirm-modal'
        }}
        isOpen={true}
        onRequestClose={this.closeModal}
        contentLabel="confirm modal"
        content={this.contentModal()}
        size="medium"
      />
    )
  }
}
