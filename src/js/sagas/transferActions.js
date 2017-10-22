import { take, put, call, fork, select, takeEvery, all } from 'redux-saga/effects'
import * as actions from '../actions/transferActions'
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
  	yield put(actions.doApprovalTransactionFail(e, action.meta))
  }     
}

export function* watchTransfer() {
  yield takeEvery("TRANSFER.TX_BROADCAST_PENDING", broadCastTx)
  yield takeEvery("TRANSFER.APPROVAL_TX_BROADCAST_PENDING", approveTx)    
}