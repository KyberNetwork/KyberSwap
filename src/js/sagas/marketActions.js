import { put, call, takeEvery } from 'redux-saga/effects';
import * as marketActions from "../actions/marketActions";
import { store } from '../store';
import BLOCKCHAIN_INFO from "../../../env"
import { sortQuotePriority } from "../utils/sorters";

export function* fetchMarketData() {
  const state = store.getState();
  const ethereum = state.connection.ethereum;
  const tokens = state.tokens.tokens;

  try {
    let marketData = yield call([ethereum, ethereum.call], "getMarketData");

    // marketData = marketData.filter(token => {
    //   return token.pair.split('_')[0] !== BLOCKCHAIN_INFO.wrapETHToken;
    // });

    const marketQuotes = Object.keys(tokens)
      .filter((key)=> (tokens[key]["is_quote"] && key !== BLOCKCHAIN_INFO.wrapETHToken))
      .sort((first, second) => {
        return sortQuotePriority(tokens, first, second);
      });

    yield put(marketActions.getMarketInfoSuccess(marketData, marketQuotes));
  } catch(e) {
    console.log(e)
  }
}

export function* watchMarket() {
  yield takeEvery("MARKET.FETCH_MARKET_DATA", fetchMarketData)
}
