import { take, put, call, fork, select, takeEvery, all } from 'redux-saga/effects'
import * as actions from '../actions/globalActions'
import GLOBAL from "../constants/globalActions"
import { fetchRatePromise } from "../services/exchange"

function* getLatestBlock(action) {
  const ethereum = action.payload
  const block = yield call(ethereum.getLatestBlockPromise, ethereum)
  yield put(actions.updateBlockComplete(block))
}

function* updateRate(action) {
  const {ethereum, source, dest, reserve} = action.payload
  const rate = yield call(fetchRatePromise, ethereum, source, dest, reserve)
  yield put(actions.updateRateComplete(rate))
}

export function* watchGlobal() {
  yield takeEvery(GLOBAL.NEW_BLOCK_INCLUDED_PENDING, getLatestBlock)
  yield takeEvery(GLOBAL.RATE_UPDATED_PENDING, updateRate)
}


