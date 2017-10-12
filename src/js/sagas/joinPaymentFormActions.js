/* eslint-disable no-constant-condition */

import { take, put, call, fork, select, takeEvery, all } from 'redux-saga/effects'
import * as actions from '../actions/joinPaymentFormActions'
import PAYMENT from "../constants/joinPaymentFormActions"
//import * as service from "../services/accounts"

function* broadcastTx(action) {
   try {
  	const hash = yield call(action.payload.ethereum.sendRawTransaction, action.payload.tx, action.payload.ethereum)	
  	action.payload.callback(hash, action.payload.tx)
  	yield put(actions.doTransactionComplete(hash))
  }
  catch (e) {
  	yield put(actions.doTransactionFail(e))
  } 
}

export function* watchPayment() {
  yield takeEvery(PAYMENT.JOIN_PAYMENT_FORM_TX_BROADCAST_PENDING, broadcastTx)  
}


// export default function* root() {
//   yield all([
//     //fork(addNewAccount),
//     fork(watchAddNewAccount),    
//   ])
// }
