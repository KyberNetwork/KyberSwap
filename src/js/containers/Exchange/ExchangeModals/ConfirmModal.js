import React from "react"
import { Modal } from "../../../components/CommonElement"
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'
import * as exchangeActions from "../../../actions/exchangeActions"
import constants from "../../../services/constants"
import * as converter from "../../../utils/converter"
import * as validators from "../../../utils/validators"
import { getParameterByName } from "../../../utils/common";
import { getWallet } from "../../../services/keys"
import { FeeDetail } from "../../../components/CommonElement"
import BLOCKCHAIN_INFO from "../../../../../env"
import Tx from "../../../services/tx"
import * as web3Package from "../../../services/web3";
import * as accountActions from '../../../actions/accountActions'

@connect((store, props) => {
    const account = store.account.account
    const translate = getTranslate(store.locale)
    const tokens = store.tokens.tokens
    const exchange = store.exchange
    const ethereum = store.connection.ethereum
    const global = store.global

    return {
        translate, exchange, tokens, account, ethereum, global
    }
})

export default class ConfirmModal extends React.Component {
    constructor() {
        super()
        this.state = {
            err: "",
            isFetchGas: true,
            isFetchRate: true,
            gasLimit: 0,
            slippageRate: 0,
            expectedRate: 0,
            startTime: 0,
            isConfirmingTx: false
        }
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
      
        this.getSlippageRate()
        this.getGasSwap()
    }

    getReferAddr = () => {
        if (this.props.account.type === "metamask") {
            const web3Service = web3Package.newWeb3Instance();
            const walletId = web3Service.getWalletId();
            return walletId;
        }
        
        var refAddr = getParameterByName("ref")
        if (!validators.verifyAccount(refAddr)) {
            return refAddr
        }
        
        return constants.EXCHANGE_CONFIG.COMMISSION_ADDR
    }

    async getSlippageRate() {
        try {
            var source = this.props.exchange.sourceToken
            var dest = this.props.exchange.destToken
            var destTokenSymbol = this.props.exchange.destTokenSymbol
            var sourceAmount = this.props.exchange.snapshot.sourceAmount
            var sourceDecimal = this.props.tokens[this.props.exchange.sourceTokenSymbol].decimals
            var sourceAmountHex = converter.stringToHex(sourceAmount, sourceDecimal)
            var ethereum = this.props.ethereum

            var rate = await ethereum.call("getRate", source, dest, sourceAmountHex)
            if (rate.expectedRate == 0 || rate.slippageRate == 0) {
                this.setState({
                    isFetchRate: false,
                    rateErr: this.props.translate("error.node_error") || "There are some problems with nodes. Please try again in a while."
                })
            } else {
                this.setState({
                    isFetchRate: false,
                    expectedRate: rate.expectedRate
                })
                if (!this.props.exchange.isEditRate) {
                    this.setState({
                        isFetchRate: false,
                        slippageRate: rate.slippageRate
                    })
                }
            }

        } catch (err) {
            console.log(err)
            this.setState({
                rateErr: err.toString(),
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
        // var destAddress = this.props.account.address

        var destAddress = this.props.account.type === "promo" && this.props.account.info && this.props.account.info.promoType === "payment"
        ? this.props.account.info.receiveAddr : this.props.account.address;

        var maxDestAmount = converter.biggestNumber()
        var slippageRate = this.state.slippageRate
        var waletId = this.getReferAddr()
        var nonce = this.props.account.getUsableNonce()
        var gas = converter.numberToHex(this.state.gasLimit)
        var gasPrice = converter.numberToHex(converter.gweiToWei(this.props.exchange.snapshot.gasPrice))
        var keystring = this.props.account.keystring
        var type = this.props.account.type
        return {
            formId, address, ethereum, sourceToken, sourceTokenSymbol, sourceDecimal, sourceAmount,
            destToken, destAddress, maxDestAmount, slippageRate, waletId, nonce, gas, gasPrice, keystring, type, destAmount, destTokenSymbol
        }
    }

    async getGasSwap() {
        const { ethereum, sourceToken, sourceAmount, destToken, maxDestAmount, slippageRate, walletId, destTokenSymbol, sourceTokenSymbol } = this.getFormParams()
        const gasApprove = this.state.gas_approve;
        const gasPrice = this.props.exchange.gasPrice;
        const ethBalance = this.props.account.balance;
        let gas = await this.getMaxGasExchange();
        this.setState({ gasLimit: gas });
        
        try {
            if (this.props.tokens[sourceTokenSymbol].is_gas_fixed || this.props.tokens[destTokenSymbol].is_gas_fixed) {
                this.setState({ isFetchGas: false });
                this.validateEthBalance(ethBalance, sourceTokenSymbol, sourceAmount, gas, gasApprove, gasPrice);
                return;
            }
            
            var data = await ethereum.call("exchangeData", sourceToken, sourceAmount,
                destToken, this.props.account.address,
                maxDestAmount, slippageRate, walletId)

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
                this.setState({ gasLimit: estimatedGas })
            }
        } catch (err) {
            console.log(err);
        }
  
        this.setState({ isFetchGas: false });
        this.validateEthBalance(ethBalance, sourceTokenSymbol, sourceAmount, gas, gasApprove, gasPrice);
    }

    validateEthBalance(ethBalance, srcSymbol, srcAmount, gas, gasApprove, gasPrice) {
      const isNotEnoughEth = validators.verifyBalanceForTransaction(
        ethBalance, srcSymbol, srcAmount, gas + gasApprove, gasPrice
      );
  
      if (isNotEnoughEth) {
        this.setState({
          err: this.props.translate("error.eth_balance_not_enough_for_fee") || "Your ETH balance is not enough for the transaction fee"
        })
      }
    }
    
    async getMaxGasExchange() {
        const srcTokenAddress = this.props.exchange.sourceToken;
        const destTokenAddress = this.props.exchange.destToken;
        const srcAmount = this.props.exchange.sourceAmount;
        const ethereum = this.props.ethereum;

        try {
            const gasLimitResult =  await ethereum.call("getGasLimit", srcTokenAddress, destTokenAddress, srcAmount);

            if (gasLimitResult.error) {
                return this.getMaxGasExchangeFromTokens();
            } else {
                return gasLimitResult.data;
            }
        } catch (err) {
            console.log(err);
            return this.getMaxGasExchangeFromTokens();
        }
    }
    
    getMaxGasExchangeFromTokens() {
        const exchange = this.props.exchange;
        const tokens = this.props.tokens;

        const sourceTokenLimit = tokens[exchange.sourceTokenSymbol] ? tokens[exchange.sourceTokenSymbol].gasLimit : 0;
        const destTokenLimit = tokens[exchange.destTokenSymbol] ? tokens[exchange.destTokenSymbol].gasLimit : 0;

        const sourceGasLimit = sourceTokenLimit ? parseInt(sourceTokenLimit) : exchange.max_gas;
        const destGasLimit = destTokenLimit ? parseInt(destTokenLimit) : exchange.max_gas;

        return sourceGasLimit + destGasLimit;
    }

    async onSubmit() {
        //reset        
        var wallet = getWallet(this.props.account.type)
        var password = ""
        if (this.state.err || this.state.isConfirmingTx || this.state.isFetchGas || this.state.isFetchRate) return
        this.setState({
            err: "",
            isConfirmingTx: true
        })
        try {

            var { formId, address, ethereum, sourceToken, sourceTokenSymbol, sourceDecimal, sourceAmount,
                destToken, destAddress, maxDestAmount, slippageRate, waletId, nonce, gas, gasPrice, keystring, type, destAmount, destTokenSymbol } = this.getFormParams()

            var callFunc = sourceTokenSymbol === "ETH" ? "etherToOthersFromAccount" : "tokenToOthersFromAccount"

            var txHash = await wallet.broadCastTx(callFunc, formId, ethereum, address, sourceToken,
                sourceAmount, destToken, destAddress,
                maxDestAmount, slippageRate,
                waletId, nonce, gas,
                gasPrice, keystring, type, password)


            //submit hash to broadcast server
            try {
                ethereum.call("getInfo", { txHash })
            } catch (err) {
                console.log(err)
            }

            //notify server
            try {
                var notiService = this.props.global.notiService
                notiService.callFunc("setNewTx", { hash: txHash })
            } catch (e) {
                console.log(e)
            }

            //run after broadcast
            //track complete trade
            var data = { sourceAmount, sourceTokenSymbol, destAmount, destTokenSymbol }
            this.props.global.analytics.callTrack("trackCoinExchange", data);
            this.props.global.analytics.callTrack("completeTrade", txHash, "kyber", "swap");

            // Track swapping time here
            const startTime = this.state.startTime;
            const currentTime = Math.round(new Date().getTime());
            this.props.global.analytics.callTrack("trackBroadcastedTransaction", currentTime - startTime);

            const tx = new Tx(
                txHash, address, gas, gasPrice, nonce, "pending", "exchange", data)

            this.props.dispatch(accountActions.incManualNonceAccount(address))
            this.props.dispatch(accountActions.updateAccount(ethereum, this.props.account))
            //   this.props.dispatch(addTx(tx))
            this.props.dispatch(exchangeActions.doTransactionComplete(tx))
            this.props.dispatch(exchangeActions.finishExchange())


            //go to the next step
            this.props.dispatch(exchangeActions.forwardExchangePath())
        } catch (err) {
            console.log(err)
            this.setState({ err: err.toString(), isConfirmingTx: false })
        }
    }


    msgHtml = () => {
        if (this.state.isConfirmingTx && this.props.account.type !== 'privateKey') {
            return <div className="message-waiting">{this.props.translate("modal.waiting_for_confirmation") || "Waiting for confirmation from your wallet"}</div>
        } else {
            return ""
        }
    }



    errorHtml = () => {
        if (this.state.err) {
            let metaMaskClass = this.props.account.type === 'metamask' ? 'metamask' : ''
            return (
                <React.Fragment>
                    <div className={'modal-error custom-scroll ' + metaMaskClass}>
                        {this.state.err}
                    </div>
                </React.Fragment>
            )
        } else {
            return ""
        }
    }

    closeModal = () => {
        if (this.state.isConfirmingTx) return
        this.props.dispatch(exchangeActions.resetExchangePath())
    }


    recap = () => {
        // if (!this.props.exchange.snapshot || !Object.keys(this.props.exchange.snapshot).length) return

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
        var destAmount = converter.caculateDestAmount(sourceAmount, this.state.expectedRate, destDecimal)

        var sourceTokenSymbol = this.props.exchange.sourceTokenSymbol
        var sourceIcon = this.props.exchange.sourceIcon
        var destIcon = this.props.exchange.destIcon

        var slippageRate = this.state.slippageRate
        var expectedRate = this.state.expectedRate

        const { isOnMobile } = this.props.global;


        var slippagePercent = converter.calculatePercentRate(slippageRate, expectedRate)
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
                                    <img src={require("../../../../assets/img/v3/info_blue.svg")} />{' '}
                                    <span>{`${this.props.translate("transaction.promo_expired_notification") || "After swapping please transfer your token to your personal wallet before"} ${expiredYear}`}</span>
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
                                        <img src={require("../../../../assets/img/v3/info_blue.svg")} />{' '}
                                        <span>{`${this.props.translate("transaction.promo_expired_notification") || "After swapping please transfer your token to your personal wallet before"} ${expiredYear}`}</span>
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
                            <div className="space space--padding"><img src={require("../../../../assets/img/exchange/arrow-right-orange.svg")} /></div>
                            <div className="amount-item amount-right">
                                <div className={"rc-label"}>{this.props.translate("transaction.exchange_to") || "To"}</div>
                                <div className={"rc-info"}>
                                    <div>
                                        {this.state.isFetchRate ? <img src={require('../../../../assets/img/waiting-white.svg')} /> : destAmount}
                                    </div>
                                    <div>
                                        {destTokenSymbol}
                                    </div>
                                </div>
                            </div>
                        </div>


                        {this.props.exchange.snapshot.percentChange >= 10 &&
                            <div className="description error">
                                <span className="error-text">
                                    {this.props.translate("error.percent_change_error", { percentChange: this.props.exchange.percentChange }) || `There is a ${this.props.exchange.percentChange}% difference in price for the requested quantity and the default 0.5 ETH quantity.`}
                                </span>
                            </div>
                        }

                    </React.Fragment>
                }

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
                                <div className="space space-arrow-icon"><img src={require("../../../../assets/img/exchange/arrow-right-orange-long.svg")} /></div>
                                <div className="text-below">{this.props.translate("transaction.send_to_organizer") || "Send to the Organizer"}</div>
                            </div>
                            <div className="amount-item amount-right amount-item-promo-balance">
                                <div className={"rc-label"}>{this.props.translate("transaction.exchange_to") || "To"}</div>
                                <div className={"rc-info rc-info-promo-balance"}>
                                    <div>
                                        {this.state.isFetchRate ? <img src={require('../../../../assets/img/waiting-white.svg')} /> : destAmount}
                                    </div>
                                    <div>
                                        {destTokenSymbol}
                                    </div>
                                </div>
                            </div>
                            <div className="space-container space-container-grid-align">
                                <div className="space space-arrow-icon"><img src={require("../../../../assets/img/exchange/arrow-right-orange-long.svg")} /></div>
                            </div>
                            <div className="amount-item amount-right">
                                <div>
                                    <div className={"rc-label"}>{this.props.translate("transaction.exchange_receive") || "Receive"}</div>
                                    <div className={"rc-info"}>
                                        1 {this.props.translate("transaction.gift") || "Gift"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                }

                {!this.state.isFetchRate && converter.compareTwoNumber(slippageRate, expectedRate) === 1 &&
                    <div className="description error">
                        <span className="error-text">
                            {this.props.translate("error.min_rate_greater_expected_rate") || "Your configured minimal exchange rate is higher than what is recommended by KyberNetwork. Your exchange has high chance to fail"}
                        </span>
                    </div>
                }
            </div>
        )

    }

    contentModal = () => {
        const warningLowFee = this.props.exchange.sourceTokenSymbol === 'ETH' && converter.compareTwoNumber(0.01, converter.subOfTwoNumber(converter.toT(this.props.tokens['ETH'].balance), this.props.exchange.sourceAmount)) === 1;

        return (
            <div>
                <a className="x" onClick={this.closeModal}>
                    <img src={require("../../../../assets/img/v3/Close-3.svg")} />
                </a>
                <div className="content-wrapper">
                    <div className="content with-overlap">
                        <div className="row">
                            <div>
                                <div>
                                    <div className="title">{this.props.translate("modal.confirm_swap") || "Swap Confirm"}</div>
                                    {this.recap()}

                                    <FeeDetail
                                        translate={this.props.translate}
                                        gasPrice={this.props.exchange.snapshot.gasPrice}
                                        gas={this.state.gasLimit}
                                    />

                                {warningLowFee &&
                                    <div className={"tx-fee-warning"}>
                                        <img src={require("../../../../assets/img/warning-triangle.svg")}/>
                                        <span>{this.props.translate("transaction.tx_fee_warning") || 'After this swap, you will not have enough ETH as fee for further transactions.'}</span>
                                    </div>
                                }

                                </div>
                                {this.errorHtml()}
                            </div>
                        </div>
                        <div>{this.msgHtml()}</div>
                    </div>
                    <div className="overlap">
                        <div className="input-confirm grid-x">
                            <a className={"button process-submit cancel-process" + (this.state.isConfirmingTx ? " disabled-button" : "")} onClick={this.closeModal}>
                                {this.props.translate("modal.cancel" || "Cancel")}
                            </a>
                            <a className={"button process-submit " + (this.state.err || this.state.isFetchGas || this.state.isFetchRate || this.state.isConfirmingTx ? "disabled-button" : "next")} onClick={this.onSubmit.bind(this)}>{this.props.translate("modal.confirm") || "Confirm"}</a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        return (
            <Modal className={{
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
