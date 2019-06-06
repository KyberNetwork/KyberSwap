

import { take, put, call, fork, select, takeEvery, all, apply } from 'redux-saga/effects'
import * as limitOrderActions from '../actions/limitOrderActions'
import * as globalActions from "../actions/globalActions"
import { store } from '../store'
import { getTranslate } from 'react-localize-redux';
import * as common from "./common"
import * as commonUtils from "../utils/common"
import {getFee, getOrdersByIdArr} from "../services/limit_order"
import {isUserLogin} from "../utils/common"
import * as utilActions from '../actions/utilActions'
import BLOCKCHAIN_INFO from "../../../env"

import * as constants from "../services/constants"

function* selectToken(action) {
    const { symbol, address, type } = action.payload
    yield put(limitOrderActions.selectToken(symbol, address, type))

    const state = store.getState();
    var ethereum = state.connection.ethereum
    var limitOrder = state.limitOrder
    var source = limitOrder.sourceToken
    var dest = limitOrder.destToken
    var sourceTokenSymbol = limitOrder.sourceTokenSymbol
    var isManual = true
    var sourceAmount = limitOrder.sourceAmount


    if (type === "source" ){
      var account = state.account.account
      if (isUserLogin() && account !== false){
        yield put(limitOrderActions.fetchFee(account.address, symbol, limitOrder.destTokenSymbol))
      }

      source = address
      sourceTokenSymbol = symbol
    }else{
      dest = address      
    }
    
    
    // yield put(utilActions.hideSelectToken())
  
    // yield put(actions.checkSelectToken())
    // yield call(estimateGasNormal)
    
    if (ethereum){      
      yield put(limitOrderActions.updateRate(ethereum, source, dest, sourceAmount, sourceTokenSymbol, isManual ))
    }
  
    //calculate gas use
    // yield call(updateGasUsed)
  }


function* updateRatePending(action) {
  var { ethereum, sourceTokenSymbol, sourceToken, destTokenSymbol, destToken, sourceAmount, isManual, type  } = action.payload;
  

  // const state = store.getState();
  // const translate = getTranslate(state.locale);
  // const { destTokenSymbol, destAmount } = state.limitOrder;


  var sourceAmoutRefined = yield call(common.getSourceAmount, sourceTokenSymbol, sourceAmount)
  var sourceAmoutZero = yield call(common.getSourceAmountZero, sourceTokenSymbol)

  try{
    var lastestBlock = yield call([ethereum, ethereum.call], "getLatestBlock")
    var rate = yield call([ethereum, ethereum.call], "getRateAtSpecificBlock", sourceToken, destToken, sourceAmoutRefined, lastestBlock)
    var rateZero = yield call([ethereum, ethereum.call], "getRateAtSpecificBlock", sourceToken, destToken, sourceAmoutZero, lastestBlock)
    var { expectedPrice, slippagePrice } = rate

    yield put.resolve(limitOrderActions.updateRateComplete(rateZero.expectedPrice.toString(), expectedPrice, slippagePrice, lastestBlock, isManual, type))

  }catch(err){
    console.log(err)
    if(isManual){
      yield put(utilActions.openInfoModal(translate("error.error_occurred") || "Error occurred",
      translate("error.node_error") || "There are some problems with nodes. Please try again in a while."))
      return
    }
  }
}

function* fetchFee(action){
  var { userAddr, src, dest, srcAmount, destAmount } = action.payload
  try{
    var fee = yield call(getFee, userAddr, src, dest, srcAmount, destAmount)
    yield put(limitOrderActions.fetchFeeComplete(fee))
  }catch(err){
    console.log(err)
    yield put(limitOrderActions.fetchFeeComplete(constants.LIMIT_ORDER_CONFIG.maxFee, err))
  }

}

function* triggerAfterAccountImport(action){
  const { pathname } = window.location;

  if (pathname.includes(constants.LIMIT_ORDER_CONFIG.path)) {
    const state = store.getState()
    var limitOrder = state.limitOrder
    var account = state.account.account
    const ethereum = state.connection.ethereum;
    const tokens = state.tokens.tokens;

    if (account && account.type === "promo") {
      const promoToken = BLOCKCHAIN_INFO.promo_token;

      if (promoToken && tokens[promoToken]) {
        const promoAddr = tokens[promoToken].address;
        const promoDecimal = tokens[promoToken].decimals;

        let destTokenSymbol = limitOrder.destTokenSymbol;
        if (account.info.destToken && tokens[account.info.destToken.toUpperCase()]) {
          destTokenSymbol = account.info.destToken.toUpperCase();
        }
        const destAddress = tokens[destTokenSymbol].address;

        let path = constants.BASE_HOST + "/limit_order/" + promoToken.toLowerCase() + "-" + destTokenSymbol.toLowerCase();
        path = commonUtils.getPath(path, constants.LIST_PARAMS_SUPPORTED);
        yield put(globalActions.goToRoute(path));

        yield put(limitOrderActions.selectToken(promoToken, promoAddr, destTokenSymbol, destAddress, "promo"));

        try{
          var balanceSource = yield call([ethereum, ethereum.call], "getBalanceToken", account.address, promoAddr)
          var balance = converter.toT(balanceSource, promoDecimal)
          yield put(limitOrderActions.inputChange('source', balance))
          yield put(limitOrderActions.focusInput('source'));
        }catch(e){
          console.log(e)
        }
      }
    }

    if (isUserLogin()){
      yield put(limitOrderActions.fetchFee(account.address, limitOrder.sourceTokenSymbol, limitOrder.destTokenSymbol))    
    }
  }
}

function*  fetchOpenOrderStatus() {
  const state = store.getState()
  var listOrder = state.limitOrder.listOrder
  var idArr = []
  listOrder.map(value => {
    if(value.status === constants.LIMIT_ORDER_CONFIG.status.OPEN || value.status === constants.LIMIT_ORDER_CONFIG.status.IN_PROGRESS){
      idArr.push(value.id)
    }
  })
  try{
    var orders = yield call(getOrdersByIdArr, idArr)
    //update order
    for (var j = 0; j <orders.length; j++){
      for (var i = 0; i < listOrder.length; i++){
            if (listOrder[i].id === orders[j].id){
                listOrder[i] = orders[j]
                break
            }
        }
    }
    yield put(limitOrderActions.addListOrder(listOrder))


  }catch(err){
    console.log(err)
  }
}

export function* watchLimitOrder() {
    yield takeEvery("LIMIT_ORDER.SELECT_TOKEN_ASYNC", selectToken)

    yield takeEvery("LIMIT_ORDER.UPDATE_RATE_PENDING", updateRatePending)

    yield takeEvery("LIMIT_ORDER.FETCH_FEE", fetchFee)

    yield takeEvery("ACCOUNT.IMPORT_NEW_ACCOUNT_FULFILLED", triggerAfterAccountImport)

    yield takeEvery("LIMIT_ORDER.FETCH_OPEN_ORDER_STATUS", fetchOpenOrderStatus)

  }