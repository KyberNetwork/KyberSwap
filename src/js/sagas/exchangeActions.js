import { take, put, call, fork, select, takeEvery, all, apply } from 'redux-saga/effects'
import * as actions from '../actions/exchangeActions'
import { updateAccount, incManualNonceAccount } from '../actions/accountActions'
import { addTx } from '../actions/txActions'
import * as utilActions from '../actions/utilActions'
import constants from "../services/constants"
import * as converter from "../utils/converter"
import * as ethUtil from 'ethereumjs-util'
import Tx from "../services/tx"

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
      console.log(hashApprove)
      //increase nonce 
      yield put(incManualNonceAccount(account.address))
      nonce++

      var txRaw = yield call(keyService.callSignTransaction, "tokenToOthersFromAccount", formId, ethereum, address, sourceToken,
        sourceAmount, destToken, destAddress,
        maxDestAmount, minConversionRate,
        throwOnFailure, nonce, gas,
        gasPrice, keystring, type, password)
      yield put(actions.prePareBroadcast())
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
    gasPrice, keystring, type, password, account, data, keyService } = action.payload
  try {
    var remainStr = yield call(ethereum.call("getAllowance"), sourceToken, address)
    var remain = converter.hexToBigNumber(remainStr)
    var sourceAmountBig = converter.hexToBigNumber(sourceAmount)
    if (!remain.greaterThanOrEqualTo(sourceAmountBig)) {
      var rawApprove = yield call(keyService.callSignTransaction, "getAppoveToken", ethereum, sourceToken, sourceAmount, nonce, gas, gasPrice,
        keystring, password, type, address)
      yield put(actions.prePareBroadcast())
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
  const { ethereum, source, dest, reserve, focus } = action.payload
  try {
    const rate = yield call(ethereum.call("getRate"), source, dest, reserve)
    yield put.sync(actions.updateRateExchangeComplete(rate))
    yield put(actions.caculateAmount())
  }
  catch (err) {
    console.log("===================")
    console.log(err)
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
}