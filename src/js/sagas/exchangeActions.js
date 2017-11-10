import { take, put, call, fork, select, takeEvery, all, apply } from 'redux-saga/effects'
import * as actions from '../actions/exchangeActions'
import { updateAccount, incManualNonceAccount } from '../actions/accountActions'
import { addTx } from '../actions/txActions'
import * as utilActions from '../actions/utilActions'
import constants from "../services/constants"
import * as converter from "../utils/converter"
import * as ethUtil from 'ethereumjs-util'
import * as servicesExchange from "../services/exchange"
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

function* runAfterBroadcastTx(ethereum, txRaw, hash, account, data) {
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
  yield put(incManualNonceAccount(account.address))
  yield put(updateAccount(ethereum, account))
}

function* doApproveTransactionFail(ethereum, account, e) {
  yield put(actions.doApprovalTransactionFail(e))
  yield put(incManualNonceAccount(account.address))
  yield put(updateAccount(ethereum, account))
}

function* processApprove(action) {
  const { ethereum, sourceToken, sourceAmount, nonce, gas, gasPrice,
    keystring, password, accountType, account } = action.payload
  try {
    const rawApprove = yield call(servicesExchange.getAppoveToken, ethereum, sourceToken, sourceAmount, nonce, gas, gasPrice,
      keystring, password, accountType)
    const hashApprove = yield call(ethereum.call("sendRawTransaction"), rawApprove, ethereum)
    yield put(actions.hideApprove())
    yield put(actions.showConfirm())
  } catch (e) {
    console.log(e)
    yield call(doApproveTransactionFail, ethereum, account, e.message)
  }
}

function* processExchangeAfterConfirm(action) {
  const { formId, ethereum, address, sourceToken,
    sourceAmount, destToken, destAddress,
    maxDestAmount, minConversionRate,
    throwOnFailure, nonce, gas,
    gasPrice, keystring, type, password, account, data } = action.payload
  try {
    if (sourceToken == constants.ETHER_ADDRESS) {
      var txRaw = yield call(servicesExchange.etherToOthersFromAccount, formId, ethereum, address, sourceToken,
        sourceAmount, destToken, destAddress,
        maxDestAmount, minConversionRate,
        throwOnFailure, nonce, gas,
        gasPrice, keystring, type, password)
    } else {
      txRaw = yield call(servicesExchange.tokenToOthersFromAccount, formId, ethereum, address, sourceToken,
        sourceAmount, destToken, destAddress,
        maxDestAmount, minConversionRate,
        throwOnFailure, nonce, gas,
        gasPrice, keystring, type, password)
    }
    yield put(actions.prePareBroadcast())
    const hash = yield call(ethereum.call("sendRawTransaction"), txRaw)
    yield call(runAfterBroadcastTx, ethereum, txRaw, hash, account, data)
  } catch (e) {
    console.log(e)
    yield call(doTransactionFail, ethereum, account, e.message)
  }
}

function* processExchange(action) {
  const { formId, ethereum, address, sourceToken,
    sourceAmount, destToken, destAddress,
    maxDestAmount, minConversionRate,
    throwOnFailure, nonce, gas,
    gasPrice, keystring, type, password, account, data } = action.payload

  //check send ether or send token 

  try {
    if (sourceToken == constants.ETHER_ADDRESS) {
      var txRaw
      if (type === "keystore") {
        try {
          txRaw = yield call(servicesExchange.etherToOthersFromAccount, formId, ethereum, address, sourceToken,
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
          yield put(actions.prePareBroadcast())
          const hash = yield call(ethereum.call("sendRawTransaction"), txRaw, ethereum)
          yield call(runAfterBroadcastTx, ethereum, txRaw, hash, account, data)
        } catch (e) {
          console.log(e)
          yield call(doTransactionFail, ethereum, account, e.message)
          return
        }

      } else {
        yield put(actions.showConfirm())
      }
    } else {
      const remainStr = yield call(ethereum.call("getAllowance"), sourceToken, address)
      const remain = converter.hexToBigNumber(remainStr)
      const sourceAmountBig = converter.hexToBigNumber(sourceAmount)
      if (!remain.greaterThanOrEqualTo(sourceAmountBig)) {
        //get approve
        if (type === "keystore") {
          var rawApprove
          try {
            rawApprove = yield call(servicesExchange.getAppoveToken, ethereum, sourceToken, sourceAmount, nonce, gas, gasPrice,
              keystring, password, type)
          } catch (e) {
            console.log(e)
            yield put(actions.throwPassphraseError(e.message))
            return
          }
          yield put(actions.prePareBroadcast())
          const hashApprove = yield call(ethereum.call("sendRawTransaction"), rawApprove, ethereum)
          //console.log(hashApprove)
          const txRaw = yield call(servicesExchange.tokenToOthersFromAccount, formId, ethereum, address, sourceToken,
            sourceAmount, destToken, destAddress,
            maxDestAmount, minConversionRate,
            throwOnFailure, nonce, gas,
            gasPrice, keystring, type, password)
          const hash = yield call(ethereum.call("sendRawTransaction"), txRaw, ethereum)
          yield call(runAfterBroadcastTx, ethereum, txRaw, hash, account, data)
        } else {
          yield put(actions.showApprove())
        }
      } else {
        //var txRaw
        if (type === "keystore") {
          try {
            var txRaw = yield call(servicesExchange.tokenToOthersFromAccount, formId, ethereum, address, sourceToken,
              sourceAmount, destToken, destAddress,
              maxDestAmount, minConversionRate,
              throwOnFailure, nonce, gas,
              gasPrice, keystring, type, password)
          } catch (e) {
            console.log(e)
            yield put(actions.throwPassphraseError(e.message))
            return
          }
          yield put(actions.prePareBroadcast())
          const hash = yield call(ethereum.call("sendRawTransaction"), txRaw, ethereum)
          yield call(runAfterBroadcastTx, ethereum, txRaw, hash, account, data)
        } else {
          yield put(actions.showConfirm())
        }
      }
    }
  }
  catch (e) {
    console.log(e)
    yield call(doTransactionFail, ethereum, account, e.message)
  }
}

function* updateRatePending(action) {
  const { ethereum, source, dest, reserve } = action.payload
  const rate = yield call(ethereum.call("getRate"), source, dest, reserve)
  yield put(actions.updateRateExchangeComplete(rate))

}

export function* watchExchange() {
  yield takeEvery("EXCHANGE.TX_BROADCAST_PENDING", broadCastTx)
  yield takeEvery("EXCHANGE.APPROVAL_TX_BROADCAST_PENDING", approveTx)
  yield takeEvery("EXCHANGE.SELECT_TOKEN_ASYNC", selectToken)
  yield takeEvery("EXCHANGE.PROCESS_EXCHANGE", processExchange)
  yield takeEvery("EXCHANGE.PROCESS_APPROVE", processApprove)
  yield takeEvery("EXCHANGE.PROCESS_EXCHANGE_AFTER_CONFIRM", processExchangeAfterConfirm)
  yield takeEvery("EXCHANGE.UPDATE_RATE_PENDING", updateRatePending)
}