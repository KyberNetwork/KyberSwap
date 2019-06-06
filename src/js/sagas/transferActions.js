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
import { store } from "../store"
import { getTranslate } from 'react-localize-redux';


function* getMaxGasTransfer() {
  var state = store.getState()
  const transfer = state.transfer
  if (transfer.tokenSymbol !== 'DGX') {
    return transfer.gas_limit
  } else {
    return 250000
  }
}

function* estimateGasUsed(action) {
  var { ethereum } = action.payload
  var state = store.getState()
  var transfer = state.transfer

  var tokens = state.tokens.tokens
  var decimals = 18
  var tokenSymbol = state.transfer.tokenSymbol
  if (tokens[tokenSymbol]) {
    decimals = tokens[tokenSymbol].decimals
  }

  var account = state.account.account
  var fromAddr = account.address

  yield call(fetchAndSetGas, ethereum, fromAddr, transfer.tokenSymbol, transfer.token, decimals, transfer.amount)
}



function* estimateGasUsedWhenSelectToken(action) {
  const { symbol, address } = action.payload

  var state = store.getState()

  var ethereum = state.connection.ethereum
  if (!ethereum) {
    return
  }

  var transfer = state.transfer

  var tokens = state.tokens.tokens
  var decimals = 18
  var tokenSymbol = symbol
  if (tokens[tokenSymbol]) {
    decimals = tokens[tokenSymbol].decimals
  }

  var account = state.account.account
  var fromAddr = account.address

  yield call(fetchAndSetGas, ethereum, fromAddr, tokenSymbol, address, decimals, transfer.amount)
}

function* estimateGasUsedWhenChangeAmount(action) {
  var amount = action.payload

  var state = store.getState()
  var ethereum = state.connection.ethereum
  if (!ethereum) {
    return
  }

  var transfer = state.transfer
  var tokens = state.tokens.tokens

  var decimals = 18
  var tokenSymbol = transfer.tokenSymbol
  if (tokens[tokenSymbol]) {
    decimals = tokens[tokenSymbol].decimals
  }

  var account = state.account.account
  var fromAddr = account.address

  yield call(fetchAndSetGas, ethereum, fromAddr, tokenSymbol, transfer.token, decimals, amount)

}

function* fetchAndSetGas(ethereum, fromAddr, tokenSymbol, tokenAddr, decimals, amount) {
  var gasRequest = yield call(calculateGasUse, ethereum, fromAddr, tokenSymbol, tokenAddr, decimals, amount)
  // {"status": "success", res: gasLimit}
  if (gasRequest.status === "success") {
    const gas = gasRequest.res
    yield put(actions.setGasUsed(gas))
  } else {
    var gasLimit = yield call(getMaxGasTransfer)
    yield put(actions.setGasUsed(gasLimit))
  }
}


function* fetchGasSnapshot() {
  var state = store.getState()
  var transfer = state.transfer
  var tokens = state.tokens.tokens
  var ethereum = state.connection.ethereum

  var decimals = 18
  var tokenSymbol = transfer.tokenSymbol
  if (tokens[tokenSymbol]) {
    decimals = tokens[tokenSymbol].decimals
  }

  var account = state.account.account
  var fromAddr = account.address




  var gasRequest = yield call(common.handleRequest, calculateGasUse, ethereum, fromAddr, tokenSymbol, transfer.token, decimals, transfer.amount)
  if (gasRequest.status === "success") {
    const gas = gasRequest.data
    yield put(actions.setGasUsedSnapshot(gas))
  }
  if ((gasRequest.status === "timeout") || (gasRequest.status === "fail")) {
    // var state = store.getState()
    // var transfer = state.transfer
    var gasLimit = yield call(getMaxGasTransfer)
    yield put(actions.setGasUsedSnapshot(gasLimit))
  }

  yield put(actions.fetchSnapshotGasSuccess())
}

function* calculateGasUse(ethereum, fromAddr, tokenSymbol, tokenAddr, tokenDecimal, sourceAmount) {
  var state = store.getState()
  var transfer = state.transfer
  const amount = converter.stringToHex(sourceAmount, tokenDecimal)
  var gasLimit = yield call(getMaxGasTransfer)
  var gas = 0
  var internalAdrr = "0x3cf628d49ae46b49b210f0521fbd9f82b461a9e1"
  var txObj
  if (tokenSymbol === 'ETH') {
    var destAddr = transfer.destAddress !== "" ? transfer.destAddress : internalAdrr
    txObj = {
      from: fromAddr,
      value: amount,
      to: destAddr
    }
    try {
      gas = yield call([ethereum, ethereum.call], "estimateGas", txObj)
      if (gas > 21000) {
        gas = Math.round(gas * 120 / 100)
      }
      return { status: "success", res: gas }
    } catch (e) {
      console.log(e.message)
      return { "status": "success", res: gasLimit }
    }
  } else {
    if (tokenSymbol === "TUSD" || tokenSymbol === "EURS") {
      return { "status": "success", res: gasLimit }
    }
    try {
      var destAddr = transfer.destAddress !== "" ? transfer.destAddress : internalAdrr
      var data = yield call([ethereum, ethereum.call], "sendTokenData", tokenAddr, amount, destAddr)
      txObj = {
        from: fromAddr,
        value: "0",
        to: tokenAddr,
        data: data
      }
      gas = yield call([ethereum, ethereum.call], "estimateGas", txObj)
      //addition 15k gas for transfer token
      gas = Math.round((gas + 15000) * 120 / 100)
      return { "status": "success", res: gas }
    } catch (e) {
      console.log(e.message)
      return { "status": "success", res: gasLimit }
    }
  }
}

export function* verifyTransfer() {
  var state = store.getState()
  var transfer = state.transfer
  var translate = getTranslate(state.locale)

  var amount = transfer.amount
  if (isNaN(amount) || amount === "") {
    amount = 0
  }

  if (state.account.isGetAllBalance){
    var account = state.account.account
    var testBalanceWithFee = validators.verifyBalanceForTransaction(account.balance,
      transfer.tokenSymbol, amount, transfer.gas, transfer.gasPrice)
    if (testBalanceWithFee) {
      yield put(actions.throwErrorAmount(constants.TRANSFER_CONFIG.sourceErrors.balance, translate("error.eth_balance_not_enough_for_fee")))
    } else {
      yield put(actions.clearErrorAmount(constants.TRANSFER_CONFIG.sourceErrors.balance))
    }
  }
}

export function* doAfterAccountImported(action){
  var {account, walletName} = action.payload
  if (account.type === "promo"){
    var state = store.getState()
    var transfer = state.transfer
    var tokens = state.tokens.tokens
    var ethereum = state.connection.ethereum

    if (account.info.destToken && tokens[account.info.destToken.toUpperCase()]){
      var destTokenSymbol = account.info.destToken.toUpperCase()
      var destToken = tokens[destTokenSymbol].address

      //select in transfer
      yield put(actions.selectToken(destTokenSymbol, destToken))

      yield put(actions.setGasPriceSuggest({
        ...transfer.gasPriceSuggest,
        fastGas: transfer.gasPriceSuggest.fastGas + 2
      }))

      if (!transfer.isEditGasPrice) {
        yield put(actions.setSelectedGasPrice(transfer.gasPriceSuggest.fastGas + 2, "f"));
      }

    }

  }
}

export function* watchTransfer() {

  yield takeEvery("TRANSFER.ESTIMATE_GAS_USED", estimateGasUsed)
  yield takeEvery("TRANSFER.SELECT_TOKEN", estimateGasUsedWhenSelectToken)
  yield takeEvery("TRANSFER.ESTIMATE_GAS_WHEN_AMOUNT_CHANGE", estimateGasUsedWhenChangeAmount)
  yield takeEvery("TRANSFER.FETCH_GAS_SNAPSHOT", fetchGasSnapshot)
  yield takeEvery("TRANSFER.VERIFY_TRANSFER", verifyTransfer)

  yield takeEvery("ACCOUNT.IMPORT_NEW_ACCOUNT_FULFILLED", doAfterAccountImported)
}
