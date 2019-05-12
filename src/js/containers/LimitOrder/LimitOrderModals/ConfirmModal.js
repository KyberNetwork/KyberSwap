import React from "react"
import { Modal } from "../../../components/CommonElement"

import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'
import * as limitOrderActions from "../../../actions/limitOrderActions"
import * as accountActions from "../../../actions/accountActions"
import constants from "../../../services/constants"

import {getWallet} from "../../../services/keys"

import {getNonce, submitOrder} from "../../../services/limit_order"
import * as converters from "../../../utils/converter"

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

export default class ConfirmModal extends React.Component {

    constructor(){
        super()
        this.state = {
            err: ""
        }
    }
    
    async getUserNonce(){
        //user nonce from server
        try{
            var ethereum = this.props.ethereum
            //nonce from server
            var nonceServer = await getNonce(this.props.account.address, this.props.limitOrder.sourceTokenSymbol, this.props.limitOrder.destTokenSymbol)

            // nonce from contract
            var concatTokenAddresses = converters.concatTokenAddresses(this.props.limitOrder.sourceToken, this.props.limitOrder.destToken)
            var nonceContract = ethereum.call("getLimitOrderNonce", this.props.account.address, concatTokenAddresses)
            return nonceContract > nonceServer ? nonceContract: nonceServer           
        }catch(err){
            console.log(err)
            throw err         
        }
    }

    async onSubmit(){
        //reset        
        var wallet = getWallet(this.props.account.type)
        var password = ""

        try{
            //get user nonce
            var ethereum = this.props.ethereum
            var user = this.props.account.address
            var nonce = await this.getUserNonce()
            var srcToken = this.props.limitOrder.sourceToken
            var srcQty = converters.toTWei(this.props.limitOrder.sourceAmount, this.props.tokens[this.props.limitOrder.sourceTokenSymbol].decimals)
            var destToken = this.props.limitOrder.destToken
            var destAddress = this.props.account.address
            var minConversionRate = converters.toTWei(this.props.triggerRate, 18)
            var feeInPrecision = this.props.limitOrder.orderFee * this.props.limitOrder.sourceAmount / 100
            feeInPrecision = converters.toTWei(feeInPrecision)

            var signData = ethereum.call("getKeccak256", user, nonce, srcToken, srcQty, destToken, destAddress, minConversionRate, feeInPrecision)
            var signature = await wallet.signSignature(signData, this.props.account)     
            
            //submit to server
            var newOrder = await submitOrder({  
                "address": this.props.account.address,
                "nonce": nonce,
                "source": this.props.sourceTokenSymbol,
                "dest": this.props.destTokenSymbol,
                "src_amount": this.props.sourceAmount,
                "min_rate": this.props.triggerRate,
                "fee": this.props.limitOrder.orderFee,

            })

            //save new order
            this.props.dispatch(limitOrderActions.addNewOrder(newOrder))

            //increase account nonce 
            // this.props.dispatch(accountActions.incManualNonceAccount(this.props.account.address))

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
        return (
            <div className="order-confirm-modal">
            <div className="title">Order Confirm</div>
            <a className="x" onClick={(e) => this.props.closeModal(e)}>&times;</a>
            <div className="content with-overlap">
              <div className="row">
                <div>
                  <div>
                    <div className="message">                 
                        Your transaction will be broadcasted when rate of {this.props.limitOrder.sourceTokenSymbol}/{this.props.limitOrder.destTokenSymbol} >= {this.props.limitOrder.triggerRate}
                    </div>
                  </div>                  
                  
                  <div className={'modal-error custom-scroll'}>
                        {this.state.err}
                    </div>
    
                </div>
    
              </div>
            </div>
            <div className="overlap">
              <div className="input-confirm grid-x input-confirm--approve">                
                  <div className="cell medium-4 small-12">
                  <a className={"button process-submit next"} onClick={this.onSubmit}>Confirm</a>
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
            isOpen={this.props.limitOrder.orderPath[this.props.limitOrder.currentPathIndex] === constants.LIMIT_ORDER_CONFIG.orderPath.confirmSubmitOrder}
            onRequestClose={this.closeModal}
            contentLabel="Confirm modal"
            content={this.contentModal()}
            size="medium"
          />
        )


    }
}
