import { take, put, call, fork, select, takeEvery, all, apply } from 'redux-saga/effects'
import * as actions from '../actions/exchangeActions'
import { updateAccount, incManualNonceAccount } from '../actions/accountActions'
import { addTx } from '../actions/txActions'
import * as utilActions from '../actions/utilActions'
import constants from "../services/constants"
import * as converter from "../utils/converter"
import * as ethUtil from 'ethereumjs-util'
import Tx from "../services/tx"
import { getTranslate } from 'react-localize-redux';
import { store } from '../store';

function* broadCastTx(action) {
  const { ethereum, tx, account, data } = action.payload
  try {
    yield put(actions.prePareBroadcast())
    const hash = yield call(ethereum.call("sendRawTransaction"), tx, ethereum)
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
    const hash = yield call(ethereum.call("sendRawTransaction"), tx, ethereum)
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
}

export function* runAfterBroadcastTx(ethereum, txRaw, hash, account, data) {
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
}

function* doTransactionFail(ethereum, account, e) {
  yield put(actions.doTransactionFail(e))
  //yield put(incManualNonceAccount(account.address))
  yield put(updateAccount(ethereum, account))
}

function* doApproveTransactionFail(ethereum, account, e) {
  yield put(actions.doApprovalTransactionFail(e))
  //yield put(incManualNonceAccount(account.address))
  yield put(updateAccount(ethereum, account))
}


export function* checkTokenBalanceOfColdWallet(action) {
  const { formId, ethereum, address, sourceToken,
    sourceAmount, destToken, destAddress,
    maxDestAmount, minConversionRate,
    throwOnFailure, nonce, gas,
    gasPrice, keystring, type, password, account, data, keyService } = action.payload

  const remainStr = yield call(ethereum.call("getAllowance"), sourceToken, address)
  const remain = converter.hexToBigNumber(remainStr)
  const sourceAmountBig = converter.hexToBigNumber(sourceAmount)
  if (!remain.greaterThanOrEqualTo(sourceAmountBig)) {
    yield put(actions.showApprove())
  } else {
    yield put(actions.showConfirm())
  }
}

function* processApprove(action) {
  const { ethereum, sourceToken, sourceAmount, nonce, gas, gasPrice,
    keystring, password, accountType, account, keyService } = action.payload
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
    keystring, password, accountType, account, keyService } = action.payload
  try {
    const rawApprove = yield call(keyService.callSignTransaction, "getAppoveToken", ethereum, sourceToken, sourceAmount, nonce, gas, gasPrice,
      keystring, password, accountType, account.address)
    const hashApprove = yield call(ethereum.call("sendRawTransaction"), rawApprove, ethereum)
    console.log(hashApprove)
    //increase nonce 
    yield put(incManualNonceAccount(account.address))

    yield put(actions.hideApprove())
    yield put(actions.showConfirm())
  } catch (e) {
    console.log(e)
    yield call(doApproveTransactionFail, ethereum, account, e.message)
  }
}

export function* processApproveByMetamask(action) {
  const { ethereum, sourceToken, sourceAmount, nonce, gas, gasPrice,
    keystring, password, accountType, account, keyService } = action.payload
  try {
    const hashApprove = yield call(keyService.callSignTransaction, "getAppoveToken", ethereum, sourceToken, sourceAmount, nonce, gas, gasPrice,
      keystring, password, accountType, account.address)
    //const hashApprove = yield call(ethereum.call("sendRawTransaction"), rawApprove, ethereum)
    console.log(hashApprove)
    //increase nonce 
    yield put(incManualNonceAccount(account.address))

    yield put(actions.hideApprove())
    yield put(actions.showConfirm())
  } catch (e) {
    console.log(e)
    yield call(doApproveTransactionFail, ethereum, account, e.message)
  }
}

export function* processExchange(action) {
  const { formId, ethereum, address, sourceToken,
    sourceAmount, destToken, destAddress,
    maxDestAmount, minConversionRate,
    throwOnFailure, nonce, gas,
    gasPrice, keystring, type, password, account, data, keyService, balanceData } = action.payload

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
    gasPrice, keystring, type, password, account, data, keyService, balanceData } = action.payload
  var txRaw
  try {
    txRaw = yield call(keyService.callSignTransaction, "etherToOthersFromAccount", formId, ethereum, address, sourceToken,
      sourceAmount, destToken, destAddress,
      maxDestAmount, minConversionRate,
      throwOnFailure, nonce, gas,
      gasPrice, keystring, type, password)
  } catch (e) {
    console.log(e)
    yield put(actions.throwPassphraseError(e.message))
    return
  }
  try {
    yield put(actions.prePareBroadcast(balanceData))
    const hash = yield call(ethereum.call("sendRawTransaction"), txRaw, ethereum)
    yield call(runAfterBroadcastTx, ethereum, txRaw, hash, account, data)
  } catch (e) {
    console.log(e)
    yield call(doTransactionFail, ethereum, account, e.message)
    return
  }
}

export function* exchangeETHtoTokenPrivateKey(action) {
  const { formId, ethereum, address, sourceToken,
    sourceAmount, destToken, destAddress,
    maxDestAmount, minConversionRate,
    throwOnFailure, nonce, gas,
    gasPrice, keystring, type, password, account, data, keyService, balanceData } = action.payload
  try {
    var txRaw = yield call(keyService.callSignTransaction, "etherToOthersFromAccount", formId, ethereum, address, sourceToken,
      sourceAmount, destToken, destAddress,
      maxDestAmount, minConversionRate,
      throwOnFailure, nonce, gas,
      gasPrice, keystring, type, password)
    yield put(actions.prePareBroadcast(balanceData))
    const hash = yield call(ethereum.call("sendRawTransaction"), txRaw, ethereum)
    yield call(runAfterBroadcastTx, ethereum, txRaw, hash, account, data)
  } catch (e) {
    console.log(e)
    yield call(doTransactionFail, ethereum, account, e.message)
    return
  }
}

export function* exchangeETHtoTokenColdWallet(action) {
  const { formId, ethereum, address, sourceToken,
    sourceAmount, destToken, destAddress,
    maxDestAmount, minConversionRate,
    throwOnFailure, nonce, gas,
    gasPrice, keystring, type, password, account, data, keyService, balanceData } = action.payload
  try {
    var txRaw = yield call(keyService.callSignTransaction, "etherToOthersFromAccount", formId, ethereum, address, sourceToken,
      sourceAmount, destToken, destAddress,
      maxDestAmount, minConversionRate,
      throwOnFailure, nonce, gas,
      gasPrice, keystring, type, password)

    yield put(actions.prePareBroadcast(balanceData))
    const hash = yield call(ethereum.call("sendRawTransaction"), txRaw, ethereum)
    yield call(runAfterBroadcastTx, ethereum, txRaw, hash, account, data)
  } catch (e) {
    console.log(e)
    yield call(doTransactionFail, ethereum, account, e.message)
    return
  }
}

function* exchangeETHtoTokenMetamask(action) {
  const { formId, ethereum, address, sourceToken,
    sourceAmount, destToken, destAddress,
    maxDestAmount, minConversionRate,
    throwOnFailure, nonce, gas,
    gasPrice, keystring, type, password, account, data, keyService, balanceData } = action.payload
  try {
    var hash = yield call(keyService.callSignTransaction, "etherToOthersFromAccount", formId, ethereum, address, sourceToken,
      sourceAmount, destToken, destAddress,
      maxDestAmount, minConversionRate,
      throwOnFailure, nonce, gas,
      gasPrice, keystring, type, password)
    yield put(actions.prePareBroadcast(balanceData))
    const txRaw = { gas, gasPrice, nonce }
    yield call(runAfterBroadcastTx, ethereum, txRaw, hash, account, data)
  } catch (e) {
    console.log(e)
    yield call(doTransactionFail, ethereum, account, e.message)
    return
  }
}


function* exchangeTokentoETHKeystore(action) {
  var { formId, ethereum, address, sourceToken,
    sourceAmount, destToken, destAddress,
    maxDestAmount, minConversionRate,
    throwOnFailure, nonce, gas,
    gasPrice, keystring, type, password, account, data, keyService, balanceData } = action.payload
  var remainStr = yield call(ethereum.call("getAllowance"), sourceToken, address)
  console.log("remain: " + remainStr)
  var remain = converter.hexToBigNumber(remainStr)
  var sourceAmountBig = converter.hexToBigNumber(sourceAmount)
  if (!remain.greaterThanOrEqualTo(sourceAmountBig)) {
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
      var hashApprove = yield call(ethereum.call("sendRawTransaction"), rawApprove, ethereum)
      console.log("approve: " + hashApprove)
      //increase nonce 
      yield put(incManualNonceAccount(account.address))
      nonce++

      var txRaw = yield call(keyService.callSignTransaction, "tokenToOthersFromAccount", formId, ethereum, address, sourceToken,
        sourceAmount, destToken, destAddress,
        maxDestAmount, minConversionRate,
        throwOnFailure, nonce, gas,
        gasPrice, keystring, type, password)
      yield put(actions.prePareBroadcast(balanceData))
      var hash = yield call(ethereum.call("sendRawTransaction"), txRaw, ethereum)
      yield call(runAfterBroadcastTx, ethereum, txRaw, hash, account, data)
    } catch (e) {
      console.log(e)
      yield call(doTransactionFail, ethereum, account, e.message)
      return
    }
  } else {
    var txRaw
    // console.log({formId, ethereum, address, sourceToken,
    //   sourceAmount, destToken, destAddress,
    //   maxDestAmount, minConversionRate,
    //   throwOnFailure, nonce, gas,
    //   gasPrice, keystring, type, password})
    try {
      txRaw = yield call(keyService.callSignTransaction, "tokenToOthersFromAccount", formId, ethereum, address, sourceToken,
        sourceAmount, destToken, destAddress,
        maxDestAmount, minConversionRate,
        throwOnFailure, nonce, gas,
        gasPrice, keystring, type, password)
    } catch (e) {
      console.log(e)
      yield put(actions.throwPassphraseError(e.message))
      return
    }
    try {
      yield put(actions.prePareBroadcast(balanceData))
      const hash = yield call(ethereum.call("sendRawTransaction"), txRaw, ethereum)
      yield call(runAfterBroadcastTx, ethereum, txRaw, hash, account, data)
    } catch (e) {
      console.log(e)
      yield call(doTransactionFail, ethereum, account, e.message)
      return
    }
  }
}
export function* exchangeTokentoETHPrivateKey(action) {
  var { formId, ethereum, address, sourceToken,
    sourceAmount, destToken, destAddress,
    maxDestAmount, minConversionRate,
    throwOnFailure, nonce, gas,
    gasPrice, keystring, type, password, account, data, keyService, balanceData } = action.payload
  try {
    var remainStr = yield call(ethereum.call("getAllowance"), sourceToken, address)
    var remain = converter.hexToBigNumber(remainStr)
    var sourceAmountBig = converter.hexToBigNumber(sourceAmount)
    if (!remain.greaterThanOrEqualTo(sourceAmountBig)) {
      var rawApprove = yield call(keyService.callSignTransaction, "getAppoveToken", ethereum, sourceToken, sourceAmount, nonce, gas, gasPrice,
        keystring, password, type, address)
      yield put(actions.prePareBroadcast(balanceData))
      var hashApprove = yield call(ethereum.call("sendRawTransaction"), rawApprove, ethereum)
      console.log(hashApprove)
      //increase nonce 
      yield put(incManualNonceAccount(account.address))
      nonce++
    }
    var txRaw = yield call(keyService.callSignTransaction, "tokenToOthersFromAccount", formId, ethereum, address, sourceToken,
      sourceAmount, destToken, destAddress,
      maxDestAmount, minConversionRate,
      throwOnFailure, nonce, gas,
      gasPrice, keystring, type, password)
    yield put(actions.prePareBroadcast(balanceData))
    var hash = yield call(ethereum.call("sendRawTransaction"), txRaw, ethereum)
    yield call(runAfterBroadcastTx, ethereum, txRaw, hash, account, data)
  } catch (e) {
    console.log(e)
    yield call(doTransactionFail, ethereum, account, e.message)
    return
  }
}

function* exchangeTokentoETHColdWallet(action) {
  const { formId, ethereum, address, sourceToken,
    sourceAmount, destToken, destAddress,
    maxDestAmount, minConversionRate,
    throwOnFailure, nonce, gas,
    gasPrice, keystring, type, password, account, data, keyService, balanceData } = action.payload
  try {
    const txRaw = yield call(keyService.callSignTransaction, "tokenToOthersFromAccount", formId, ethereum, address, sourceToken,
      sourceAmount, destToken, destAddress,
      maxDestAmount, minConversionRate,
      throwOnFailure, nonce, gas,
      gasPrice, keystring, type, password)
    yield put(actions.prePareBroadcast(balanceData))
    const hash = yield call(ethereum.call("sendRawTransaction"), txRaw, ethereum)
    yield call(runAfterBroadcastTx, ethereum, txRaw, hash, account, data)
  } catch (e) {
    console.log(e)
    yield call(doTransactionFail, ethereum, account, e.message)
    return
  }
}

export function* exchangeTokentoETHMetamask(action) {
  const { formId, ethereum, address, sourceToken,
    sourceAmount, destToken, destAddress,
    maxDestAmount, minConversionRate,
    throwOnFailure, nonce, gas,
    gasPrice, keystring, type, password, account, data, keyService, balanceData } = action.payload
  try {
    const hash = yield call(keyService.callSignTransaction, "tokenToOthersFromAccount", formId, ethereum, address, sourceToken,
      sourceAmount, destToken, destAddress,
      maxDestAmount, minConversionRate,
      throwOnFailure, nonce, gas,
      gasPrice, keystring, type, password)
    yield put(actions.prePareBroadcast(balanceData))
    //const hash = yield call(ethereum.call("sendRawTransaction"), txRaw, ethereum)
    const txRaw = { gas, gasPrice, nonce }
    yield call(runAfterBroadcastTx, ethereum, txRaw, hash, account, data)
  } catch (e) {
    console.log(e)
    yield call(doTransactionFail, ethereum, account, e.message)
    return
  }
}

function* updateRatePending(action) {
  const { ethereum, source, dest, sourceAmount, isManual, rateInit } = action.payload
  try {
    const rate = yield call(ethereum.call("getRate"), source, dest, sourceAmount)
    const expectedPrice = rate.expectedPrice ? rate.expectedPrice : "0"
    const slippagePrice = rate.slippagePrice ? rate.slippagePrice : "0"
    yield put.sync(actions.updateRateExchangeComplete(rateInit, expectedPrice, slippagePrice))
    yield put(actions.caculateAmount())
  }
  catch (err) {
    console.log("===================")
    console.log(err)
  }
}

function* updateGasUsed(action) {
  try {
    const { ethereum, exchange } = action.payload
    const sourceToken = exchange.sourceToken
    const sourceAmount = converter.stringToHex(exchange.sourceAmount, exchange.sourceDecimal)
    const destToken = exchange.destToken
    const destAddress = exchange.destAddress
    const maxDestAmount = converter.biggestNumber()
    const minConversionRate = converter.numberToHex(exchange.offeredRate)
    const throwOnFailure = false
    var data = yield call([ethereum, ethereum.call("exchangeData")], sourceToken, sourceAmount,
      destToken, destAddress,
      maxDestAmount, minConversionRate, throwOnFailure)
    //console.log(data)
    var value = '0'
    if (exchange.sourceTokenSymbol === 'ETH') {
      value = sourceAmount
    }
    var txObj = {
      from: destAddress,
      to: exchange.kyber_address,
      data: data,
      value: value,
    }
    console.log(txObj)
    var estimatedGas = yield call([ethereum, ethereum.call("estimateGas")], txObj)
    console.log(estimatedGas)
    yield put(actions.setEstimateGas(estimatedGas))
  } catch (e) {
    console.log(e)
  }
}

function* analyzeError(action) {
  const { ethereum, txHash } = action.payload
  try {
    //var txHash = exchange.txHash
    var tx = yield call([ethereum, ethereum.call("getTx")], txHash)
   // console.log(tx)
    var value = tx.value
    var owner = tx.from
    var gas_price = tx.gasPrice
    var blockNumber = tx.blockNumber

    var result = yield call([ethereum, ethereum.call("exactExchangeData")], tx.input)
    var source = result[0].value
    var srcAmount = result[1].value
    var dest = result[2].value
    var destAddress = result[3].value
    var maxDestAmount = result[4].value
    var minConversionRate = result[5].value
    var walletID = result[6].value
    var reserves = yield call([ethereum, ethereum.call("getListReserve")])

    var input = {
      value, owner, gas_price, source, srcAmount, dest,
      destAddress, maxDestAmount, minConversionRate, walletID, reserves
    }

    yield call(debug, input, blockNumber, ethereum)
    //check gas price
  } catch (e) {
    console.log(e)
  }
}

function* debug(input, blockno, ethereum) {
  var networkIssues = {}
  var reserveIssues = {}
  var translate = getTranslate(store.getState().locale)
  var gasCap = yield call([ethereum, ethereum.call("wrapperGetGasCap")], blockno)
  if (converter.compareTwoNumber(input.gas_price, gasCap) === 1) {
    networkIssues["gas_price"] = translate('error.gas_price_exceeded_limit') || "Gas price exceeded max limit"
  }
  console.log(translate('import.from_private_key_input_title'))
  if (input.source !== constants.ETHER_ADDRESS) {
    if (converter.compareTwoNumber(input.value, 0) === 1) {
      networkIssues["token_ether"] = translate('error.issue_token_ether') || "Failed because of sending ether along the tx when it is trying to trade token to ether"
    }
    var remainStr = yield call([ethereum, ethereum.call("getAllowance")], input.source, input.owner, blockno)
    if (converter.compareTwoNumber(remainStr, input.srcAmount) === -1) {
      networkIssues["allowance"] = translate('error.issue_allowance') || "Failed because allowance is lower than srcAmount"
    }
    var balance = yield call([ethereum, ethereum.call("getTokenBalance")], input.source, input.owner, blockno)
    if (converter.compareTwoNumber(balance, input.srcAmount) === -1) {
      networkIssues["balance"] = translate('error.issue_balance') || "Failed because token balance is lower than srcAmount"
    }
  } else {
    if (converter.compareTwoNumber(input.value, input.srcAmount) !== 0) {
      networkIssues["ether_amount"] = translate('error.issue_ether_amount') || "Failed because the user didn't send the exact amount of ether along"
    }
  }

  if (input.source === constants.ETHER_ADDRESS) {
    var userCap = yield call([ethereum, ethereum.call("getMaxCap")], input.owner, blockno)
    if (converter.compareTwoNumber(input.srcAmount, userCap) === 1) {
      networkIssues["user_cap"] = translate('error.issue_user_cap') || "Failed because the source amount exceeded user cap"
    }
  }

  if (input.dest === constants.ETHER_ADDRESS) {
    var userCap = yield call([ethereum, ethereum.call("getMaxCap")], input.owner, blockno)
    if (input.destAmount > userCap) {
      networkIssues["user_cap"] = translate('error.issue_user_cap') || "Failed because the source amount exceeded user cap"
    }
  }

  //Reserve scops
  var rates = yield call([ethereum, ethereum.call("wrapperGetConversionRate")]
    , input.reserves[0], input, blockno)
  if (converter.compareTwoNumber(rates.expectedPrice, 0) === 0) {
    var reasons = yield call([ethereum, ethereum.call("wrapperGetReasons")], input.reserves[0], input, blockno)
    reserveIssues["reason"] = reasons
  } else {
    //var chosenReserve = yield call([ethereum, ethereum.call("wrapperGetChosenReserve")], input, blockno)
   // var reasons = yield call([ethereum, ethereum.call("wrapperGetReasons")], chosenReserve, input, blockno)

    if(converter.compareTwoNumber(input.minConversionRate, rates.expectedPrice) === 1){
      reserveIssues["reason"] = translate('error.min_rate_too_high') || "Your min rate is too high!"
    }
  }
  console.log(reserveIssues)
  console.log(networkIssues)
  yield put(actions.setAnalyzeError(networkIssues, reserveIssues))
}


export function* watchExchange() {
  yield takeEvery("EXCHANGE.TX_BROADCAST_PENDING", broadCastTx)
  yield takeEvery("EXCHANGE.APPROVAL_TX_BROADCAST_PENDING", approveTx)
  yield takeEvery("EXCHANGE.SELECT_TOKEN_ASYNC", selectToken)
  yield takeEvery("EXCHANGE.PROCESS_EXCHANGE", processExchange)
  yield takeEvery("EXCHANGE.PROCESS_APPROVE", processApprove)
  yield takeEvery("EXCHANGE.CHECK_TOKEN_BALANCE_COLD_WALLET", checkTokenBalanceOfColdWallet)
  yield takeEvery("EXCHANGE.UPDATE_RATE_PENDING", updateRatePending)
  yield takeEvery("EXCHANGE.ESTIMATE_GAS_USED", updateGasUsed)
  yield takeEvery("EXCHANGE.ANALYZE_ERROR", analyzeError)
}