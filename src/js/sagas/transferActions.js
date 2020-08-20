import { put, call, takeEvery } from 'redux-saga/effects'
import * as actions from '../actions/transferActions'
import constants from "../services/constants"
import * as converter from "../utils/converter"
import * as common from "./common"
import * as validators from "../utils/validators"
import { store } from "../store"
import { getTranslate } from 'react-localize-redux';

function* getMaxGasTransfer() {
  const state = store.getState();
  const transfer = state.transfer;
  const specialGasLimit = constants.SPECIAL_TRANSFER_GAS_LIMIT[transfer.tokenSymbol];
  
  if (!specialGasLimit) {
    return transfer.gas_limit;
  }
  
  return specialGasLimit;
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

function* doAfterAccountImported(action){
  var {account, walletName} = action.payload
  if (account.type === "promo"){
    var state = store.getState()
    var transfer = state.transfer
    var tokens = state.tokens.tokens

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
  yield takeEvery("TRANSFER.VERIFY_TRANSFER", verifyTransfer)
  yield takeEvery("ACCOUNT.IMPORT_NEW_ACCOUNT_FULFILLED", doAfterAccountImported)
}
