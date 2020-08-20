import React from "react"
import { Modal } from "../../../components/CommonElement"
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'
import * as limitOrderActions from "../../../actions/limitOrderActions"
import constants from "../../../services/constants"
import limitOrderServices from "../../../services/limit_order";
import * as converters from "../../../utils/converter"
import BLOCKCHAIN_INFO from "../../../../../env"
import { OrderTableInfo } from "../../../components/CommonElement";
import createOrderObject from "../../../utils/convert_object";

@connect((store, props) => {
  const account = store.account.account
  const wallet = store.account.wallet
  const translate = getTranslate(store.locale)
  const tokens = store.tokens.tokens
  const limitOrder = store.limitOrder
  const ethereum = store.connection.ethereum
  const global = store.global;
  const formType = props.isBuyForm ? 'buy' : 'sell';
  const convertedTriggerRate = props.isBuyForm ? converters.divOfTwoNumber(1, props.triggerRate) : props.triggerRate;

  return {
    translate, limitOrder, tokens, account, ethereum, global,
    isOnDAPP: store.account.isOnDAPP, formType, convertedTriggerRate, wallet
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
    };
    
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount = () => {
    this.fetchFee()
  };

  async fetchFee() {
    var userAddr = this.props.account.address
    var src = this.props.sourceToken.address
    var dest = this.props.destToken.address
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
      var nonceServer = await limitOrderServices.getNonce(this.props.account.address, this.props.sourceToken.symbol, this.props.destToken.symbol)
      var concatTokenAddresses = converters.concatTokenAddresses(this.props.sourceToken.address, this.props.destToken.address)
      var nonceContract = await ethereum.call("getLimitOrderNonce", this.props.account.address, concatTokenAddresses)
      const biggerContractNonce = converters.calculateContractNonce(nonceContract, BLOCKCHAIN_INFO.kyberswapAddress);
      const minNonce = converters.calculateMinNonce(BLOCKCHAIN_INFO.kyberswapAddress);
      
      return converters.findMaxNumber([nonceServer, biggerContractNonce, minNonce])
    } catch(err) {
      console.log(err)
      throw err
    }
  }

  async onSubmit(){
    this.props.global.analytics.callTrack("trackClickConfirmSubmitOrder");
    if(this.state.isFetchFee) return

    const wallet = this.props.wallet;

    this.setState({
      isConfirming: true,
      err: ""
    });

    try {
      const ethereum = this.props.ethereum;
      const nonce = await this.getUserNonce();
      const srcTokenAddr = this.props.sourceToken.address;
      const destTokenAddr = this.props.destToken.address;
      const srcSymbol = this.props.sourceToken.symbol;
      const sourceAmount = converters.toHex(converters.toTWei(this.props.sourceAmount, this.props.tokens[srcSymbol].decimals));
      const destAddress = this.props.account.address.toLowerCase();
      const minConversionRate = converters.toHex(converters.toTWei(this.props.convertedTriggerRate, 18));
      const feeInPrecision = converters.toHex(converters.toTWei(this.state.fee, 6));

      const signData = await ethereum.call("getMessageHash", destAddress, nonce, srcTokenAddr.toLowerCase(), sourceAmount, destTokenAddr, destAddress, minConversionRate, feeInPrecision);
      const signature = await wallet.signSignature(signData, this.props.account);
      
      const newOrder = await limitOrderServices.submitOrder({
        user_address: this.props.account.address.toLowerCase(),
        nonce: nonce,
        src_token: srcTokenAddr,
        dest_token: destTokenAddr,
        src_amount: sourceAmount,
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
    const isBuyForm = this.props.isBuyForm;
    const displaySrcSymbol = this.props.sourceToken.symbol === BLOCKCHAIN_INFO.wrapETHToken ? 'ETH*' : this.props.sourceToken.symbol;
    const displayDestSymbol = this.props.destToken.symbol === BLOCKCHAIN_INFO.wrapETHToken ? 'ETH*' : this.props.destToken.symbol;
    const displayBaseSymbol = isBuyForm ? displayDestSymbol : displaySrcSymbol;
    const displayQuoteSymbol = isBuyForm ? displaySrcSymbol : displayDestSymbol;
    const formattedTriggerRate = converters.displayNumberWithDot(this.props.triggerRate, 9);
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
            {this.props.translate("modal.order_confirm", { sideTrade: this.props.formType, symbol: displayBaseSymbol })}
          </div>
          <div className="limit-order-modal__close" onClick={this.closeModal}>
            <div className="limit-order-modal__close-wrapper"/>
          </div>
          <div className="limit-order-modal__content">
            <div className="limit-order-modal__message limit-order-modal__message--text-small">
              {this.props.translate("limit_order.confirm_order_message", {
                base: displayBaseSymbol,
                quote: displayQuoteSymbol,
                rawRate: this.props.triggerRate,
                rate: formattedTriggerRate,
                compare: compareBaseRateWithQuoteRate
              })}
            </div>

            <OrderTableInfo
              listOrder={[orderObject]}
              translate={this.props.translate}
            />

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
