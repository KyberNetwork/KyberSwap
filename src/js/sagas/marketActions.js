import { put, call, takeEvery } from 'redux-saga/effects'
import * as marketActions from "../actions/marketActions"
import { store } from '../store'

export function* fetchMarketData() {
  const state = store.getState();
  const ethereum = state.connection.ethereum;

  try {
    const marketData = yield call([ethereum, ethereum.call], "getMarketData");
    const marketQuotes = [...new Set(marketData.map(token => token.pair.split('_')[0]))];
    yield put(marketActions.getMarketInfoSuccess(marketData, marketQuotes));
  } catch(e) {
    console.log(e)
  }
}

export function* watchMarket() {
  yield takeEvery("MARKET.FETCH_MARKET_DATA", fetchMarketData)
}
