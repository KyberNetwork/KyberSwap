import { take, put, call, fork, select, takeEvery, all } from 'redux-saga/effects'
import * as actions from '../actions/exchangeActions'
import * as utilActions from '../actions/utilActions'
//import EXCHANGE from "../constants/exchangeFormActions"

function* broadCastTx(action) {
  try {        
    const {ethereum, tx, callback} = action.payload    
  	const hash = yield call(ethereum.sendRawTransaction, tx, ethereum)	
  	callback(hash, tx)
  	yield put(actions.doTransactionComplete(hash, action.meta))
  }
  catch (e) {
  	yield put(actions.doTransactionFail(e, action.meta))
  }     
}

function* approveTx(action) {
  try {
    const {ethereum, tx, callback} = action.payload   
  	const hash = yield call(ethereum.sendRawTransaction, tx, ethereum)	
  	callback(hash, tx)
  	yield put(actions.doApprovalTransactionComplete(hash, action.meta))
  }
  catch (e) {
    console.log(e)
  	yield put(actions.doApprovalTransactionFail(e.message, action.meta))
  }     
}

function* selectToken(action) {
  const {symbol,address, type, ethereum} = action.payload
  yield put(actions.selectToken(symbol,address, type))
  yield put(utilActions.hideSelectToken())
  
  yield put(actions.checkSelectToken())
  yield call(ethereum.fetchRateExchange)
}

export function* watchExchange() {
  yield takeEvery("EXCHANGE.TX_BROADCAST_PENDING", broadCastTx)
  yield takeEvery("EXCHANGE.APPROVAL_TX_BROADCAST_PENDING", approveTx)  
  yield takeEvery("EXCHANGE.SELECT_TOKEN_ASYNC", selectToken)
}