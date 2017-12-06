import * as converter from "../utils/converter"

export function updateBlock(ethereum, block) {
  return {
    type: "GLOBAL.NEW_BLOCK_INCLUDED_PENDING",
    payload: ethereum
  }
}

export function updateBlockComplete(block) {
  return {
    type: "GLOBAL.NEW_BLOCK_INCLUDED_FULFILLED",
    payload: block
  }
}

export function updateBlockFailed(error) {
  return {
    type: "GLOBAL.GET_NEW_BLOCK_FAILED",
    payload: error
  }
}

// export function updateRate(ethereum, source, reserve, ownerAddr) {
//   return {
//     type: "GLOBAL.RATE_UPDATED_PENDING",
//     payload: {ethereum, source, reserve, ownerAddr}
//   }
// }

export function updateAllRate(ethereum, tokens, reserve, ownerAddr) {
  return {
    type: 'GLOBAL.RATE_UPDATE_ALL_PENDING',
    payload: { ethereum, tokens, reserve, ownerAddr }
  }
}

export function updateAllRateComplete(rates, isUpdateBalance) {
  return {
    type: 'GLOBAL.ALL_RATE_UPDATED_FULFILLED',
    payload: { rates, isUpdateBalance }
  }
}

export function acceptTermOfService() {
  return {
    type: "GLOBAL.TERM_OF_SERVICE_ACCEPTED"
  }
}

export function clearSession() {
  return {
    type: "GLOBAL.CLEAR_SESSION"
  }
}

export function clearSessionComplete() {
  return {
    type: "GLOBAL.CLEAR_SESSION_FULFILLED"
  }
}

export function goToRoute(route) {
  return {
    type: "GLOBAL.GO_TO_ROUTE",
    payload: route
  }
}


export function updateHistoryExchange(ethereum, page, itemPerPage, isAutoFetch) {
  return {
    type: "GLOBAL.UPDATE_HISTORY_EXCHANGE",
    payload: { ethereum, page, itemPerPage, isAutoFetch }
  }
}

export function updateHistory(logs, latestBlock, page, eventsCount, isAutoFetch) {
  return {
    type: "GLOBAL.UPDATE_HISTORY",
    payload: { logs, latestBlock, page, eventsCount, isAutoFetch }
  }
}

export function checkConnection(ethereum, count, maxCount, isCheck) {
  return {
    type: "GLOBAL.CHECK_CONNECTION",
    payload: { ethereum, count, maxCount, isCheck }
  }
}

export function updateIsCheck(isCheck){
  return {
    type: "GLOBAL.CONNECTION_UPDATE_IS_CHECK",
    payload: isCheck
  }
}

export function updateCountConnection(count){
  return {
    type: "GLOBAL.CONNECTION_UPDATE_COUNT",
    payload: count
  }
}

export function setGasPrice(ethereum){
  return {
    type: "GLOBAL.SET_GAS_PRICE",
    payload: ethereum
  }
}

export function setGasPriceComplete(gasPrice){
  var gasPriceGwei = converter.weiToGwei(gasPrice)
  return {
    type: "GLOBAL.SET_GAS_PRICE_COMPLETE",
    payload: gasPriceGwei
  }
}