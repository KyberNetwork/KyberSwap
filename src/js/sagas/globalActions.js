import { take, put, call, fork, select, takeEvery, all } from 'redux-saga/effects'
import * as actions from '../actions/globalActions'
import * as actionsUtils from '../actions/utilActions'
import { fetchRatePromise } from "../services/rate"
import { Rate, updateAllRatePromise } from "../services/rate"
import { push } from 'react-router-redux';
import { addTranslationForLanguage, setActiveLanguage, getActiveLanguage } from 'react-localize-redux';
import localForage from 'localforage'
import { store } from "../store"

export function* getLatestBlock(action) {
  const ethereum = action.payload
  const block = yield call(ethereum.call("getLatestBlock"))
  yield put(actions.updateBlockComplete(block))
}

export function* updateHistoryExchange(action) {
  const { ethereum, page, itemPerPage, isAutoFetch } = action.payload
  var latestBlock = yield call(ethereum.call("getLatestBlock"))
  const newLogs = yield call(ethereum.call("getLogTwoColumn"), page, itemPerPage)
  const eventsCount = yield call(ethereum.call("countALlEvents"))
  yield put(actions.updateHistory(newLogs, latestBlock, page, eventsCount, isAutoFetch))
}

export function* updateRate(action) {
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



export function* goToRoute(action) {
  yield put(push(action.payload));
}

export function* clearSession(action) {
  yield put(actions.clearSessionComplete())
  yield put(actions.goToRoute('/'));
}

export function* updateAllRate(action) {
  const { ethereum, tokens, reserve, ownerAddr } = action.payload
  let isUpdateBalance = ownerAddr ? true : false
  const rates = yield call(updateAllRatePromise, ethereum, tokens, reserve, ownerAddr)
  yield put(actions.updateAllRateComplete(rates, isUpdateBalance))
}

export function* changelanguage(action){
  const { ethereum, lang } = action.payload
  try{
    var state = store.getState()
    if(!state.locale || ! state.locale.translations|| !state.locale.translations["pack"] || state.locale.translations["pack"].indexOf(lang) < 0 ){
      const languagePack = yield call(ethereum.call("getLanguagePack"), lang)
      if(!languagePack) return;
      yield put.sync(addTranslationForLanguage(languagePack, lang))
      localForage.setItem('activeLanguageData', languagePack)
    }
    yield put(setActiveLanguage(lang))
    localForage.setItem('activeLanguage', lang)
  } catch(err){
    console.log(err)
  }
}

export function* checkConnection(action){
  var {ethereum, count, maxCount, isCheck} = action.payload
  const isConnected = yield call([ethereum, ethereum.call("isConnectNode")])
  console.log(isConnected)
  if (isConnected){
    if (!isCheck){
      yield put(actions.updateIsCheck(true))
      yield put(actions.updateCountConnection(0))
    }
  }else{
    if (isCheck){
      if(count > maxCount){
        yield put(actions.updateIsCheck(false))
        yield put(actions.updateCountConnection(0))
        return
      }
      if(count === maxCount){
        yield put(actionsUtils.openInfoModal("Error modal", "Cannot connect to node right now. Please check your network!"))
        yield put(actions.updateCountConnection(++count))
        return
      }
      if(count < maxCount){
        yield put(actions.updateCountConnection(++count))
        return
      }
    }
  }
}

export function* watchGlobal() {
  yield takeEvery("GLOBAL.NEW_BLOCK_INCLUDED_PENDING", getLatestBlock)
  yield takeEvery("GLOBAL.RATE_UPDATED_PENDING", updateRate)
  yield takeEvery("GLOBAL.GO_TO_ROUTE", goToRoute)
  yield takeEvery("GLOBAL.CLEAR_SESSION", clearSession)
  yield takeEvery("GLOBAL.RATE_UPDATE_ALL_PENDING", updateAllRate)
  yield takeEvery("GLOBAL.UPDATE_HISTORY_EXCHANGE", updateHistoryExchange)
  yield takeEvery("GLOBAL.CHANGE_LANGUAGE", changelanguage)
  yield takeEvery("GLOBAL.CHECK_CONNECTION", checkConnection)
}


