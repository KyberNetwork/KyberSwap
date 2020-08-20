import React from "react"
import { Modal } from "../../../components/CommonElement"
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'
import * as transferActions from "../../../actions/transferActions"
import * as converter from "../../../utils/converter"
import * as validators from "../../../utils/validators"
import { FeeDetail } from "../../../components/CommonElement"
import Tx from "../../../services/tx"
import * as accountActions from '../../../actions/accountActions'
import constants from "../../../services/constants";

@connect((store) => {
    const account = store.account.account
    const wallet = store.account.wallet;
    const translate = getTranslate(store.locale)
    const tokens = store.tokens.tokens
    const transfer = store.transfer
    const ethereum = store.connection.ethereum
    const global = store.global

    return {
        translate, transfer, tokens, account, ethereum, global, wallet
    }
})
export default class ConfirmModal extends React.Component {
    constructor() {
        super()
        this.state = {
            err: "",
            isFetchGas: false,
            gasLimit: 0,
            gasPrice: 0,
            isConfirmingTx: false
        }
        this.confirmingTimer = null;
    }

    componentDidMount = () => {
        this.setState({
            isFetchGas: true,
            gasLimit: this.getMaxGasTransfer(),
            gasPrice: this.props.transfer.gasPrice
        })


        this.getGasTransfer()
    }
    
    componentWillUnmount() {
        clearTimeout(this.confirmingTimer);
    }

    getMaxGasTransfer = () => {
        const transfer = this.props.transfer;
        const specialGasLimit = constants.SPECIAL_TRANSFER_GAS_LIMIT[transfer.tokenSymbol];
    
        if (!specialGasLimit) {
            return transfer.gas_limit;
        }
    
        return specialGasLimit;
    };

    getFormParams = () => {
        var tokenSymbol = this.props.transfer.tokenSymbol
        var address = this.props.account.address
        var destAddress = this.props.transfer.destAddress
        var destEthName = this.props.transfer.destEthName;
        var tokenDecimal = this.props.tokens[tokenSymbol].decimals
        var tokenAddress = this.props.tokens[tokenSymbol].address
        var amount = converter.stringToHex(this.props.transfer.amount, tokenDecimal)
        var ethereum = this.props.ethereum
        var nonce = this.props.account.getUsableNonce()
        var gas = converter.numberToHex(this.state.gasLimit)
        var gasPrice = converter.numberToHex(converter.gweiToWei(this.state.gasPrice))
        var keystring = this.props.account.keystring
        var type = this.props.account.type
        var password = ""

        return {
            tokenSymbol, address, destEthName, destAddress, tokenDecimal, amount, tokenAddress, nonce, ethereum, gas, gasPrice, keystring, type, password
        }
    }
    
    async getGasTransfer() {
        var txObj
        var { tokenSymbol, address, destAddress, tokenDecimal, amount, tokenAddress, ethereum } = this.getFormParams()
        if (tokenSymbol === "TUSD" || tokenSymbol === "EURS") {
            this.setState({ isFetchGas: false })
            return
        }
        try {
            var fromAddr = !validators.verifyAccount(address) ? address : "0x3cf628d49ae46b49b210f0521fbd9f82b461a9e1"
            if (tokenSymbol === 'ETH') {
                txObj = {
                    from: fromAddr,
                    value: amount,
                    to: destAddress
                }
                var gas = await ethereum.call("estimateGas", txObj)
                if (gas > 21000) {
                    gas = Math.round(gas * 120 / 100)
                }
                this.setState({
                    gasLimit: gas,
                    isFetchGas: false
                })

            } else {
                var data = await ethereum.call("sendTokenData", tokenAddress, amount, destAddress)
                txObj = {
                    from: fromAddr,
                    value: "0x0",
                    to: tokenAddress,
                    data: data
                }

                gas = await ethereum.call("estimateGas", txObj)
                //addition 15k gas for transfer token
                gas = Math.round((gas + 15000) * 120 / 100)
                this.setState({
                    gasLimit: gas,
                    isFetchGas: false
                })
            }
        } catch (err) {
            console.log(err)
            this.setState({
                isFetchGas: false
            })
        }
    }

    async clickTransfer() {
        const wallet = this.props.wallet;

        if (this.state.isConfirmingTx) return
        
        this.setState({
            err: "",
            isConfirmingTx: true
        })
    
        if (this.props.account.type === 'walletconnect') {
            this.confirmingTimer = setTimeout(() => {
                this.setState({ isConfirmingTx: false })
            }, constants.TX_CONFIRMING_TIMEOUT);
        }
        
        try {

            var { formId, ethereum, address, tokenAddress, amount, destAddress, nonce, gas, gasPrice, keystring, type, password, tokenSymbol } = this.getFormParams()

            var callFunc = tokenSymbol === "ETH" ? "sendEtherFromAccount" : "sendTokenFromAccount"

            var txHash = await wallet.broadCastTx(callFunc, formId, ethereum, address,
                tokenAddress, amount,
                destAddress.toLowerCase(), nonce, gas,
                gasPrice, keystring, type, password)

            //notify server
            try {
                var notiService = this.props.global.notiService
                notiService.callFunc("setNewTx", { hash: txHash })
            } catch (e) {
                console.log(e)
            }

            this.props.global.analytics.callTrack("trackCoinTransfer", tokenSymbol);
            this.props.global.analytics.callTrack("completeTrade", txHash, "kyber", "transfer");


            var data = { amount, tokenSymbol, destAddress }
            const tx = new Tx(
                txHash, address, gas, gasPrice, nonce, "pending", "transfer", data)

            this.props.dispatch(accountActions.incManualNonceAccount(address))
            this.props.dispatch(accountActions.updateAccount(ethereum, this.props.account))

            this.props.dispatch(transferActions.doTransactionComplete(tx))
            this.props.dispatch(transferActions.finishTransfer())



            //go to the next step
            this.props.dispatch(transferActions.forwardTransferPath())
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
            return (
                <React.Fragment>
                    <div className={'modal-error message-error common__slide-up'}>
                        {this.state.err}
                    </div>
                </React.Fragment>
            )
        }
        
        return ""
    }

    closeModal = () => {
        if (this.state.isConfirmingTx) return
        this.props.dispatch(transferActions.resetTransferPath())
    }


    recap = () => {
        var { tokenSymbol, destAddress, destEthName } = this.getFormParams()
        var amount = this.props.transfer.amount.toString()
        return (
            <div className={"transfer-title theme__background-2 theme__text-6"}>
                <div className="recap-sum-up">
                    {this.props.translate("transaction.about_to_transfer") || "You are about to transfer"}
                </div>
                <div className="recap-transfer">
                    <div>
                        <strong className={"theme__text"}>
                            {amount.slice(0, 7)}{amount.length > 7 ? '...' : ''} {tokenSymbol}
                        </strong>
                    </div>
                    <div className={"recap-transfer__to"}>{this.props.translate("transaction.to") || "to"}</div>
                    <div className={"theme__text"}>
                        {destEthName && (
                          <div>{destEthName}</div>
                        )}
                        <div>{destAddress.slice(0, 7)}...{destAddress.slice(-5)}</div>
                    </div>
                </div>
            </div>
        )
    }

    contentModal = () => {
        return (
            <div>
                <div className="x" onClick={this.closeModal}>
                    <img src={require("../../../../assets/img/v3/Close-3.svg")} />
                </div>
                <div className="content-wrapper">
                    <div className="content with-overlap">
                        <div className="row">
                            <div>
                                <div>
                                    <div className="title">{this.props.translate("modal.confirm_transfer_title") || "Transfer Confirm"}</div>
                                    {this.recap()}
                                    <FeeDetail
                                        translate={this.props.translate}
                                        gasPrice={this.state.gasPrice}
                                        gas={this.state.gasLimit}
                                        isFetchingGas={this.state.isFetchGas}

                                    />
                                </div>
                                {this.errorHtml()}
                            </div>
                        </div>
                        <div>{this.msgHtml()}</div>
                    </div>
                    <div className="overlap theme__background-2">
                        
                        <div className="input-confirm grid-x">
                            <div className={"button process-submit cancel-process" + (this.state.isConfirmingTx ? " disabled-button" : "")} onClick={this.closeModal}>
                                {this.props.translate("modal.cancel" || "Cancel")}
                            </div>
                            <div className={"button process-submit " + (this.state.isFetchGas || this.state.isConfirmingTx ? "disabled-button" : "next")} onClick={this.clickTransfer.bind(this)}>{this.props.translate("modal.confirm").toLocaleUpperCase() || "Confirm".toLocaleUpperCase()}</div>
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
