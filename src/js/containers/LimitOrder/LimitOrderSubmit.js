import React from "react"
import { connect } from "react-redux"
import * as limitOrderActions from "../../actions/limitOrderActions"
import * as utilActions from "../../actions/utilActions"
import * as common from "../../utils/common"
import * as converters from "../../utils/converter"
import { getTranslate } from 'react-localize-redux'
import BLOCKCHAIN_INFO from "../../../../env"
import { ApproveZeroModal, ApproveMaxModal, WrapETHModal, ConfirmModal } from "./LimitOrderModals"
import { isUserLogin } from "../../utils/common"
import constants from "../../services/constants"
import limitOrderServices from "../../services/limit_order";

@connect((store) => {
  const account = store.account.account
  const translate = getTranslate(store.locale)
  const tokens = store.tokens.tokens
  const limitOrder = store.limitOrder
  const ethereum = store.connection.ethereum

  return {
    translate, limitOrder, tokens, account, ethereum,
    global: store.global
  }
})
export default class LimitOrderSubmit extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      orderPath: [],
      currentPath: 0,
      isValidating: false
    }
  }

  getUserBalance = () => {
    const token = common.findTokenBySymbol(this.props.availableBalanceTokens, this.props.sourceToken.symbol);
    return token.balance;
  };

  getSourceAmount = () => {
    if (this.props.sourceAmount === "NaN") return 0;
    
    const sourceAmountBig = converters.toTWei(this.props.sourceAmount, this.props.tokens[this.props.sourceToken.symbol].decimals);
    
    return sourceAmountBig.toString()
  };

  calculateETHEquivalent = () => {
    if (this.props.baseSymbol === 'WETH') {
      return this.props.isBuyForm ? this.props.destAmount : this.props.sourceAmount;
    } else if (this.props.quoteSymbol === 'WETH') {
      return this.props.isBuyForm ? this.props.sourceAmount : this.props.destAmount;
    }

    const rateBig = converters.toTWei(this.props.tokens[this.props.sourceToken.symbol].rate, 18);

    return converters.toEther(converters.calculateDest(this.props.sourceAmount, rateBig, 6));
  };
  
  updateValidatingStatus = (isValidating) => {
    this.setState({ isValidating })
  };

  async validateOrder() {
    const sourceAmount = parseFloat(this.props.sourceAmount);
    const isBuyForm = this.props.isBuyForm;
    const { isAgreeForceSubmit, errors } = this.props.limitOrder;
    const { baseSymbol, sourceToken, destToken } = this.props;
    const displaySrcSymbol = sourceToken.symbol === 'WETH' ? constants.WETH_SUBSTITUTE_NAME : sourceToken.symbol;
    let isValidate = true;
    let amountErrors = [];
    let priceErrors = [];

    if (!isUserLogin()) {
      if (window.kyberBus) {
        window.kyberBus.broadcast('open.signin.modal')
      } else {
        const errorMessage = this.props.translate("error.login_to_submit_order") || "You must login to KyberSwap account to submit limit orders";
        this.props.addPriceErrors([errorMessage]);
      }

      this.updateValidatingStatus(false);
      return;
    }
    
    if (!this.props.account) {
      const errorMessage = this.props.translate("error.import_to_submit_order") || "You must import your wallet to submit limit orders";
      this.props.addPriceErrors([errorMessage]);
      this.updateValidatingStatus(false);
      return;
    }
  
    if (errors.rateSystem || this.props.global.eligibleError) {
      isValidate = false
    }
    
    if (isNaN(sourceAmount)) {
      amountErrors.push(this.props.translate("error.source_amount_is_not_number") || "Entered amount is invalid");
      isValidate = false
    }

    //verify min source amount
    if (!+this.props.tokens[baseSymbol].rate) {
      priceErrors.push(this.props.translate("error.kyber_maintain") || "This token pair is temporarily under maintenance");
      isValidate = false
    }

    const ethEquivalentValue = this.calculateETHEquivalent();

    if (ethEquivalentValue < BLOCKCHAIN_INFO.limitOrder.minSupportOrder && !isNaN(sourceAmount)) {
      amountErrors.push(this.props.translate("error.amount_too_small", { minAmount: BLOCKCHAIN_INFO.limitOrder.minSupportOrder} ) ||`Amount is too small. Limit order only support min ${constants.LIMIT_ORDER_CONFIG.minSupportOrder} ETH equivalent order`);
      isValidate = false
    }

    const rawTriggerRate = this.props.triggerRate;
    const triggerRate = isBuyForm ? converters.divOfTwoNumber(1, rawTriggerRate) : rawTriggerRate;
    const triggerRateFloat = parseFloat(triggerRate)
    
    if (isNaN(triggerRateFloat)) {
      priceErrors.push(this.props.translate("error.rate_is_not_number") || "Trigger rate is not a number")
      isValidate = false
    }
    
    const initialOfferedRate = isBuyForm ? this.props.limitOrder.buyRate : this.props.limitOrder.sellRate;
    
    // check rate is too big
    if (initialOfferedRate) {
      const offeredRate = converters.toT(initialOfferedRate);
      const formattedOfferedRate = isBuyForm ? converters.divOfTwoNumber(1, offeredRate) : offeredRate;
      const percentChange = converters.percentChange(rawTriggerRate, formattedOfferedRate);
      const maxPercentTriggerRate = BLOCKCHAIN_INFO.limitOrder.maxPercentTriggerRate;
      const minPercentBuyTriggerRate = BLOCKCHAIN_INFO.limitOrder.maxPercentTriggerRate / 10;

      if (isBuyForm && percentChange < minPercentBuyTriggerRate * -1) {
        priceErrors.push(this.props.translate("error.rate_too_low", { minRate: minPercentBuyTriggerRate }) || `Trigger rate is too low, only allow ${minPercentBuyTriggerRate}% less than the current rate`);
        isValidate = false
      }

      if (!isBuyForm && percentChange > maxPercentTriggerRate) {
        priceErrors.push(this.props.translate("error.rate_too_high", { maxRate: maxPercentTriggerRate } ) || `Trigger rate is too high, only allow ${constants.LIMIT_ORDER_CONFIG.maxPercentTriggerRate}% greater than the current rate`);
        isValidate = false
      }
    }
   
    //check balance
    var userBalance = this.getUserBalance()
    var srcAmount = this.getSourceAmount()

    if (converters.compareTwoNumber(userBalance, srcAmount) < 0) {
      amountErrors.push(this.props.translate("error.insufficient_balance_order", { tokenSymbol: displaySrcSymbol }) ||`Your balance is insufficient for the order. Please check your ${displaySrcSymbol} balance and your pending orders`)
      isValidate = false
    }

    if (amountErrors.length > 0) {
      this.props.addAmountErrors(amountErrors);
    }

    if (priceErrors.length > 0) {
      this.props.addPriceErrors(priceErrors);
    }

    if (!isValidate) {
      this.updateValidatingStatus(false);
      return;
    } else {
      this.props.clearErrors();
    }

    try {
      const eligibleAccount = await limitOrderServices.getEligibleAccount(this.props.account.address);

      if (eligibleAccount) {
        const errorTitle = this.props.translate("error.error_occurred") || "Error occurred"
        const errorContent = this.props.translate("limit_order.ineligible_address", { account: eligibleAccount }) || `This address has been used by ${eligibleAccount}. Please place order with other address.`;

        this.props.dispatch(utilActions.openInfoModal(errorTitle, errorContent));
        this.updateValidatingStatus(false);

        return;
      }
    } catch (err) {
      const errorTitle = this.props.translate("error.error_occurred") || "Error occurred"
      const errorContent = err.message;

      this.props.dispatch(utilActions.openInfoModal(errorTitle, errorContent));
      this.updateValidatingStatus(false);

      return;
    }

    // If user agree force submit order
    if (isAgreeForceSubmit && rawTriggerRate === this.props.limitOrder.forceSubmitRate) {
      await this.findPathOrder();
      this.updateValidatingStatus(false);
      return;
    }

    // Filter active orders which have higher rate than current input rate
    let higherRateOrders = [];

    if (this.props.limitOrder.filterMode === "client") {
      higherRateOrders = this.props.limitOrder.listOrder.filter(item => {
        const isSamePair = sourceToken.symbol === item.source && destToken.symbol === item.dest;
        
        if (isSamePair) {
          const formattedRate = this.props.isBuyForm ? converters.formatNumberByPrecision(triggerRate, 18) : triggerRate;
          const rateComparison = converters.compareTwoNumber(item.min_rate, formattedRate) > 0;
          
          return item.user_address.toLowerCase() === this.props.account.address.toLowerCase() &&
                item.status === constants.LIMIT_ORDER_CONFIG.status.OPEN && rateComparison;
        } 
        
        return false;
      });
    } else {
      higherRateOrders = await limitOrderServices.getRelatedOrders(
        this.props.sourceToken.address,
        this.props.destToken.address,
        triggerRate,
        this.props.account.address
      );
    }
    
    if (higherRateOrders.length > 0) {
      this.props.dispatch(limitOrderActions.setRelatedOrders(higherRateOrders));
  
      this.props.toggleCancelOrderModal(true);
  
      /**
       * Check if current user input rate is smaller than previous saved force submit rate
       * If smaller, user have to confirm force submit again.
       */
      if (triggerRate !== this.props.limitOrder.forceSubmitRate) {
        this.props.dispatch(limitOrderActions.setAgreeForceSubmit(false));
      }
    } else {
      await this.findPathOrder()
    }

    this.updateValidatingStatus(false);
  }

  getMaxGasApprove = () => {
    const tokens = this.props.tokens;
    const baseSymbol = this.props.baseSymbol;
    
    if (tokens[baseSymbol] && tokens[baseSymbol].gasApprove) {
      return tokens[baseSymbol].gasApprove
    } else {
      return this.props.limitOrder.max_gas_approve
    }
  };

  getMaxGasExchange = () => {
    const tokens = this.props.tokens;
    const WTHToken = BLOCKCHAIN_INFO.wrapETHToken;
    
    return tokens[WTHToken] && tokens[WTHToken].gasLimit ? tokens[WTHToken].gasLimit : this.props.limitOrder.max_gas;
  };

  getMaxGasLimit = (orderPath) => {
    let gasLimit = 0;
    
    for (let i = 0; i < orderPath.length; i++) {
      switch (orderPath[i]) {
        case constants.LIMIT_ORDER_CONFIG.orderPath.approveZero:
        case constants.LIMIT_ORDER_CONFIG.orderPath.approveMax:
          gasLimit += this.getMaxGasApprove();
          break;
        case constants.LIMIT_ORDER_CONFIG.orderPath.wrapETH:
          gasLimit += this.getMaxGasExchange();
          break;
      }
    }
    
    return gasLimit
  };

  validateBalance = (orderPath) => {
    const ethBalance = this.props.tokens["ETH"].balance;
    const gasLimit = this.getMaxGasLimit(orderPath);
    let totalFee = converters.totalFee(this.props.limitOrder.gasPrice, gasLimit);
  
    if (this.props.quoteSymbol === 'WETH' && this.props.isBuyForm) {
      const srcAmount = this.getSourceAmount();
      const wrapETHTokenBalance = this.props.tokens['WETH'].balance;

      totalFee = converters.sumOfTwoNumber(totalFee, converters.subOfTwoNumber(srcAmount, wrapETHTokenBalance));
    }
    
    return converters.compareTwoNumber(ethBalance, totalFee) >= 0;
  };

  async findPathOrder() {
    try {
      var orderPath = [];
      var ethereum = this.props.ethereum
      var allowance = await ethereum.call("getAllowanceAtLatestBlock", this.props.sourceToken.address, this.props.account.address, BLOCKCHAIN_INFO.kyberswapAddress)

      const { limit_order_tx_approve_zero, limit_order_tx_approve_max } = this.props.tokens[this.props.baseSymbol];

      if (allowance == 0 && !limit_order_tx_approve_max) {
        orderPath.push(constants.LIMIT_ORDER_CONFIG.orderPath.approveMax);
      } else if (allowance != 0 && allowance < Math.pow(10,28)) {
        if (!limit_order_tx_approve_zero) {
          orderPath.push(constants.LIMIT_ORDER_CONFIG.orderPath.approveZero, constants.LIMIT_ORDER_CONFIG.orderPath.approveMax);
        } else if (limit_order_tx_approve_zero && !limit_order_tx_approve_max) {
          orderPath.push(constants.LIMIT_ORDER_CONFIG.orderPath.approveMax);
        }
      }
  
      if (this.props.sourceToken.symbol === 'WETH') {
        const sourceAmount = this.getSourceAmount();
        const WETHBalance = this.getAvailableWethBalance();

        if (converters.compareTwoNumber(WETHBalance, sourceAmount) < 0) {
          orderPath.push(constants.LIMIT_ORDER_CONFIG.orderPath.wrapETH);
        }
      }
  
      orderPath.push(constants.LIMIT_ORDER_CONFIG.orderPath.confirmSubmitOrder);
      
      if (this.validateBalance(orderPath)) {
        this.setState({
          orderPath: orderPath,
          currentPath: orderPath[0]
        });
      } else {
        const message = this.props.translate("error.eth_balance_not_enough_for_fee") || "Your ETH balance is not enough to pay for transaction fees";
        this.props.addAmountErrors([message]);
      }
    } catch (err) {
      console.log(err)
      const title = this.props.translate("error.error_occurred") || "Error occurred"
      const content = this.props.translate("error.node_error") || "There are some problems with nodes. Please try again in a while."
      this.props.dispatch(utilActions.openInfoModal(title, content))
    }
  }

  submitOrder = () => {
    const isWalletImported = this.props.account;
    const isPromoCode = isWalletImported && this.props.account.type === "promo";
    
    this.updateValidatingStatus(true);
    
    if (isPromoCode) {
      const title = this.props.translate("error.error_occurred") || "Error occurred";
      const content = this.props.translate("limit_order.not_support_promo_code" || "You cannot submit order with promo code. Please use other wallets.");
      this.props.dispatch(utilActions.openInfoModal(title, content));
      this.updateValidatingStatus(false);
      return;
    }

    this.validateOrder()
  };

  getAvailableWethBalance = () => {
    const wethOpenOrderAmount = this.props.getOpenOrderAmount(BLOCKCHAIN_INFO.wrapETHToken, 18);
    return converters.subOfTwoNumber(this.props.tokens[BLOCKCHAIN_INFO.wrapETHToken].balance, wethOpenOrderAmount);
  };
  
  closePathModal = () => {
    this.setState({
      orderPath: [],
      currentPath: 0
    });
  };
  
  goToNextPath = () => {
    let orderPath = this.state.orderPath;
    
    orderPath.shift();
    
    this.setState({
      orderPath: orderPath,
      currentPath: orderPath[0]
    });
  };

  render() {
    const isButtonDisabled = this.props.limitOrder.isSelectToken || this.state.isValidating;

    return (
      <div className={"limit-order-submit"}>
        <div
          className={`disabled limit-order-submit__accept-button common__button common__button--${this.props.isBuyForm ? 'green' : 'red'} ${isButtonDisabled ? 'disabled' : ''}`}
          // onClick={this.submitOrder}
        >
          {this.state.isValidating && (
            <div>Loading...</div>
          )}
  
          {!this.state.isValidating && (
            this.props.marketText
          )}
        </div>
       
        <div>
          {this.state.currentPath === constants.LIMIT_ORDER_CONFIG.orderPath.approveZero && (
            <ApproveZeroModal
              sourceToken={this.props.sourceToken}
              getMaxGasApprove={this.getMaxGasApprove.bind(this)}
              goToNextPath={this.goToNextPath}
              closeModal={this.closePathModal}
            />
          )}
          {this.state.currentPath === constants.LIMIT_ORDER_CONFIG.orderPath.approveMax && (
            <ApproveMaxModal
              sourceToken={this.props.sourceToken}
              getMaxGasApprove={this.getMaxGasApprove.bind(this)}
              goToNextPath={this.goToNextPath}
              closeModal={this.closePathModal}
            />
          )}
          {this.state.currentPath === constants.LIMIT_ORDER_CONFIG.orderPath.wrapETH && (
            <WrapETHModal
              sourceToken={this.props.sourceToken}
              destToken={this.props.destToken}
              sourceAmount={this.props.sourceAmount}
              availableWethBalance={this.getAvailableWethBalance()}
              goToNextPath={this.goToNextPath}
              closeModal={this.closePathModal}
            />
          )}
          {this.state.currentPath === constants.LIMIT_ORDER_CONFIG.orderPath.confirmSubmitOrder && (
            <ConfirmModal
              sourceToken={this.props.sourceToken}
              destToken={this.props.destToken}
              isBuyForm={this.props.isBuyForm}
              triggerRate={this.props.triggerRate}
              sourceAmount={this.props.sourceAmount}
              destAmount={this.props.destAmount}
              closeModal={this.closePathModal}
            />
          )}
        </div>
      </div>
    )
  }
}
