export function fetchMarketData() {
  return {
    type: "MARKET.FETCH_MARKET_DATA"
  }
}

export function getMarketInfoSuccess(marketData) {
  return {
    type: "MARKET.GET_MARKET_INFO_SUCCESS",
    payload: marketData
  }
}