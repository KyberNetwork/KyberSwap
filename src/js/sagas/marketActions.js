import { put, call, takeEvery } from 'redux-saga/effects';
import * as marketActions from "../actions/marketActions";
import { store } from '../store';

export function* fetchMarketData() {
  const state = store.getState();
  const ethereum = state.connection.ethereum;

  try {
    let marketData = yield call([ethereum, ethereum.call], "getMarketData");
    marketData = marketData.reduce((result, pair) => { Object.assign(result, {[pair.pair]: pair}); return result},{});
    yield put(marketActions.getMarketInfoSuccess(marketData ? marketData : []));
  } catch(e) {
    console.log(e)
  }
}

export function* watchMarket() {
  yield takeEvery("MARKET.FETCH_MARKET_DATA", fetchMarketData)
}
