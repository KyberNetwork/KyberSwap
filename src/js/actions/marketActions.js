

export function changeSearchWord(value) {
    return {
       type: "MARKET.CHANGE_SEARCH_WORD",
       payload: value
     }
}

export function resetListToken(searchWord) {
  return {
    type: "MARKET.RESET_LIST_TOKEN",
    payload: {searchWord}
  }
}

export function changeCurrency(value) {
    return {
       type: "MARKET.CHANGE_CURRENCY",
       payload: value
     }
}

export function changeSort(value) {
    return {
       type: "MARKET.CHANGE_SORT",
       payload: value
     }
}

export function changeSymbol(symbol) {
  return {
    type: "MARKET.CHANGE_SYMBOL",
    payload: symbol
  }
}

export function fetchMarketData() {
  return {
    type: "MARKET.FETCH_MARKET_DATA"
  }
}

export function getMarketInfoSuccess(marketData, marketQuotes) {
  return {
    type: "MARKET.GET_MARKET_INFO_SUCCESS",
    payload: { marketData, marketQuotes }
  }
}

export function updateSortState(sortKey, sortType) {
  return {
    type: "MARKET.UPDATE_SORT_STATE",
    payload: {sortKey, sortType}
  }
}

export function showSearchInput(value) {
  return {
    type: "MARKET.UPDATE_SHOW_SEARCH_INPUT",
    payload: value
  }
}
