import React from "react"
import { connect } from "react-redux"
import * as limitOrderActions from "../../actions/limitOrderActions"
import * as utilActions from "../../actions/utilActions"
import * as common from "../../utils/common"
import * as converters from "../../utils/converter"
import { getTranslate } from 'react-localize-redux'
import BLOCKCHAIN_INFO from "../../../../env"
import { ApproveZeroModal, ApproveMaxModal, WrapETHModal, ConfirmModal, SubmitStatusModal, WarningModal } from "./LimitOrderModals"
import { isUserLogin } from "../../utils/common"
import constants from "../../services/constants"
import { Tooltip } from "react-tippy";

@connect((store, props) => {
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
  constructor() {
    super()
    this.state = {
      isAgree: false,
      higherRateOrders: []
    }
  }

  getUserBalance = () => {
    const tokens = this.props.availableBalanceTokens;
    const srcSymbol = this.props.limitOrder.sourceTokenSymbol;
    const token = common.findTokenBySymbol(tokens, srcSymbol);
    return token.balance;
  }

  getSourceAmount = () => {
    var sourceAmount = parseFloat(this.props.limitOrder.sourceAmount)
    if (isNaN(sourceAmount)) {
      return 0
    }
    this.props.limitOrder.listOrder.map(value => {
      if (value.status === constants.LIMIT_ORDER_CONFIG.status.OPEN && value.source === this.props.limitOrder.sourceTokenSymbol && value.address.toLowerCase() === this.props.account.address.toLowerCase()) {
        sourceAmount += parseFloat(value.src_amount);
      }
    })
    var sourceAmountBig = converters.toTWei(sourceAmount, this.props.tokens[this.props.limitOrder.sourceTokenSymbol].decimals)
    return sourceAmountBig.toString()
  }


  calculateETHequivalent = () => {
    if (this.props.limitOrder.sourceTokenSymbol === BLOCKCHAIN_INFO.wrapETHToken){
      return this.props.limitOrder.sourceAmount
    }
    if (this.props.limitOrder.destTokenSymbol === BLOCKCHAIN_INFO.wrapETHToken){
      return this.props.limitOrder.destAmount
    }
    var rateBig = converters.toTWei(this.props.tokens[this.props.limitOrder.sourceTokenSymbol].rate, 18)
    var ethEquivalentValue = converters.calculateDest(this.props.limitOrder.sourceAmount, rateBig, 6)
    ethEquivalentValue = converters.toEther(ethEquivalentValue)
    return ethEquivalentValue
  }

  validateOrder = () => {
    // check source amount is zero
    var sourceAmount = parseFloat(this.props.limitOrder.sourceAmount)
    var isValidate = true
    var sourceAmountError = []
    var rateError = []
    if (this.props.limitOrder.sourceTokenSymbol === this.props.limitOrder.destTokenSymbol) {
      sourceAmountError.push("Source token must be different from dest token")
      isValidate = false
    }
    if (isNaN(sourceAmount)) {
      sourceAmountError.push("Source amount is not number")
      isValidate = false
    }

    //verify min source amount
    if (this.props.tokens[this.props.limitOrder.sourceTokenSymbol].rate == 0) {
      sourceAmountError.push("This pair is under maintenance")
      isValidate = false
    }


    // var rateBig = converters.toTWei(this.props.tokens[this.props.limitOrder.sourceTokenSymbol].rate, 18)
    var ethEquivalentValue = this.calculateETHequivalent()

    if (ethEquivalentValue < constants.LIMIT_ORDER_CONFIG.minSupportOrder && !isNaN(sourceAmount)) {
      sourceAmountError.push(`Amount is too smalll. Limit order only support min ${constants.LIMIT_ORDER_CONFIG.minSupportOrder} ETH equivalent order`)
      isValidate = false
    }

    if (ethEquivalentValue > constants.LIMIT_ORDER_CONFIG.maxSupportOrder && !isNaN(sourceAmount)) {
      sourceAmountError.push(`Amount is too big. Limit order only support max ${constants.LIMIT_ORDER_CONFIG.maxSupportOrder} ETH equivalent order`)
      isValidate = false
    }

    // check rate is zero
    var triggerRate = parseFloat(this.props.limitOrder.triggerRate)
    if (isNaN(triggerRate)) {
      rateError.push("Trigger rate is not number")
      isValidate = false
    }
    // check rate is too big
    var triggerRateBig = converters.roundingRate(this.props.limitOrder.triggerRate)
    var percentChange = converters.percentChange(triggerRateBig, this.props.limitOrder.offeredRate)
    if (percentChange > constants.LIMIT_ORDER_CONFIG.maxPercentTriggerRate && !isNaN(triggerRate)) {
      rateError.push(`Trigger rate is too high, only allow ${constants.LIMIT_ORDER_CONFIG.maxPercentTriggerRate}% greater than the current rate`)
      isValidate = false
    }
    if (percentChange < constants.LIMIT_ORDER_CONFIG.minPercentTriggerRate && !isNaN(triggerRate)) {
      rateError.push(`Trigger rate is too low, please increase trigger rate. Minimum rate is 20% lower than current market rate.`)
      isValidate = false
    }

    //check balance
    var userBalance = this.getUserBalance()
    var srcAmount = this.getSourceAmount()
    if (converters.compareTwoNumber(userBalance, srcAmount) < 0) {
      sourceAmountError.push(`Your balance is insufficent for the order. Please check your ${this.props.limitOrder.sourceTokenSymbol} balance and your pending order`)
      isValidate = false
    }

    if (sourceAmountError.length > 0) {
      this.props.dispatch(limitOrderActions.throwError("sourceAmount", sourceAmountError))
    }
    if (rateError.length > 0) {
      this.props.dispatch(limitOrderActions.throwError("triggerRate", rateError))
    }

    if (!isValidate) {
      return
    }


    //check if he is agreed submit order
    console.log("isAgree")
    console.log(this.state.isAgree)
    if (this.state.isAgree) {
      this.findPathOrder()
      this.setState({ isAgree: false })
      return
    }

    // Filter active orders which have higher rate than current input rate
    const higherRateOrders = this.props.limitOrder.listOrder.filter(item => {
      return item.source === this.props.limitOrder.sourceTokenSymbol &&
            item.dest === this.props.limitOrder.destTokenSymbol &&
            item.address.toLowerCase() === this.props.account.address.toLowerCase() &&
            item.status === constants.LIMIT_ORDER_CONFIG.status.OPEN &&
            converters.compareTwoNumber(this.props.limitOrder.triggerRate, item.min_rate) < 1;
    });

    this.setState({
      higherRateOrders: higherRateOrders
    });

    if (higherRateOrders.length > 0) {
      if (!this.props.limitOrder.errors.rateWarning) {
        this.props.dispatch(limitOrderActions.throwError("rateWarning", "Lower rate"));
      }
    } else {
      if (this.props.limitOrder.errors.rateWarning) {
        this.props.dispatch(limitOrderActions.throwError("rateWarning", ""));
      }
      this.findPathOrder()
    }

  }

  getMaxGasApprove = () => {
    var tokens = this.props.tokens
    var sourceSymbol = this.props.limitOrder.sourceTokenSymbol
    if (tokens[sourceSymbol] && tokens[sourceSymbol].gasApprove) {
      return tokens[sourceSymbol].gasApprove
    } else {
      return this.props.limitOrder.max_gas_approve
    }
  }

  getMaxGasExchange = () => {
    const tokens = this.props.tokens
    var destTokenSymbol = BLOCKCHAIN_INFO.wrapETHToken
    var destTokenLimit = tokens[destTokenSymbol] && tokens[destTokenSymbol].gasLimit ? tokens[destTokenSymbol].gasLimit : this.props.limitOrder.max_gas

    return destTokenLimit;

  }

  getMaxGasLimit = (orderPath) => {
    var gasLimit = 0
    for (var i = 0; i < orderPath.length; i++) {
      switch (orderPath[i]) {
        case constants.LIMIT_ORDER_CONFIG.orderPath.approveZero:
        case constants.LIMIT_ORDER_CONFIG.orderPath.approveMax:
          gasLimit += this.getMaxGasApprove()
          break
        case constants.LIMIT_ORDER_CONFIG.orderPath.wrapETH:
          gasLimit += this.getMaxGasExchange()
          break
      }
    }
    return gasLimit
  }

  validateBalance = (orderPath) => {
    var gasLimit = this.getMaxGasLimit(orderPath)
    var totalFee = converters.calculateGasFee(this.props.limitOrder.gasPrice, gasLimit)
    var totalFeeBig = converters.toTWei(totalFee, 18)
    var ethBalance = this.props.tokens["ETH"].balance

    var compareValue
    if (this.props.limitOrder.sourceTokenSymbol === BLOCKCHAIN_INFO.wrapETHToken) {
      var srcAmount = this.getSourceAmount()
      var wrapETHTokenBalance = this.props.tokens[BLOCKCHAIN_INFO.wrapETHToken].balance
      compareValue = converters.sumOfTwoNumber(totalFeeBig, converters.subOfTwoNumber(srcAmount, wrapETHTokenBalance))
    } else {
      compareValue = totalFeeBig
    }
    return converters.compareTwoNumber(ethBalance, compareValue) < 0 ? false : true
  }

  async findPathOrder() {
    try {
      var orderPath = []
      // var currentPath = constants.LIMIT_ORDER_CONFIG.orderPath.confirmSubmitOrder
      var ethereum = this.props.ethereum
      // check wrapped eth
      var allowance = await ethereum.call("getAllowanceAtLatestBlock", this.props.limitOrder.sourceToken, this.props.account.address, BLOCKCHAIN_INFO.kyberswapAddress)
      if (allowance == 0) {
        orderPath = [constants.LIMIT_ORDER_CONFIG.orderPath.approveMax]
        // currentPath = constants.LIMIT_ORDER_CONFIG.orderPath.approveMax
      }
      if (allowance != 0 && allowance < Math.pow(10, 28)) {
        orderPath = [constants.LIMIT_ORDER_CONFIG.orderPath.approveZero, constants.LIMIT_ORDER_CONFIG.orderPath.approveMax]
        // currentPath = constants.LIMIT_ORDER_CONFIG.orderPath.approveZero
      }

      if (this.props.limitOrder.sourceTokenSymbol === BLOCKCHAIN_INFO.wrapETHToken) {
        var sourceToken = this.getSourceAmount()
        var userBalance = this.props.tokens[this.props.limitOrder.sourceTokenSymbol].balance
        if (converters.compareTwoNumber(userBalance, sourceToken) < 0) {
          orderPath.push(constants.LIMIT_ORDER_CONFIG.orderPath.wrapETH)
        }
      }
      orderPath.push(constants.LIMIT_ORDER_CONFIG.orderPath.confirmSubmitOrder)
      orderPath.push(constants.LIMIT_ORDER_CONFIG.orderPath.submitStatusOrder)

      //check balance eth is enough

      if (this.validateBalance(orderPath)) {
        this.props.dispatch(limitOrderActions.updateOrderPath(orderPath, 0))
      } else {
        console.log("Your eth balance is not enough for transactions")
        var title = this.props.translate("error.error_occurred") || "Error occurred"
        var content = "Your eth balance is not enough for transactions"
        this.props.dispatch(utilActions.openInfoModal(title, content))
      }

    } catch (err) {
      console.log(err)

      var title = this.props.translate("error.error_occurred") || "Error occurred"
      var content = this.props.translate("error.node_error") || "There are some problems with nodes. Please try again in a while."
      this.props.dispatch(utilActions.openInfoModal(title, content))

    }
  }


  submitOrder = () => {
    if (!isUserLogin()) {
      window.location.href = "/users/sign_in"
    }

    if (this.props.account !== false) {
      this.validateOrder()
    }
  }

  agreeSubmit = () => {
    this.setState({ isAgree: true }, () => {
      this.submitOrder()
    })
  }

  getRateWarningTooltip = () => {
    if (!this.props.account) {
      return null;
    }

    const tableComp = this.state.higherRateOrders.map(item => {
      const datetime = common.getFormattedDate(item.status === constants.LIMIT_ORDER_CONFIG.status.OPEN || constants.LIMIT_ORDER_CONFIG.status.IN_PROGRESS ? item.created_time : item.cancel_time);
      const rate = converters.roundingNumber(item.min_rate);
      return (
        <div key={item.id} className="rate-warning-tooltip__order">
          <div>{datetime}</div>
          <div>{`${item.source.toUpperCase()}/${item.dest.toUpperCase()} >= ${rate}`}</div>
        </div>
      );
    });

    return (
      <div className="rate-warning-tooltip">
        {/* Description */}
        <div className="rate-warning-tooltip__description">
          {this.props.translate("limit_order.lower_rate_warning") || "This new order has a lower rate than some orders you have created. Below orders will be cancelled when you submitted this order.s"}
        </div>
        {/* Table */}
        <div className="rate-warning-tooltip__order-container">
          {tableComp}
        </div>
        {/* Buttons */}
        <div className="rate-warning-tooltip__footer">
          <button
						className="btn-cancel"
						onClick={e => this.closeRateWarningTooltip()}
					>
						{this.props.translate("limit_order.change_rate") || "Change Rate"}
					</button>
					<button
						className="btn-confirm"
						onClick={e => this.confirmAgreeSubmit()}
					>
						{this.props.translate("import.yes") || "Yes"}
					</button>
        </div>
      </div>
    );
  }

  closeRateWarningTooltip = () => {
    this.props.dispatch(limitOrderActions.throwError("rateWarning", ""));
  }

  confirmAgreeSubmit = () => {
    this.props.dispatch(limitOrderActions.throwError("rateWarning", ""));
    this.props.dispatch(limitOrderActions.setPendingCancelOrders(this.state.higherRateOrders));
    this.agreeSubmit();
  }

  render() {
    var isDisable = isUserLogin() && this.props.account == false
    var isWaiting = this.props.limitOrder.isSelectToken || this.props.limitOrder.errors.sourceAmount.length > 0 || this.props.limitOrder.errors.triggerRate.length > 0
    return (
      <div className={"limit-order-submit"}>
        {(
          <Tooltip
            open={this.props.limitOrder.errors.rateWarning !== ""}
            position="right"
            interactive={true}
            animateFill={false}
            onRequestClose={() => this.closeRateWarningTooltip()}
            html={this.getRateWarningTooltip()}
          >
            <button className={`accept-button ${isDisable ? "disable" : ""} ${isWaiting ? "waiting" : ""}`} onClick={this.submitOrder}>
              {isUserLogin() ? "Submit" : "Login to Submit Order"}
            </button>
          </Tooltip>
        )}
       
        <div>
          {this.props.limitOrder.orderPath[this.props.limitOrder.currentPathIndex] === constants.LIMIT_ORDER_CONFIG.orderPath.approveZero && <ApproveZeroModal getMaxGasApprove={this.getMaxGasApprove.bind(this)} />}
          {this.props.limitOrder.orderPath[this.props.limitOrder.currentPathIndex] === constants.LIMIT_ORDER_CONFIG.orderPath.approveMax && <ApproveMaxModal getMaxGasApprove={this.getMaxGasApprove.bind(this)} />}
          {this.props.limitOrder.orderPath[this.props.limitOrder.currentPathIndex] === constants.LIMIT_ORDER_CONFIG.orderPath.wrapETH && <WrapETHModal getOpenOrderAmount={this.props.getOpenOrderAmount} />}
          {this.props.limitOrder.orderPath[this.props.limitOrder.currentPathIndex] === constants.LIMIT_ORDER_CONFIG.orderPath.confirmSubmitOrder && <ConfirmModal />}
          {this.props.limitOrder.orderPath[this.props.limitOrder.currentPathIndex] === constants.LIMIT_ORDER_CONFIG.orderPath.submitStatusOrder && <SubmitStatusModal />}
        </div>
      </div>
    )
  }
}
