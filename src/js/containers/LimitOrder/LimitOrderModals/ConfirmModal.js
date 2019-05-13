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
            var nonceContract = await ethereum.call("getLimitOrderNonce", this.props.account.address, concatTokenAddresses)
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
            var user = this.props.account.address.toLowerCase()
            var nonce = await this.getUserNonce()
            nonce = converters.toHex(nonce)
            var srcToken = this.props.limitOrder.sourceToken.toLowerCase()

            var srcQty = converters.toTWei(this.props.limitOrder.sourceAmount, this.props.tokens[this.props.limitOrder.sourceTokenSymbol].decimals)
            srcQty = converters.toHex(srcQty)

            var destToken = this.props.limitOrder.destToken.toLowerCase()
            var destAddress = this.props.account.address.toLowerCase()
            var minConversionRate = converters.toTWei(this.props.limitOrder.triggerRate, 18)
            minConversionRate = converters.toHex(minConversionRate)

            
            var feeInPrecision = this.props.limitOrder.orderFee * this.props.limitOrder.sourceAmount / 100
            feeInPrecision = converters.toTWei(feeInPrecision)
            feeInPrecision = converters.toHex(feeInPrecision)
            

            var signData = await ethereum.call("keccak256", user, nonce, srcToken, srcQty, destToken, destAddress, minConversionRate, feeInPrecision)
            console.log(signData)
            var signature = await wallet.signSignature(signData, this.props.account)     
            
            //submit to server
            var newOrder = await submitOrder({  
                address: this.props.account.address,
                nonce: nonce,
                source: this.props.limitOrder.sourceTokenSymbol,
                dest: this.props.limitOrder.destTokenSymbol,
                src_amount: this.props.limitOrder.sourceAmount,
                min_rate: this.props.limitOrder.triggerRate,
                fee: this.props.limitOrder.orderFee,
                signature: signature
            })

            //save new order
            this.props.dispatch(limitOrderActions.addNewOrder(newOrder))

            //increase account nonce 
            // this.props.dispatch(accountActions.incManualNonceAccount(this.props.account.address))

            //go to the next step
            this.props.dispatch(limitOrderActions.forwardOrderPath())
        }catch(err){
            console.log(err)
            this.setState({err: err.toString()})
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
                  <a className={"button process-submit next"} onClick={this.onSubmit.bind(this)}>Confirm</a>
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
            contentLabel="Confirm modal"
            content={this.contentModal()}
            size="medium"
          />
        )


    }
}
