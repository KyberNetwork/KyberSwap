import { take, put, call, fork, select, takeEvery, all, apply } from 'redux-saga/effects'
import * as actions from '../actions/exchangeActions'
import * as globalActions from "../actions/globalActions"

import * as common from "./common"
import * as validators from "../utils/validators"
import * as analytics from "../utils/analytics"

import { updateAccount, incManualNonceAccount } from '../actions/accountActions'
import { addTx } from '../actions/txActions'
import * as utilActions from '../actions/utilActions'
import constants from "../services/constants"
import * as converter from "../utils/converter"
import * as ethUtil from 'ethereumjs-util'
import Tx from "../services/tx"
import { getTranslate, getActiveLanguage } from 'react-localize-redux';
import { store } from '../store'
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
  yield call(ethereum.fetchRateExchange, true)

  yield call(fetchGas)
  //calculate gas use
  // yield call(updateGasUsed)
}

export function* runAfterBroadcastTx(ethereum, txRaw, hash, account, data) {

  try {
    yield call(getInfo, hash)
  } catch (e) {
    console.log(e)
  }

  //track complete trade
  analytics.trackCoinExchange(data)
  analytics.completeTrade(hash, "kyber", "swap")

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


  try{
    var state = store.getState()
    var notiService = state.global.notiService
    notiService.callFunc("setNewTx",{hash: hash})
  }catch(e){
    console.log(e)
  }
  


  //estimate time for tx
  // var state = store.getState()
  // var gasInfo = state.exchange.gasPriceSuggest
  // var gasPrice = state.exchange.gasPrice
  // estimateTime = estimateTimeTx(...gasInfo, gasPrice)
  // console.log(estimateTime)
}

function* getInfo(hash) {
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
  yield call([ethereum, ethereum.call], "getInfo", { hash })

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
  console.log("tx failed")
  console.log({account, e})
  var error = e
  if (!error){
    var translate = getTranslate(store.getState().locale)
    var link = BLOCKCHAIN_INFO.ethScanUrl + "address/" + account.address
    error = translate("error.broadcast_tx", {link: link}) || "Potentially Failed! We likely couldn't broadcast the transaction to the blockchain. Please check on Etherscan to verify."
  }
  yield put(actions.setBroadcastError(error))
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
  let translate = getTranslate(store.getState().locale)
  try {
    const remainStr = yield call([ethereum, ethereum.call], "getAllowanceAtLatestBlock", sourceToken, address)
    const remain = converter.hexToBigNumber(remainStr)
    const sourceAmountBig = converter.hexToBigNumber(sourceAmount)


    if (!remain.isGreaterThanOrEqualTo(sourceAmountBig) && !isApproveTxPending()) {
      yield put(actions.showApprove())
      yield call(fetchGasApproveSnapshot)
      //fetch gas approve

    } else {
      yield put(actions.showConfirm())
      yield call(fetchGasConfirmSnapshot)
    }
  } catch (e) {
    let title = translate("error.error_occurred") || "Error occurred"
    let content = translate("error.network_error") || "Cannot connect to node right now. Please check your network!"
    yield put(utilActions.openInfoModal(title, content))
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
    console.log(e)
    let msg = ''
    if (accountType === 'ledger') {
      msg = keyService.getLedgerError(e)
    } else {
      msg = e.message
    }
    yield put(actions.setSignError(msg))
    return
  }
  var hashApprove
  try {
    hashApprove = yield call([ethereum, ethereum.callMultiNode], "sendRawTransaction", rawApprove)
    console.log(hashApprove)
    yield put(actions.setApproveTx(hashApprove, sourceTokenSymbol))

    //increase nonce 
    yield put(incManualNonceAccount(account.address))

    yield put(actions.hideApprove())
    yield put(actions.showConfirm())
    yield put(actions.fetchGasSuccess())
  } catch (e) {
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
    yield put(actions.fetchGasSuccess())
  } catch (e) {
    yield put(actions.setSignError(e))
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
      console.log(e)
      let msg = ''
      if (type === 'ledger') {
        msg = keyService.getLedgerError(e)
      } else {
        msg = e.message
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
      yield put(actions.setSignError(e))
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
  if (!remain.isGreaterThanOrEqualTo(sourceAmountBig) && !isApproveTxPending()) {
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
    if (!remain.isGreaterThanOrEqualTo(sourceAmountBig) && !isApproveTxPending()) {
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
      console.log(e)
      let msg = ''
      if (type === 'ledger') {
        msg = keyService.getLedgerError(e)
      } else {
        msg = e.message
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
      yield put(actions.setSignError(e))
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

function* getRate(ethereum, source, dest, sourceAmount) {
  //console.log({source, dest, sourceAmount})
  try {
    //get latestblock
    const lastestBlock = yield call([ethereum, ethereum.call], "getLatestBlock")
    // console.log(lastestBlock)
    const rate = yield call([ethereum, ethereum.call], "getRateAtSpecificBlock", source, dest, sourceAmount, lastestBlock)
    const expectedPrice = rate.expectedPrice ? rate.expectedPrice : "0"
    const slippagePrice = rate.slippagePrice ? rate.slippagePrice : "0"
    return { status: "success", res: { expectedPrice, slippagePrice, lastestBlock } }
  }
  catch (err) {
    console.log(err)
    return { status: "fail" }
    //yield put.sync(actions.updateRateExchangeComplete(rateInit, "0", "0", 0))
    //yield put(actions.setRateSystemError())
  }
}



function* getSourceAmount(sourceTokenSymbol, sourceAmount){
  var state = store.getState()
  var tokens = state.tokens.tokens

  var sourceAmountHex = "0x0"
  if (tokens[sourceTokenSymbol]){
    var decimal = tokens[sourceTokenSymbol].decimal
    var rateSell = tokens[sourceTokenSymbol].rate
    console.log({sourceAmount, decimal, rateSell})
    sourceAmountHex = converter.calculateMinSource(sourceTokenSymbol, sourceAmount, decimal, rateSell)
  }else{
    sourceAmountHex = converter.stringToHex(sourceAmount, 18)
  }
  return sourceAmountHex
}

function* getSourceAmountZero(sourceTokenSymbol){
  var state = store.getState()
  var tokens = state.tokens.tokens
  var sourceAmountHex = "0x0"
  if (tokens[sourceTokenSymbol]){
    var decimal = tokens[sourceTokenSymbol].decimal
    var rateSell = tokens[sourceTokenSymbol].rate
    sourceAmountHex = converter.toHex(converter.getSourceAmountZero(sourceTokenSymbol, decimal, rateSell))
  }
  return sourceAmountHex
}

function* updateRatePending(action) {
  const { ethereum, source, dest, sourceAmount, sourceTokenSymbol, isManual } = action.payload
  var state = store.getState()
  // var exchangeSnapshot = state.exchange.snapshot
  var translate = getTranslate(state.locale)
  
  var sourceAmoutRefined = yield call(getSourceAmount, sourceTokenSymbol, sourceAmount)
  var sourceAmoutZero = yield call(getSourceAmountZero, sourceTokenSymbol)
  //console.log({sourceAmoutRefined, sourceAmoutZero})
  //console.log("is_manual: " + isManual)
  if (isManual) {
    var rateRequest = yield call(common.handleRequest, getRate, ethereum, source, dest, sourceAmoutRefined)
    console.log("rate_request_manual: " + JSON.stringify(rateRequest))
    console.log("source_amount: " + JSON.stringify(sourceAmoutRefined))
    if (rateRequest.status === "success") {      
      var { expectedPrice, slippagePrice, lastestBlock } = rateRequest.data      
      var rateInit = expectedPrice.toString()
      if (expectedPrice.toString() === "0"){
        var rateRequestZeroAmount = yield call(common.handleRequest, getRate, ethereum, source, dest, sourceAmoutZero)

        //console.log(rateRequestZeroAmount.data)
        if (rateRequestZeroAmount.status === "success"){
          rateInit = rateRequestZeroAmount.data.expectedPrice
        }
        if (rateRequestZeroAmount.status === "timeout") {
          yield put(utilActions.openInfoModal(translate("error.error_occurred") || "Error occurred",
            translate("error.node_error") || "There are some problems with nodes. Please try again in a while."))
            return
        }
        if (rateRequestZeroAmount.status === "fail") {
          yield put(utilActions.openInfoModal(translate("error.error_occurred") || "Error occurred",
            translate("error.network_error") || "Cannot connect to node right now. Please check your network!"))
            return
        }
      }
      yield put.sync(actions.updateRateExchangeComplete(rateInit, expectedPrice, slippagePrice, lastestBlock, isManual, true))
      // if (expectedPrice === "0") {
      //   yield put(actions.setRateSystemError())
      // }else{
      //   yield put(actions.caculateAmount())
      // }
    }
    // else{
    //   yield put.sync(actions.updateRateExchangeComplete(rateInit, "0", "0", 0, isManual, false))
    // }

    if (rateRequest.status === "timeout") {
      yield put(utilActions.openInfoModal(translate("error.error_occurred") || "Error occurred",
        translate("error.node_error") || "There are some problems with nodes. Please try again in a while."))
    }
    if (rateRequest.status === "fail") {
      yield put(utilActions.openInfoModal(translate("error.error_occurred") || "Error occurred",
        translate("error.network_error") || "Cannot connect to node right now. Please check your network!"))
    }

    // if ((rateRequest.status === "timeout") || (rateRequest.status === "fail")) {

    //   yield put(utilActions.openInfoModal("Error", "There are some problems with nodes. Please try again in a while"))
    // }

  } else {
    const rateRequest = yield call(getRate, ethereum, source, dest, sourceAmoutRefined)
   // console.log("rate_request_manual_not: " + JSON.stringify(rateRequest))
    if (rateRequest.status === "success") {
      var { expectedPrice, slippagePrice, lastestBlock } = rateRequest.res
    //  console.log(rateRequest.res)
      var rateInit = expectedPrice.toString()
      if (expectedPrice.toString() === "0"){
        var rateRequestZeroAmount = yield call(common.handleRequest, getRate, ethereum, source, dest, sourceAmoutZero)

     //   console.log(rateRequestZeroAmount.data)
        if (rateRequestZeroAmount.status === "success"){
          rateInit = rateRequestZeroAmount.data.expectedPrice
        }
        // if (rateRequestZeroAmount.status === "timeout") {
        //   yield put(utilActions.openInfoModal(translate("error.error_occurred") || "Error occurred",
        //     translate("error.node_error") || "There are some problems with nodes. Please try again in a while."))
        //     return
        // }
        // if (rateRequestZeroAmount.status === "fail") {
        //   yield put(utilActions.openInfoModal(translate("error.error_occurred") || "Error occurred",
        //     translate("error.network_error") || "Cannot connect to node right now. Please check your network!"))
        //     return
        // }
      }
      
      yield put.sync(actions.updateRateExchangeComplete(rateInit, expectedPrice, slippagePrice, lastestBlock, isManual, true))

      // if (expectedPrice.toString() !== "0"){
      //   yield put.sync(actions.updateRateExchangeComplete(rateInit, expectedPrice, slippagePrice, lastestBlock, isManual, true))
      // }


    }
    else {
      //yield put.sync(actions.updateRateExchangeComplete(rateInit, "0", "0", 0, isManual, false))

      //yield put(actions.setRateFailError())
    }

    // const { expectedPrice, slippagePrice, lastestBlock } = rates.res
    // yield put.sync(actions.updateRateExchangeComplete(rateInit, expectedPrice, slippagePrice, lastestBlock))
    // if (lastestBlock === 0) {
    //   yield put(actions.setRateSystemError())
    // }else{
    //   yield put(actions.caculateAmount())
    // }

    // try {
    //   //get latestblock
    //   const lastestBlock = yield call([ethereum, ethereum.call],"getLatestBlock")
    //  // console.log(lastestBlock)
    //   const rate = yield call([ethereum, ethereum.call], "getRateAtSpecificBlock", source, dest, sourceAmount, lastestBlock)
    //   const expectedPrice = rate.expectedPrice ? rate.expectedPrice : "0"
    //   const slippagePrice = rate.slippagePrice ? rate.slippagePrice : "0"
    //   yield put.sync(actions.updateRateExchangeComplete(rateInit, expectedPrice, slippagePrice, lastestBlock))
    //   yield put(actions.caculateAmount())
    // }
    // catch (err) {    
    //   console.log(err)
    //   yield put.sync(actions.updateRateExchangeComplete(rateInit, "0", "0", 0))
    //   yield put(actions.setRateSystemError())
    // }
  }
}



function* getRateSnapshot(ethereum, source, dest, sourceAmountHex) {
  try {
    var rate = yield call([ethereum, ethereum.call], "getRate", source, dest, sourceAmountHex)
    return { status: "success", res: rate }
  } catch (e) {
    console.log(e)
    return { status: "fail", err: e }
  }
}
function* updateRateSnapshot(action) {
  const ethereum = action.payload
  var state = store.getState()
  var exchangeSnapshot = state.exchange.snapshot
  var translate = getTranslate(state.locale)
  try {
    var source = exchangeSnapshot.sourceToken
    var dest = exchangeSnapshot.destToken
    var destTokenSymbol = exchangeSnapshot.destTokenSymbol
    var sourceAmount = exchangeSnapshot.sourceAmount
    var sourceDecimal = exchangeSnapshot.sourceDecimal
    var sourceAmountHex = converter.stringToHex(sourceAmount, sourceDecimal)
    var rateInit = 0

    var rateRequest = yield call(common.handleRequest, getRateSnapshot, ethereum, source, dest, sourceAmountHex)
    if (rateRequest.status === "success") {
      var rate = rateRequest.data
      var expectedPrice = rate.expectedRate ? rate.expectedRate : "0"
      var slippagePrice = rate.slippageRate ? rate.slippageRate : "0"
     // expectedPrice = "0"
      if (expectedPrice  == 0){
        yield put(utilActions.openInfoModal(translate("error.error_occurred") || "Error occurred", 
                                            translate("error.node_error") || "There are some problems with nodes. Please try again in a while."))
        yield put(actions.hideApprove())
        yield put(actions.hideConfirm())
        yield put(actions.hidePassphrase())
      }else{
        yield put.sync(actions.updateRateSnapshotComplete(rateInit, expectedPrice, slippagePrice))
        yield put(actions.caculateAmountInSnapshot())
      }
    }else{
      yield put(actions.hideApprove())
      yield put(actions.hideConfirm())
      yield put(actions.hidePassphrase())
    }
    var title = translate("error.error_occurred") || "Error occurred"
    var content = ''
    if (rateRequest.status === "timeout") {
      content = translate("error.node_error") || "There are some problems with nodes. Please try again in a while."
      yield put(utilActions.openInfoModal(title, content))
    }
    if (rateRequest.status === "fail") {
      content = translate("error.network_error") || "Cannot connect to node right now. Please check your network!"
      yield put(utilActions.openInfoModal(title, content))
    }

    // const rate = yield call([ethereum, ethereum.call], "getRate", source, dest, sourceAmountHex)
    // const expectedPrice = rate.expectedRate ? rate.expectedRate : "0"
    // const slippagePrice = rate.slippageRate ? rate.slippageRate : "0"

    // yield put.sync(actions.updateRateSnapshotComplete(rateInit, expectedPrice, slippagePrice))
    // yield put(actions.caculateAmountInSnapshot())
  }
  catch (err) {
    console.log("===================")
    console.log(err)
  }
}

function* fetchGas() {
  yield call(estimateGas)
}

function* estimateGas() {

  var gasRequest = yield call(common.handleRequest, getGasUsed)
  if (gasRequest.status === "success") {
    const { gas, gas_approve } = gasRequest.data
    yield put(actions.setEstimateGas(gas, gas_approve))
  }
  if ((gasRequest.status === "timeout") || (gasRequest.status === "fail")) {
    console.log("timeout")
    var state = store.getState()
    const exchange = state.exchange

    const sourceTokenSymbol = exchange.sourceTokenSymbol
    var gas = yield call(getMaxGasExchange)
    var gas_approve 
    if(sourceTokenSymbol === "ETH"){
      gas_approve = 0
    }else{
      gas_approve = yield call(getMaxGasApprove)
    }

    yield put(actions.setEstimateGas(gas, gas_approve))
  }
}

function* fetchGasSnapshot() {
  yield call(estimateGasSnapshot)
  yield put(actions.fetchGasSuccessSnapshot())
}

function* estimateGasSnapshot() {

  var gasRequest = yield call(common.handleRequest, getGasUsed)
  console.log("gas_request:" + JSON.stringify(gasRequest))
  if (gasRequest.status === "success") {
    const { gas, gas_approve } = gasRequest.data
    yield put(actions.setEstimateGasSnapshot(gas, gas_approve))
  }
  if ((gasRequest.status === "timeout") || (gasRequest.status === "fail")) {
    console.log("timeout")
    var state = store.getState()
    const exchange = state.exchange

    const sourceTokenSymbol = exchange.sourceTokenSymbol
    var gas = yield call(getMaxGasExchange)
    var gas_approve 
    if(sourceTokenSymbol === "ETH"){
      gas_approve = 0
    }else{
      gas_approve = yield call(getMaxGasApprove)
    }

    yield put(actions.setEstimateGasSnapshot(gas, gas_approve))
  }
}

function* fetchGasConfirmSnapshot() {
  var state = store.getState()
  const exchange = state.exchange
  var gas
  var gas_approve = 0

  var gasRequest = yield call(common.handleRequest, getGasConfirm)
  if (gasRequest.status === "success") {
    const gas = gasRequest.data
    yield put(actions.setEstimateGasSnapshot(gas, gas_approve))
  }
  if ((gasRequest.status === "timeout") || (gasRequest.status === "fail")) {
    console.log("timeout")

    gas = yield call(getMaxGasExchange)
    yield put(actions.setEstimateGasSnapshot(gas, gas_approve))
  }

  yield put(actions.fetchGasSuccessSnapshot())
}

function* fetchGasApproveSnapshot() {
  var state = store.getState()
  const exchange = state.exchange
  var gas = yield call(getMaxGasExchange)
  var gas_approve

  var gasRequest = yield call(common.handleRequest, getGasApprove)
  if (gasRequest.status === "success") {
    const gas_approve = gasRequest.data
    yield put(actions.setEstimateGasSnapshot(gas, gas_approve))
  }
  if ((gasRequest.status === "timeout") || (gasRequest.status === "fail")) {
    console.log("timeout")

    gas_approve = yield call(getMaxGasApprove)
    yield put(actions.setEstimateGasSnapshot(gas, gas_approve))
  }

  yield put(actions.fetchGasSuccessSnapshot())
}


function* getMaxGasExchange(){
  var state = store.getState()
  const exchange = state.exchange
  const tokens = state.tokens.tokens

  var sourceTokenLimit = tokens[exchange.sourceTokenSymbol].gasLimit
  var destTokenLimit = tokens[exchange.destTokenSymbol].gasLimit

  var sourceGasLimit = sourceTokenLimit ? parseInt(sourceTokenLimit) : exchange.max_gas
  var destGasLimit = destTokenLimit ? parseInt(destTokenLimit) : exchange.max_gas

  // console.log("fee tx: ", sourceGasLimit + destGasLimit)

  return sourceGasLimit + destGasLimit

  // if (exchange.sourceTokenSymbol === 'DGX'){
  //   if (exchange.destTokenSymbol === 'ETH'){
  //     return 750000
  //   }else{
  //     return (750000 + exchange.max_gas)
  //   }
  // }
  // if (exchange.sourceTokenSymbol === 'ETH'){
  //   if (exchange.destTokenSymbol === 'DGX'){
  //     return 750000
  //   }else{
  //     return exchange.max_gas
  //   }
  // }

  // if (exchange.sourceTokenSymbol !== 'ETH'){
  //   if (exchange.destTokenSymbol === 'DGX'){
  //     return 750000 + exchange.max_gas
  //   }
  //   if (exchange.destTokenSymbol === 'ETH'){
  //     return exchange.max_gas
  //   }
  //   else{
  //     return exchange.max_gas * 2
  //   }
  // }
}

function* getMaxGasApprove(){
  var state = store.getState()
  const exchange = state.exchange
  if (exchange.sourceTokenSymbol !== 'DGX' && exchange.destTokenSymbol !== 'DGX') {
    return exchange.max_gas_approve
  }else{
    return 120000
  }
}

function* getGasConfirm() {
  var state = store.getState()
  const ethereum = state.connection.ethereum
  const exchange = state.exchange
  const kyber_address = BLOCKCHAIN_INFO.network

  const maxGas = yield call(getMaxGasExchange)
  
  var gas = maxGas
  var gas_approve = 0

  var account = state.account.account
  var address = account.address

  var tokens = state.tokens.tokens
  var sourceDecimal = 18
  var sourceTokenSymbol = exchange.sourceTokenSymbol
  if (tokens[sourceTokenSymbol]) {
    sourceDecimal = tokens[sourceTokenSymbol].decimal
  }

  const sourceToken = exchange.sourceToken
  const sourceAmount = converter.stringToHex(exchange.sourceAmount, sourceDecimal)
  const destToken = exchange.destToken
  const maxDestAmount = converter.biggestNumber()
  const minConversionRate = converter.numberToHex(converter.toTWei(exchange.slippageRate, 18))
  const blockNo = converter.numberToHexAddress(exchange.blockNo)
  //const throwOnFailure = "0x0000000000000000000000000000000000000000"
  var data = yield call([ethereum, ethereum.call], "exchangeData", sourceToken, sourceAmount,
    destToken, address,
    maxDestAmount, minConversionRate, blockNo)

  var gas = 0

  var value = '0x0'
  if (exchange.sourceTokenSymbol === 'ETH') {
    value = sourceAmount
  }

  var txObj = {
    from: address,
    to: kyber_address,
    data: data,
    value: value
  }
  // var gasRequest = yield call(common.handleRequest, api.estimateGas, ethereum, txObj)
  // if (gasRequest.status === "success"){
  //   gas = gasRequest.data
  // }
  // if (gasRequest.status === "timeout"){
  //   console.log("timeout")
  // }
  try {
    gas = yield call([ethereum, ethereum.call], "estimateGas", txObj)
    //  console.log("gas ne: " + gas)
    gas = Math.round(gas * 120 / 100)
    //console.log("gas ne: " + gas)
    if (gas > maxGas) {
      gas = maxGas
    }
    return { status: "success", res: gas }
  } catch (e) {
    console.log(e)
    return { status: "fail", err: e }
  }


}

function* getGasApprove() {
  var state = store.getState()
  const ethereum = state.connection.ethereum
  const exchange = state.exchange
  const sourceToken = exchange.sourceToken

  var account = state.account.account
  var address = account.address

  const maxGasApprove = yield call(getMaxGasApprove)
  var gas_approve = 0
  try {
    var dataApprove = yield call([ethereum, ethereum.call], "approveTokenData", sourceToken, converter.biggestNumber())
    var txObjApprove = {
      from: address,
      to: sourceToken,
      data: dataApprove,
      value: '0x0',
    }
    gas_approve = yield call([ethereum, ethereum.call], "estimateGas", txObjApprove)
    gas_approve = Math.round(gas_approve * 120 / 100)
    if (gas_approve > maxGasApprove) {
      gas_approve = maxGasApprove
    }
    return { status: "success", res: gas_approve }
  } catch (e) {
    console.log(e)
    return { status: "fail", err: e }
  }

}

function* getGasUsed() {
  var state = store.getState()
  const ethereum = state.connection.ethereum
  const exchange = state.exchange
  const kyber_address = BLOCKCHAIN_INFO.network


  const maxGas = yield call(getMaxGasExchange)

  //console.log("max gas exchange:" + maxGas)

  const maxGasApprove = yield call(getMaxGasApprove)
  var gas = maxGas
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
    const minConversionRate = converter.numberToHex(converter.toTWei(exchange.slippageRate, 18))
    const blockNo = converter.numberToHexAddress(exchange.blockNo)
    //const throwOnFailure = "0x0000000000000000000000000000000000000000"
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
      if (!remain.isGreaterThanOrEqualTo(sourceAmountBig)) {
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
        if (gas_approve > maxGasApprove) {
          gas_approve = maxGasApprove
        }
      } else {
        gas_approve = 0
      }
    }
    var txObj = {
      from: address,
      to: kyber_address,
      data: data,
      value: value
    }
    // var gasRequest = yield call(common.handleRequest, api.estimateGas, ethereum, txObj)
    // if (gasRequest.status === "success"){
    //   gas = gasRequest.data
    // }
    // if (gasRequest.status === "timeout"){
    //   console.log("timeout")
    // }
    gas = yield call([ethereum, ethereum.call], "estimateGas", txObj)
    console.log("get_gas:" + gas)
    gas = Math.round(gas * 120 / 100)
    //console.log("gas ne: " + gas)
    if (gas > maxGas) {
      gas = maxGas
    }

    return { status: "success", res: { gas, gas_approve } }
  } catch (e) {
    console.log("Cannot estimate gas")
    console.log(e)
    return { status: "fail", err: e }
  }
  //console.log(gas, gas_approve)
  //yield put(actions.setEstimateGas(gas, gas_approve))
}

function* analyzeError(action) {
  const { ethereum, txHash } = action.payload
  //yield put(globalActions.openAnalyze(txHash))
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

    var receipt = yield call([ethereum, ethereum.call], 'txMined', txHash)
    var transaction = {
      gasUsed: receipt.gasUsed,
      status: receipt.status,
      gas: tx.gas
    }
    var input = {
      value, owner, gas_price, source, srcAmount, dest,
      destAddress, maxDestAmount, minConversionRate, walletID, reserves, txHash, transaction
    }

    console.log(input)
    yield call(debug, input, blockNumber, ethereum)
    //check gas price
  } catch (e) {
    console.log(e)
    yield put(actions.setAnalyzeError({}, txHash))
    //yield put(globalActions.setAnalyzeError({}, {}, txHash))
  }
}

function* debug(input, blockno, ethereum) {
  // console.log({input, blockno})
  var networkIssues = {}
  // var reserveIssues = {}
  var translate = getTranslate(store.getState().locale)
  var gasCap = yield call([ethereum, ethereum.call], "wrapperGetGasCap", blockno)

  if(input.transaction.gasUsed === input.transaction.gas && !input.transaction.status) networkIssues["gas_used"] = "Your transaction is run out of gas"

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
  var rates = yield call([ethereum, ethereum.call], "getRateAtSpecificBlock", input.source, input.dest, input.srcAmount, blockno)
  if (converter.compareTwoNumber(rates.expectedPrice, 0) === 0) {
    var reasons = yield call([ethereum, ethereum.call], "wrapperGetReasons", input.reserves[0], input, blockno)
    ///reserveIssues["reason"] = reasons
    networkIssues["rateError"] = reasons
  } else {
    //var chosenReserve = yield call([ethereum, ethereum.call("wrapperGetChosenReserve")], input, blockno)
    // var reasons = yield call([ethereum, ethereum.call("wrapperGetReasons")], chosenReserve, input, blockno)
    console.log(rates)
    console.log(input.minConversionRate)
    if (converter.compareTwoNumber(input.minConversionRate, rates.expectedPrice) === 1) {
//      reserveIssues["reason"] = translate('error.min_rate_too_high') || "Your min rate is too high!"

        networkIssues["rateZero"] = translate('error.min_rate_too_high') || "Your min rate is too high!"
    }
  }
  console.log("_________________________")
  //console.log(reserveIssues)
  console.log(networkIssues)
  //yield put(globalActions.setAnalyzeError(networkIssues, reserveIssues, input.txHash))

  yield put(actions.setAnalyzeError(networkIssues, input.txHash))
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

function* verifyExchange() {
  var state = store.getState()

  //const ethereum = state.connection.ethereum
  const exchange = state.exchange
  const offeredRate = state.exchange.offeredRate

  var sourceTokenSymbol = exchange.sourceTokenSymbol
  var tokens = state.tokens.tokens
  var sourceBalance = 0
  var sourceDecimal = 18
  var sourceName = "Ether"
  var rateSourceToEth = 0
  if (tokens[sourceTokenSymbol]) {
    sourceBalance = tokens[sourceTokenSymbol].balance
    sourceDecimal = tokens[sourceTokenSymbol].decimal
    sourceName = tokens[sourceTokenSymbol].name
    rateSourceToEth = tokens[sourceTokenSymbol].rate
  }

  var destTokenSymbol = exchange.destTokenSymbol
  var destBalance = 0
  var destDecimal = 18
  var destName = "Kybernetwork"
  if (tokens[destTokenSymbol]) {
    destBalance = tokens[destTokenSymbol].balance
    destDecimal = tokens[destTokenSymbol].decimal
    destName = tokens[destTokenSymbol].name
  }

  var sourceAmount = exchange.sourceAmount

  var validateAmount = validators.verifyAmount(sourceAmount,
    sourceBalance,
    sourceTokenSymbol,
    sourceDecimal,
    rateSourceToEth,
    destDecimal,
    exchange.maxCap)

  var sourceAmountErrorKey
  var isNotNumber = false
  switch (validateAmount) {
    case "not a number":
      sourceAmountErrorKey = "error.source_amount_is_not_number"
      isNotNumber = true
      break
    case "too high":
      sourceAmountErrorKey = "error.source_amount_too_high"
      break
    case "too high cap":
      sourceAmountErrorKey = "error.source_amount_too_high_cap"
      break
    case "too small":
      sourceAmountErrorKey = "error.source_amount_too_small"
      break
    case "too high for reserve":
      sourceAmountErrorKey = "error.source_amount_too_high_for_reserve"
      break
  }
  if (!isNotNumber) {
    if (sourceAmountErrorKey) {
      yield put(actions.thowErrorSourceAmount(sourceAmountErrorKey))
    } else {
      yield put(actions.thowErrorSourceAmount(""))
    }
  }
  // if (sourceAmountErrorKey) {
  //   yield put(actions.thowErrorSourceAmount(sourceAmountErrorKey))
  // }else{
  //   yield put(actions.thowErrorSourceAmount(""))
  // }

  if (isNaN(sourceAmount) || sourceAmount === "") {
    sourceAmount = 0
  }
  var validateWithFee = validators.verifyBalanceForTransaction(tokens['ETH'].balance, sourceTokenSymbol,
    sourceAmount, exchange.gas + exchange.gas_approve, exchange.gasPrice)

  if (validateWithFee) {
    yield put(actions.thowErrorEthBalance("error.eth_balance_not_enough_for_fee"))
  } else {
    yield put(actions.thowErrorEthBalance(""))
  }

}


export function* fetchExchangeEnable() {
  var enableRequest = yield call(common.handleRequest, getExchangeEnable)
  if (enableRequest.status === "success") {
    var state = store.getState()
    var exchange = state.exchange
    console.log(enableRequest)
    if (enableRequest.data === true && exchange.errors.exchange_enable === "") {
      var translate = getTranslate(state.locale)
      var kycLink = "https://account.kyber.network/users/sign_up"
      yield put(utilActions.openInfoModal(translate("error.error_occurred") || "Error occurred",
        translate("error.exceed_daily_volumn", { link: kycLink }) || "You may want to register with us to have higher trade limits " + kycLink))
    }
    yield put(actions.setExchangeEnable(enableRequest.data))
  }
  if ((enableRequest.status === "timeout") || (enableRequest.status === "fail")) {
    yield put(actions.setExchangeEnable(false))
  }
}

export function* getExchangeEnable() {
  var state = store.getState()
  const ethereum = state.connection.ethereum

  var account = state.account.account
  var address = account.address

  try {
    var enabled = yield call([ethereum, ethereum.call], "getExchangeEnable", address)
    return { status: "success", res: enabled }
  } catch (e) {
    console.log(e.message)
    return { status: "success", res: false }
  }
}


export function* watchExchange() {
  yield takeEvery("EXCHANGE.TX_BROADCAST_PENDING", broadCastTx)
  yield takeEvery("EXCHANGE.APPROVAL_TX_BROADCAST_PENDING", approveTx)

  yield takeEvery("EXCHANGE.PROCESS_EXCHANGE", processExchange)
  yield takeEvery("EXCHANGE.PROCESS_APPROVE", processApprove)
  yield takeEvery("EXCHANGE.CHECK_TOKEN_BALANCE_COLD_WALLET", checkTokenBalanceOfColdWallet)
  yield takeEvery("EXCHANGE.UPDATE_RATE_PENDING", updateRatePending)
  yield takeEvery("EXCHANGE.UPDATE_RATE_SNAPSHOT", updateRateSnapshot)
  yield takeEvery("EXCHANGE.ESTIMATE_GAS_USED", fetchGas)
  yield takeEvery("EXCHANGE.ANALYZE_ERROR", analyzeError)

  yield takeEvery("EXCHANGE.SELECT_TOKEN_ASYNC", selectToken)
  yield takeEvery("EXCHANGE.INPUT_CHANGE", fetchGas)
  //yield takeEvery("EXCHANGE.FETCH_GAS", fetchGasManual)
  yield takeEvery("EXCHANGE.FETCH_GAS_SNAPSHOT", fetchGasSnapshot)

  yield takeEvery("EXCHANGE.CHECK_KYBER_ENABLE", checkKyberEnable)
  yield takeEvery("EXCHANGE.VERIFY_EXCHANGE", verifyExchange)

  yield takeEvery("EXCHANGE.FETCH_EXCHANGE_ENABLE", fetchExchangeEnable)
}