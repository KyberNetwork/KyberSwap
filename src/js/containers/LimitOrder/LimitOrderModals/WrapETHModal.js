import React from "react"
import { Modal } from "../../../components/CommonElement"

import { filterInputNumber } from "../../../utils/validators";

import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'
import * as limitOrderActions from "../../../actions/limitOrderActions"
import * as accountActions from "../../../actions/accountActions"
import constants from "../../../services/constants"
import * as converters from "../../../utils/converter"

import BLOCKCHAIN_INFO from "../../../../../env"

import { getAssetUrl } from "../../../utils/common"

import { getWallet } from "../../../services/keys"
import ReactTooltip from 'react-tooltip'

@connect((store, props) => {
    const account = store.account.account
    const translate = getTranslate(store.locale)
    const tokens = store.tokens.tokens
    const limitOrder = store.limitOrder
    const ethereum = store.connection.ethereum
    const exchange = store.exchange
    const global = store.global
    return {
        translate, limitOrder, tokens, account, ethereum, exchange, global

    }
})

export default class WrapETHModal extends React.Component {

    constructor() {
        super()
        this.state = {
            err: "",
            isConfirming: false,
            isError: false,
            amountConvert: 0,
            minAmountConvert: 0
        }
    }

    componentDidMount = () => {

        var convertedEth = this.getAmountWrapETH()
        var minAmountConvert = converters.toEther(convertedEth)

        this.setState({ amountConvert: minAmountConvert, minAmountConvert: minAmountConvert })

        //verify cap - remove because of new term
        // var maxCap = this.props.account.maxCap
        // if (maxCap !== "infinity") {
        //     maxCap = converters.toEther(maxCap)
        // } else {
        //     this.setState({ isError: false })
        //     return
        // }

        // if (converters.compareTwoNumber(convertedEth, maxCap) === 1) {
        //     this.setState({ err: `Converted amount is over your cap - ${maxCap} ETH`, isError: true })
        // } else {
        //     this.setState({ isError: false })
        // }
    }

    handleChange = (e) => {
        var value = e.target.value
        var check = filterInputNumber(e, e.target.value, this.state.amountConvert)
        if (check) {
            this.setState({ amountConvert: value })
            //validate amount
            if (converters.compareTwoNumber(value, this.state.minAmountConvert) < 0) {
                this.setState({ err: "Please enter bigger number. Min converted amount is " + this.state.minAmountConvert })
            } else {
                this.setState({ err: "" })
            }
        }
    }
    
    getAmountWrapETH = () => {
        var srcToken = this.props.tokens[this.props.limitOrder.sourceTokenSymbol];
        var balance = this.props.availableWethBalance;
        var srcAmount = converters.toTWei(this.props.limitOrder.sourceAmount, srcToken.decimals)
        var wrapAmount = converters.subOfTwoNumber(srcAmount, balance)
        return wrapAmount
    }

    getMaxGasExchange = (sourceTokenSymbol, destTokenSymbol) => {
      
        const tokens = this.props.tokens
      
        var sourceTokenLimit = tokens[sourceTokenSymbol] ? tokens[sourceTokenSymbol].gasLimit : 0
        var destTokenLimit = tokens[destTokenSymbol] ? tokens[destTokenSymbol].gasLimit : 0
      
        var sourceGasLimit = sourceTokenLimit ? parseInt(sourceTokenLimit) : this.props.exchange.max_gas
        var destGasLimit = destTokenLimit ? parseInt(destTokenLimit) : this.props.exchange.max_gas
      
        return sourceGasLimit + destGasLimit
      
      }

    validateAmount = () => {
        var err = ""
        if (this.state.amountConvert === "") {
            this.setState({ err: "Your entered amount is invalid" })
            return
        }

        if (converters.compareTwoNumber(this.state.amountConvert, this.state.minAmountConvert) < 0) {
            err = "Please enter bigger number. Min converted amount is " + this.state.minAmountConvert
        }
        
        var gasLimit = this.getMaxGasExchange(this.props.limitOrder.sourceTokenSymbol, this.props.limitOrder.destTokenSymbol)
        var gasPrice = this.props.limitOrder.gasPrice

        var txFee = converters.toTWei(converters.calculateGasFee(gasPrice, gasLimit))
        var totalAmount = converters.sumOfTwoNumber(converters.toTWei(this.state.amountConvert), txFee)
        if (converters.compareTwoNumber(totalAmount, this.props.tokens["ETH"].balance) > 0) {
            err = "Your balance is insufficient for transaction."
        }

        this.setState({ err: err })

        return err === "" ? true : false

    }

    async onSubmit() {
        this.props.global.analytics.callTrack("trackClickConvertEth");
        if (this.state.isConfirming) return

        //validate
        if (!this.validateAmount()) return

        this.setState({ isConfirming: true, err: "" })
        //reset
        var wallet = getWallet(this.props.account.type)

        try {
            var formId = "limit_order"
            var ethereum = this.props.ethereum
            var address = this.props.account.address
            var sourceToken = this.props.tokens["ETH"].address
            var sourceAmount = converters.toHex(converters.toTWei(this.state.amountConvert, 18))
            var destToken = this.props.tokens[BLOCKCHAIN_INFO.wrapETHToken].address
            var destAddress = this.props.account.address            
            var maxDestAmount = converters.biggestNumber()

            var minConversionRate = converters.toHex(Math.pow(10, 18))
            var blockNo = constants.EXCHANGE_CONFIG.COMMISSION_ADDR
            var nonce = this.props.account.nonce
            var gas = this.props.limitOrder.max_gas
            var gasPrice =  converters.toHex(converters.gweiToWei(this.props.limitOrder.gasPrice))
            var keystring = this.props.account.keystring
            var type = this.props.account.type

            var password = ""

            var txHash = await wallet.broadCastTx("etherToOthersFromAccount", formId, ethereum, address, sourceToken,
                sourceAmount, destToken, destAddress,
                maxDestAmount, minConversionRate,
                blockNo, nonce, gas,
                gasPrice, keystring, type, password)

            //increase account nonce 
            this.props.dispatch(accountActions.incManualNonceAccount(this.props.account.address))

            //go to the next step
            this.props.dispatch(limitOrderActions.forwardOrderPath())
        } catch (err) {
            console.log(err)
            this.setState({ err: err, isConfirming: false })
        }
    }


    closeModal = () => {
        if (this.state.isConfirming) return
        this.props.dispatch(limitOrderActions.resetOrderPath())
    }

    msgHtml = () => {
        if (this.state.isConfirming && this.props.account.type !== 'privateKey') {
            return <span>{this.props.translate("modal.waiting_for_confirmation") || "Waiting for confirmation from your wallet"}</span>
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

    contentModal = () => {
        // var wrapAmount = converters.roundingNumber(this.state.amountConvert)
        const availableWethBalance = converters.roundingNumber(converters.toEther(this.props.availableWethBalance));

        return (
            <div className="wrap-eth-modal">
              <div className="title">Convert ETH to WETH</div>
              <a className="x" onClick={this.closeModal}>&times;</a>
              <div className="content with-overlap">
                  <div className="row">
                      <div>

                          <div className="message">
                              <span>Your order can not be submited because your WETH is not enough, please convert ETH to WETH.</span>
                              <span className="weth-modal-tooltip-icon" data-tip={'Limit orders are supported only for token listed on Kyber. ETH is not supported, Please use WETH instead.'} data-for="weth-tooltip" currentitem="false">
                                  <img src={require("../../../../assets/img/v3/info_grey.svg")} />
                              </span>
                              <ReactTooltip class={"weth-modal-tooltip"} id="weth-tooltip" effect="solid" type="dark" />
                          </div>
                          <div className="address-info">
                              <div>
                                  <label>Your address: </label>
                                  <span className={"target-value"}>{this.props.account.address}</span>
                              </div>
                              <div>
                                  <label>Your balance: </label>
                                  <div className={"target-value balance-info"}>
                                      <div>{converters.roundingNumber(converters.toEther(this.props.tokens["ETH"].balance))} ETH</div>
                                      <div>{availableWethBalance} WETH</div>
                                  </div>
                              </div>
                          </div>

                          <div className="illustration">
                              <div className="source-token token-item">
                                  <div className="token-info">
                                      <img src={getAssetUrl(`tokens/eth.svg`)} />
                                      <span>ETH</span>
                                  </div>
                                  <div className="token-value">
                                      <input value={this.state.amountConvert} id="wrap-input"
                                          min="0"
                                          step="0.000001"
                                          placeholder="0" 
                                          type={this.props.global.isOnMobile ? "number" : "text"} maxLength="50" autoComplete="off"
                                          onChange={(e) => this.handleChange(e)} />
                                  </div>
                              </div>

                              <div className="token-connector">
                                  <i className="k k-transfer k-3x"></i>
                              </div>

                              <div className="dest-token token-item">
                                  <div className="token-info">
                                      <img src={getAssetUrl(`tokens/${BLOCKCHAIN_INFO.wrapETHToken.toLowerCase()}.svg`)} />
                                      <span>{BLOCKCHAIN_INFO.wrapETHToken}</span>
                                  </div>
                              </div>
                          </div>

                          {/* {this.state.err && (
                      <div className={'modal-error custom-scroll'}>
                          {this.state.err}
                      </div>
                  )} */}
                          {this.errorHtml()}

                      </div>

                  </div>
              </div>
              <div className="overlap">
                {this.msgHtml()}
                <div className="input-confirm grid-x input-confirm--approve">
                  <div className="cell btn-wrapper">
                        {/* <a className={"button process-submit " + (this.props.isApproving || this.props.isFetchingGas ? "disabled-button" : "next")}
                          onClick={this.props.onSubmit}
                        >{this.props.translate("modal.approve").toLocaleUpperCase() || "Approve".toLocaleUpperCase()}</a> */}
                    <a className={"button process-submit cancel-process"} onClick={this.closeModal}>{this.props.translate("modal.cancel") || "Cancel"}</a>
                    <a className={"button process-submit next"} onClick={this.onSubmit.bind(this)}>{this.props.translate("modal.convert") || "Convert"}</a>
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
                contentLabel="approve token"
                content={this.contentModal()}
                size="medium"
            />
        )


    }
}
