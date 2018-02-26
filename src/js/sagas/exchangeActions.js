import { take, put, call, fork, select, takeEvery, all, apply, cancel } from 'redux-saga/effects'
import { delay } from 'redux-saga';
import * as actions from '../actions/exchangeActions'
import * as globalActions from "../actions/globalActions"

import { updateAccount, incManualNonceAccount } from '../actions/accountActions'
import { addTx } from '../actions/txActions'
import * as utilActions from '../actions/utilActions'
import constants from "../services/constants"
import * as converter from "../utils/converter"
import * as common from "../utils/common"
import * as ethUtil from 'ethereumjs-util'
import Tx from "../services/tx"
import { getTranslate, getActiveLanguage } from 'react-localize-redux';
import { store } from '../store';
import BLOCKCHAIN_INFO from "../../../env"
import bowser from 'bowser'


function* broadCastTx(action) {
  const { ethereum, tx, account, data } = action.payload
  try {
    yield put(actions.prePareBroadcast())
    const hash = yield call([ethereum, ethereum.callMultiNode], "sendRawTransaction", tx)
    yield call(runAfterBroadcastTx, ethereum, tx, hash, account, data)
  }
  catch (e) {
    console.log(e)
    yield call(doTransactionFail, ethereum, account, e.message)
  }
}

function* approveTx(action) {
  try {
    const { ethereum, tx, callback } = action.payload
    const hash = yield call([ethereum, ethereum.callMultiNode], "sendRawTransaction", tx)
    callback(hash, tx)
    yield put(actions.doApprovalTransactionComplete(hash, action.meta))
  }
  catch (e) {
    console.log(e)
    yield put(actions.doApprovalTransactionFail(e.message, action.meta))
  }
}

function* selectToken(action) {
  const { symbol, address, type, ethereum } = action.payload
  yield put(actions.selectToken(symbol, address, type))
  yield put(utilActions.hideSelectToken())

  yield put(actions.checkSelectToken())
  yield call(ethereum.fetchRateExchange)

  //calculate gas use
  yield call(updateGasUsed)
}

export function* runAfterBroadcastTx(ethereum, txRaw, hash, account, data) {

  try{
    yield call(getInfo, hash)
  }catch(e){
    console.log(e)
  }

  //console.log({txRaw, hash, account, data})
  const tx = new Tx(
    hash, account.address, ethUtil.bufferToInt(txRaw.gas),
    converter.weiToGwei(ethUtil.bufferToInt(txRaw.gasPrice)),
    ethUtil.bufferToInt(txRaw.nonce), "pending", "exchange", data)
  yield put(incManualNonceAccount(account.address))
  yield put(updateAccount(ethereum, account))
  yield put(addTx(tx))
  yield put(actions.doTransactionComplete(hash))
  yield put(actions.finishExchange())
  yield put(actions.resetSignError())
  
  
  
  //estimate time for tx
  var state = store.getState()
  var gasInfo = state.exchange.gasPriceSuggest
  var gasPrice = state.exchange.gasPrice
  var estimateTime = common.estimateTimeTx({...gasInfo, gasPrice})
  
  var estimateTimeSecond = estimateTime * 60000
  
  store.dispatch(actions.setEstimateTimeProgress(estimateTimeSecond))
  
  var watchProgress = yield fork(watchProgressFunc, estimateTimeSecond)
  yield take(['GLOBAL.CLEAR_SESSION', 'EXCHANGE.MAKE_NEW_EXCHANGE'])
  yield cancel(watchProgress)  
}

export function* watchProgressFunc(estimateTime){
  var step = Math.round(estimateTime / 100)
  var stepProgress = Math.max(3000, step)
  console.log(stepProgress)
  var runner = 0
  while(true){
    console.log("Progress_running_exchange")
    if (runner > estimateTime) {
      store.dispatch(actions.showInfoProgress())  
      return
    }
    //check tx is mined
    var state = store.getState()
    var hash = state.exchange.txHash
    var txs = state.txs
    if (txs[hash] && txs[hash].status !== "pending"){
      return
    }
    
    store.dispatch(actions.setCurrentTimeProgress(runner))
    runner += stepProgress
    yield call(delay, stepProgress)
  }
}

function* getInfo(hash){
  var state = store.getState()
  var ethereum = state.connection.ethereum
  // var timestamp = Date.now()
  // var language = getActiveLanguage(state.locale).code
  // var device = state.account.account.type
  // var sender = state.account.account.address
  
  // var exchange = state.exchange.snapshot
  // var minRate = exchange.minConversionRate
  // var offeredRate = exchange.offeredRate
  // var sourceToken = exchange.sourceToken
  // var sourceTokenSymbol = exchange.sourceTokenSymbol
  // var sourceAmount = exchange.sourceAmount
  // var maxDestAmount = exchange.maxDestAmount
  // var destTokenSymbol = exchange.destTokenSymbol
  // var destToken = exchange.destToken
  // var gasPrice = exchange.gasPrice
  // var gas = exchange.gas
  // var browserName = bowser.name
  yield call([ethereum, ethereum.call], "getInfo", {hash})

  // yield call([ethereum, ethereum.call], "getInfo", {hash, timestamp, language, device, sender, minRate, 
  //                                 offeredRate, sourceToken, sourceTokenSymbol, sourceAmount, maxDestAmount, destTokenSymbol, destToken, gasPrice, gas, browserName})
}


function* doTransactionFail(ethereum, account, e) {
  yield put(actions.doTransactionFail(e))
  yield put(updateAccount(ethereum, account))
}

function* doApproveTransactionFail(ethereum, account, e) {
  yield put(actions.doApprovalTransactionFail(e))
  yield put(updateAccount(ethereum, account))
}

function* doTxFail(ethereum, account, e) {
  yield put(actions.setBroadcastError(e))
  yield put(updateAccount(ethereum, account))
}


function isApproveTxPending() {
  //check have approve tx
  const state = store.getState()
  const tokens = state.tokens.tokens
  const sourceTokenSymbol = state.exchange.sourceTokenSymbol
  return !!tokens[sourceTokenSymbol].approveTx
}

export function* checkTokenBalanceOfColdWallet(action) {
  const { formId, ethereum, address, sourceToken,
    sourceAmount, destToken, destAddress,
    maxDestAmount, minConversionRate,
    throwOnFailure, nonce, gas,
    gasPrice, keystring, type, password, account, data, keyService } = action.payload

  const remainStr = yield call([ethereum, ethereum.call], "getAllowanceAtLatestBlock", sourceToken, address)
  const remain = converter.hexToBigNumber(remainStr)
  const sourceAmountBig = converter.hexToBigNumber(sourceAmount)


  if (!remain.greaterThanOrEqualTo(sourceAmountBig) && !isApproveTxPending()) {
    yield put(actions.showApprove())
  } else {
    yield put(actions.showConfirm())
  }
}

function* processApprove(action) {
  const { ethereum, sourceToken, sourceAmount, nonce, gas, gasPrice,
    keystring, password, accountType, account, keyService, sourceTokenSymbol } = action.payload
  switch (accountType) {
    case "trezor":
    case "ledger":
      yield call(processApproveByColdWallet, action)
      break
    case "metamask":
      yield call(processApproveByMetamask, action)
      break
  }
}

export function* processApproveByColdWallet(action) {
  const { ethereum, sourceToken, sourceAmount, nonce, gas, gasPrice,
    keystring, password, accountType, account, keyService, sourceTokenSymbol } = action.payload
  //try {
    let rawApprove
    try {
      rawApprove = yield call(keyService.callSignTransaction, "getAppoveToken", ethereum, sourceToken, sourceAmount, nonce, gas, gasPrice,
        keystring, password, accountType, account.address)
    } catch (e) {
      let msg = ''
      if (e.native && accountType == 'ledger') {
        msg = keyService.getLedgerError(e.native)
      }
      yield put(actions.setSignError(msg))
      return
    }
    var hashApprove
    try{
      hashApprove = yield call([ethereum, ethereum.callMultiNode], "sendRawTransaction", rawApprove)
      console.log(hashApprove)
      yield put(actions.setApproveTx(hashApprove, sourceTokenSymbol))

      //increase nonce 
      yield put(incManualNonceAccount(account.address))

      yield put(actions.hideApprove())
      yield put(actions.showConfirm())
    }catch(e){
      console.log(e)
      yield call(doTxFail, ethereum, account, e.message)
    }

    //save approve to store

    
 // } catch (e) {
    //console.log(e)
    
 // }
}

export function* processApproveByMetamask(action) {
  const { ethereum, sourceToken, sourceAmount, nonce, gas, gasPrice,
    keystring, password, accountType, account, keyService, sourceTokenSymbol } = action.payload
  try {
    const hashApprove = yield call(keyService.callSignTransaction, "getAppoveToken", ethereum, sourceToken, sourceAmount, nonce, gas, gasPrice,
      keystring, password, accountType, account.address)

    yield put(actions.setApproveTx(hashApprove, sourceTokenSymbol))
    //const hashApprove = yield call(ethereum.call("sendRawTransaction"), rawApprove, ethereum)
    console.log(hashApprove)
    //return
    //increase nonce 
    yield put(incManualNonceAccount(account.address))

    yield put(actions.hideApprove())
    yield put(actions.showConfirm())
  } catch (e) {
    yield put(actions.setSignError(''))
  }
}

export function* processExchange(action) {
  const { formId, ethereum, address, sourceToken,
    sourceAmount, destToken, destAddress,
    maxDestAmount, minConversionRate,
    throwOnFailure, nonce, gas,
    gasPrice, keystring, type, password, account, data, keyService, balanceData, sourceTokenSymbol, blockNo } = action.payload

  if (sourceToken === constants.ETHER_ADDRESS) {
    switch (type) {
      case "keystore":
        yield call(exchangeETHtoTokenKeystore, action)
        break
      case "privateKey":
        yield call(exchangeETHtoTokenPrivateKey, action)
        break
      case "trezor":
      case "ledger":
        yield call(exchangeETHtoTokenColdWallet, action)
        break
      case "metamask":
        yield call(exchangeETHtoTokenMetamask, action)
        break
    }
  } else {
    switch (type) {
      case "keystore":
        yield call(exchangeTokentoETHKeystore, action)
        break
      case "privateKey":
        yield call(exchangeTokentoETHPrivateKey, action)
        break
      case "metamask":
        yield call(exchangeTokentoETHMetamask, action)
        break
      case "trezor":
      case "ledger":
        yield call(exchangeTokentoETHColdWallet, action)
        break
    }
  }
}

export function* exchangeETHtoTokenKeystore(action) {
  const { formId, ethereum, address, sourceToken,
    sourceAmount, destToken, destAddress,
    maxDestAmount, minConversionRate,
    throwOnFailure, nonce, gas,
    gasPrice, keystring, type, password, account, data, keyService, balanceData, sourceTokenSymbol, blockNo } = action.payload
  var txRaw
  try {
    txRaw = yield call(keyService.callSignTransaction, "etherToOthersFromAccount", formId, ethereum, address, sourceToken,
      sourceAmount, destToken, destAddress,
      maxDestAmount, minConversionRate,
      blockNo, nonce, gas,
      gasPrice, keystring, type, password)
  } catch (e) {
    console.log(e)
    yield put(actions.throwPassphraseError(e.message))
    return
  }
  try {
    yield put(actions.prePareBroadcast(balanceData))
    const hash = yield call([ethereum, ethereum.callMultiNode], "sendRawTransaction", txRaw)
    yield call(runAfterBroadcastTx, ethereum, txRaw, hash, account, data)
  } catch (e) {
    console.log(e)
    yield call(doTxFail, ethereum, account, e.message)
    return
  }
}

export function* exchangeETHtoTokenPrivateKey(action) {
  const { formId, ethereum, address, sourceToken,
    sourceAmount, destToken, destAddress,
    maxDestAmount, minConversionRate,
    throwOnFailure, nonce, gas,
    gasPrice, keystring, type, password, account, data, keyService, balanceData, sourceTokenSymbol, blockNo } = action.payload
  try {
    var txRaw
    try {
      txRaw = yield call(keyService.callSignTransaction, "etherToOthersFromAccount", formId, ethereum, address, sourceToken,
        sourceAmount, destToken, destAddress,
        maxDestAmount, minConversionRate,
        blockNo, nonce, gas,
        gasPrice, keystring, type, password)
    } catch (e) {
      console.log(e)
      yield put(actions.setSignError(e.message))
      return
    }

    yield put(actions.prePareBroadcast(balanceData))
    const hash = yield call([ethereum, ethereum.callMultiNode], "sendRawTransaction", txRaw)
    yield call(runAfterBroadcastTx, ethereum, txRaw, hash, account, data)
  } catch (e) {
    console.log(e)
    yield call(doTxFail, ethereum, account, e.message)
    return
  }
}

export function* exchangeETHtoTokenColdWallet(action) {
  const { formId, ethereum, address, sourceToken,
    sourceAmount, destToken, destAddress,
    maxDestAmount, minConversionRate,
    throwOnFailure, nonce, gas,
    gasPrice, keystring, type, password, account, data, keyService, balanceData, sourceTokenSymbol, blockNo } = action.payload
  try {
    var txRaw
    try {
      txRaw = yield call(keyService.callSignTransaction, "etherToOthersFromAccount", formId, ethereum, address, sourceToken,
        sourceAmount, destToken, destAddress,
        maxDestAmount, minConversionRate,
        blockNo, nonce, gas,
        gasPrice, keystring, type, password)
    } catch (e) {
      let msg = ''
      if (e.native && type == 'ledger') {
        msg = keyService.getLedgerError(e.native)
      }
      yield put(actions.setSignError(msg))
      return
    }
    yield put(actions.prePareBroadcast(balanceData))
    const hash = yield call([ethereum, ethereum.callMultiNode], "sendRawTransaction", txRaw)
    yield call(runAfterBroadcastTx, ethereum, txRaw, hash, account, data)
  } catch (e) {
    console.log(e)
    yield call(doTxFail, ethereum, account, e.message)
    return
  }
}

function* exchangeETHtoTokenMetamask(action) {
  const { formId, ethereum, address, sourceToken,
    sourceAmount, destToken, destAddress,
    maxDestAmount, minConversionRate,
    throwOnFailure, nonce, gas,
    gasPrice, keystring, type, password, account, data, keyService, balanceData, sourceTokenSymbol, blockNo } = action.payload
  try {
    var hash
    try {
      hash = yield call(keyService.callSignTransaction, "etherToOthersFromAccount", formId, ethereum, address, sourceToken,
        sourceAmount, destToken, destAddress,
        maxDestAmount, minConversionRate,
        blockNo, nonce, gas,
        gasPrice, keystring, type, password)
    } catch (e) {
      yield put(actions.setSignError(''))
      return
    }

    yield put(actions.prePareBroadcast(balanceData))
    const txRaw = { gas, gasPrice, nonce }
    yield call(runAfterBroadcastTx, ethereum, txRaw, hash, account, data)
  } catch (e) {
    let msg = converter.sliceErrorMsg(e.message)
    yield call(doTxFail, ethereum, account, e.message)
    return
  }
}

function* exchangeTokentoETHKeystore(action) {
  var { formId, ethereum, address, sourceToken,
    sourceAmount, destToken, destAddress,
    maxDestAmount, minConversionRate,
    throwOnFailure, nonce, gas,
    gasPrice, keystring, type, password, account, data, keyService, balanceData, sourceTokenSymbol, blockNo } = action.payload
  var remainStr = yield call([ethereum, ethereum.call], "getAllowanceAtLatestBlock", sourceToken, address)
  console.log("remain: " + remainStr)
  var remain = converter.hexToBigNumber(remainStr)
  var sourceAmountBig = converter.hexToBigNumber(sourceAmount)
  if (!remain.greaterThanOrEqualTo(sourceAmountBig) && !isApproveTxPending()) {
    var rawApprove
    try {
      rawApprove = yield call(keyService.callSignTransaction, "getAppoveToken", ethereum, sourceToken, sourceAmount, nonce, gas, gasPrice,
        keystring, password, type, address)
    } catch (e) {
      console.log(e)
      yield put(actions.throwPassphraseError(e.message))
      return
    }
    try {
      yield put(actions.prePareBroadcast(balanceData))
      var hashApprove, txRaw
      try {
        var hashApprove = yield call([ethereum, ethereum.callMultiNode], "sendRawTransaction", rawApprove)

        yield put(actions.setApproveTx(hashApprove, sourceTokenSymbol))
        console.log("approve: " + hashApprove)
        //increase nonce 
        yield put(incManualNonceAccount(account.address))
        nonce++
        txRaw = yield call(keyService.callSignTransaction, "tokenToOthersFromAccount", formId, ethereum, address, sourceToken,
          sourceAmount, destToken, destAddress,
          maxDestAmount, minConversionRate,
          blockNo, nonce, gas,
          gasPrice, keystring, type, password)
        yield put(actions.prePareBroadcast(balanceData))
      } catch (e) {
        console.log(e)
        yield call(doTxFail, ethereum, account, e.message)
        return
      }
      var hash = yield call([ethereum, ethereum.callMultiNode], "sendRawTransaction", txRaw)
      yield call(runAfterBroadcastTx, ethereum, txRaw, hash, account, data)
    } catch (e) {
      console.log(e)
      yield call(doTxFail, ethereum, account, e.message)
      return
    }
  } else {
    var txRaw
    try {
      txRaw = yield call(keyService.callSignTransaction, "tokenToOthersFromAccount", formId, ethereum, address, sourceToken,
        sourceAmount, destToken, destAddress,
        maxDestAmount, minConversionRate,
        blockNo, nonce, gas,
        gasPrice, keystring, type, password)
    } catch (e) {
      console.log(e)
      yield put(actions.throwPassphraseError(e.message))
      return
    }
    try {
      yield put(actions.prePareBroadcast(balanceData))
      const hash = yield call([ethereum, ethereum.callMultiNode], "sendRawTransaction", txRaw)
      yield call(runAfterBroadcastTx, ethereum, txRaw, hash, account, data)
    } catch (e) {
      console.log(e)
      yield call(doTxFail, ethereum, account, e.message)
      return
    }
  }
}
export function* exchangeTokentoETHPrivateKey(action) {
  var { formId, ethereum, address, sourceToken,
    sourceAmount, destToken, destAddress,
    maxDestAmount, minConversionRate,
    throwOnFailure, nonce, gas,
    gasPrice, keystring, type, password, account, data, keyService, balanceData, sourceTokenSymbol, blockNo } = action.payload
  try {
    var remainStr = yield call([ethereum, ethereum.call], "getAllowanceAtLatestBlock", sourceToken, address)
    var remain = converter.hexToBigNumber(remainStr)
    var sourceAmountBig = converter.hexToBigNumber(sourceAmount)
    if (!remain.greaterThanOrEqualTo(sourceAmountBig) && !isApproveTxPending()) {
      let rawApprove
      try {
        rawApprove = yield call(keyService.callSignTransaction, "getAppoveToken", ethereum, sourceToken, sourceAmount, nonce, gas, gasPrice,
          keystring, password, type, address)
      } catch (e) {
        yield put(actions.setSignError(e.message))
        return
      }

      yield put(actions.prePareBroadcast(balanceData))
      var hashApprove
      try {
        var hashApprove = yield call([ethereum, ethereum.callMultiNode], "sendRawTransaction", rawApprove)
        yield put(actions.setApproveTx(hashApprove, sourceTokenSymbol))
        console.log(hashApprove)
        //increase nonce 
        yield put(incManualNonceAccount(account.address))
        nonce++
      } catch (e) {
        console.log(e)
        yield call(doTxFail, ethereum, account, e.message)
        return
      }
    }

    var txRaw
    try {
      txRaw = yield call(keyService.callSignTransaction, "tokenToOthersFromAccount", formId, ethereum, address, sourceToken,
        sourceAmount, destToken, destAddress,
        maxDestAmount, minConversionRate,
        blockNo, nonce, gas,
        gasPrice, keystring, type, password)
    } catch (e) {
      yield put(actions.setSignError(e.message))
      return
    }
    yield put(actions.prePareBroadcast(balanceData))
    var hash = yield call([ethereum, ethereum.callMultiNode], "sendRawTransaction", txRaw)
    yield call(runAfterBroadcastTx, ethereum, txRaw, hash, account, data)
  } catch (e) {
    console.log(e)
    yield call(doTxFail, ethereum, account, e.message)
    return
  }
}

function* exchangeTokentoETHColdWallet(action) {
  const { formId, ethereum, address, sourceToken,
    sourceAmount, destToken, destAddress,
    maxDestAmount, minConversionRate,
    throwOnFailure, nonce, gas,
    gasPrice, keystring, type, password, account, data, keyService, balanceData, sourceTokenSymbol, blockNo } = action.payload
  try {
    let txRaw
    try {
      txRaw = yield call(keyService.callSignTransaction, "tokenToOthersFromAccount", formId, ethereum, address, sourceToken,
        sourceAmount, destToken, destAddress,
        maxDestAmount, minConversionRate,
        blockNo, nonce, gas,
        gasPrice, keystring, type, password)
    } catch (e) {
      let msg = ''
      if (e.native && type == 'ledger') {
        msg = keyService.getLedgerError(e.native)
      }
      yield put(actions.setSignError(msg))
      return
    }

    yield put(actions.prePareBroadcast(balanceData))
    const hash = yield call([ethereum, ethereum.callMultiNode], "sendRawTransaction", txRaw)
    yield call(runAfterBroadcastTx, ethereum, txRaw, hash, account, data)
  } catch (e) {
    yield call(doTxFail, ethereum, account, e.message)
    return
  }
}

export function* exchangeTokentoETHMetamask(action) {
  const { formId, ethereum, address, sourceToken,
    sourceAmount, destToken, destAddress,
    maxDestAmount, minConversionRate,
    throwOnFailure, nonce, gas,
    gasPrice, keystring, type, password, account, data, keyService, balanceData, sourceTokenSymbol, blockNo } = action.payload
  try {
    var hash
    try {
      hash = yield call(keyService.callSignTransaction, "tokenToOthersFromAccount", formId, ethereum, address, sourceToken,
        sourceAmount, destToken, destAddress,
        maxDestAmount, minConversionRate,
        blockNo, nonce, gas,
        gasPrice, keystring, type, password)
    } catch (e) {
      yield put(actions.setSignError(''))
      return
    }

    yield put(actions.prePareBroadcast(balanceData))
    const txRaw = { gas, gasPrice, nonce }
    yield call(runAfterBroadcastTx, ethereum, txRaw, hash, account, data)
  } catch (e) {
    console.log(e)
    yield call(doTxFail, ethereum, account, e.message)
    return
  }
}

function* updateRatePending(action) {
  const { ethereum, source, dest, sourceAmount, isManual, rateInit } = action.payload
  try {
    //get latestblock
    const lastestBlock = yield call([ethereum, ethereum.call],"getLatestBlock")
   // console.log(lastestBlock)
    const rate = yield call([ethereum, ethereum.call], "getRateAtSpecificBlock", source, dest, sourceAmount, lastestBlock)
    const expectedPrice = rate.expectedPrice ? rate.expectedPrice : "0"
    const slippagePrice = rate.slippagePrice ? rate.slippagePrice : "0"
    yield put.sync(actions.updateRateExchangeComplete(rateInit, expectedPrice, slippagePrice, lastestBlock))
    yield put(actions.caculateAmount())
  }
  catch (err) {    
    console.log(err)
    yield put.sync(actions.updateRateExchangeComplete(rateInit, "0", "0", 0))
    yield put(actions.setRateSystemError())
  }
}

function* updateRateSnapshot(action){
  const ethereum = action.payload
  var state = store.getState()
  var exchangeSnapshot = state.exchange.snapshot

  try {
    var source = exchangeSnapshot.sourceToken
    var dest = exchangeSnapshot.destToken
    var destTokenSymbol = exchangeSnapshot.destTokenSymbol
    var sourceAmount = exchangeSnapshot.sourceAmount
    var sourceDecimal = exchangeSnapshot.sourceDecimal
    var sourceAmountHex = converter.stringToHex(sourceAmount, sourceDecimal)
    var rateInit = 0

    const rate = yield call([ethereum, ethereum.call], "getRate", source, dest, sourceAmountHex)
    const expectedPrice = rate.expectedRate ? rate.expectedRate : "0"
    const slippagePrice = rate.slippageRate ? rate.slippageRate : "0"

    yield put.sync(actions.updateRateSnapshotComplete(rateInit, expectedPrice, slippagePrice))
    yield put(actions.caculateAmountInSnapshot())
  }
  catch (err) {
    console.log("===================")
    console.log(err)
  }
}

function* fetchGas(action) {
  yield call(updateGasUsed)
  yield put(actions.fetchGasSuccess())
}

function* updateGasUsed(action) {
  var state = store.getState()
  const ethereum = state.connection.ethereum
  const exchange = state.exchange
  const kyber_address = BLOCKCHAIN_INFO.network

  var gas = exchange.max_gas
  var gas_approve = 0

  var account = state.account.account
  var address = account.address

  var tokens = state.tokens.tokens
  var sourceDecimal = 18
  var sourceTokenSymbol = exchange.sourceTokenSymbol
  if (tokens[sourceTokenSymbol]) {
    sourceDecimal = tokens[sourceTokenSymbol].decimal
  }

  try {
    const sourceToken = exchange.sourceToken
    const sourceAmount = converter.stringToHex(exchange.sourceAmount, sourceDecimal)
    const destToken = exchange.destToken
    const maxDestAmount = converter.biggestNumber()
    const minConversionRate = converter.numberToHex(exchange.offeredRate)
    const blockNo = converter.numberToHexAddress(exchange.blockNo)
    const throwOnFailure = "0x0000000000000000000000000000000000000000"
    var data = yield call([ethereum, ethereum.call], "exchangeData", sourceToken, sourceAmount,
      destToken, address,
      maxDestAmount, minConversionRate, blockNo)
    var value = '0'
    if (exchange.sourceTokenSymbol === 'ETH') {
      value = sourceAmount
    } else {
      //calculate gas approve
      const remainStr = yield call([ethereum, ethereum.call], "getAllowanceAtLatestBlock", sourceToken, address)
      const remain = converter.hexToBigNumber(remainStr)
      const sourceAmountBig = converter.hexToBigNumber(sourceAmount)
      if (!remain.greaterThanOrEqualTo(sourceAmountBig)) {
        //calcualte gas approve
        var dataApprove = yield call([ethereum, ethereum.call], "approveTokenData", sourceToken, converter.biggestNumber())
        var txObjApprove = {
          from: address,
          to: sourceToken,
          data: dataApprove,
          value: '0x0',
        }
        gas_approve = yield call([ethereum, ethereum.call], "estimateGas", txObjApprove)
        gas_approve = Math.round(gas_approve * 120 / 100)
        if (gas_approve > exchange.max_gas_approve) {
          gas = exchange.max_gas_approve
        }
      } else {
        gas_approve = 0
      }
    }
    var txObj = {
      from: address,
      to: kyber_address,
      data: data,
      value: value,
    }
    gas = yield call([ethereum, ethereum.call], "estimateGas", txObj)
    gas = Math.round(gas * 120 / 100)
    if (gas > exchange.max_gas) {
      gas = exchange.max_gas
    }
  } catch (e) {
    console.log(e.message)
  }
  //console.log(gas, gas_approve)
  yield put(actions.setEstimateGas(gas, gas_approve))
}

function* analyzeError(action) {
  const { ethereum, txHash } = action.payload
  yield put(globalActions.openAnalyze(txHash))
  try {
    //var txHash = exchange.txHash
    //console.log(txHash)
    var tx = yield call([ethereum, ethereum.call], "getTx", txHash)
  //  console.log(tx)
    console.log(tx.input)
    // console.log(tx)
    var value = tx.value
    var owner = tx.from
    var gas_price = tx.gasPrice
    var blockNumber = tx.blockNumber

    var result = yield call([ethereum, ethereum.call], "exactTradeData", tx.input)
    var source = result[0].value
    var srcAmount = result[1].value
    var dest = result[2].value
    var destAddress = result[3].value
    var maxDestAmount = result[4].value
    var minConversionRate = result[5].value
    var walletID = result[6].value
    var reserves = yield call([ethereum, ethereum.call], "getListReserve")

    var input = {
      value, owner, gas_price, source, srcAmount, dest,
      destAddress, maxDestAmount, minConversionRate, walletID, reserves, txHash
    }

    yield call(debug, input, blockNumber, ethereum)
    //check gas price
  } catch (e) {
    console.log(e)
    yield put(globalActions.setAnalyzeError({}, {}, txHash))
  }
}

function* debug(input, blockno, ethereum) {
// console.log({input, blockno})
  var networkIssues = {}
  var reserveIssues = {}
  var translate = getTranslate(store.getState().locale)
  var gasCap = yield call([ethereum, ethereum.call], "wrapperGetGasCap", blockno)
  if (converter.compareTwoNumber(input.gas_price, gasCap) === 1) {
    networkIssues["gas_price"] = translate('error.gas_price_exceeded_limit') || "Gas price exceeded max limit"
  }
  if (input.source !== constants.ETHER_ADDRESS) {
    if (converter.compareTwoNumber(input.value, 0) === 1) {
      networkIssues["token_ether"] = translate('error.issue_token_ether') || "Failed because of sending ether along the tx when it is trying to trade token to ether"
    }
    var remainStr = yield call([ethereum, ethereum.call], "getAllowanceAtSpecificBlock", input.source, input.owner, blockno)
    if (converter.compareTwoNumber(remainStr, input.srcAmount) === -1) {
      networkIssues["allowance"] = translate('error.issue_allowance') || "Failed because allowance is lower than srcAmount"
    }
    var balance = yield call([ethereum, ethereum.call], "getTokenBalanceAtSpecificBlock", input.source, input.owner, blockno)
    if (converter.compareTwoNumber(balance, input.srcAmount) === -1) {
      networkIssues["balance"] = translate('error.issue_balance') || "Failed because token balance is lower than srcAmount"
    }
  } else {
    if (converter.compareTwoNumber(input.value, input.srcAmount) !== 0) {
      networkIssues["ether_amount"] = translate('error.issue_ether_amount') || "Failed because the user didn't send the exact amount of ether along"
    }
  }

  if (input.source === constants.ETHER_ADDRESS) {
    var userCap = yield call([ethereum, ethereum.call], "getMaxCapAtSpecificBlock", input.owner, blockno)
    if (converter.compareTwoNumber(input.srcAmount, userCap) === 1) {
      networkIssues["user_cap"] = translate('error.issue_user_cap') || "Failed because the source amount exceeded user cap"
    }
  }

  if (input.dest === constants.ETHER_ADDRESS) {
    var userCap = yield call([ethereum, ethereum.call], "getMaxCapAtSpecificBlock", input.owner, blockno)
    if (input.destAmount > userCap) {
      networkIssues["user_cap"] = translate('error.issue_user_cap') || "Failed because the source amount exceeded user cap"
    }
  }

  //Reserve scops
  var rates = yield call([ethereum, ethereum.call], "getRateAtSpecificBlock", input.source,input.dest, input.srcAmount, blockno)
  if (converter.compareTwoNumber(rates.expectedPrice, 0) === 0) {
    var reasons = yield call([ethereum, ethereum.call], "wrapperGetReasons", input.reserves[0], input, blockno)
    reserveIssues["reason"] = reasons
  } else {
    //var chosenReserve = yield call([ethereum, ethereum.call("wrapperGetChosenReserve")], input, blockno)
    // var reasons = yield call([ethereum, ethereum.call("wrapperGetReasons")], chosenReserve, input, blockno)
    console.log(rates)
    console.log(input.minConversionRate)
    if (converter.compareTwoNumber(input.minConversionRate, rates.expectedPrice) === 1) {
      reserveIssues["reason"] = translate('error.min_rate_too_high') || "Your min rate is too high!"
    }
  }
  console.log("_________________________")
  console.log(reserveIssues)
  console.log(networkIssues)
  yield put(globalActions.setAnalyzeError(networkIssues, reserveIssues, input.txHash))
}

function* checkKyberEnable() {
  var state = store.getState()
  const ethereum = state.connection.ethereum
  try {
    var enabled = yield call([ethereum, ethereum.call], "checkKyberEnable")
    yield put(actions.setKyberEnable(enabled))
  } catch (e) {
    console.log(e.message)
    yield put(actions.setKyberEnable(false))
  }

}


export function* watchExchange() {
  yield takeEvery("EXCHANGE.TX_BROADCAST_PENDING", broadCastTx)
  yield takeEvery("EXCHANGE.APPROVAL_TX_BROADCAST_PENDING", approveTx)
  yield takeEvery("EXCHANGE.SELECT_TOKEN_ASYNC", selectToken)
  yield takeEvery("EXCHANGE.PROCESS_EXCHANGE", processExchange)
  yield takeEvery("EXCHANGE.PROCESS_APPROVE", processApprove)
  yield takeEvery("EXCHANGE.CHECK_TOKEN_BALANCE_COLD_WALLET", checkTokenBalanceOfColdWallet)
  yield takeEvery("EXCHANGE.UPDATE_RATE_PENDING", updateRatePending)
  yield takeEvery("EXCHANGE.UPDATE_RATE_SNAPSHOT", updateRateSnapshot)
  yield takeEvery("EXCHANGE.ESTIMATE_GAS_USED", updateGasUsed)
  yield takeEvery("EXCHANGE.ANALYZE_ERROR", analyzeError)

  yield takeEvery("EXCHANGE.INPUT_CHANGE", updateGasUsed)
  yield takeEvery("EXCHANGE.FETCH_GAS", fetchGas)
  yield takeEvery("EXCHANGE.CHECK_KYBER_ENABLE", checkKyberEnable)
}