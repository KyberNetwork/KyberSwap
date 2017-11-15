import { take, put, call, fork, select, takeEvery, all } from 'redux-saga/effects'
import * as actions from '../actions/globalActions'
import { fetchRatePromise } from "../services/rate"
import { Rate, updateAllRatePromise } from "../services/rate"
import { push } from 'react-router-redux';

function* getLatestBlock(action) {
  const ethereum = action.payload
  const block = yield call(ethereum.call("getLatestBlock"))
  yield put(actions.updateBlockComplete(block))
}

function* updateRate(action) {
  const { ethereum, source, reserve, ownerAddr } = action.payload
  const rate = new Rate(
    source.name,
    source.symbol,
    source.icon,
    source.address,
    source.decimal
  )
  yield [
    rate.fetchRate(ethereum, reserve),
    rate.updateBalance(ethereum, ownerAddr)
  ]
  yield put(actions.updateRateComplete(rate))
}



function* goToRoute(action) {
  yield put(push(action.payload));
}

function* clearSession(action) {
  yield put(actions.clearSessionComplete())
  yield put(actions.goToRoute('/'));
}

function* updateAllRate(action) {
  const { ethereum, tokens, reserve, ownerAddr } = action.payload
  const rates = yield call(updateAllRatePromise, ethereum, tokens, reserve, ownerAddr)
  yield put(actions.updateAllRateComplete(rates))
}

export function* watchGlobal() {
  yield takeEvery("GLOBAL.NEW_BLOCK_INCLUDED_PENDING", getLatestBlock)
  yield takeEvery("GLOBAL.RATE_UPDATED_PENDING", updateRate)
  yield takeEvery("GLOBAL.GO_TO_ROUTE", goToRoute)
  yield takeEvery("GLOBAL.CLEAR_SESSION", clearSession)
  yield takeEvery("GLOBAL.RATE_UPDATE_ALL_PENDING", updateAllRate)
}


