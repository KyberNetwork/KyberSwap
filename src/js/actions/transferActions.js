export function selectToken(symbol, address) {
  return {
    type: "TRANSFER.SELECT_TOKEN",
    payload: { symbol, address }
  }
}

export function errorSelectToken(message) {
  return {
    type: "TRANSFER.THOW_ERROR_SELECT_TOKEN",
    payload: message
  }
}

export function specifyGas(value) {
  return {
    type: "TRANSFER_SPECIFY_GAS",
    payload: value
  }
}

export function setRandomTransferSelectedToken(random) {
  return {
    type: "TRANSFER.SET_RANDOM_SELECTED_TOKEN",
    payload: random
  }
}

export function specifyGasPrice(value) {
  return {
    type: "TRANSFER_SPECIFY_GAS_PRICE",
    payload: value
  }
}

export function toggleAdvance() {
  return {
    type: "TRANSFER.TOGGLE_ADVANCE",
  }
}

export function setDestEthNameAndAddress(destAddress, destEthName) {
  return {
    type: "TRANSFER.SET_DEST_ETH_NAME_AND_ADDRESS",
    payload: { destAddress, destEthName }
  }
}

export function clearTransferError() {
  return {
    type: "TRANSFER.CLEAR_TRANSFER_ERROR"
  }
}

export function specifyAmountTransfer(value) {
  return {
    type: "TRANSFER.TRANSFER_SPECIFY_AMOUNT",
    payload: value
  }
}

export function estimateGasWhenAmountChange(value) {
  return {
    type: "TRANSFER.ESTIMATE_GAS_WHEN_AMOUNT_CHANGE",
    payload: value
  }
}

export function throwErrorDestAddress(key, message) {
  return {
    type: "TRANSFER.THROW_ERROR_DEST_ADDRESS",
    payload: { key, message }
  }
}


export function clearErrorDestAddress(key) {
  return {
    type: "TRANSFER.CLEAR_ERROR_DEST_ADDRESS",
    payload: { key }
  }
}


export function throwErrorAmount(key, message) {
  return {
    type: "TRANSFER.THROW_AMOUNT_ERROR",
    payload: {key, message}
  }
}

export function clearErrorAmount(key) {
  return {
    type: "TRANSFER.CLEAR_ERROR_AMOUNT",
    payload: { key }
  }
}

export function finishTransfer() {
  return {
    type: "TRANSFER.FINISH_TRANSACTION"
  }
}

export function doTransactionComplete(tx) {
  return {
    type: "TRANSFER.TX_BROADCAST_FULFILLED",
    payload: {tx},
  }
}

export function updateTransferPath(transferPath, currentPathIndex){
  return {
    type: "TRANSFER.UPDATE_TRANSFER_PATH",
    payload: { transferPath, currentPathIndex }
  }
}

export function resetTransferPath() {
  return {
    type: "TRANSFER.RESET_TRANSFER_PATH"
  }
}

export function  forwardTransferPath() {
  return {
    type: "TRANSFER.FORWARD_TRANSFER_PATH"
  }
}


export function makeNewTransfer() {
  return {
    type: "TRANSFER.MAKE_NEW_TRANSFER"
  }
}


export function updateCurrentBalance(tokenBalance, txHash) {
  return {
    type: "TRANSFER.UPDATE_CURRENT_BALANCE",
    payload: { tokenBalance, txHash }
  }
}

export function estimateGasTransfer(ethereum) {
  return {
    type: "TRANSFER.ESTIMATE_GAS_USED",
    payload: {ethereum}
  }
}

export function setGasUsed(gas) {
  return {
    type: "TRANSFER.SET_GAS_USED",
    payload: { gas }
  }
}

export function setGasUsedSnapshot(gas) {
  return {
    type: "TRANSFER.SET_GAS_USED_SNAPSHOT",
    payload: { gas }
  }
}

export function verifyTransfer() {
  return {
    type: "TRANSFER.VERIFY_TRANSFER",
  }
}

export function setSnapshot(data) {
  return {
    type: "TRANSFER.SET_SNAPSHOT",
    payload: data
  }
}

export function setGasPriceTransferComplete(safeLowGas, standardGas, fastGas, superFastGas, defaultGas, selectedGas) {
  return {
    type: "TRANSFER.SET_GAS_PRICE_TRANSFER_COMPLETE",
    payload: { safeLowGas, standardGas, defaultGas, fastGas, superFastGas, selectedGas }
  }
}

export function setGasPriceSuggest(gasPriceSuggest) {
  return {
    type: "TRANSFER.SET_GAS_PRICE_SUGGEST",
    payload: gasPriceSuggest
  }
}

export function seSelectedGas(level) {
  return {
    type: "TRANSFER.SET_SELECTED_GAS",
    payload: { level: level }
  }
}

export function openImportAccount() {
  return {
    type: "TRANSFER.OPEN_IMPORT_ACCOUNT"
  }
}

export function closeImportAccountTransfer() {
  return {
    type: "TRANSFER.CLOSE_IMPORT_ACCOUNT"
  }
}

export function toggleBalanceContent() {
  return {
    type: "TRANSFER.TOGGLE_BALANCE_CONTENT"
  }
}

export function toggleAdvanceContent() {
  return {
    type: "TRANSFER.TOGGLE_ADVANCE_CONTENT"
  }
}

export function setIsOpenAdvance() {
  return {
    type: "TRANSFER.SET_IS_OPEN_ADVANCE",
    payload: true
  }
}

export function clearIsOpenAdvance() {
  return {
    type: "TRANSFER.SET_IS_OPEN_ADVANCE",
    payload: false
  }
}

export function setSelectedGasPrice(gasPrice, gasLevel) {
  return {
    type: "TRANSFER.SET_SELECTED_GAS_PRICE",
    payload: { gasPrice, gasLevel }
  }
}

export function setIsSelectTokenBalance(value) {
  return {
    type: "TRANSFER.SET_IS_SELECT_TOKEN_BALANCE",
    payload: value
  }
}
