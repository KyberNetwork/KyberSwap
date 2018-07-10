

export function changeSearchWord(value) {
    return {
       type: "MARKET.CHANGE_SEARCH_WORD",
       payload: value
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


export function changeDisplayColumn(value) {
    return {
       type: "MARKET.CHANGE_DISPLAY_COLUMN",
       payload: value
     }
}



export function changeShowColumn(column, show) {
    return {
       type: "MARKET.CHANGE_SHOW_COLUMN",
       payload: {column, show}
     }
}


export function getMarketData(){
  return {
    type: "MARKET.GET_MARKET_DATA"    
  }
}

export function getMarketDataComplete(data){
  return {
    type: "MARKET.GET_MARKET_DATA_COMPLETE",
    payload: data
  }
}

export function showTradingViewChart(symbol){
  return {
    type: "MARKET.SHOW_TRADINGVIEW_CHART",
    payload: {symbol}
  }
}

export function hideTradingViewChart(){
  return {
    type: "MARKET.HIDE_TRADINGVIEW_CHART"
  }
}

export function getGeneralInfoTokens(){
  return {
    type: "MARKET.GET_GENERAL_INFO_TOKENS"
  }
}

export function getGeneralTokenInfoComplete(tokens, rateUSD){
  return {
    type: "MARKET.GET_GENERAL_INFO_TOKENS_COMPLETE",
    payload:{tokens, rateUSD}
  }
}

export function getVolumn(){
  return {
    type: "MARKET.GET_VOLUMN"
  }
}

export function getVolumnSuccess(data){
  return {
    type: "MARKET.GET_VOLUMN_SUCCESS",
    payload: {data}
  }
}

export function getMarketInfoSuccess(data, rateUSD) {
  return {
    type: "MARKET.GET_MARKET_INFO_SUCCESS",
    payload: {data, rateUSD}
  }
}
