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
        yield put.sync(globalActions.updateAllRateComplete(rates))

        const rateUSDETH = yield call([ethereum, ethereum.call],"getRateETH")

        // var data = yield call([ethereum, ethereum.call], "getVolumnChart")
        // yield put(marketActions.getVolumnSuccess(data))

        // use new cached api
        var newData = yield call([ethereum, ethereum.call], "getRightMarketInfo")
        yield put(marketActions.getMarketInfoSuccess(newData.data, rateUSDETH))

        // new api last 7d
        var last7D = yield call([ethereum, ethereum.call], "getLast7D", queryString)
        yield put(marketActions.getLast7DSuccess(last7D.data, last7D.timeStamp))
    }catch(e){
        console.log(e)
    }
}

export function* getNewData(action) {
    var state = store.getState()
    var marketConfig = state.market.configs
    var newListTokens = action.payload.listTokens

    var firstPageSize = marketConfig.firstPageSize
    var pageSize = marketConfig.normalPageSize
    var tokens = state.market.tokens
    var listTokens = []

    listTokens = newListTokens
    var nextPage = marketConfig.page + 1
    yield put(marketActions.updatePageNum(nextPage))
    var oldPosition = pageSize * (nextPage - 2) + firstPageSize
    
    var nextPosition = listTokens.length
    if (oldPosition + pageSize <= listTokens.length) {
        nextPosition = oldPosition + pageSize
    }

    var currentListToken = listTokens.slice(oldPosition, nextPosition)
    var timeNow = Date.now() / 1000
    var queryString = ""

    currentListToken.forEach((key) => {
        if (key === 'ETH') return
        var dataAge = 0
        if (marketConfig.timeUpdateData[key]) {
            dataAge = timeNow - marketConfig.timeUpdateData[key]
        }
        if (tokens[key].ETH.last_7d === 0 || tokens[key].USD.last_7d === 0 || dataAge > 300) {
            queryString += key + "-"
        }
    })

    if (queryString != "") {
        var ethereum = state.connection.ethereum
        try {
            var newData = yield call([ethereum, ethereum.call], "getLast7D", queryString)
            yield put(marketActions.getMoreDataSuccess(newData.data, newData.timeStamp))
        }catch(e){
            console.log(e)
        }
    }
}

function compareString(currency) {
    return function(tokenA, tokenB) {
    var marketA = tokenA + currency
    var marketB = tokenB + currency
    if (marketA < marketB)
        return -1;
    if (marketA > marketB)
        return 1;
    return 0;
    }
}

function compareNum(originalTokens, currency, sortKey) {
    return function(tokenA, tokenB) {
        return originalTokens[tokenA][currency][sortKey] - originalTokens[tokenB][currency][sortKey]
    }
}

export function* resetFilteredTokens(action) {
    // filter tokens and update tokens here
    var state = store.getState()
    var searchWord = action.payload.searchWord
    if (!searchWord) {
        searchWord = state.market.configs.searchWord
    }
    var tokens = state.market.tokens
    var filteredTokens = []
    Object.keys(tokens).forEach((key) => {
        // if (key === "ETH") return
        if ((key !== "") && !key.toLowerCase().includes(searchWord.toLowerCase())) return
    
        filteredTokens.push(key)
    })
    var sortKey = action.payload.sortKey
    var sortType = action.payload.sortType
    if (!sortKey && !sortType) {
        if (state.market.configs.sortKey != "") {
            sortKey = state.market.configs.sortKey
            sortType = state.market.configs.sortType[sortKey]
        }
    }
    if (sortKey && sortKey != "") {
        if (sortKey === 'market') {
            filteredTokens.sort(compareString('ETH'))
        } else if (sortKey != '') {
            filteredTokens.sort(compareNum(tokens, 'ETH', sortKey))
        }
        if (sortType === '-sort-desc') {
            filteredTokens.reverse()
        }
    }
    var nextPosition = state.market.configs.firstPageSize
    if (filteredTokens.length < nextPosition) {
        nextPosition = filteredTokens.length
    }
    yield put(marketActions.updateFilteredTokensSuccess(filteredTokens))
    var timeNow = Date.now() / 1000
    var listTokens = filteredTokens.slice(0, nextPosition)
    var queryString = ""
    var marketConfig = state.market.configs

    listTokens.forEach((key) => {
        if (key === 'ETH') return
        var dataAge = 0
        if (marketConfig.timeUpdateData[key]) {
            dataAge = timeNow - marketConfig.timeUpdateData[key]
        }
        if (tokens[key].ETH.last_7d === 0 || tokens[key].USD.last_7d === 0 || dataAge > 300) {
            queryString += key + "-"
        }
    })

    if (queryString != "") {
        var ethereum = state.connection.ethereum
        try {
            var newData = yield call([ethereum, ethereum.call], "getLast7D", queryString)
            yield put(marketActions.getMoreDataSuccess(newData.data, newData.timeStamp))
        }catch(e){
            console.log(e)
        }
    }
}

export function* watchMarket() {
  yield takeEvery("MARKET.GET_MARKET_DATA", getData)
  //yield takeEvery("MARKET.GET_GENERAL_INFO_TOKENS", getGeneralTokenInfo)
  yield takeEvery("MARKET.GET_MORE_DATA", getNewData)
  yield takeEvery("MARKET.GET_VOLUMN", getVolumn)

  yield takeEvery("MARKET.CHANGE_SEARCH_WORD", resetFilteredTokens)
  yield takeEvery("MARKET.UPDATE_SORT_STATE", resetFilteredTokens)
}


