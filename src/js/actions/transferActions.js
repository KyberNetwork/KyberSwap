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

export function goToStep(step) {
  return {
    type: "TRANSFER.GO_TO_STEP",
    payload: step
  }
}

export function openPassphrase() {
  return {
    type: "TRANSFER.OPEN_PASSPHRASE",
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

export function hideConfirm() {
  return {
    type: "TRANSFER.HIDE_CONFIRM",
  }
}

export function showConfirm() {
  return {
    type: "TRANSFER.SHOW_CONFIRM",

  }
}

export function specifyAddressReceive(value) {
  return {
    type: "TRANSFER.TRANSFER_SPECIFY_ADDRESS_RECEIVE",
    payload: value.trim()
  }
}

export function specifyAmountTransfer(value) {
  return {
    type: "TRANSFER.TRANSFER_SPECIFY_AMOUNT",
    payload: value
  }
}

export function throwErrorDestAddress(message) {
  return {
    type: "TRANSFER.THROW_ERROR_DEST_ADDRESS",
    payload: message
  }
}


export function thowErrorAmount(message) {
  return {
    type: "TRANSFER.THROW_AMOUNT_ERROR",
    payload: message
  }
}

export function thowErrorEthBalance(message){
  return {
    type: "TRANSFER.THROW_ETH_BALANCE_ERROR",
    payload: message
  }
}

export function thowErrorGasPrice(message) {
  return {
    type: "TRANSFER.THROW_GAS_PRICE_ERROR",
    payload: message
  }
}

export function hidePassphrase() {
  return {
    type: "TRANSFER.HIDE_PASSPHRASE",
  }
}

export function changePassword() {
  return {
    type: "TRANSFER.CHANGE_PASSPHRASE",
  }
}

export function prePareBroadcast(balanceData) {
  return {
    type: "TRANSFER.PREPARE_TRANSACTION",
    payload: {balanceData: balanceData}
  }
}

export function finishTransfer() {
  return {
    type: "TRANSFER.FINISH_TRANSACTION"
  }
}

export function throwPassphraseError(message) {
  return {
    type: "TRANSFER.THROW_ERROR_PASSPHRASE",
    payload: message
  }
}

export function processTransfer(formId, ethereum, address,
  token, amount,
  destAddress, nonce, gas,
  gasPrice, keystring, type, password, account, data, keyService, balanceData) {
  return {
    type: "TRANSFER.PROCESS_TRANSFER",
    payload: {
      formId, ethereum, address,
      token, amount,
      destAddress, nonce, gas,
      gasPrice, keystring, type, password, account, data, keyService, balanceData
    }
  }
}

export function doTransaction(id, ethereum, tx, account, data) {
  return {
    type: "TRANSFER.TX_BROADCAST_PENDING",
    payload: { ethereum, tx, account, data },
  }
}

export function doTransactionComplete(txHash) {
  return {
    type: "TRANSFER.TX_BROADCAST_FULFILLED",
    payload: txHash,
  }
}

export function doTransactionFail(error) {
  return {
    type: "TRANSFER.TX_BROADCAST_REJECTED",
    payload: error,
  }
}


export function resetSignError() {
  return {
    type: "TRANSFER.RESET_SIGN_ERROR",
  }
}

export function setSignError(error) {
  return {
    type: "TRANSFER.SET_SIGN_ERROR",
    payload: error,
  }
}

export function resetBroadcastError() {
  return {
    type: "TRANSFER.RESET_BROADCAST_ERROR",
  }
}

export function setBroadcastError(error) {
  return {
    type: "TRANSFER.SET_BROADCAST_ERROR",
    payload: error,
  }
}

export function throwErrorSignTransferTransaction(error) {
  return {
    type: "TRANSFER.THROW_ERROR_SIGN_TRANSACTION",
    payload: error
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


export function setTermAndServices(value){
  return {
    type: "TRANSFER.SET_TERM_AND_SERVICES",
    payload: {value}
  }
}

export function fetchGasSnapshot(){
  return {
    type: "TRANSFER.FETCH_GAS_SNAPSHOT"
  }
}

export function fetchSnapshotGasSuccess(){
  return {
    type: "TRANSFER.FETCH_SNAPSHOT_GAS_SUCCESS"
  }
}

// export function fetchGas(){
//   return {
//     type: "TRANSFER.FETCH_GAS"
//   }
// }
// export function fetchGasSuccess(){
//   return {
//     type: "TRANSFER.FETCH_GAS_SUCCESS"
//   }
// }
export function estimateGasTransfer(){
  return {
    type: "TRANSFER.ESTIMATE_GAS_USED"
  }
}

export function setGasUsed(gas){
  return {
    type: "TRANSFER.SET_GAS_USED",
    payload: {gas}
  }
}

export function setGasUsedSnapshot(gas){
  return {
    type: "TRANSFER.SET_GAS_USED_SNAPSHOT",
    payload: {gas}
  }
}

export function verifyTransfer(){
  return {
    type: "TRANSFER.VERIFY_TRANSFER",
  }
}

export function setSnapshot(data){
  return {
    type: "TRANSFER.SET_SNAPSHOT",
    payload: data
  }
}

export function setGasPriceTransferComplete(safeLowGas, standardGas, fastGas, defaultGas, selectedGas){
  return {
    type: "TRANSFER.SET_GAS_PRICE_TRANSFER_COMPLETE",
    payload: {safeLowGas, standardGas, defaultGas, fastGas, selectedGas}
  }
}


export function seSelectedGas(level){
  return {
    type: "TRANSFER.SET_SELECTED_GAS",
    payload: {level: level}
  }
}

export function openImportAccount(){
  return {
    type: "TRANSFER.OPEN_IMPORT_ACCOUNT"
  }
}

export function closeImportAccountTransfer(){
  return {
    type: "TRANSFER.CLOSE_IMPORT_ACCOUNT"
  }
}