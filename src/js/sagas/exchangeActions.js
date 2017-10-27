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
//import EXCHANGE from "../constants/exchangeFormActions"

function* broadCastTx(action) {
  const { ethereum, tx, account, data } = action.payload
  try {
    const hash = yield call(ethereum.sendRawTransaction, tx, ethereum)
    yield call(runAfterBroadcastTx, ethereum, tx, hash, account, data)
  }
  catch (e) {
    yield call(doTransactionFail, ethereum, account, e)
  }
}

function* approveTx(action) {
  try {
    const { ethereum, tx, callback } = action.payload
    const hash = yield call(ethereum.sendRawTransaction, tx, ethereum)
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
    const hashApprove = yield call(ethereum.sendRawTransaction, rawApprove, ethereum)
    console.log(hashApprove)
    yield put(actions.hideApprove())
    yield put(actions.showConfirmApprove())
  } catch (e) {
    yield call(doApproveTransactionFail, ethereum, account, e)
  }
}
function* processExchangeAfterApprove(action){
  const { formId, ethereum, address, sourceToken,
    sourceAmount, destToken, destAddress,
    maxDestAmount, minConversionRate,
    throwOnFailure, nonce, gas,
    gasPrice, keystring, type, password, account, data } = action.payload
  try{
    const txRaw = yield call(servicesExchange.tokenToOthersFromAccount, formId, ethereum, address, sourceToken,
      sourceAmount, destToken, destAddress,
      maxDestAmount, minConversionRate,
      throwOnFailure, nonce, gas,
      gasPrice, keystring, type, password)
      yield put(actions.saveRawExchangeTransaction(txRaw))
      yield put(actions.showConfirm())
  }catch(e){
    console.log(e)
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
          yield put(actions.throwPassphraseError(e.message))
          return
        }
        const hash = yield call(ethereum.sendRawTransaction, txRaw, ethereum)
        yield call(runAfterBroadcastTx, ethereum, txRaw, hash, account, data)
      } else {
        txRaw = yield call(servicesExchange.etherToOthersFromAccount, formId, ethereum, address, sourceToken,
          sourceAmount, destToken, destAddress,
          maxDestAmount, minConversionRate,
          throwOnFailure, nonce, gas,
          gasPrice, keystring, type, password)
        yield put(actions.saveRawExchangeTransaction(txRaw))
        yield put(actions.showConfirm())
      }      
    } else {
      const remain = yield call([ethereum, ethereum.getAllowance], sourceToken, address)
      console.log(remain)
      const sourceAmountBig = converter.hexToNumber(sourceAmount)
      console.log(remain.greaterThanOrEqualTo(sourceAmountBig))
      if (!remain.greaterThanOrEqualTo(sourceAmountBig)) {
        //get approve
        if (type === "keystore") {
          var rawApprove
          try {
            rawApprove = yield call(servicesExchange.getAppoveToken, ethereum, sourceToken, sourceAmount, nonce, gas, gasPrice,
              keystring, password, type)
          } catch (e) {
            yield put(actions.throwPassphraseError(e.message))
            return
          }

          const hashApprove = yield call(ethereum.sendRawTransaction, rawApprove, ethereum)
          console.log(hashApprove)
          const txRaw = yield call(servicesExchange.tokenToOthersFromAccount, formId, ethereum, address, sourceToken,
            sourceAmount, destToken, destAddress,
            maxDestAmount, minConversionRate,
            throwOnFailure, nonce, gas,
            gasPrice, keystring, type, password)
          const hash = yield call(ethereum.sendRawTransaction, txRaw, ethereum)
          yield call(runAfterBroadcastTx, ethereum, txRaw, hash, account, data)
        } else {
          yield put(actions.showApprove())
        }
      } else {
        var txRaw
        try {
          txRaw = yield call(servicesExchange.tokenToOthersFromAccount, formId, ethereum, address, sourceToken,
            sourceAmount, destToken, destAddress,
            maxDestAmount, minConversionRate,
            throwOnFailure, nonce, gas,
            gasPrice, keystring, type, password)
        } catch (e) {
          yield put(actions.throwPassphraseError(e.message))
          return
        }        
        if (type === "keystore") {
          const hash = yield call(ethereum.sendRawTransaction, txRaw, ethereum)
          yield call(runAfterBroadcastTx, ethereum, txRaw, hash, account, data)
        } else {
          yield put(actions.saveRawExchangeTransaction(txRaw))
          yield put(actions.showConfirm())
        }
      }
    }
  }
  catch (e) {
    yield call(doTransactionFail, ethereum, account, e)
  }


}

export function* watchExchange() {
  yield takeEvery("EXCHANGE.TX_BROADCAST_PENDING", broadCastTx)
  yield takeEvery("EXCHANGE.APPROVAL_TX_BROADCAST_PENDING", approveTx)
  yield takeEvery("EXCHANGE.SELECT_TOKEN_ASYNC", selectToken)
  yield takeEvery("EXCHANGE.PROCESS_EXCHANGE", processExchange)
  yield takeEvery("EXCHANGE.PROCESS_APPROVE", processApprove)
  yield takeEvery("EXCHANGE.PROCESS_EXCHANGE_AFTER_APPROVE", processExchangeAfterApprove)
}