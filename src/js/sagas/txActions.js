import { take, put, call, fork, select, takeEvery, all } from 'redux-saga/effects'
import {joinedKyberWallet} from '../actions/accountActions'
import {updateTxComplete} from '../actions/txActions'
import { Rate, updateAllRatePromise } from "../services/rate"
import { updateAllRateComplete } from "../actions/globalActions"
import constants from "../services/constants"

function* updateTx(action) {
  const {tx, ethereum, tokens, account} = action.payload
  const newTx = yield call(tx.sync, ethereum, tx)	
  yield put(updateTxComplete(newTx))    

  var rates = []
  for (var k = 0; k < constants.RESERVES.length; k++) {
    var reserve = constants.RESERVES[k];
    rates[k] = yield call(updateAllRatePromise, ethereum, tokens, constants.RESERVES[k], account.address)
  }
  yield put(updateAllRateComplete(rates[0]))
}

export function* watchTx() {
  yield takeEvery("TX.UPDATE_TX_PENDING", updateTx)  
}

