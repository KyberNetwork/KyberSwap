import { take, put, call, fork, select, takeEvery, all } from 'redux-saga/effects'
import {joinedKyberWallet} from '../actions/accountActions'
import {addWallet} from '../actions/walletActions'
import {updateTxComplete} from '../actions/txActions'
import TX from "../constants/txActions"

function* updateTx(action) {
  const tx = yield call(action.payload.tx.sync, action.payload.ethereum, action.payload.tx)	
  if (tx.address && tx.address != "") {  	
    yield put(joinedKyberWallet(tx.from, tx.address))
    yield put(addWallet(tx.address, tx.from, tx.data, "default desc"))
  }  	
  yield put(updateTxComplete(tx))    
}

export function* watchTx() {
  yield takeEvery(TX.UPDATE_TX_PENDING, updateTx)  
}

