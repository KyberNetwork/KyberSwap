import { take, put, call, fork, select, takeEvery, all } from 'redux-saga/effects'
// import * as actions from '../actions/globalActions'
// import * as actionsExchange from '../actions/exchangeActions'
// import * as actionsUtils from '../actions/utilActions'
import * as marketActions from "../actions/marketActions"
import * as globalActions from "../actions/globalActions"
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

// export function* getGeneralTokenInfo(action){
//     var state = store.getState()
//     var ethereum = state.connection.ethereum
//     var rateUSD = state.tokens.tokens.ETH.rateUSD 
//     try {
//         var data = yield call([ethereum, ethereum.call], "getGeneralTokenInfo")
//         yield put(marketActions.getGeneralTokenInfoComplete(data, rateUSD))
//     }catch(e){
//         console.log(e)
//     }
// }

export function* getVolumn(){
    var state = store.getState()
    var ethereum = state.connection.ethereum
    var tokens = state.tokens.tokens
    try {
        const rates = yield call([ethereum, ethereum.call],"getAllRates", tokens)
        yield put.sync(globalActions.updateAllRateComplete(rates))

        const rateUSDETH = yield call([ethereum, ethereum.call],"getRateETH")

        // var data = yield call([ethereum, ethereum.call], "getVolumnChart")
        // yield put(marketActions.getVolumnSuccess(data))

        // use new cached api
        var newData = yield call([ethereum, ethereum.call], "getMarketInfo")
        yield put(marketActions.getMarketInfoSuccess(newData.data, rateUSDETH))
    }catch(e){
        console.log(e)
    }
}

export function* watchMarket() {
  yield takeEvery("MARKET.GET_MARKET_DATA", getData)
  //yield takeEvery("MARKET.GET_GENERAL_INFO_TOKENS", getGeneralTokenInfo)
  yield takeEvery("MARKET.GET_VOLUMN", getVolumn)
}


