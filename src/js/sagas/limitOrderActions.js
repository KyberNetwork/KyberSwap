

import { take, put, call, fork, select, takeEvery, all, apply } from 'redux-saga/effects'
import * as limitOrderActions from '../actions/limitOrderActions'
import { store } from '../store'
import { getTranslate } from 'react-localize-redux';
import * as common from "./common"
import {getFee} from "../services/limit_order"
import {isUserLogin} from "../utils/common"

import * as constants from "../services/constants"

function* selectToken(action) {
    const { symbol, address, type } = action.payload
    yield put(limitOrderActions.selectToken(symbol, address, type))



    if (type === "source" ){
      const state = store.getState();
      var limitOrder = state.limitOrder
      var account = state.account.account
      if (isUserLogin() && account !== false){
        yield put(limitOrderActions.fetchFee(account.address, symbol, limitOrder.destTokenSymbol))
      }
      
    }
    
    // yield put(utilActions.hideSelectToken())
  
    // yield put(actions.checkSelectToken())
    // yield call(estimateGasNormal)
    
    // if (ethereum){
    //   yield call(ethereum.fetchRateExchange, true)
    // }
  
    //calculate gas use
    // yield call(updateGasUsed)
  }


function* updateRatePending(action) {
  var { source, dest, sourceTokenSymbol, isManual, sourceAmount } = action.payload;
  

  const state = store.getState();
  const translate = getTranslate(state.locale);
  const { destTokenSymbol, destAmount } = state.limitOrder;
  var ethereum = state.connection.ethereum


  var sourceAmoutRefined = yield call(common.getSourceAmount, sourceTokenSymbol, sourceAmount)
  var sourceAmoutZero = yield call(common.getSourceAmountZero, sourceTokenSymbol)

  try{
    var lastestBlock = yield call([ethereum, ethereum.call], "getLatestBlock")
    var rate = yield call([ethereum, ethereum.call], "getRateAtSpecificBlock", source, dest, sourceAmoutRefined, lastestBlock)
    var rateZero = yield call([ethereum, ethereum.call], "getRateAtSpecificBlock", source, dest, sourceAmoutZero, lastestBlock)
    var { expectedPrice, slippagePrice } = rate

    yield put.resolve(limitOrderActions.updateRateComplete(rateZero.expectedPrice.toString(), expectedPrice, slippagePrice, lastestBlock, isManual, true))

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
  var { userAddr, source, dest } = action.payload
  try{
    var fee = yield call(getFee, userAddr, source, dest)
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
    if (isUserLogin()){
      yield put(limitOrderActions.fetchFee(account.address, limitOrder.sourceTokenSymbol, limitOrder.destTokenSymbol))    
    }
  }
}

export function* watchLimitOrder() {
    yield takeEvery("LIMIT_ORDER.SELECT_TOKEN_ASYNC", selectToken)

    yield takeEvery("LIMIT_ORDER.UPDATE_RATE_PENDING", updateRatePending)

    yield takeEvery("LIMIT_ORDER.FETCH_FEE", fetchFee)

    yield takeEvery("ACCOUNT.IMPORT_NEW_ACCOUNT_FULFILLED", triggerAfterAccountImport)

  }