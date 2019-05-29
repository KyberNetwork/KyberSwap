import React from "react"
import { Modal } from "../../../components/CommonElement"

import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'
import * as limitOrderActions from "../../../actions/limitOrderActions"
import * as accountActions from "../../../actions/accountActions"
import constants from "../../../services/constants"
import * as converters from "../../../utils/converter"

import BLOCKCHAIN_INFO from "../../../../../env"

import {getAssetUrl} from "../../../utils/common"

import {getWallet} from "../../../services/keys"
import ReactTooltip from 'react-tooltip'

@connect((store, props) => {
    const account = store.account.account
    const translate = getTranslate(store.locale)
    const tokens = store.tokens.tokens
    const limitOrder = store.limitOrder
    const ethereum = store.connection.ethereum
    const exchange = store.exchange

    return {
        translate, limitOrder, tokens, account, ethereum, exchange

    }
})

export default class WrapETHModal extends React.Component {

    constructor(){
        super()
        this.state = {
            err: "",
            isConfirming: false,
            isError: true
        }
    }

    componentDidMount = () => {
        //verify cap
        var maxCap = this.props.account.maxCap
        if (maxCap !== "infinity") {
          maxCap = converters.toEther(maxCap)
        }else{
            this.setState({isError: false})
            return
        }
        var convertedEth = this.getAmountWrapETH()

        if (converters.compareTwoNumber(convertedEth, maxCap) === 1){
            this.setState({err: `Converted amount is over your cap - ${maxCap} ETH`, isError: true})
        }else{
            this.setState({isError: false})
        }
    }

    getAmountWrapETH = () =>{
        var srcToken = this.props.tokens[this.props.limitOrder.sourceTokenSymbol];
        var balance = this.getAvailableWethBalance();
        var srcAmount = converters.toTWei(this.props.limitOrder.sourceAmount, srcToken.decimals)
        var wrapAmount = converters.subOfTwoNumber(srcAmount, balance)
        return wrapAmount
    }

    async onSubmit(){
        if (this.state.isError) return
        if (this.state.isConfirming) return

        this.setState({isConfirming: true, err: ""})
        //reset
        var wallet = getWallet(this.props.account.type)
        
        try{
            var formId = "limit_order"
            var ethereum = this.props.ethereum
            var address = this.props.account.address
            var sourceToken = this.props.tokens["ETH"].address
            var sourceAmount = converters.toHex( this.getAmountWrapETH() )
            var destToken = this.props.tokens[BLOCKCHAIN_INFO.wrapETHToken].address
            var destAddress = this.props.account.address
            var maxDestAmount = converters.toHex( this.getAmountWrapETH() )
            var minConversionRate = converters.toHex(Math.pow(10,18))
            var blockNo = constants.EXCHANGE_CONFIG.COMMISSION_ADDR
            var nonce = this.props.account.nonce
            var gas = this.props.limitOrder.max_gas
            var gasPrice = this.props.limitOrder.gasPrice
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
        }catch(err){
            console.log(err)
            this.setState({err: err, isConfirming: false})
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

      getAvailableWethBalance = () => {
        const wethOpenOrderAmount = this.props.getOpenOrderAmount('ETH', 18);
        return this.props.tokens[BLOCKCHAIN_INFO.wrapETHToken].balance - wethOpenOrderAmount;
      }

    contentModal = () => {
        var wrapAmount = this.getAmountWrapETH()
        wrapAmount = converters.roundingNumber(converters.toT(wrapAmount, this.props.tokens[this.props.limitOrder.sourceTokenSymbol].decimals))
        const availableWethBalance = converters.roundingNumber(converters.toEther(this.getAvailableWethBalance()));

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
                        <img src={require("../../../../assets/img/v3/info_grey.svg")}/>
                      </span>
                      <ReactTooltip class={"weth-modal-tooltip"} id="weth-tooltip" effect="solid" type="dark"/>
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
                            <div className="token-value">{wrapAmount}</div>
                        </div>

                        <div className="token-connector">
                            <i className="k k-transfer k-3x"></i>
                        </div>

                        <div  className="dest-token token-item">
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
                  <a className={"button process-submit cancel-process"} onClick={this.closeModal}>Cancel</a>
                  <a className={"button process-submit next"} onClick={this.onSubmit.bind(this)}>Convert</a>
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
                contentLabel="approve modal"
                content={this.contentModal()}
                size="medium"
              />
        )


    }
}
