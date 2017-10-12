import { take, put, call, fork, select, takeEvery, all } from 'redux-saga/effects'
import * as actions from '../actions/exchangeFormActions'
import EXCHANGE from "../constants/exchangeFormActions"

function* broadCastTx(action) {
  try {
  	const hash = yield call(action.payload.ethereum.sendRawTransaction, action.payload.tx, action.payload.ethereum)	
  	action.payload.callback(hash, action.payload.tx)
  	yield put(actions.doTransactionComplete(hash, action.meta))
  }
  catch (e) {
  	yield put(actions.doTransactionFail(e, action.meta))
  }     
}

function* approveTx(action) {
  try {
  	const hash = yield call(action.payload.ethereum.sendRawTransaction, action.payload.tx, action.payload.ethereum)	
  	action.payload.callback(hash, action.payload.tx)
  	yield put(actions.doApprovalTransactionComplete(hash, action.meta))
  }
  catch (e) {
  	yield put(actions.doApprovalTransactionFail(error, action.meta))
  }     
}

export function* watchExchange() {
  yield takeEvery(EXCHANGE.EXCHANGE_FORM_TX_BROADCAST_PENDING, broadCastTx)
  yield takeEvery(EXCHANGE.EXCHANGE_FORM_APPROVAL_TX_BROADCAST_PENDING, approveTx)  
}