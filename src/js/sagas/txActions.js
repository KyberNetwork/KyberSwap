import { take, put, call, fork, select, takeEvery, all } from 'redux-saga/effects'
import {joinedKyberWallet} from '../actions/accountActions'
import {updateTxComplete} from '../actions/txActions'

function* updateTx(action) {
  const {tx, ethereum} = action.payload
  const newTx = yield call(tx.sync, ethereum, tx)	
  yield put(updateTxComplete(newTx))    
}

export function* watchTx() {
  yield takeEvery("TX.UPDATE_TX_PENDING", updateTx)  
}

