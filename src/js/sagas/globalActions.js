import { take, put, call, fork, select, takeEvery, all } from 'redux-saga/effects'
import * as actions from '../actions/globalActions'
import * as actionsExchange from '../actions/exchangeActions'
import * as actionsUtils from '../actions/utilActions'
import { closeImportLoading } from '../actions/accountActions'
import { Rate } from "../services/rate"
import { push } from 'react-router-redux';
import { addTranslationForLanguage, setActiveLanguage, getActiveLanguage } from 'react-localize-redux';
import { getTranslate } from 'react-localize-redux';
import { getLanguage } from "../services/language"
import Language from "../../../lang"
import constants from "../services/constants"

import * as converter from "../utils/converter"
import { store } from '../store'

export function* getLatestBlock(action) {
  const ethereum = action.payload
  try{
    const block = yield call([ethereum, ethereum.call], "getLatestBlock")
    yield put(actions.updateBlockComplete(block))
  }catch(e){
    console.log(e)
  }
  
}

export function* updateHistoryExchange(action) {
  try{
    const { ethereum, page, itemPerPage, isAutoFetch } = action.payload
    var latestBlock = yield call([ethereum, ethereum.call], "getLatestBlock")
    const newLogs = yield call([ethereum, ethereum.call], "getLog")
    yield put(actions.updateHistory(newLogs, latestBlock, page, isAutoFetch))
  }catch(e){
    console.log(e)
  }
}

export function* goToRoute(action) {
  yield put(push(action.payload));
}

export function* clearSession(action) {
  yield put(actions.clearSessionComplete())
  yield put(actions.goToRoute('/'));
}

export function* updateAllRate(action) {
  const { ethereum, tokens } = action.payload
  try {
    const rates = yield call([ethereum, ethereum.call],"getAllRates", tokens)
    yield put(actions.updateAllRateComplete(rates))
  }
  catch (err) {
    //get rate from blockchain
    console.log(err.message)
  }
}

export function* updateRateUSD(action) {
  const { ethereum, tokens } = action.payload
  try {
    const rates = yield call([ethereum, ethereum.call],"getAllRatesUSD")
    yield put(actions.updateAllRateUSDComplete(rates))
    yield put(actions.showBalanceUSD())        
  }
  catch (err) {
    yield put(actions.hideBalanceUSD())
  }
}



export function* checkConnection(action) {
  var { ethereum, count, maxCount, isCheck } = action.payload
  try {
    const isConnected = yield call([ethereum, ethereum.call], "isConnectNode")
    if (!isCheck) {
      yield put(actions.updateIsCheck(true))
      yield put(actions.updateCountConnection(0))
    }
  }catch(err){
    console.log(err)
    if (isCheck) {
      if (count > maxCount) {
        yield put(actions.updateIsCheck(false))
        yield put(actions.updateCountConnection(0))
        return
      }
      if (count === maxCount) {
        let translate = getTranslate(store.getState().locale)
        let titleModal = translate('error.error_occurred') || 'Error occurred'
        let contentModal = translate('error.network_error') || 'Cannot connect to node right now. Please check your network!'
        yield put(actionsUtils.openInfoModal(titleModal, contentModal))
        yield put(closeImportLoading())
        yield put(actions.updateCountConnection(++count))
        return
      }
      if (count < maxCount) {
        yield put(actions.updateCountConnection(++count))
        return
      }
    }
  }
}

function compareMaxGasPrice(safeLowGas, standardGas, fastGas, defaultGas, maxGas){
  var safeLowGas = parseFloat(safeLowGas)
  var standardGas = parseFloat(standardGas)
  var fastGas = parseFloat(fastGas)
  var defaultGas = parseFloat(defaultGas)
  var maxGas = parseFloat(maxGas)
  if (fastGas > maxGas) {
    var returnSuggest = {}
    returnSuggest.fastGas = maxGas
    returnSuggest.standardGas = maxGas
    returnSuggest.safeLowGas = maxGas - maxGas * 30 / 100
    returnSuggest.defaultGas = maxGas
    return returnSuggest
  } else {
    return {safeLowGas, standardGas, fastGas, defaultGas}
  }
}

export function* setGasPrice(action) {
  var safeLowGas, standardGas, fastGas, defaultGas
  var state = store.getState()
  var maxGasPrice = state.exchange.maxGasPrice

  try {
    const ethereum = action.payload
    const gasPrice = yield call([ethereum, ethereum.call], "getGasPrice")

    safeLowGas = gasPrice.low
    standardGas = gasPrice.standard
    defaultGas = gasPrice.default
    fastGas = gasPrice.fast

    var compareWithMax = compareMaxGasPrice(safeLowGas, standardGas, fastGas, defaultGas, maxGasPrice)
    yield put(actions.setGasPriceComplete(compareWithMax))

  }catch (err) {
    console.log(err.message)
  }
}

export function* setMaxGasPrice(action) {
  try {
    const ethereum = action.payload
    const maxGasPrice = yield call([ethereum, ethereum.call], "getMaxGasPrice")
    yield put(actionsExchange.setMaxGasPriceComplete(maxGasPrice))
  } catch (err) {
    console.log(err)
  }

}


export function* changelanguage(action) {
  const { ethereum, lang, locale } = action.payload

  if (Language.supportLanguage.indexOf(lang) < 0) return
  try {
    var activeLang = lang
    if (!Language.loadAll && lang !== Language.defaultLanguage) {
      activeLang = lang == Language.defaultLanguage ? Language.defaultLanguage : Language.defaultAndActive[1]
      if (!locale || locale.translations["pack"][1] !== lang) {
        var languagePack = yield call(ethereum.call,"getLanguagePack", lang)
        if (!languagePack) return;

        yield put.sync(addTranslationForLanguage(languagePack, activeLang))
      }
    }
    yield put(setActiveLanguage(activeLang))
  } catch (err) {
    console.log(err)
  }
}

export function* watchGlobal() {
  yield takeEvery("GLOBAL.NEW_BLOCK_INCLUDED_PENDING", getLatestBlock)

  yield takeEvery("GLOBAL.GO_TO_ROUTE", goToRoute)
  yield takeEvery("GLOBAL.CLEAR_SESSION", clearSession)

  yield takeEvery("GLOBAL.UPDATE_HISTORY_EXCHANGE", updateHistoryExchange)
  yield takeEvery("GLOBAL.CHANGE_LANGUAGE", changelanguage)
  yield takeEvery("GLOBAL.CHECK_CONNECTION", checkConnection)
  yield takeEvery("GLOBAL.SET_GAS_PRICE", setGasPrice)

  yield takeEvery("GLOBAL.RATE_UPDATE_ALL_PENDING", updateAllRate)
  yield takeEvery("GLOBAL.UPDATE_RATE_USD_PENDING", updateRateUSD)


  yield takeEvery("EXCHANGE.SET_MAX_GAS_PRICE", setMaxGasPrice)
}


