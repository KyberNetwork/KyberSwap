import { take, put, call, fork, select, takeEvery, all } from 'redux-saga/effects'
import * as actions from '../actions/transferActions'
import * as utilActions from '../actions/utilActions'
import constants from "../services/constants"
import * as converter from "../utils/converter"
import * as ethUtil from 'ethereumjs-util'
import Tx from "../services/tx"
import { updateAccount, incManualNonceAccount } from '../actions/accountActions'
import { addTx } from '../actions/txActions'

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


function* runAfterBroadcastTx(ethereum, txRaw, hash, account, data) {
  const tx = new Tx(
    hash, account.address, ethUtil.bufferToInt(txRaw.gas),
    converter.weiToGwei(ethUtil.bufferToInt(txRaw.gasPrice)),
    ethUtil.bufferToInt(txRaw.nonce), "pending", "transfer", data)
  yield put(incManualNonceAccount(account.address))
  yield put(updateAccount(ethereum, account))
  yield put(addTx(tx))
  yield put(actions.doTransactionComplete(hash))
  yield put(actions.finishTransfer())
}

function* doTransactionFail(ethereum, account, e) {
  yield put(actions.doTransactionFail(e))
  //yield put(incManualNonceAccount(account.address))
  yield put(updateAccount(ethereum, account))
}


export function* processTransfer(action) {
  const { formId, ethereum, address,
    token, amount,
    destAddress, nonce, gas,
    gasPrice, keystring, type, password, account, data, keyService } = action.payload
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
    gasPrice, keystring, type, password, account, data, keyService } = action.payload
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
    yield put(actions.prePareBroadcast())
    const hash = yield call(ethereum.call("sendRawTransaction"), rawTx, ethereum)
    yield call(runAfterBroadcastTx, ethereum, rawTx, hash, account, data)
  } catch (e) {
    yield call(doTransactionFail, ethereum, account, e.message)
  }

}

function* transferColdWallet(action, callService) {
  const { formId, ethereum, address,
    token, amount,
    destAddress, nonce, gas,
    gasPrice, keystring, type, password, account, data, keyService } = action.payload
  try {
    var rawTx
    rawTx = yield call(keyService.callSignTransaction, callService, formId, ethereum, address,
      token, amount,
      destAddress, nonce, gas,
      gasPrice, keystring, type, password)
    yield put(actions.prePareBroadcast())
    const hash = yield call(ethereum.call("sendRawTransaction"), rawTx, ethereum)
    yield call(runAfterBroadcastTx, ethereum, rawTx, hash, account, data)
  } catch (e) {
    console.log(e)
    yield call(doTransactionFail, ethereum, account, e.message)
    return
  }
}

function* transferMetamask(action, callService) {
  const { formId, ethereum, address,
    token, amount,
    destAddress, nonce, gas,
    gasPrice, keystring, type, password, account, data, keyService } = action.payload
  try {
    const hash = yield call(keyService.callSignTransaction, callService, formId, ethereum, address,
      token, amount,
      destAddress, nonce, gas,
      gasPrice, keystring, type, password)
    yield put(actions.prePareBroadcast())
    const rawTx = {gas, gasPrice, nonce}
    yield call(runAfterBroadcastTx, ethereum, rawTx, hash, account, data)
  } catch (e) {
    console.log(e)
    yield call(doTransactionFail, ethereum, account, e.message)
    return
  }
}

export function* watchTransfer() {
  yield takeEvery("TRANSFER.TX_BROADCAST_PENDING", broadCastTx)
  yield takeEvery("TRANSFER.PROCESS_TRANSFER", processTransfer)
}