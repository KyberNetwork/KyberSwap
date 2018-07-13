
//import {RATE_EPSILON} from "../services/constants.js"
import constants from "../services/constants"
import * as converter from "../utils/converter"

export function selectTokenAsync(symbol, address, type, ethereum) {
  return {
    type: "EXCHANGE.SELECT_TOKEN_ASYNC",
    payload: { symbol, address, type, ethereum }
  }
}
export function selectToken(symbol, address, type) {
  return {
    type: "EXCHANGE.SELECT_TOKEN",
    payload: { symbol, address, type }
  }
}
export function checkSelectToken() {
  return {
    type: "EXCHANGE.CHECK_SELECT_TOKEN"
  }
}

export function caculateAmount() {
  return {
    type: "EXCHANGE.CACULATE_AMOUNT"
  }
}

export function caculateAmountInSnapshot(){
  return {
    type: "EXCHANGE.CACULATE_AMOUNT_SNAPSHOT"
  }
}

export function inputChange(focus, value) {
  return {
    type: "EXCHANGE.INPUT_CHANGE",
    payload: { focus, value }
  }
}

export function focusInput(focus) {
  return {
    type: "EXCHANGE.FOCUS_INPUT",
    payload: focus
  }
}

export function thowErrorSourceAmount(message) {
  return {
    type: "EXCHANGE.THROW_SOURCE_AMOUNT_ERROR",
    payload: message
  }
}

export function thowErrorMaxCap(){
  return {
    type: "EXCHANGE.THROW_SOURCE_AMOUNT_ERROR",
    payload: message
  }
}

export function thowErrorEthBalance(message){
  return {
    type: "EXCHANGE.THROW_ETH_BALANCE_ERROR",
    payload: message
  }
}

export function thowErrorGasPrice(message) {
  return {
    type: "EXCHANGE.THROW_GAS_PRICE_ERROR",
    payload: message
  }
}

export function thowErrorRate(message) {
  return {
    type: "EXCHANGE.THROW_RATE_ERROR",
    payload: message
  }
}

export function goToStep(step) {
  return {
    type: "EXCHANGE.GO_TO_STEP",
    payload: step
  }
}

export function specifyGas(value) {
  return {
    type: "EXCHANGE.SPECIFY_GAS",
    payload: value
  }
}

export function seSelectedGas(level){
  return {
    type: "EXCHANGE.SET_SELECTED_GAS",
    payload: {level: level}
  }
}

export function specifyGasPrice(value) {
  return {
    type: "EXCHANGE.SPECIFY_GAS_PRICE",
    payload: value
  }
}

export function toggleAdvance() {
  return {
    type: "EXCHANGE.TOGGLE_ADVANCE",
  }
}

export function setRandomExchangeSelectedToken(random) {
  return {
    type: "EXCHANGE.SET_RANDOM_SELECTED_TOKEN",
    payload: random
  }
}

export function updateRateExchange(ethereum, source, dest,
  sourceAmount, sourceTokenSymbol, isManual = false) {
  return {
    type: "EXCHANGE.UPDATE_RATE_PENDING",
    payload: { ethereum, source, dest, sourceAmount, sourceTokenSymbol, isManual }
  }
}

export function updateRateSnapshot(ethereum){
  return {
    type: "EXCHANGE.UPDATE_RATE_SNAPSHOT",
    payload: ethereum
  }
}

export function updatePrevSource(value) {
  return {
    type: "EXCHANGE.SET_PREV_SOURCE",
    payload: { value }
  }
}

export function updateRateExchangeComplete(rateInit, expectedPrice, slippagePrice, blockNo, isManual, isSuccess) {
  // var rateBig = converter.stringToBigNumber(rate.expectedPrice)
  //  var offeredRate = rateBig.times(1 - constants.RATE_EPSILON).toFixed(0)

  //var rateBig = converter.stringToBigNumber(rate[0])
  //  var offeredRate = rate.expectedPrice
  //var expirationBlock = rate[1]
  //var reserveBalance = rate[2]
  return {
    type: "EXCHANGE.UPDATE_RATE",
    payload: { rateInit, expectedPrice, slippagePrice, blockNo, isManual, isSuccess}
  }

}

export function updateRateSnapshotComplete(rateInit, expectedPrice, slippagePrice) {
  // var rateBig = converter.stringToBigNumber(rate.expectedPrice)
  //  var offeredRate = rateBig.times(1 - constants.RATE_EPSILON).toFixed(0)

  //var rateBig = converter.stringToBigNumber(rate[0])
  //  var offeredRate = rate.expectedPrice
  //var expirationBlock = rate[1]
  //var reserveBalance = rate[2]
  return {
    type: "EXCHANGE.UPDATE_RATE_SNAPSHOT_COMPLETE",
    payload: { rateInit, expectedPrice, slippagePrice: converter.toT(slippagePrice, 18), rateInitSlippage:  converter.toT(rateInit, 18)}
  }

}


// export function setRateSystemError(){
//   return {
//     type: "EXCHANGE.SET_RATE_ERROR_SYSTEM"
//   }  
// }

// export function setRateFailError(){
//   return {
//     type: "EXCHANGE.SET_RATE_ERROR_FAIL"
//   }  
// }

// export function setErrorRateSystem(){
//   return {
//     type: "EXCHANGE.SET_RATE_ERROR_SYSTEM"
//   }  
// }
// export function setErrorRateExchange(){
//   return {
//     type: "EXCHANGE.ERROR_RATE_ZERO"
//   }
// }

// export function clearErrorRateExchange(){
//   return {
//     type: "EXCHANGE.CLEAR_ERROR_RATE_ZERO"
//   }
// }

// export function setErrorRateEqualZero(){
//   return {
//     type: "EXCHANGE.SET_RATE_ERROR_ZERO"
//   }
// }


export function openPassphrase() {
  return {
    type: "EXCHANGE.OPEN_PASSPHRASE",
  }
}

export function hidePassphrase() {
  return {
    type: "EXCHANGE.HIDE_PASSPHRASE",
  }
}

export function hideConfirm() {
  return {
    type: "EXCHANGE.HIDE_CONFIRM",
  }
}

export function showConfirm() {
  return {
    type: "EXCHANGE.SHOW_CONFIRM",
  }
}

export function hideApprove() {
  return {
    type: "EXCHANGE.HIDE_APPROVE",
  }
}

export function showApprove() {
  return {
    type: "EXCHANGE.SHOW_APPROVE",
  }
}

export function changePassword() {
  return {
    type: "EXCHANGE.CHANGE_PASSPHRASE",
  }
}


export function prePareBroadcast(balanceData) {
  return {
    type: "EXCHANGE.PREPARE_BROADCAST",
    payload: { balanceData }
  }
}

export function finishExchange() {
  return {
    type: "EXCHANGE.FINISH_EXCHANGE"
  }
}

export function throwPassphraseError(message) {
  return {
    type: "EXCHANGE.THROW_ERROR_PASSPHRASE",
    payload: message
  }
}

export function processExchange(formId, ethereum, address, sourceToken,
  sourceAmount, destToken, destAddress,
  maxDestAmount, minConversionRate,
  throwOnFailure, nonce, gas,
  gasPrice, keystring, type, password, account, data, keyService, balanceData, sourceTokenSymbol, blockNo) {
  return {
    type: "EXCHANGE.PROCESS_EXCHANGE",
    payload: {
      formId, ethereum, address, sourceToken,
      sourceAmount, destToken, destAddress,
      maxDestAmount, minConversionRate,
      throwOnFailure, nonce, gas,
      gasPrice, keystring, type, password, account, data, keyService, balanceData, sourceTokenSymbol, blockNo
    }
  }
}

export function checkTokenBalanceOfColdWallet(formId, ethereum, address, sourceToken,
  sourceAmount, destToken, destAddress,
  maxDestAmount, minConversionRate,
  throwOnFailure, nonce, gas,
  gasPrice, keystring, type, password, account, data, keyService) {
  return {
    type: "EXCHANGE.CHECK_TOKEN_BALANCE_COLD_WALLET",
    payload: {
      formId, ethereum, address, sourceToken,
      sourceAmount, destToken, destAddress,
      maxDestAmount, minConversionRate,
      throwOnFailure, nonce, gas,
      gasPrice, keystring, type, password, account, data, keyService
    }
  }
}

export function doApprove(ethereum, sourceToken, sourceAmount, nonce, gas, gasPrice,
  keystring, password, accountType, account, keyService, sourceTokenSymbol) {
  return {
    type: "EXCHANGE.PROCESS_APPROVE",
    payload: {
      ethereum, sourceToken, sourceAmount, nonce, gas, gasPrice,
      keystring, password, accountType, account, keyService, sourceTokenSymbol
    }
  }
}
export function doTransaction(id, ethereum, tx, account, data) {
  return {
    type: "EXCHANGE.TX_BROADCAST_PENDING",
    payload: { ethereum, tx, account, data },
    meta: id,
  }
}

export function doTransactionComplete(txHash) {
  return {
    type: "EXCHANGE.TX_BROADCAST_FULFILLED",
    payload: txHash,
  }
}

export function doTransactionFail(error) {
  return {
    type: "EXCHANGE.TX_BROADCAST_REJECTED",
    payload: error
  }
}

export function doApprovalTransaction(id, ethereum, tx, callback) {
  return {
    type: "EXCHANGE.APPROVAL_TX_BROADCAST_PENDING",
    payload: { ethereum, tx, callback },
    meta: id,
  }
}

export function doApprovalTransactionComplete(txHash, id) {
  return {
    type: "EXCHANGE.APPROVAL_TX_BROADCAST_FULFILLED",
    payload: txHash,
    meta: id,
  }
}

export function doApprovalTransactionFail(error) {
  return {
    type: "EXCHANGE.APPROVAL_TX_BROADCAST_REJECTED",
    payload: error,
  }
}

export function resetSignError() {
  return {
    type: "EXCHANGE.RESET_SIGN_ERROR",
  }
}

export function setSignError(error) {
  return {
    type: "EXCHANGE.SET_SIGN_ERROR",
    payload: error,
  }
}

export function resetBroadcastError() {
  return {
    type: "EXCHANGE.RESET_BROADCAST_ERROR",
  }
}

export function setBroadcastError(error) {
  return {
    type: "EXCHANGE.SET_BROADCAST_ERROR",
    payload: error,
  }
}

export function makeNewExchange() {
  return {
    type: "EXCHANGE.MAKE_NEW_EXCHANGE"
  }
}

export function updateCurrentBalance(sourceBalance, destBalance, txHash) {
  return {
    type: "EXCHANGE.UPDATE_CURRENT_BALANCE",
    payload: { sourceBalance, destBalance, txHash }
  }
}

export function setTermAndServices(value) {
  return {
    type: "EXCHANGE.SET_TERM_AND_SERVICES",
    payload: { value }
  }
}

export function setMinRate(value) {
  return {
    type: "EXCHANGE.SET_MIN_RATE",
    payload: { value }
  }
}

export function resetMinRate() {
  return {
    type: "EXCHANGE.RESET_MIN_RATE",
  }
}


export function estimateGas() {
  return {
    type: "EXCHANGE.ESTIMATE_GAS_USED",
  }
}

export function setEstimateGas(gas, gas_approve) {
  return {
    type: "EXCHANGE.SET_GAS_USED",
    payload: { gas, gas_approve }
  }
}

export function setEstimateGasSnapshot(gas, gas_approve){
  return {
    type: "EXCHANGE.SET_GAS_USED_SNAPSHOT",
    payload: { gas, gas_approve }
  }
}

export function swapToken() {
  return {
    type: "EXCHANGE.SWAP_TOKEN",
  }
}

export function setCapExchange(maxCap) {
  return {
    type: "EXCHANGE.SET_CAP_EXCHANGE",
    payload: { maxCap }
  }
}

export function thowErrorNotPossessKGt(message) {
  return {
    type: "EXCHANGE.THROW_NOT_POSSESS_KGT_ERROR",
    payload: message
  }
}

export function setMaxGasPrice(ethereum) {
  return {
    type: "EXCHANGE.SET_MAX_GAS_PRICE",
    payload: ethereum
  }
}

export function setMaxGasPriceComplete(maxGasPriceGwei) { 
  return {
    type: "EXCHANGE.SET_MAX_GAS_PRICE_COMPLETE",
    payload: maxGasPriceGwei
  }
}

export function setGasPriceSwapComplete(safeLowGas, standardGas, fastGas, defaultGas, selectedGas) {
  return {
    type: "EXCHANGE.SET_GAS_PRICE_SWAP_COMPLETE",
    payload: {safeLowGas, standardGas, defaultGas, fastGas, selectedGas}
  }
}

export function analyzeError(ethereum, txHash) {
  return {
    type: "EXCHANGE.ANALYZE_ERROR",
    payload: { ethereum, txHash}
  }
}

export function setAnalyzeError(networkIssues, txHash){
  return {
    type: "EXCHANGE.SET_ANALYZE_ERROR",
    payload: { networkIssues  , txHash}
  }
}


export function fetchGas(){
  return {
    type: "EXCHANGE.FETCH_GAS"
  }
}
export function fetchGasSnapshot(){
  return {
    type: "EXCHANGE.FETCH_GAS_SNAPSHOT"
  }
}

export function fetchGasSuccess(){
  return {
    type: "EXCHANGE.FETCH_GAS_SUCCESS"
  }
}

export function fetchGasSuccessSnapshot(){
  return {
    type: "EXCHANGE.FETCH_GAS_SUCCESS_SNAPSHOT"
  }
}

export function checkKyberEnable(){
  return {
    type: "EXCHANGE.CHECK_KYBER_ENABLE"
  }
}

export function setKyberEnable(enable){
  return {
    type: "EXCHANGE.SET_KYBER_ENABLE",
    payload: enable
  }
}

export function setApproveTx(hash, symbol){
  return {
    type: "EXCHANGE.SET_APPROVE_TX",
    payload: {hash, symbol}
  }
}

export function removeApproveTx(symbol){
  return {
    type: "EXCHANGE.REMOVE_APPROVE_TX",
    payload: {symbol}
  }
}

export function setSnapshot(data){
  data.isFetchingRate = true
  return {
    type: "EXCHANGE.SET_SNAPSHOT",
    payload: data
  }
}

export function verifyExchange(){
  return {
    type: "EXCHANGE.VERIFY_EXCHANGE",
  }
}

export function fetchExchangeEnable(){
  return {
    type: "EXCHANGE.FETCH_EXCHANGE_ENABLE",
  }
}

export function setExchangeEnable(enable){
  return {
    type: "EXCHANGE.SET_EXCHANGE_ENABLE",
    payload: enable
  }
}

export function updateBalanceData(balanceData, hash){
  return {
    type: "EXCHANGE.UPDATE_BALANCE_DATA",
    payload: {balanceData, hash}
  }
}

export function throwErrorHandleAmount(){
  return {
    type: "EXCHANGE.HANDLE_AMOUNT"
  }
}