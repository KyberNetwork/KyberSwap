import { take, put, call, fork, select, takeEvery, all } from 'redux-saga/effects'
import * as actions from '../actions/globalActions'
import GLOBAL from "../constants/globalActions"
import { fetchRatePromise } from "../services/exchange"

function* getLatestBlock(action) {
  const block = yield call(action.payload.getLatestBlockPromise, action.payload)
  yield put(actions.updateBlockComplete(block))
}

function* updateRate(action) {
  const rate = yield call(fetchRatePromise, action.payload.ethereum, action.payload.source, action.payload.dest, action.payload.reserve)
  yield put(actions.updateRateComplete(rate))
}

export function* watchGlobal() {
  yield takeEvery(GLOBAL.NEW_BLOCK_INCLUDED_PENDING, getLatestBlock)
  yield takeEvery(GLOBAL.RATE_UPDATED_PENDING, updateRate)
}


