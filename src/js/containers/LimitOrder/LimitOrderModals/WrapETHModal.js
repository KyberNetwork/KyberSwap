import React from "react"
import { Modal } from "../../../components/CommonElement"
import { filterInputNumber } from "../../../utils/validators";
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'
import * as accountActions from "../../../actions/accountActions"
import constants from "../../../services/constants"
import * as converters from "../../../utils/converter"
import BLOCKCHAIN_INFO from "../../../../../env"
import { getAssetUrl } from "../../../utils/common"

@connect((store) => {
    const account = store.account.account
    const wallet = store.account.wallet
    const translate = getTranslate(store.locale)
    const tokens = store.tokens.tokens
    const limitOrder = store.limitOrder
    const ethereum = store.connection.ethereum
    const exchange = store.exchange
    const global = store.global
    return {
        translate, limitOrder, tokens, account, ethereum, exchange, global, wallet
    }
})
export default class WrapETHModal extends React.Component {
    constructor(props) {
        super(props);
        
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
    };
    
    handleChange = (e) => {
        const check = filterInputNumber(e, e.target.value, this.state.amountConvert);
        
        if (check) {
            this.setState({ amountConvert: e.target.value });

            if (converters.compareTwoNumber(e.target.value, this.state.minAmountConvert) < 0) {
                this.setState({ err: this.props.translate("error.min_converted_amount", { minAmount: this.state.minAmountConvert }) || `Please enter bigger number. Min converted amount is ${this.state.minAmountConvert}` })
            } else {
                this.setState({ err: "" })
            }
        }
    };
    
    getAmountWrapETH = () => {
        const srcToken = this.props.sourceToken;
        const balance = this.props.availableWethBalance;
        const srcAmount = converters.toTWei(this.props.sourceAmount, srcToken.decimals);
        
        return converters.subOfTwoNumber(srcAmount, balance);
    };
    
    getMaxGasExchange = () => {
        const tokens = this.props.tokens
        var sourceTokenLimit = tokens["ETH"] ? tokens["ETH"].gasLimit : 0
        var destTokenLimit = tokens[BLOCKCHAIN_INFO.wrapETHToken] ? tokens[BLOCKCHAIN_INFO.wrapETHToken].gasLimit : 0
        var sourceGasLimit = sourceTokenLimit ? parseInt(sourceTokenLimit) : this.props.exchange.max_gas
        var destGasLimit = destTokenLimit ? parseInt(destTokenLimit) : this.props.exchange.max_gas
        
        return sourceGasLimit + destGasLimit
    };
    
    validateAmount = () => {
        var err = ""
        if (this.state.amountConvert === "") {
            this.setState({ err: this.props.translate("error.amount_must_be_number") || "The amount you entered is invalid" });
            return
        }
        
        if (converters.compareTwoNumber(this.state.amountConvert, this.state.minAmountConvert) < 0) {
            err = this.props.translate("error.min_converted_amount", { minAmount: this.state.minAmountConvert }) || `Please enter bigger number. Min converted amount is ${this.state.minAmountConvert}`;
        }
        
        var gasLimit = this.getMaxGasExchange(this.props.sourceToken.symbol, this.props.destToken.symbol)
        var gasPrice = this.props.limitOrder.gasPrice
        
        var txFee = converters.toTWei(converters.calculateGasFee(gasPrice, gasLimit))
        var totalAmount = converters.sumOfTwoNumber(converters.toTWei(this.state.amountConvert), txFee)
        if (converters.compareTwoNumber(totalAmount, this.props.tokens["ETH"].balance) > 0) {
            err = this.props.translate("error.insufficient_balance") || "Your balance is insufficient for transaction";
        }
        
        this.setState({ err: err })
        
        return err === "" ? true : false
        
    }
    
    async onSubmit() {
        this.props.global.analytics.callTrack("trackClickConvertEth");
        if (this.state.isConfirming) return
        
        if (!this.validateAmount()) return
        
        this.setState({ isConfirming: true, err: "" })
        
        const wallet = this.props.wallet;
        
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
            var nonce = this.props.account.getUsableNonce()
            var gas = this.props.limitOrder.max_gas
            var gasPrice =  converters.toHex(converters.gweiToWei(this.props.limitOrder.gasPrice))
            var keystring = this.props.account.keystring
            var type = this.props.account.type
            var password = ""

            await wallet.broadCastTx(
              "etherToOthersFromAccount", formId, ethereum, address, sourceToken, sourceAmount, destToken,
              destAddress, maxDestAmount, minConversionRate, blockNo, nonce, gas, gasPrice,
              keystring, type, password, '0x0'
            )
            
            this.props.dispatch(accountActions.incManualNonceAccount(this.props.account.address))
            
            this.props.goToNextPath();
        } catch (err) {
            console.log(err)
            this.setState({ err: err.toString(), isConfirming: false })
        }
    }
    
    closeModal = () => {
        if (this.state.isConfirming) return
        this.props.closeModal();
    }
    
    msgHtml = () => {
        if (this.state.isConfirming && this.props.account.type !== 'privateKey') {
            return <div className="modal-message common__slide-up">{this.props.translate("modal.waiting_for_confirmation") || "Waiting for confirmation from your wallet"}</div>
        }
        
        return ""
    }
    
    errorHtml = () => {
        if (this.state.err) {
            return (
              <React.Fragment>
                  <div className='modal-error common__slide-up'>
                      {this.state.err}
                  </div>
              </React.Fragment>
            )
        }
        
        return ""
    };
    
    contentModal = () => {
        const availableWethBalance = converters.roundingNumber(converters.toEther(this.props.availableWethBalance));
        
        return (
          <div className="wrap-eth-modal theme__text">
              <div className="title">{this.props.translate("limit_order.wrap_eth_modal_title") || "Convert ETH to WETH"}</div>
              <div className="x" onClick={this.closeModal}>
                  <img src={require("../../../../assets/img/v3/Close-3.svg")} />
              </div>
              <div className="content with-overlap">
                  <div className="row">
                      <div>
                          
                          <div className="message">
                              <span>{this.props.translate("limit_order.wrap_eth_notify") || "Your order can not be submited because your WETH is not enough, please convert ETH to WETH."}</span>
                          </div>
                          <div className="address-info">
                              <div>
                                  <label className={"theme__text-6"}>{this.props.translate("limit_order.your_address") || "Your address:"}</label>{' '}
                                  <span className={"target-value"}>{this.props.account.address}</span>
                              </div>
                              <div>
                                  <label className={"theme__text-6"}>{this.props.translate("limit_order.your_balance") || "Your balance:"}</label>{' '}
                                  <div className={"target-value balance-info"}>
                                      <div>{converters.roundingNumber(converters.toEther(this.props.tokens["ETH"].balance))} ETH</div>
                                      <div>{availableWethBalance} WETH</div>
                                  </div>
                              </div>
                          </div>
                          
                          <div className="illustration">
                              <div className="source-token token-item">
                                  <div className="token-info theme__background-333">
                                      <img src={getAssetUrl(`tokens/eth.svg`)} />
                                      <span>ETH</span>
                                  </div>
                                  <div className="token-value theme__background-44">
                                      <input
                                        value={this.state.amountConvert}
                                        id="wrap-input" className={"theme__text"}
                                        min="0"
                                        step="0.000001"
                                        placeholder="0"
                                        type={this.props.global.isOnMobile ? "number" : "text"}
                                        maxLength="50" autoComplete="off"
                                        onChange={this.handleChange}
                                      />
                                  </div>
                              </div>
                              
                              <div className="token-connector">
                                  <i className="transfer__arrow"></i>
                              </div>
                              
                              <div className="dest-token token-item">
                                  <div className="token-info theme__background-333">
                                      <img src={getAssetUrl(`tokens/${BLOCKCHAIN_INFO.wrapETHToken.toLowerCase()}.svg`)} />
                                      <span>{BLOCKCHAIN_INFO.wrapETHToken}</span>
                                  </div>
                              </div>
                          </div>
                          
                          {this.errorHtml()}
                          {this.msgHtml()}
                      </div>
                  
                  </div>
              </div>
              <div className="overlap theme__background-2">
                  <div className="input-confirm grid-x input-confirm--approve">
                      <div className={"button process-submit cancel-process"} onClick={this.closeModal}>{this.props.translate("modal.cancel") || "Cancel"}</div>
                      <div className={"button process-submit next"} onClick={this.onSubmit.bind(this)}>{this.props.translate("modal.convert") || "Convert"}</div>
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
            contentLabel="approve token"
            content={this.contentModal()}
            size="medium"
          />
        )
    }
}
