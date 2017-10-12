import { take, put, call, fork, select, takeEvery, all } from 'redux-saga/effects'
import {joinedKyberWallet} from '../actions/accountActions'
import {addWallet} from '../actions/walletActions'
import {updateTxComplete} from '../actions/txActions'
import TX from "../constants/txActions"

function* updateTx(action) {
  const {tx, ethereum} = action.payload
  const newTx = yield call(tx.sync, ethereum, tx)	
  if (newTx.address && newTx.address != "") {  	
    yield put(joinedKyberWallet(newTx.from, newTx.address))
    yield put(addWallet(newTx.address, newTx.from, newTx.data, "default desc"))
  }  	
  yield put(updateTxComplete(newTx))    
}

export function* watchTx() {
  yield takeEvery(TX.UPDATE_TX_PENDING, updateTx)  
}

