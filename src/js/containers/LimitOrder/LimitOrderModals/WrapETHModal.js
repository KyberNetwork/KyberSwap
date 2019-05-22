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

@connect((store, props) => {
    const account = store.account.account
    const translate = getTranslate(store.locale)
    const tokens = store.tokens.tokens
    const limitOrder = store.limitOrder
    const ethereum = store.connection.ethereum

    return {
        translate, limitOrder, tokens, account, ethereum

    }
})

export default class WrapETHModal extends React.Component {

    constructor(){
        super()
        this.state = {
            err: ""
        }
    }

    getAmountWrapETH = () =>{
        var srcToken = this.props.tokens[this.props.limitOrder.sourceTokenSymbol]
        var balance = srcToken.balance
        var srcAmount = converters.toTWei(this.props.limitOrder.sourceAmount, srcToken.decimals)
        var wrapAmount = converters.subOfTwoNumber(srcAmount,balance)
        return wrapAmount  
    }

      
    
    async onSubmit(){
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

            var txHash = wallet.broadCastTx("etherToOthersFromAccount", formId, ethereum, address, sourceToken,
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
            this.setState({err: err})
        }
    }


    closeModal = () => {
        this.props.dispatch(limitOrderActions.resetOrderPath())
    }

    contentModal = () => {
        var wrapAmount = this.getAmountWrapETH()
        wrapAmount = converters.roundingNumber(converters.toT(wrapAmount, this.props.tokens[this.props.limitOrder.sourceTokenSymbol].decimals))
        return (
            <div className="wrap-eth-modal">
            <div className="title">Convert ETH to WETH</div>
            <a className="x" onClick={this.closeModal}>&times;</a>
            <div className="content with-overlap">
              <div className="row">
                <div>

                    <div className="message">                 
                        Your order can not be submited because your WETH is not enough, please convert ETH to WETH.
                    </div>    
                    <div className="address-info">
                        <div>
                            <label>Your address: </label>
                            <span>{this.props.account.address}</span>
                        </div>
                        <div>
                            <label>Your balance: </label>
                            <span>{converters.roundingNumber(converters.toEther(this.props.tokens["ETH"].balance))} ETH</span>
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
                    
                    {this.state.err && (
                        <div className={'modal-error custom-scroll'}>
                            {this.state.err}
                        </div>
                    )}
                  
    
                </div>
    
              </div>
            </div>
            <div className="overlap">
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
