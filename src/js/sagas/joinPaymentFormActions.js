import { take, put, call, fork, select, takeEvery, all } from 'redux-saga/effects'
import * as actions from '../actions/joinPaymentFormActions'
import PAYMENT from "../constants/joinPaymentFormActions"

function* broadcastTx(action) {
   try {
   	const {ethereum, tx, callback} = action.payload
  	const hash = yield call(ethereum.sendRawTransaction, tx, ethereum)	
  	callback(hash, tx)
  	yield put(actions.doTransactionComplete(hash))
  }
  catch (e) {
  	yield put(actions.doTransactionFail(e))
  } 
}

export function* watchPayment() {
  yield takeEvery(PAYMENT.JOIN_PAYMENT_FORM_TX_BROADCAST_PENDING, broadcastTx)  
}