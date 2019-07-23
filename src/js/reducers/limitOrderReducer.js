import { REHYDRATE } from 'redux-persist/lib/constants'
import constants from "../services/constants"
import * as converter from "../utils/converter"
import BLOCKCHAIN_INFO from "../../../env"


var initState = constants.INIT_LIMIT_ORDER_STATE
initState.snapshot = constants.INIT_LIMIT_ORDER_STATE

const limitOrder = (state = initState, action) => {
  var newState = { ...state, errors: { ...state.errors } }
  switch (action.type) {
    // case "LIMIT_ORDER.SELECT_TOKEN_ASYNC": {
    //   newState.isSelectToken = true
    //   return newState
    // }

    case "LIMIT_ORDER.SELECT_TOKEN": {

      var {sourceTokenSymbol, sourceToken, destTokenSymbol, destToken, type} = action.payload
      newState.sourceTokenSymbol = sourceTokenSymbol
      newState.sourceToken = sourceToken
      newState.destTokenSymbol = destTokenSymbol
      newState.destToken = destToken

      var errors = newState.errors
      errors.sourceAmount = []
      errors.triggerRate = []
      newState.errors = errors

      newState.selected = true
      newState.isEditRate = false
      return newState
    }

    case "LIMIT_ORDER.INPUT_CHANGE": {
      const {focus, value} = action.payload     
      switch(focus) {
        case "source":
          newState.sourceAmount = value
          var errors = newState.errors
          errors.sourceAmount = []
          newState.errors = errors
          var bigRate = converter.roundingRate(state.triggerRate)
          newState.destAmount = converter.caculateDestAmount(value, bigRate)
          break
        case "dest":
          newState.destAmount = value
          var errors = newState.errors
          errors.triggerRate = []
          newState.errors = errors
          newState.sourceAmount = converter.caculateSourceAmount(value, state.offeredRate);
          break
        case "rate": 
          newState.triggerRate = value
          var errors = newState.errors
          errors.triggerRate = []
          newState.errors = errors
          var bigRate = converter.roundingRate(value)
          newState.destAmount = converter.caculateDestAmount(state.sourceAmount, bigRate)  
          break
      }
      return newState
    }
    case "LIMIT_ORDER.FOCUS_INPUT": {
      newState.inputFocus = action.payload;
      return newState;
    }
    case "LIMIT_ORDER.UPDATE_RATE_COMPLETE": {
      const { rateInit, expectedPrice, slippagePrice, blockNo, isManual, type, errMsg } = action.payload

  
      if (expectedPrice == "0") {
        newState.errors.rateSystem = errMsg;
        // if (rateInit == "0" || rateInit == 0 || rateInit === undefined || rateInit === null) {
        //   newState.errors.rateSystem = "This token pair is temporarily under maintenance"
        // } else {
        //   newState.errors.rateSystem = "Kyber cannot handle your amount at the moment, please reduce your amount"
        // }
      } else {
        newState.errors.rateSystem = ""
      }
      

      var slippageRate = slippagePrice == "0" ? converter.estimateSlippagerate(rateInit, 18) : converter.toT(slippagePrice, 18)
      var expectedRate = expectedPrice == "0" ? rateInit : expectedPrice

      newState.slippageRate = slippageRate
      newState.offeredRate = expectedRate
      newState.blockNo = blockNo

      if(type === constants.LIMIT_ORDER_CONFIG.updateRateType.selectToken){
        newState.triggerRate = converter.roundingRateNumber(converter.toT(expectedRate, 18)).replace(/,/g, "");
        newState.destAmount = converter.caculateDestAmount(newState.sourceAmount, expectedRate, 4)  
      }

      newState.isSelectToken = false
      return newState
    }

    case "LIMIT_ORDER.UPDATE_RATE_PENDING": {
      const isManual = action.payload.isManual
      if (isManual) {
        newState.isSelectToken = true
      }
      return newState
    }
    case "LIMIT_ORDER.SET_IS_SELECT_TOKEN_BALANCE": {
      newState.isSelectTokenBalance = action.payload;
      return newState;
    }
    case "LIMIT_ORDER.FETCH_FEE": {
      newState.isFetchingFee = action.payload.shouldLoading;
      return newState
    }
    case "LIMIT_ORDER.FETCH_FEE_COMPLETE":{
      const {fee, feeAfterDiscount, discountPercentage, err} = action.payload

      newState.orderFee = fee
      newState.orderFeeAfterDiscount = feeAfterDiscount
      newState.orderFeeDiscountPercentage = discountPercentage
      newState.orderFeeErr = err ? err : ""
      newState.isFetchingFee = false

      return newState
    }

    case "LIMIT_ORDER.THROW_ERROR":{
      const { key, msg } = action.payload
      var errors = newState.errors
      errors[key] = msg
      newState.errors = errors
      return newState
    }
    case "LIMIT_ORDER.UPDATE_ORDER_PATH":{
      const {orderPath, currentPathIndex} = action.payload
      newState.orderPath = orderPath
      newState.currentPathIndex = currentPathIndex
      return newState
    }
    case "LIMIT_ORDER.RESET_ORDER_PATH":{
      newState.currentPathIndex = -1
      return newState
    }
    case "LIMIT_ORDER.FORWARD_ORDER_PATH":{
      newState.currentPathIndex += 1
      return newState
    }
    case "LIMIT_ORDER.ADD_LIST_ORDER": {
      const listOrder = action.payload;
      newState.listOrder = listOrder;
      return newState;
    }
    case "LIMIT_ORDER.ADD_NEW_ORDER":{
      const {order} = action.payload
      var listOrder = newState.listOrder
      listOrder.unshift(order)
      newState.listOrder = listOrder
      return newState
    }
    case "LIMIT_ORDER.REMOVE_ORDER": {
      const { order } = action.payload;
      const listOrder = JSON.parse(JSON.stringify(newState.listOrder));
      const target = listOrder.filter(item => item.id === order.id);
      if (target.length > 0) {
        listOrder.splice(listOrder.indexOf(target[0]), 1);
      }
      newState.listOrder = listOrder;
      return newState;
    }
    case "LIMIT_ORDER.UPDATE_ORDER": {
      const { order } = action.payload;
      const newListOrder = newState.listOrder.map(item => {
        if (item.id === order.id) {
          return order;
        }

        return item;
      });
      newState.listOrder = newListOrder;
      return newState;
    }
    case "LIMIT_ORDER.SET_ORDERS_COUNT": {
      const count = action.payload;
      newState.ordersCount = count;
      return newState;
    }
    case "LIMIT_ORDER.SET_FILTER_MODE": {
      const filterMode = action.payload;
      newState.filterMode = filterMode;
      return newState;
    }
    case "LIMIT_ORDER.GET_LIST_FILTER_COMPLETE": {
      const { pairs, addresses } = action.payload;
      newState.orderPairs = pairs;
      newState.orderAddresses = addresses;
      return newState;
    }
    case "LIMIT_ORDER.SET_ADDRESS_FILTER": {
      const { addressFilter } = action.payload;
      newState.addressFilter = addressFilter;
      return newState;
    }
    case "LIMIT_ORDER.SET_PAIR_FILTER": {
      const { pairFilter } = action.payload;
      newState.pairFilter = pairFilter;
      return newState;
    }
    case "LIMIT_ORDER.SET_STATUS_FILTER": {
      const { statusFilter } = action.payload;
      newState.statusFilter = statusFilter;
      return newState;
    }
    case "LIMIT_ORDER.SET_TIME_FILTER": {
      const { timeFilter } = action.payload;
      newState.timeFilter = timeFilter;
      return newState;
    }
    case "LIMIT_ORDER.SET_ORDER_PAGE_INDEX": {
      const pageIndex = action.payload;
      newState.pageIndex = pageIndex;
      return newState;
    }
    case "LIMIT_ORDER.SET_ORDER_DATE_SORT": {
      const dateSort = action.payload;
      newState.dateSort = dateSort;
      return newState;
    }
    case "LIMIT_ORDER.GET_PENDING_BALANCES_COMPLETE": {
      const { pendingBalances, pendingTxs } = action.payload;
      newState.pendingBalances = JSON.parse(JSON.stringify(pendingBalances));
      // console.log(pendingTxs)
      newState.pendingTxs = JSON.parse(JSON.stringify(pendingTxs));
      // console.log(newState.pendingTxs)
      return newState;
    }
    case "LIMIT_ORDER.SET_RELATED_ORDERS": {
      const { orders } = action.payload;
      newState.relatedOrders = JSON.parse(JSON.stringify(orders));
      return newState;
    }
    case "LIMIT_ORDER.SET_IS_DISABLE_SUBMIT": {
      const { isDisable } = action.payload;
      newState.isDisableSubmit = isDisable;
      return newState;
    }
    case "LIMIT_ORDER.SET_AGREE_FORCE_SUBMIT": {
      const { isAgree } = action.payload;
      newState.isAgreeForceSubmit = isAgree;
      return newState;
    }
    case "LIMIT_ORDER.SET_FORCE_SUBMIT_RATE": {
      const { rate } = action.payload;
      newState.forceSubmitRate = rate;
      return newState;
    }
    case "LIMIT_ORDER.CHANGE_ORDER_TAB_COMPLETE": {
      const { tab } = action.payload;
      newState.activeOrderTab = tab;
      return newState;
    }

    case "GLOBAL.SET_GAS_PRICE_COMPLETE": {
      const { safeLowGas, standardGas, fastGas, defaultGas, selectedGas } = action.payload;

      const gasPriceSuggest = { ...newState.gasPriceSuggest };

      gasPriceSuggest.fastGas = Math.round(fastGas * 10) / 10;
      gasPriceSuggest.standardGas = Math.round(standardGas * 10) / 10;
      gasPriceSuggest.safeLowGas = Math.round(safeLowGas * 10) / 10;

      newState.gasPriceSuggest = { ...gasPriceSuggest };
      newState.gasPrice = Math.round(defaultGas * 10) / 10;

      newState.selectedGas = selectedGas;
      return newState;
    }
  }
  return state
}

export default limitOrder;
