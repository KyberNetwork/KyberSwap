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
    var tokens = state.market.tokens

    // page config
    var pageConfig = state.market.configs
    var page = pageConfig.page
    var firstPageSize = pageConfig.firstPageSize
    let pageSize = pageConfig.normalPageSize

    var tokenNum = pageSize * (page - 1) + firstPageSize
    var queryString = Object.keys(tokens).slice(0, tokenNum).reduce(function(queryString, key){
        queryString += "-" + key
        return queryString
    })

    try {
        const rates = yield call([ethereum, ethereum.call],"getAllRates", tokens)
        // yield put.sync(globalActions.updateAllRateComplete(rates))

        const rateUSDETH = yield call([ethereum, ethereum.call],"getRateETH")

        // var data = yield call([ethereum, ethereum.call], "getVolumnChart")
        // yield put(marketActions.getVolumnSuccess(data))

        // use new cached api
        var newData = yield call([ethereum, ethereum.call], "getRightMarketInfo")
        yield put(marketActions.getMarketInfoSuccess(newData.data, rateUSDETH, rates))

        // new api last 7d
        var last7D = yield call([ethereum, ethereum.call], "getLast7D", queryString)
        yield put(marketActions.getLast7DSuccess(last7D.data))
    }catch(e){
        console.log(e)
    }
}

export function* getNewData(action) {
    var state = store.getState()
    var pageConfig = state.market.configs
    var searchWord = action.payload.searchWord
    var newListTokens = action.payload.listTokens
    var sortedTokens = action.payload.sortedTokens

    var firstPageSize = pageConfig.firstPageSize
    var pageSize = pageConfig.normalPageSize
    var tokens = state.tokens.tokens

    var ethereum = state.connection.ethereum
    var listTokens = []
    var oldPosition = 0
    var nextPosition = firstPageSize

    if (searchWord) {
        Object.keys(tokens).forEach((key) => {
            if (key === "ETH") return
            if ((key !== "") && !key.toLowerCase().includes(searchWord.toLowerCase())) return
        
            listTokens.push(key)
        })
        if (listTokens.length < nextPosition) {
            nextPosition = listTokens.length
        }
    }

    if (Array.isArray(sortedTokens) && sortedTokens.length > 0) {
        listTokens = sortedTokens
        if (listTokens.length < nextPosition) {
            nextPosition = listTokens.length
        }
    }

    if (newListTokens) {
        listTokens = newListTokens
        var nextPage = pageConfig.page + 1
        yield put(marketActions.updatePageNum(nextPage))
        oldPosition = pageSize * (nextPage - 2) + firstPageSize
        nextPosition = listTokens.length
        if (oldPosition + pageSize <= listTokens.length) {
            nextPosition = oldPosition + pageSize
        }
    }

    var currentListToken = listTokens.slice(oldPosition, nextPosition)
    if (currentListToken.length > 0) {
        var queryString = currentListToken.reduce(function(queryString, key){
            queryString += "-" + key
            return queryString
        })
        try {
            var newData = yield call([ethereum, ethereum.call], "getLast7D", queryString)
            yield put(marketActions.getMoreDataSuccess(newData.data))
        }catch(e){
            console.log(e)
            yield put(marketActions.getMoreDataSuccess({}))
        }
    }
}

export function* watchMarket() {
  yield takeEvery("MARKET.GET_MARKET_DATA", getData)
  //yield takeEvery("MARKET.GET_GENERAL_INFO_TOKENS", getGeneralTokenInfo)
  yield takeEvery("MARKET.GET_MORE_DATA", getNewData)
  yield takeEvery("MARKET.GET_VOLUMN", getVolumn)
  yield takeEvery("MARKET.RESET_LIST_TOKEN", getNewData)
  yield takeEvery("MARKET.UPDATE_SORTED_TOKENS", getNewData)
}


