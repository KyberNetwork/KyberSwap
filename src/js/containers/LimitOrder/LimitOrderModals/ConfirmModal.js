import React from "react"
import { Modal } from "../../../components/CommonElement"
import ReactTooltip from 'react-tooltip';
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'
import * as limitOrderActions from "../../../actions/limitOrderActions"
import * as accountActions from "../../../actions/accountActions"
import constants from "../../../services/constants"

import {getWallet} from "../../../services/keys"

import {getNonce, submitOrder, getFee} from "../../../services/limit_order"
import * as converters from "../../../utils/converter"
import BLOCKCHAIN_INFO from "../../../../../env"

@connect((store, props) => {
    const account = store.account.account
    const translate = getTranslate(store.locale)
    const tokens = store.tokens.tokens
    const limitOrder = store.limitOrder
    const ethereum = store.connection.ethereum
    const global = store.global;

    return {
        translate, limitOrder, tokens, account, ethereum, global
    }
})

export default class ConfirmModal extends React.Component {

    constructor(){
        super()
        this.state = {
            err: "",
            isConfirming: false,
            isFetchFee : true,
            isFinish: false,
            fee : constants.LIMIT_ORDER_CONFIG.maxFee
        }
        this.onSubmit = this.onSubmit.bind(this);
    }
    
    componentDidMount = () => {
      this.fetchFee()
    }

    async fetchFee(){
      var userAddr = this.props.account.address
      var src = this.props.tokens[this.props.limitOrder.sourceTokenSymbol].address
      var dest = this.props.tokens[this.props.limitOrder.destTokenSymbol].address
      var srcAmount = this.props.limitOrder.sourceAmount
      var destAmount = this.props.limitOrder.destAmount
      try{
        var fee = await getFee(userAddr, src, dest, srcAmount, destAmount)        
        this.setState({isFetchFee : false, fee: fee})
      }catch(err){
        console.log(err)
        this.setState({isFetchFee : false})
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
            console.log(concatTokenAddresses)
            var nonceContract = await ethereum.call("getLimitOrderNonce", this.props.account.address, concatTokenAddresses)
            nonceContract  = converters.sumOfTwoNumber(nonceContract, 1)
            nonceContract = converters.toHex(nonceContract)
            //get minimum nonce
            var minNonce = converters.calculateMinNonce(BLOCKCHAIN_INFO.kyberswapAddress)
            
            var validNonce = converters.findMaxNumber([nonceServer, nonceContract, minNonce])
            return validNonce
        }catch(err){
            console.log(err)
            throw err         
        }
    }

    async onSubmit(){
        if(this.state.isFetchFee) return
        //reset        
        var wallet = getWallet(this.props.account.type)
        var password = "";
        this.setState({
          isConfirming: true,
          err: ""
        });

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

            
            var feeInPrecision = this.state.fee
            feeInPrecision = converters.toTWei(feeInPrecision, 4)
            feeInPrecision = converters.toHex(feeInPrecision)

            var signData = await ethereum.call("getMessageHash", user, nonce, srcToken, srcQty, destToken, destAddress, minConversionRate, feeInPrecision)
            console.log(signData)
            
            var signature = await wallet.signSignature(signData, this.props.account)     

            
            var pramameters = await ethereum.call("getSignatureParameters", signature)
            
            console.log(signature)
            console.log(signData)
            console.log(pramameters)
            console.log({user, nonce, srcToken, srcQty, destToken, destAddress, minConversionRate, feeInPrecision})
            
            
            var newOrder = await submitOrder({  
                address: this.props.account.address,
                nonce: nonce,
                source: this.props.limitOrder.sourceTokenSymbol,
                dest: this.props.limitOrder.destTokenSymbol,
                src_amount: parseFloat(this.props.limitOrder.sourceAmount),
                min_rate: this.props.limitOrder.triggerRate,
                fee: this.props.limitOrder.orderFee,
                signature: signature
            });

            newOrder.id = this.props.limitOrder.listOrder.length + 1;

            //save new order
            this.props.dispatch(limitOrderActions.addNewOrder(newOrder))            

            //go to the next step
            // this.props.dispatch(limitOrderActions.forwardOrderPath())
            this.setState({
              isFinish: true,
              isConfirming: false
            });
        }catch(err){
            console.log(err.message);
            this.setState({
              err: err.toString(),
              isConfirming: false,
              isFinish: false
            })
        }
    }

  
    closeModal = () => {
      if (this.state.isConfirming) return;
      this.props.dispatch(limitOrderActions.resetOrderPath())
    }

    msgHtml = () => {
      if (this.state.isConfirming && this.props.account.type !== 'privateKey') {
          return <div className="limit-order-modal__result--pending">
          {this.props.translate("modal.waiting_for_confirmation") || "Waiting for confirmation from your wallet"}
        </div>
      } else {
          return ""
      }
  }

    getFeeInfoTooltip = () => {
      let calculateFee = (this.props.limitOrder.orderFee * this.props.limitOrder.sourceAmount) / 100;
      calculateFee = converters.roundingNumber(calculateFee);
      const sourceAmount = converters.roundingNumber(this.props.limitOrder.sourceAmount)

      return `
      <div>
        <div className="title">
          ${`Fee ${calculateFee} ${this.props.limitOrder.sourceTokenSymbol} (${this.props.limitOrder.orderFee}% of ${sourceAmount} ${this.props.limitOrder.sourceTokenSymbol})`}
        </div>
        <div className="description">
          ${this.props.translate("limit_order.fee_info_message") || "Don’t worry. You will not be charged now. You pay fees only when transaction is executed (broadcasted & mined)."}
        </div>
      <div>
      `
    }

    getFeeInfoComponent = () => {
      return (
        <React.Fragment>
          <span data-tip data-for="fee-info" data-scroll-hide="false">
            <img src={require("../../../../assets/img/v3/info_grey.svg")} />
          </span>
          <ReactTooltip globalEventOff="click" html={true} place="right" type="light" id="fee-info" className="limit-order-modal__fee--info">
            {this.getFeeInfoTooltip()}
          </ReactTooltip>
        </React.Fragment>
      );
    }

    contentModal = () => {
      let calculateFee = (this.props.limitOrder.orderFee * this.props.limitOrder.sourceAmount) / 100;
      // calculateFee = converters.displayNumberWithDot(calculateFee);

      const receiveAmount = (this.props.limitOrder.sourceAmount - (this.props.limitOrder.orderFee * this.props.limitOrder.sourceAmount) / 100) * this.props.limitOrder.triggerRate
      return (
          <div className="limit-order-modal">
            <div className="limit-order-modal__body">
              <div className="limit-order-modal__title">
                {this.props.translate("modal.order_confirm") ||
                  "Order Confirm"}
              </div>
              <div className="limit-order-modal__close" onClick={e => this.closeModal()}>
                <div className="limit-order-modal__close-wrapper"></div>
              </div>
              <div className="limit-order-modal__content">
                <div className="limit-order-modal__message limit-order-modal__message--text-small">
                  {this.props.translate("limit_order.confirm_order_message", {
                    srcToken: this.props.limitOrder.sourceTokenSymbol,
                    destToken: this.props.limitOrder.destTokenSymbol,
                    rate: this.props.limitOrder.triggerRate
                  }) || 
                    `Your transaction will be broadcasted when rate of ${this.props.limitOrder.sourceTokenSymbol}/${this.props.limitOrder.destTokenSymbol} >= ${this.props.limitOrder.triggerRate}`
                  }
                </div>
                <div className="limit-order-modal__amount">
                  <div className="limit-order-modal__pair">
                    <div className="amount">
                      <div className="amount-item amount-left">                         
                        <div className={"rc-label"}>{this.props.translate("transaction.exchange_from") || "From"}</div>
                        <div className={"rc-info"}>
                          <div title={this.props.limitOrder.sourceAmount}>
                            {this.props.limitOrder.sourceAmount}
                          </div>
                          <div>
                            {this.props.limitOrder.sourceTokenSymbol}
                          </div>  
                        </div>
                      </div>
                      <div className="space space--padding"><img src={require("../../../../assets/img/exchange/arrow-right-orange.svg")} /></div>
                      <div className="amount-item amount-right">
                        <div className={"rc-label"}>{this.props.translate("transaction.exchange_to") || "To"}</div>
                        <div className={"rc-info"}>
                          <div title={this.props.limitOrder.destAmount}>
                            {this.props.limitOrder.snapshot.isFetchingRate ? <img src={require('../../../../assets/img/waiting-white.svg')} /> : this.props.limitOrder.destAmount}
                          </div>
                          <div>
                            {this.props.limitOrder.destTokenSymbol}
                          </div>
                        </div> 
                      </div>
                    </div>
                  </div>
                  <div className="limit-order-modal__fee">
                    <div className="limit-order-modal__fee--title">
                      <div>
                        {this.props.translate("limit_order.fee") || "Fee"}
                      </div>
                      {!this.props.global.isOnMobile && this.getFeeInfoComponent()}
                    </div>
                    <div className="limit-order-modal__fee--amount">
                      <div title={calculateFee}>
                        {converters.displayNumberWithDot(calculateFee)}
                      </div>
                      <div>
                        {this.props.limitOrder.sourceTokenSymbol}
                      </div>
                      {this.props.global.isOnMobile && this.getFeeInfoComponent()}
                    </div>
                  </div>
                </div>
                <div className="limit-order-modal__result">
                  <span>You will receive</span>{' '}
                  <span title={receiveAmount}>{`${converters.displayNumberWithDot(receiveAmount)} ${this.props.limitOrder.destTokenSymbol}`}</span>
                </div>

                  {this.msgHtml()}
                {this.state.err && <div className="limit-order-modal__result--error">
                  {this.state.err}
                </div>}

              </div>
            </div>

            {!this.state.isFinish && <div className="limit-order-modal__footer">
              <button
                className={`btn-cancel ${(this.state.isConfirming || this.state.isFetchFee) ? "btn--disabled" : ""}`}
                onClick={e => this.closeModal()}
              >
                {this.props.translate("modal.cancel") || "Cancel"}
              </button>
              <button className={`btn-confirm ${(this.state.isConfirming || this.state.isFetchFee) ? "btn--disabled" : ""}`}
                onClick={e => this.onSubmit()}>{this.props.translate("modal.confirm") || "Confirm"}</button>
            </div>}

            {this.state.isFinish && <div className="limit-order-modal__success-msg">
              <img src={require("../../../../assets/img/limit-order/checkmark_green.svg")}/>
              <span>Success</span>
            </div>}
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
