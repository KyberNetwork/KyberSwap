import { take, put, call, fork, select, takeEvery, all } from 'redux-saga/effects'
import * as marketActions from "../actions/marketActions"
import * as globalActions from "../actions/globalActions"
import { store } from '../store'
import BLOCKCHAIN_INFO from "../../../env";

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
        // yield put.resolve(globalActions.updateAllRateComplete(rates))

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

export function* fetchChartData(action) {
  const { tokenSymbol, timeRange } = action.payload;
  var state = store.getState()
  var currentChartData = state.market.chart
  if (tokenSymbol === currentChartData.tokenSymbol && currentChartData.points[timeRange]) {
    return
  }
  yield put(marketActions.setChartLoading(true));

  try {
    // if (timeRange === 'w') {
    //   const state = store.getState();
    //   const ethereum = state.connection.ethereum;

    //   const last7DPoints = yield call([ethereum, ethereum.call], 'getLast7D', tokenSymbol);
		// 	var dataLast7D = last7DPoints.data[tokenSymbol] ? last7DPoints.data[tokenSymbol] : []
    //   yield put(marketActions.setChartPoints(dataLast7D));
    // } else {
      const response = yield call(fetch, BLOCKCHAIN_INFO.tracker + `/chart/klines?symbol=${tokenSymbol}&interval=${timeRange}`);
      const data = yield call([response, response.json]);
			var chartData = {t: data.t, c: data.c}
			if (data.s !== "ok" || !data.t || !data.c || data.t.length !== data.c.length) {
				chartData.t = []
				chartData.c = []
			}
      yield put(marketActions.setChartPoints(chartData, tokenSymbol, timeRange));
    // }

  } catch(e) {
    console.log(e);
  }

  yield put(marketActions.setChartLoading(false));
}

export function* watchMarket() {
  yield takeEvery("MARKET.GET_MARKET_DATA", getData)
  yield takeEvery("MARKET.GET_MORE_DATA", getNewData)
  yield takeEvery("MARKET.GET_VOLUMN", getVolumn)
  yield takeEvery("MARKET.RESET_LIST_TOKEN", getNewData)
  yield takeEvery("MARKET.UPDATE_SORTED_TOKENS", getNewData)
  yield takeEvery("MARKET.FETCH_CHART_DATA", fetchChartData);
}


