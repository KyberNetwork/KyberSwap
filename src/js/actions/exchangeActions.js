export function selectToken(sourceTokenSymbol, sourceToken, destTokenSymbol, destToken, type) {
  return {
    type: "EXCHANGE.SELECT_TOKEN",
    payload: { sourceTokenSymbol, sourceToken, destTokenSymbol, destToken, type}
  }
}
export function checkSelectToken() {
  return {
    type: "EXCHANGE.CHECK_SELECT_TOKEN"
  }
}

export function caculateAmount(sourceTokenDecimals, destTokenDecimals) {
  return {
    type: "EXCHANGE.CACULATE_AMOUNT",
    payload: { sourceTokenDecimals, destTokenDecimals }
  }
}

export function inputChange(focus, value, sourceTokenDecimals, destTokenDecimals) {
  return {
    type: "EXCHANGE.INPUT_CHANGE",
    payload: { focus, value, sourceTokenDecimals, destTokenDecimals }
  }
}

export function focusInput(focus) {
  return {
    type: "EXCHANGE.FOCUS_INPUT",
    payload: focus
  }
}

export function throwErrorSourceAmount(key, message) {
  return {
    type: "EXCHANGE.THROW_ERROR_SOURCE_AMOUNT",
    payload: {key, message}
  }
}

export function clearErrorSourceAmount(key) {
  return {
    type: "EXCHANGE.CLEAR_ERROR_SOURCE_AMOUNT",
    payload: {key}
  }
}

export function throwErrorSlippageRate(key, message) {
  return {
    type: "EXCHANGE.THROW_ERROR_SLIPPAGE_RATE",
    payload: {key, message}
  }
}

export function seSelectedGas(level) {
  return {
    type: "EXCHANGE.SET_SELECTED_GAS",
    payload: { level: level }
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

export function updateRate(ethereum, sourceTokenSymbol, sourceToken, destTokenSymbol, destToken, sourceAmount, isManual = false, refetchSourceAmount = false, type = null) {
  return {
    type: "EXCHANGE.UPDATE_RATE_PENDING",
    payload: { ethereum, sourceTokenSymbol, sourceToken, destTokenSymbol, destToken, sourceAmount, isManual, refetchSourceAmount, type }
  }
}

export function updateRateExchangeComplete(
  expectedRateInit, expectedPrice, slippagePrice, isManual,
  percentChange, srcTokenDecimal, destTokenDecimal, isRefPriceFromChainLink
) {
  return {
    type: "EXCHANGE.UPDATE_RATE_COMPLETE",
    payload: {
      expectedRateInit, expectedPrice, slippagePrice, isManual,
      percentChange, srcTokenDecimal, destTokenDecimal, isRefPriceFromChainLink
    }
  }
}

export function finishExchange() {
  return {
    type: "EXCHANGE.FINISH_EXCHANGE"
  }
}

export function doTransactionComplete(tx) {
  return {
    type: "EXCHANGE.TX_BROADCAST_FULFILLED",
    payload: {tx},
  }
}

export function makeNewExchange() {
  return {
    type: "EXCHANGE.MAKE_NEW_EXCHANGE"
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

export function estimateGasNormal(srcAmount) {
  return {
    type: "EXCHANGE.ESTIMATE_GAS_USED_NORMAL",
    payload: {srcAmount: srcAmount}
  }
}

export function setEstimateGas(gas, gas_approve) {
  return {
    type: "EXCHANGE.SET_GAS_USED",
    payload: { gas, gas_approve }
  }
}

export function setEstimateGasSnapshot(gas, gas_approve) {
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

export function fetchMaxGasPrice(ethereum) {
  return {
    type: "EXCHANGE.FETCH_MAX_GAS_PRICE",
    payload: ethereum
  }
}

export function setMaxGasPriceComplete(maxGasPriceGwei) {
  return {
    type: "EXCHANGE.SET_MAX_GAS_PRICE_COMPLETE",
    payload: maxGasPriceGwei
  }
}

export function setGasPriceSuggest(gasPriceSuggest) {
  return {
    type: "EXCHANGE.SET_GAS_PRICE_SUGGEST",
    payload: gasPriceSuggest
  }
}

export function fetchGas() {
  return {
    type: "EXCHANGE.FETCH_GAS"
  }
}

export function fetchGasSuccess() {
  return {
    type: "EXCHANGE.FETCH_GAS_SUCCESS"
  }
}

export function checkKyberEnable(ethereum) {
  return {
    type: "EXCHANGE.CHECK_KYBER_ENABLE",
    payload: {ethereum}
  }
}

export function setSnapshot(data) {
  data.isFetchingRate = true
  return {
    type: "EXCHANGE.SET_SNAPSHOT",
    payload: data
  }
}

export function verifyExchange() {
  return {
    type: "EXCHANGE.VERIFY_EXCHANGE",
  }
}

export function openImportAccount() {
  return {
    type: "EXCHANGE.OPEN_IMPORT_ACCOUNT"
  }
}

export function closeImportAccountExchange() {
  return {
    type: "EXCHANGE.CLOSE_IMPORT_ACCOUNT"
  }
}

export function toggleBalanceContent() {
  return {
    type: "EXCHANGE.TOGGLE_BALANCE_CONTENT"
  }
}
export function toggleAdvanceContent() {
  return {
    type: "EXCHANGE.TOGGLE_ADVANCE_CONTENT"
  }
}

export function setIsOpenAdvance() {
  return {
    type: "EXCHANGE.SET_IS_OPEN_ADVANCE",
    payload: true
  }
}

export function clearIsOpenAdvance() {
  return {
    type: "EXCHANGE.SET_IS_OPEN_ADVANCE",
    payload: false
  }
}

export function setSelectedGasPrice(gasPrice, gasLevel) {
  return {
    type: "EXCHANGE.SET_SELECTED_GAS_PRICE",
    payload: { gasPrice, gasLevel }
  }
}

export function setIsSelectTokenBalance(value) {
  return {
    type: "EXCHANGE.SET_IS_SELECT_TOKEN_BALANCE",
    payload: value
  }
}

export function changeAmount(input, value){
  return {
    type: "EXCHANGE.CHANGE_AMOUNT",
    payload: {input, value}
  }
}

export function setCustomRateInputError(isError) {
  return {
    type: "EXCHANGE.SET_CUSTOM_RATE_INPUT_ERROR",
    payload: isError
  }
}

export function setCustomRateInputDirty(isDirty) {
  return {
    type: "EXCHANGE.SET_CUSTOM_RATE_INPUT_DIRTY",
    payload: isDirty
  }
}

export function setCustomRateInputValue(value) {
  return {
    type: "EXCHANGE.SET_CUSTOM_RATE_INPUT_VALUE",
    payload: value
  }
}

export function setIsSelectCustomRate(value) {
  return {
    type: "EXCHANGE.SET_IS_SELECT_CUSTOM_RATE_INPUT",
    payload: value
  }
}

export function updateExchangePath(exchangePath, currentPathIndex){
  return {
    type: "EXCHANGE.UPDATE_EXCHANGE_PATH",
    payload: { exchangePath, currentPathIndex }
  }
}

export function resetExchangePath() {
  return {
    type: "EXCHANGE.RESET_EXCHANGE_PATH"
  }
}

export function  forwardExchangePath() {
  return {
    type: "EXCHANGE.FORWARD_EXCHANGE_PATH"
  }
}

export function saveApproveZeroTx(sourceTokenSymbol, txHash) {
  return {
    type: "EXCHANGE.SAVE_APPROVE_ZERO_TX",
    payload: { sourceTokenSymbol, txHash }
  }
}

export function saveApproveMaxTx(sourceTokenSymbol, txHash) {
  return {
    type: "EXCHANGE.SAVE_APPROVE_MAX_TX",
    payload: { sourceTokenSymbol, txHash }
  }
}

export function setPlatformFee(fee) {
  return {
    type: "EXCHANGE.SET_PLATFORM_FEE",
    payload: fee
  }
}
