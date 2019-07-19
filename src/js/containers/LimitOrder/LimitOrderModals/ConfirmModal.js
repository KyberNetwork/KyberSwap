import React from "react"
import { Modal } from "../../../components/CommonElement"
import ReactTooltip from 'react-tooltip';
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'
import * as limitOrderActions from "../../../actions/limitOrderActions"
import * as accountActions from "../../../actions/accountActions"
import constants from "../../../services/constants"

import {getWallet} from "../../../services/keys"

import limitOrderServices from "../../../services/limit_order";
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
        translate, limitOrder, tokens, account, ethereum, global, isOnDAPP: store.account.isOnDAPP
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
            fee : constants.LIMIT_ORDER_CONFIG.maxFee,
            feeErr: ""
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
        var { fee } = await limitOrderServices.getFee(userAddr, src, dest, srcAmount, destAmount)        
        this.setState({isFetchFee : false, fee: fee})
      }catch(err){
        console.log(err)
        this.setState({
          isFetchFee : false,
          feeErr: err.toString()
        })
      }
    }

    async getUserNonce(){
        //user nonce from server
        try{
            var ethereum = this.props.ethereum
            //nonce from server
            var nonceServer = await limitOrderServices.getNonce(this.props.account.address, this.props.limitOrder.sourceTokenSymbol, this.props.limitOrder.destTokenSymbol)

            // nonce from contract
            var concatTokenAddresses = converters.concatTokenAddresses(this.props.limitOrder.sourceToken, this.props.limitOrder.destToken)
            console.log(concatTokenAddresses)
            var nonceContract = await ethereum.call("getLimitOrderNonce", this.props.account.address, concatTokenAddresses)
            // nonceContract = converters.sumOfTwoNumber(nonceContract, 1)
            // nonceContract = converters.toHex(nonceContract)

            const biggerContractNonce = converters.calculateContractNonce(nonceContract, BLOCKCHAIN_INFO.kyberswapAddress);

            //get minimum nonce
            var minNonce = converters.calculateMinNonce(BLOCKCHAIN_INFO.kyberswapAddress)
            
            var validNonce = converters.findMaxNumber([nonceServer, biggerContractNonce, minNonce])
            return validNonce
        }catch(err){
            console.log(err)
            throw err         
        }
    }

    async onSubmit(){
        this.props.global.analytics.callTrack("trackClickConfirmSubmitOrder");
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
            // nonce = converters.toHex(nonce)

            var srcToken = this.props.limitOrder.sourceToken.toLowerCase()

            var srcQty = converters.toTWei(this.props.limitOrder.sourceAmount, this.props.tokens[this.props.limitOrder.sourceTokenSymbol].decimals)
            srcQty = converters.toHex(srcQty)

            var destToken = this.props.limitOrder.destToken.toLowerCase()
            var destAddress = this.props.account.address.toLowerCase()
            var minConversionRate = converters.toTWei(this.props.limitOrder.triggerRate, 18)
            minConversionRate = converters.toHex(minConversionRate)

            
            var feeInPrecision = this.state.fee
            feeInPrecision = converters.toTWei(feeInPrecision, 6)
            feeInPrecision = converters.toHex(feeInPrecision)

            var signData = await ethereum.call("getMessageHash", user, nonce, srcToken, srcQty, destToken, destAddress, minConversionRate, feeInPrecision)
            // console.log("limit_order_sg")
            // console.log("---Sign Data---")
            // console.log(signData)
            
            var signature = await wallet.signSignature(signData, this.props.account)     
            // console.log("---SIGNATURE---")
            // console.log(signature)
            
            // var pramameters = await ethereum.call("getSignatureParameters", signature)
            
            // console.log("limit_order")
            // console.log(signature)
            // console.log(signData)
            // console.log("v, r, s")
            // console.log(pramameters)
            // console.log({user, nonce, srcToken, srcQty, destToken, destAddress, minConversionRate, feeInPrecision})
            
            var newOrder = await limitOrderServices.submitOrder({  
                user_address: this.props.account.address.toLowerCase(),
                nonce: nonce,
                src_token: this.props.limitOrder.sourceToken,
                dest_token: this.props.limitOrder.destToken,
                src_amount: srcQty,
                min_rate: minConversionRate,
                dest_address: this.props.account.address,
                fee: feeInPrecision,
                signature: signature
            });

            // newOrder.id = this.props.limitOrder.listOrder.length + 1;
            if (this.props.limitOrder.filterMode === "client") {
              this.props.dispatch(limitOrderActions.addNewOrder(newOrder));
              this.props.dispatch(limitOrderActions.updateOpenOrderStatus());
            } else {
              this.props.dispatch(limitOrderActions.getOrdersByFilter({}));
              this.props.dispatch(limitOrderActions.getPendingBalances(this.props.account.address));
            }

            this.props.dispatch(limitOrderActions.getListFilter());

            // Reset user agreement
            this.props.dispatch(limitOrderActions.setAgreeForceSubmit(false));

            //go to the next step
            // this.props.dispatch(limitOrderActions.forwardOrderPath())
            this.setState({
              isFinish: true,
              isConfirming: false
            });
        }catch(err){
            // console.log(err.message);
            console.log(err)
            var showErr = "Cannot submit order"
            if (err.signature && err.signature.length === 1 && err.signature[0] === "Signature is invalid" 
              && this.props.account.type === "metamask" && !this.props.isOnDAPP){
                showErr = "Signature is invalid. There is a possibility that you have signed the message with a Hardware wallet plugged in Metamask. Please try to import a Hardware Wallet to KyberSwap and resubmit the order."
            }

            if (err.signature && err.signature.length === 1 && err.signature[0] === "Signature is invalid" 
              && this.props.account.type === "metamask" && this.props.isOnDAPP){
                showErr = "Couldn't validate your signature. Your wallet might not be supported yet."
            }

            this.setState({
              err: showErr,
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

    getFeeInfoTooltip = (calculateFee) => {
      calculateFee = converters.roundingNumber(calculateFee);
      const sourceAmount = converters.roundingNumber(this.props.limitOrder.sourceAmount)

      return `
      <div>
        <div className="title">
          ${`${this.props.translate("limit_order.fee") || "Fee"} ${calculateFee} ${this.props.limitOrder.sourceTokenSymbol} (${this.state.fee}% of ${sourceAmount} ${this.props.limitOrder.sourceTokenSymbol})`}
        </div>
        <div className="description">
          ${this.props.translate("limit_order.fee_info_message") || "Don’t worry. You will not be charged now. You pay fees only when transaction is executed (broadcasted & mined)."}
        </div>
      <div>
      `
    }

    getFeeInfoComponent = (calculateFee) => {
      return (
        <React.Fragment>
          <span data-tip data-for="fee-info" data-scroll-hide="false">
            <img src={require("../../../../assets/img/v3/info_grey.svg")} />
          </span>
          <ReactTooltip globalEventOff="click" event="click mouseenter mouseleave" html={true} place={`top`} type="light" id="fee-info" className="limit-order-modal__fee--info">
            {this.getFeeInfoTooltip(calculateFee)}
          </ReactTooltip>
        </React.Fragment>
      );
    }

    contentModal = () => {
      const calculateFee = converters.multiplyOfTwoNumber(this.state.fee, this.props.limitOrder.sourceAmount);
      const formatedFee = converters.formatNumber(calculateFee, 5, '');
      const formatedSrcAmount = converters.formatNumber(this.props.limitOrder.sourceAmount, 5, '');
      const receiveAmount = converters.multiplyOfTwoNumber(converters.subOfTwoNumber(this.props.limitOrder.sourceAmount, calculateFee), this.props.limitOrder.triggerRate);

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
                    rate: converters.roundingRateNumber(this.props.limitOrder.triggerRate)
                  }) || 
                    `Your transaction will be broadcasted when rate of ${this.props.limitOrder.sourceTokenSymbol}/${this.props.limitOrder.destTokenSymbol} >= ${converters.roundingRateNumber(this.props.limitOrder.triggerRate)}`
                  }
                </div>
                <div className="limit-order-modal__pair">
                  <div className="amount">
                    <div className="amount-item amount-left">                         
                      <div className={"rc-label"}>{this.props.translate("transaction.exchange_from") || "From"}</div>
                      <div className={"rc-info"}>
                        <div title={this.props.limitOrder.sourceAmount}>
                          {formatedSrcAmount}
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
                        <div title={receiveAmount}>
                          {this.props.limitOrder.snapshot.isFetchingRate ? <img src={require('../../../../assets/img/waiting-white.svg')} /> : converters.formatNumber(receiveAmount, 5)}
                        </div>
                        <div>
                          {this.props.limitOrder.destTokenSymbol}
                        </div>
                      </div> 
                      <div className="amount--calc">
                        <span title={receiveAmount}>{`(${formatedSrcAmount} - ${formatedFee}) ${this.props.limitOrder.sourceTokenSymbol} * ${converters.roundingRateNumber(this.props.limitOrder.triggerRate)} = ${converters.formatNumber(receiveAmount, 5)} ${this.props.limitOrder.destTokenSymbol}`}</span>
                      </div>
                    </div>
                  </div>
                </div>
                  
                <div className="limit-order-modal__fee">
                  <div className="limit-order-modal__fee--title">
                    <div>
                      {this.props.translate("limit_order.fee") || "Fee"}
                    </div>
                    {!this.props.global.isOnMobile && this.getFeeInfoComponent(calculateFee)}
                  </div>
                  <div className="limit-order-modal__fee--amount">
                    <div title={calculateFee}>
                      {formatedFee}
                    </div>
                    <div>
                      {this.props.limitOrder.sourceTokenSymbol}
                    </div>
                    {this.props.global.isOnMobile && this.getFeeInfoComponent(calculateFee)}
                  </div>
                </div>
                {/* <div className="limit-order-modal__result">
                  <span>{this.props.translate("limit_order.you_will_receive") || "You will receive"}</span>{' '}
                  <span title={receiveAmount}>{`${converters.displayNumberWithDot(receiveAmount)} ${this.props.limitOrder.destTokenSymbol}`}</span>
                </div> */}

                  {this.msgHtml()}
                {this.state.err && <div className="limit-order-modal__result--error">
                  {this.state.err}
                </div>}

                {this.state.feeErr.length > 0 && <div className="limit-order-modal__result--error">
                  {this.props.translate("limit_order.fetch_fee_err") || "Cannot get fee."}
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
              <button className={`btn-confirm ${(this.state.isConfirming || this.state.isFetchFee || this.state.feeErr.length > 0) ? "btn--disabled" : ""}`}
                onClick={e => this.onSubmit()}>{this.props.translate("modal.confirm") || "Confirm"}</button>
            </div>}

            {this.state.isFinish && <div className="limit-order-modal__success-msg">
              <div className={"limit-order-modal__success-text"}>
                <img src={require("../../../../assets/img/limit-order/checkmark_green.svg")}/>
                <span>{this.props.translate("modal.success") || "Success"}</span>
              </div>
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
