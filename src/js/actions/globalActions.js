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

export function updateAllRate(ethereum, tokens) {
  return {
    type: 'GLOBAL.RATE_UPDATE_ALL_PENDING',
    payload: { ethereum, tokens }
  }
}

export function checkUserEligible(ethereum) {
  return {
    type: "GLOBAL.CHECK_USER_ELIGIBLE",
    payload: { ethereum }
  }
}

export function updateAllRateComplete(rates, rateUSD) {
  return {
    type: 'GLOBAL.ALL_RATE_UPDATED_FULFILLED',
    payload: { rates, rateUSD }
  }
}

export function updateAllRateUSDComplete(rateETHUSD) {
  return {
    type: 'GLOBAL.UPDATE_RATE_USD_FULFILLED',
    payload: { rateETHUSD }
  }
}

export function showBalanceUSD() {
  return {
    type: 'GLOBAL.SHOW_BALABCE_USD',
  }
}

export function hideBalanceUSD() {
  return {
    type: 'GLOBAL.HIDE_BALABCE_USD',
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

export function setBalanceToken(balances) {
  return {
    type: "GLOBAL.SET_BALANCE_TOKEN",
    payload: { balances }
  }
}

export function changeLanguage(ethereum, lang, locale) {
  return {
    type: "GLOBAL.CHANGE_LANGUAGE",
    payload: { ethereum, lang, locale }
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

export function checkConnection(ethereum, count, maxCount, isCheck) {
  return {
    type: "GLOBAL.CHECK_CONNECTION",
    payload: { ethereum, count, maxCount, isCheck }
  }
}


export function updateIsCheck(isCheck) {
  return {
    type: "GLOBAL.CONNECTION_UPDATE_IS_CHECK",
    payload: isCheck
  }
}

export function updateCountConnection(count) {
  return {
    type: "GLOBAL.CONNECTION_UPDATE_COUNT",
    payload: count
  }
}

export function setGasPrice() {
  return {
    type: "GLOBAL.SET_GAS_PRICE",
  }
}

export function setGasPriceComplete(safeLowGas, standardGas, fastGas, superFastGas, defaultGas, selectedGas) {
  return {
    type: "GLOBAL.SET_GAS_PRICE_COMPLETE",
    payload: { safeLowGas, standardGas, fastGas, superFastGas, defaultGas, selectedGas }
  }
}

export function visitExchange() {
  return {
    type: "GLOBAL.VISIT_EXCHANGE",
  }
}

export function caculateGasPrice(gasStationPrice) {
  return {
    type: "GLOBAL.CACULATE_GASPRICE",
    payload: gasStationPrice
  }
}

export function toggleAnalyze() {
  return {
    type: "GLOBAL.TOGGLE_ANALYZE"
  }
}

export function openAnalyze(txHash) {
  return {
    type: "GLOBAL.OPEN_ANALYZE",
    payload: txHash
  }
}

export function setAnalyzeError(networkIssues, reserveIssues, txHash) {
  return {
    type: "GLOBAL.SET_ANALYZE_ERROR",
    payload: { networkIssues, reserveIssues, txHash }
  }
}

export function throwErrorMematamask(err) {
  return {
    type: "GLOBAL.THROW_ERROR_METAMASK",
    payload: { err }
  }
}

export function throwErrorEligible(err) {
  return {
    type: "GLOBAL.THROW_ERROR_ELIGIBLE",
    payload: { err }
  }
}

export function clearErrorEligible(){
  return {
    type: "GLOBAL.CLEAR_ERROR_ELIGIBLE"
  }
}

export function updateMetamaskAccount(address, balance) {
  return {
    type: "GLOBAL.UPDATE_METAMASK_ACCOUNT",
    payload: { address, balance }
  }
}

export function setNotiHandler(notiService) {
  return {
    type: "GLOBAL.SET_NOTI_HANDLER",
    payload: { notiService }
  }
}

export function setNetworkError(error) {
  return {
    type: "GLOBAL.SET_NETWORK_ERROR",
    payload: { error }
  }
}

export function changeWallet(tradeType) {
  return {
    type: "GLOBAL.CHANGE_WALLET",
    payload: tradeType
  }
}

export function closeChangeWallet() {
  return {
    type: "GLOBAL.CLOSE_CHANGE_WALLET"
  }
}

export function setOnMobile(isIOS, isAndroid) {
  return {
    type: "GLOBAL.SET_ON_MOBILE",
    payload: { isIOS, isAndroid }
  }
}

export function setOnMobileOnly() {
  return {
    type: "GLOBAL.SET_ON_MOBILE_ONLY"
  }
}

export function initAnalytics(analytics) {
  return {
    type: "GLOBAL.INIT_ANALYTICS",
    payload: analytics
  }
}

export function setDocumentTitle(title) {
  return {
    type: "GLOBAL.SET_DOCUMENT_TITLE",
    payload: title
  }
}

export function updateTitleWithRate() {
  return {
    type: "GLOBAL.UPDATE_TITLE_WITH_RATE"
  }
}

export function switchTheme(theme) {
  return {
    type: "GLOBAL.SWITCH_THEME",
    payload: theme
  }
}

export function setCampaign(campaign) {
  return {
    type: "GLOBAL.SET_CAMPAIGN",
    payload: campaign
  }
}
