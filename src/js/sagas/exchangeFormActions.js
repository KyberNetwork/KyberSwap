import { take, put, call, fork, select, takeEvery, all } from 'redux-saga/effects'
import * as actions from '../actions/exchangeFormActions'
import EXCHANGE from "../constants/exchangeFormActions"

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
  	yield put(actions.doApprovalTransactionFail(e, action.meta))
  }     
}

export function* watchExchange() {
  yield takeEvery(EXCHANGE.EXCHANGE_FORM_TX_BROADCAST_PENDING, broadCastTx)
  yield takeEvery(EXCHANGE.EXCHANGE_FORM_APPROVAL_TX_BROADCAST_PENDING, approveTx)  
}