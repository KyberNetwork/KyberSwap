import React from "react"
import { Modal } from "../../../components/CommonElement"
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'
import * as limitOrderActions from "../../../actions/limitOrderActions"
import constants from "../../../services/constants"
import {getWallet} from "../../../services/keys"
import limitOrderServices from "../../../services/limit_order";
import * as converters from "../../../utils/converter"
import BLOCKCHAIN_INFO from "../../../../../env"
import { OrderTableInfo } from "../../../components/CommonElement";
import createOrderObject from "../../../utils/convert_object";
import OrderDetails from "../MobileElements/OrderDetails";

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
  constructor(props) {
    super(props);
    
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

  async fetchFee() {
    var userAddr = this.props.account.address
    var src = this.props.tokens[this.props.limitOrder.sourceTokenSymbol].address
    var dest = this.props.tokens[this.props.limitOrder.destTokenSymbol].address
    var srcAmount = this.props.sourceAmount
    var destAmount = this.props.destAmount
    
    try {
      var { fee } = await limitOrderServices.getFee(userAddr, src, dest, srcAmount, destAmount)
      this.setState({isFetchFee : false, fee: fee})
    } catch(err) {
      console.log(err)
      this.setState({
        isFetchFee : false,
        feeErr: err.toString()
      })
    }
  }

  async getUserNonce(){
    try{
      var ethereum = this.props.ethereum
      var nonceServer = await limitOrderServices.getNonce(this.props.account.address, this.props.limitOrder.sourceTokenSymbol, this.props.limitOrder.destTokenSymbol)
      var concatTokenAddresses = converters.concatTokenAddresses(this.props.limitOrder.sourceToken, this.props.limitOrder.destToken)
      var nonceContract = await ethereum.call("getLimitOrderNonce", this.props.account.address, concatTokenAddresses)
      const biggerContractNonce = converters.calculateContractNonce(nonceContract, BLOCKCHAIN_INFO.kyberswapAddress);
      var minNonce = converters.calculateMinNonce(BLOCKCHAIN_INFO.kyberswapAddress)
      var validNonce = converters.findMaxNumber([nonceServer, biggerContractNonce, minNonce])
      return validNonce
    } catch(err) {
      console.log(err)
      throw err
    }
  }

  async onSubmit(){
    this.props.global.analytics.callTrack("trackClickConfirmSubmitOrder");
    if(this.state.isFetchFee) return

    var wallet = getWallet(this.props.account.type)

    this.setState({
      isConfirming: true,
      err: ""
    });

    try {
      const ethereum = this.props.ethereum;
      
      const nonce = await this.getUserNonce();
      
      const isBuyForm = this.props.formType === 'buy';
      const srcTokenAddr = isBuyForm ? this.props.limitOrder.destToken : this.props.limitOrder.sourceToken;
      const destTokenAddr = isBuyForm ? this.props.limitOrder.sourceToken : this.props.limitOrder.destToken;
      const srcSymbol = isBuyForm ? this.props.limitOrder.sourceTokenSymbol : this.props.limitOrder.destTokenSymbol;
      const srcQty = converters.toHex(converters.toTWei(this.props.sourceAmount, this.props.tokens[srcSymbol].decimals));
      const destAddress = this.props.account.address.toLowerCase();
      const minConversionRate = converters.toHex(converters.toTWei(this.props.triggerRate, 18));
      const feeInPrecision = converters.toHex(converters.toTWei(this.state.fee, 6));

      const signData = await ethereum.call("getMessageHash", destAddress, nonce, srcTokenAddr.toLowerCase(), srcQty, destTokenAddr, destAddress, minConversionRate, feeInPrecision);
      const signature = await wallet.signSignature(signData, this.props.account);
      
      console.log({
        user_address: this.props.account.address.toLowerCase(),
        nonce: nonce,
        src_token: srcTokenAddr,
        dest_token: destTokenAddr,
        src_amount: srcQty,
        min_rate: minConversionRate,
        dest_address: this.props.account.address,
        fee: feeInPrecision,
        signature: signature,
        side_trade: this.props.formType
      })
      console.log('==============');
      
      const newOrder = await limitOrderServices.submitOrder({
        user_address: this.props.account.address.toLowerCase(),
        nonce: nonce,
        src_token: srcTokenAddr,
        dest_token: destTokenAddr,
        src_amount: srcQty,
        min_rate: minConversionRate,
        dest_address: this.props.account.address,
        fee: feeInPrecision,
        signature: signature,
        side_trade: this.props.formType
      });

      if (this.props.limitOrder.filterMode === "client") {
        this.props.dispatch(limitOrderActions.addNewOrder(newOrder));
        this.props.dispatch(limitOrderActions.updateOpenOrderStatus());
      } else {
        this.props.dispatch(limitOrderActions.getOrdersByFilter({}));
        this.props.dispatch(limitOrderActions.getPendingBalances(this.props.account.address));
      }

      this.props.dispatch(limitOrderActions.getListFilter());
      this.props.dispatch(limitOrderActions.setAgreeForceSubmit(false));

      this.setState({
        isFinish: true,
        isConfirming: false
      });
    }catch(err){
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
    this.props.closeModal();
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

  contentModal = () => {
    const isBuyForm = this.props.formType === "buy";
    const srcTokenSymbol = this.props.limitOrder.sourceTokenSymbol === BLOCKCHAIN_INFO.wrapETHToken ? 'ETH*' : this.props.limitOrder.sourceTokenSymbol;
    const destTokenSymbol = this.props.limitOrder.destTokenSymbol === BLOCKCHAIN_INFO.wrapETHToken ? 'ETH*' : this.props.limitOrder.destTokenSymbol;
    const triggerRate = this.props.triggerRate;
    const formattedTriggerRate = converters.displayNumberWithDot(triggerRate, 9);
    const compareBaseRateWithQuoteRate = isBuyForm ? '<=' : '>=';
    const orderObject = createOrderObject(
      this.props.limitOrder,
      this.props.account.address,
      this.props.formType,
      this.props.triggerRate,
      this.props.sourceAmount
    );

    return (
      <div className={`limit-order-modal ${this.props.global.isOnMobile ? 'limit-order-modal--mobile' : ''}`}>
          <div className="limit-order-modal__body theme__text">
          <div className="limit-order-modal__title">
            {this.props.translate("modal.order_confirm", { sideTrade: this.props.formType, symbol: srcTokenSymbol })}
          </div>
          <div className="limit-order-modal__close" onClick={this.closeModal}>
            <div className="limit-order-modal__close-wrapper"/>
          </div>
          <div className="limit-order-modal__content">
            <div className="limit-order-modal__message limit-order-modal__message--text-small">
              {this.props.translate("limit_order.confirm_order_message", {
                base: srcTokenSymbol,
                quote: destTokenSymbol,
                rawRate: triggerRate,
                rate: formattedTriggerRate,
                compare: compareBaseRateWithQuoteRate
              })}
            </div>

            {!this.props.global.isOnMobile && (
              <OrderTableInfo
                listOrder={[orderObject]}
                translate={this.props.translate}
              />
            )}

            {this.props.global.isOnMobile && (
              <OrderDetails
                order={orderObject}
                isModal={true}
                translate={this.props.translate}
              />
            )}

            {this.msgHtml()}

            {this.state.feeErr.length > 0 && (
              <div className="limit-order-modal__result--error">
                {this.props.translate("limit_order.fetch_fee_err") || "Cannot get fee."}
              </div>
            )}
          </div>
        </div>

        {(!this.state.isFinish && !this.state.err) &&
          <div className="limit-order-modal__footer theme__background-2">
            <button
              className={`btn-cancel ${(this.state.isConfirming || this.state.isFetchFee) ? "btn--disabled" : ""}`}
              onClick={this.closeModal}
            >
              {this.props.translate("modal.cancel") || "Cancel"}
            </button>
            <button
              className={`btn-confirm ${(this.state.isConfirming || this.state.isFetchFee || this.state.feeErr.length > 0) ? "btn--disabled" : ""}`}
              onClick={this.onSubmit}
            >
              {this.props.translate("modal.confirm") || "Confirm"}
            </button>
          </div>
        }

        {this.state.isFinish &&
          <div className="limit-order-modal__msg limit-order-modal__msg--success theme__background-8">
            <div className={"limit-order-modal__text"}>
              <div className={"limit-order-modal__text--success"}>
                <img src={require("../../../../assets/img/limit-order/checkmark_green.svg")}/>
                <span>{this.props.translate("modal.success") || "Success"}</span>
              </div>
              <div className={"limit-order-modal__button limit-order-modal__button--success"} onClick={this.closeModal}>
                {this.props.translate("done") || "Done"}
              </div>
            </div>
          </div>
        }

        {this.state.err &&
          <div className="limit-order-modal__msg limit-order-modal__msg--failed theme__background-9">
            <div className={"limit-order-modal__text limit-order-modal__text--failed"}>
              <div className={"limit-order-modal__left-content"}>
                <img src={require("../../../../assets/img/limit-order/error.svg")}/>
                <div>
                  <div>{this.props.translate("error_text") || "Error"}</div>
                  <div>{this.state.err}</div>
                </div>
              </div>
              <div className={"limit-order-modal__button limit-order-modal__button--failed"} onClick={this.closeModal}>
                {this.props.translate("ok") || "OK"}
              </div>
            </div>
          </div>
        }
      </div>
    )
  }

  render() {
    return (
      <Modal
        className={{
          base: 'reveal x-medium confirm-modal',
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
