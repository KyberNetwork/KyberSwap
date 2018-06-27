import { take, put, call, fork, select, takeEvery, all } from 'redux-saga/effects'
import * as actions from '../actions/transferActions'
import * as utilActions from '../actions/utilActions'
import constants from "../services/constants"
import * as converter from "../utils/converter"
import * as ethUtil from 'ethereumjs-util'

import * as common from "./common"
import * as validators from "../utils/validators"
import * as analytics from "../utils/analytics"

import Tx from "../services/tx"
import { updateAccount, incManualNonceAccount } from '../actions/accountActions'
import { addTx } from '../actions/txActions'
import { store } from "../store"

function* broadCastTx(action) {
  const { ethereum, tx, account, data } = action.payload
  try {
    yield put(actions.prePareBroadcast())
    const hash = yield call([ethereum, ethereum.callMultiNode],"sendRawTransaction", tx)
    yield call(runAfterBroadcastTx, ethereum, tx, hash, account, data)

    
  }
  catch (e) {
    console.log(e)
    yield call(doTransactionFail, ethereum, account, e.message)
  }
}

export function* runAfterBroadcastTx(ethereum, txRaw, hash, account, data) {

  //track complete trade
  analytics.trackCoinTransfer(data.tokenSymbol)
  analytics.completeTrade(hash, "kyber", "transfer")

  const tx = new Tx(
    hash, account.address, ethUtil.bufferToInt(txRaw.gas),
    converter.weiToGwei(ethUtil.bufferToInt(txRaw.gasPrice)),
    ethUtil.bufferToInt(txRaw.nonce), "pending", "transfer", data)
  yield put(incManualNonceAccount(account.address))
  yield put(updateAccount(ethereum, account))
  yield put(addTx(tx))
  yield put(actions.doTransactionComplete(hash))
  yield put(actions.finishTransfer())
  
  try{
    var state = store.getState()
    var notiService = state.global.notiService
    notiService.callFunc("setNewTx",{hash: hash})
  }catch(e){
    console.log(e)
  }
}

function* doTransactionFail(ethereum, account, e) {
  yield put(actions.doTransactionFail(e))
  //yield put(incManualNonceAccount(account.address))
  yield put(updateAccount(ethereum, account))
}

function* doTxFail(ethereum, account, e) {
  yield put(actions.setBroadcastError(e))
  yield put(updateAccount(ethereum, account))
}

export function* processTransfer(action) {
  const { formId, ethereum, address,
    token, amount,
    destAddress, nonce, gas,
    gasPrice, keystring, type, password, account, data, keyService, balanceData } = action.payload
  var callService = token == constants.ETHER_ADDRESS ? "sendEtherFromAccount" : "sendTokenFromAccount"
  switch (type) {
    case "keystore":
      yield call(transferKeystore, action, callService)
      break
    case "privateKey":
    case "trezor":
    case "ledger":
      yield call(transferColdWallet, action, callService)
      break
    case "metamask":
      yield call(transferMetamask, action, callService)
      break
  }
}

function* transferKeystore(action, callService) {
  const { formId, ethereum, address,
    token, amount,
    destAddress, nonce, gas,
    gasPrice, keystring, type, password, account, data, keyService, balanceData } = action.payload
  try {
    var rawTx = yield call(keyService.callSignTransaction, callService, formId, ethereum, address,
      token, amount,
      destAddress, nonce, gas,
      gasPrice, keystring, type, password)
  } catch (e) {
    yield put(actions.throwPassphraseError(e.message))
    return
  }
  try {
    yield put(actions.prePareBroadcast(balanceData))
    const hash = yield call([ethereum, ethereum.callMultiNode],"sendRawTransaction", rawTx)
    yield call(runAfterBroadcastTx, ethereum, rawTx, hash, account, data)
  } catch (e) {
    yield call(doTxFail, ethereum, account, e.message)
  }

}

function* transferColdWallet(action, callService) {
  const { formId, ethereum, address,
    token, amount,
    destAddress, nonce, gas,
    gasPrice, keystring, type, password, account, data, keyService, balanceData } = action.payload
  try {
    var rawTx
    try {
      rawTx = yield call(keyService.callSignTransaction, callService, formId, ethereum, address,
        token, amount,
        destAddress, nonce, gas,
        gasPrice, keystring, type, password)
    } catch (e) {
      let msg = ''
      if(e.native && type == 'ledger'){
        msg = keyService.getLedgerError(e.native)
      }
      yield put(actions.setSignError(msg))
      return
    }
    
    yield put(actions.prePareBroadcast(balanceData))
    const hash = yield call([ethereum, ethereum.callMultiNode],"sendRawTransaction", rawTx)
    yield call(runAfterBroadcastTx, ethereum, rawTx, hash, account, data)
  } catch (e) {
    let msg = ''
    if(type == 'ledger'){
      msg = keyService.getLedgerError(e.native)
    }else{
      msg = e.message
    }
    yield call(doTxFail, ethereum, account, msg)
    return
  }
}

function* transferMetamask(action, callService) {
  const { formId, ethereum, address,
    token, amount,
    destAddress, nonce, gas,
    gasPrice, keystring, type, password, account, data, keyService, balanceData } = action.payload
  try {
    var hash
    try {
      hash = yield call(keyService.callSignTransaction, callService, formId, ethereum, address,
        token, amount,
        destAddress, nonce, gas,
        gasPrice, keystring, type, password)
    } catch (e) {
      console.log(e)
      yield put(actions.setSignError(e))
      return
    }
    
    yield put(actions.prePareBroadcast(balanceData))
    const rawTx = {gas, gasPrice, nonce}
    yield call(runAfterBroadcastTx, ethereum, rawTx, hash, account, data)
  } catch (e) {
    console.log(e)
    let msg = converter.sliceErrorMsg(e.message)
    yield call(doTxFail, ethereum, account, msg)
    return
  }
}


function* getMaxGasTransfer(){
  var state = store.getState()
  const transfer = state.transfer
  if (transfer.tokenSymbol !== 'DGX') {
    return transfer.gas_limit
  }else{
    return 250000
  }
}

function* estimateGasUsed(action){
  var state = store.getState()
  var transfer = state.transfer

  var tokens = state.tokens.tokens
  var decimal = 18
  var tokenSymbol = state.transfer.tokenSymbol
  if (tokens[tokenSymbol]) {
    decimal = tokens[tokenSymbol].decimal
  }

  var account = state.account.account
  var fromAddr = account.address

  var gasRequest = yield call(common.handleRequest, calculateGasUse, fromAddr, transfer.tokenSymbol, transfer.token, decimal, transfer.amount)
  if (gasRequest.status === "success"){
    const gas = gasRequest.data
    yield put(actions.setGasUsed(gas))
  }
  if ((gasRequest.status === "timeout") || (gasRequest.status === "fail")){
    //var state = store.getState()
    //var transfer = state.transfer
    var gasLimit = yield call(getMaxGasTransfer)
    yield put(actions.setGasUsed(gasLimit))
  }
//  yield call(calculateGasUse, fromAddr, transfer.tokenSymbol, transfer.token, decimal, transfer.amount)
}



function* estimateGasUsedWhenSelectToken(action){
  const { symbol, address } = action.payload

  var state = store.getState()
  var transfer = state.transfer

  var tokens = state.tokens.tokens
  var decimal = 18
  var tokenSymbol = symbol
  if (tokens[tokenSymbol]) {
    decimal = tokens[tokenSymbol].decimal
  }

  var account = state.account.account
  var fromAddr = account.address

  var gasRequest = yield call(common.handleRequest, calculateGasUse, fromAddr, tokenSymbol, address, decimal, transfer.amount)
  if (gasRequest.status === "success"){
    const gas = gasRequest.data
    yield put(actions.setGasUsed(gas))
  }
  if ((gasRequest.status === "timeout") || (gasRequest.status === "fail")){
    // var state = store.getState()
    // var transfer = state.transfer
    // var gasLimit = transfer.gas_limit
    var gasLimit = yield call(getMaxGasTransfer)
    yield put(actions.setGasUsed(gasLimit))
  }

  //yield call(calculateGasUse, fromAddr, tokenSymbol, address, decimal, transfer.amount)
}

function* estimateGasUsedWhenChangeAmount(action){
  var amount = action.payload

  var state = store.getState()
  var transfer = state.transfer
  var tokens = state.tokens.tokens

  var decimal = 18
  var tokenSymbol = transfer.tokenSymbol
  if (tokens[tokenSymbol]) {
    decimal = tokens[tokenSymbol].decimal
  }

  var account = state.account.account
  var fromAddr = account.address

  var gasRequest = yield call(common.handleRequest, calculateGasUse, fromAddr, tokenSymbol, transfer.token, decimal, amount)
  if (gasRequest.status === "success"){
    const gas = gasRequest.data
    yield put(actions.setGasUsed(gas))
  }
  if ((gasRequest.status === "timeout") || (gasRequest.status === "fail")){
    // var state = store.getState()
    // var transfer = state.transfer
    // var gasLimit = transfer.gas_limit
    var gasLimit = yield call(getMaxGasTransfer)
    yield put(actions.setGasUsed(gasLimit))
  }

 // yield call(calculateGasUse, fromAddr, tokenSymbol, transfer.token, decimal, amount)
}


// function* fetchGas(){
//   var state = store.getState()
//   var transfer = state.transfer
//   var tokens = state.tokens.tokens

//   var decimal = 18
//   var tokenSymbol = transfer.tokenSymbol
//   if (tokens[tokenSymbol]) {
//     decimal = tokens[tokenSymbol].decimal
//   }

//   var account = state.account.account
//   var fromAddr = account.address



//   var gasRequest = yield call(common.handleRequest, calculateGasUse, fromAddr, tokenSymbol, transfer.token, decimal, transfer.amount)
//   if (gasRequest.status === "success"){
//     const gas = gasRequest.data
//     yield put(actions.setGasUsed(gas))
//   }
//   if ((gasRequest.status === "timeout") || (gasRequest.status === "fail")){
//     var state = store.getState()
//     var transfer = state.transfer
//     var gasLimit = transfer.gas_limit
//     yield put(actions.setGasUsed(gasLimit))
//   }

//   //yield call(calculateGasUse, fromAddr, tokenSymbol, transfer.token, decimal, transfer.amount)
//   yield put(actions.fetchGasSuccess())
// }

function* fetchGasSnapshot(){
  var state = store.getState()
  var transfer = state.transfer
  var tokens = state.tokens.tokens

  var decimal = 18
  var tokenSymbol = transfer.tokenSymbol
  if (tokens[tokenSymbol]) {
    decimal = tokens[tokenSymbol].decimal
  }

  var account = state.account.account
  var fromAddr = account.address



  var gasRequest = yield call(common.handleRequest, calculateGasUse, fromAddr, tokenSymbol, transfer.token, decimal, transfer.amount)
  if (gasRequest.status === "success"){
    const gas = gasRequest.data
    yield put(actions.setGasUsedSnapshot(gas))
  }
  if ((gasRequest.status === "timeout") || (gasRequest.status === "fail")){
    // var state = store.getState()
    // var transfer = state.transfer
    var gasLimit = yield call(getMaxGasTransfer)
    yield put(actions.setGasUsedSnapshot(gasLimit))
  }

  //yield call(calculateGasUse, fromAddr, tokenSymbol, transfer.token, decimal, transfer.amount)
  yield put(actions.fetchSnapshotGasSuccess())
}

function* calculateGasUse(fromAddr, tokenSymbol, tokenAddr, tokenDecimal, sourceAmount){
    var state = store.getState()
    var ethereum = state.connection.ethereum
    var transfer = state.transfer
    const amount = converter.stringToHex(sourceAmount, tokenDecimal)
    var gasLimit = yield call(getMaxGasTransfer)
    var gas = 0
    var internalAdrr = "0x3cf628d49ae46b49b210f0521fbd9f82b461a9e1"
    var txObj
    if (tokenSymbol === 'ETH'){
      var destAddr = transfer.destAddress !== "" ? transfer.destAddress : internalAdrr
      txObj = {
        from : fromAddr,
        value: amount,
        to:destAddr
      }
      try{
        gas = yield call([ethereum, ethereum.call],"estimateGas", txObj)
        if(gas > 21000){
          gas = Math.round(gas * 120 / 100)
        }
        return {status: "success", res: gas}
      //  yield put(actions.setGasUsed(gas))
      }catch(e){
        console.log(e.message)
        return {"status": "success", res: gasLimit}
        //yield put(actions.setGasUsed(gasLimit))
      }
    }else{
      try{
        var destAddr = transfer.destAddress !== "" ? transfer.destAddress : internalAdrr
        var data = yield call([ethereum, ethereum.call],"sendTokenData", tokenAddr, amount, destAddr)
        txObj = {
          from : fromAddr,
          value:"0",
          to:tokenAddr,
          data: data
        }
        gas = yield call([ethereum, ethereum.call],"estimateGas", txObj)
        gas = Math.round(gas * 120 / 100)
        return {"status": "success", res: gas}
        //return gas
      //  yield put(actions.setGasUsed(gas))
      }catch(e){
        console.log(e.message)
        return {"status": "success", res: gasLimit}
        //return gasLimit
        //yield put(actions.setGasUsed(gasLimit))
      }
    }
}

export function* verifyTransfer(){
  var state = store.getState()
  var transfer = state.transfer

  var amount = transfer.amount
  if (isNaN(amount) || amount === "") {
    amount = 0
  }
  
  var testBalanceWithFee = validators.verifyBalanceForTransaction(state.tokens.tokens['ETH'].balance,
  transfer.tokenSymbol, amount, transfer.gas, transfer.gasPrice)
  if (testBalanceWithFee) {
    yield put(actions.thowErrorEthBalance("error.eth_balance_not_enough_for_fee"))
  }else{
    yield put(actions.thowErrorEthBalance(""))
  }
}

export function* watchTransfer() {
  yield takeEvery("TRANSFER.TX_BROADCAST_PENDING", broadCastTx)
  yield takeEvery("TRANSFER.PROCESS_TRANSFER", processTransfer)

  yield takeEvery("TRANSFER.ESTIMATE_GAS_USED", estimateGasUsed)
  yield takeEvery("TRANSFER.SELECT_TOKEN", estimateGasUsedWhenSelectToken)
  yield takeEvery("TRANSFER.TRANSFER_SPECIFY_AMOUNT", estimateGasUsedWhenChangeAmount)
  //yield takeEvery("TRANSFER.FETCH_GAS", fetchGas)
  yield takeEvery("TRANSFER.FETCH_GAS_SNAPSHOT", fetchGasSnapshot)
  yield takeEvery("TRANSFER.VERIFY_TRANSFER", verifyTransfer)
}