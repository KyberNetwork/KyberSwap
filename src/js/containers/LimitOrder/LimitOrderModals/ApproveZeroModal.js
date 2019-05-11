import React from "react"
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'
import * as limitOrderActions from "../../../actions/limitOrderActions"
import * as accountActions from "../../../actions/accountActions"
import constants from "../../../services/constants"

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

export default class ApproveZeroModal extends React.Component {

    constructor(){
        super()
        this.state = {
            err: ""
        }
    }
    
    async onSubmit(){
        //reset        
        var wallet = getWallet(this.props.account.type)
        var password = ""
        try{
            var txHash = await wallet.broadCastTx("getAppoveTokenZero", this.props.ethereum, this.props.limitOrder.sourceToken, 0, this.props.account.nonce, this.props.limitOrder.max_gas_approve,
            this.props.limitOrder.gasPrice, this.props.account.keystring, password, this.props.account.type, this.props.account.address)     
            
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
        return (
            <div className="approve-modal">
            <div className="title">Approve modal</div>
            <a className="x" onClick={(e) => this.props.closeModal(e)}>&times;</a>
            <div className="content with-overlap">
              <div className="row">
                <div>
                  <div>
                    <div className="message">                 
                        {`You need reset allowance ${this.props.limitOrder.sourceTokenSymbol} of Kyber Swap with this address`}
                    </div>
                    <div class="info tx-title">
                      <div className="address-info">
                        <div>{this.props.translate("modal.address") || "Address"}</div>
                        <div>{this.props.account.address}</div>
                      </div>
                    </div>
                    {/* <FeeDetail 
                      translate={this.props.translate} 
                      gasPrice={this.props.gasPrice} 
                      gas={this.props.gas}
                      isFetchingGas={this.props.isFetchingGas}
                      totalGas={totalGas}
                    /> */}
                  </div>
                  {/* {this.errorHtml()} */}
                  
                  <div className={'modal-error custom-scroll'}>
                        {this.state.err}
                    </div>
    
                </div>
    
              </div>
            </div>
            <div className="overlap">
              <div className="input-confirm grid-x input-confirm--approve">
                <div className="cell medium-8 small-12">{this.msgHtml()}</div>
                  <div className="cell medium-4 small-12">
                    {/* <a className={"button process-submit " + (this.props.isApproving || this.props.isFetchingGas ? "disabled-button" : "next")}
                    onClick={this.props.onSubmit}
                  >{this.props.translate("modal.approve").toLocaleUpperCase() || "Approve".toLocaleUpperCase()}</a> */}
                  <a className={"button process-submit next"}
                    onClick={this.onSubmit}
                  >{this.props.translate("modal.approve").toLocaleUpperCase() || "Approve".toLocaleUpperCase()}</a>
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
            isOpen={this.props.limitOrder.orderPath[this.props.limitOrder.currentPathIndex] === constants.LIMIT_ORDER_CONFIG.orderPath.approveZero}
            onRequestClose={this.closeModal}
            contentLabel="approve modal"
            content={this.contentModal()}
            size="medium"
          />
        )


    }
}
