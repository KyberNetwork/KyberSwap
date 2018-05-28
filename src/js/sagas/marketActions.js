import { take, put, call, fork, select, takeEvery, all } from 'redux-saga/effects'
// import * as actions from '../actions/globalActions'
// import * as actionsExchange from '../actions/exchangeActions'
// import * as actionsUtils from '../actions/utilActions'
import * as marketActions from "../actions/marketActions"
// import { closeImportLoading } from '../actions/accountActions'
// import { Rate } from "../services/rate"
// import { push } from 'react-router-redux';
// import { addTranslationForLanguage, setActiveLanguage, getActiveLanguage } from 'react-localize-redux';
// import { getTranslate } from 'react-localize-redux';
// import { getLanguage } from "../services/language"
// import Language from "../../../lang"
// import constants from "../services/constants"

// import * as converter from "../utils/converter"
 import { store } from '../store'


export function* getData(action) {
    var state = store.getState()
    var ethereum = state.connection.ethereum
    try {
        var data = yield call([ethereum, ethereum.call], "getMarketData")
        yield put(marketActions.getMarketDataComplete(data))
    }catch(e){
        console.log(e)
    }
}

export function* getGeneralTokenInfo(action){
    var state = store.getState()
    var ethereum = state.connection.ethereum
    var rateUSD = state.tokens.tokens.ETH.rateUSD 
    try {
        var data = yield call([ethereum, ethereum.call], "getGeneralTokenInfo")
        yield put(marketActions.getGeneralTokenInfoComplete(data, rateUSD))
    }catch(e){
        console.log(e)
    }
}

export function* watchMarket() {
  yield takeEvery("MARKET.GET_MARKET_DATA", getData)
  yield takeEvery("MARKET.GET_GENERAL_INFO_TOKENS", getGeneralTokenInfo)

}


