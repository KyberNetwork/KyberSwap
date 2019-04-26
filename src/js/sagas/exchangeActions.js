import { take, put, call, fork, select, takeEvery, all, apply } from 'redux-saga/effects'
import * as actions from '../actions/exchangeActions'
import * as globalActions from "../actions/globalActions"

import * as common from "./common"
import * as validators from "../utils/validators"

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
  yield call(estimateGasNormal)
  
  if (ethereum){
    yield call(ethereum.fetchRateExchange, true)
  }

  //calculate gas use
  // yield call(updateGasUsed)
}

export function* runAfterBroadcastTx(ethereum, txRaw, hash, account, data) {

  try {
    yield call(getInfo, hash)
  } catch (e) {
    console.log(e)
  }

  const state = store.getState();
  const global = state.global;
  const exchange = state.exchange;

  //track complete trade
  global.analytics.callTrack("trackCoinExchange", data);
  global.analytics.callTrack("completeTrade", hash, "kyber", "swap");

  // Track swapping time here
  const swappingTime = exchange.swappingTime;
  const currentTime = Math.round(new Date().getTime());
  global.analytics.callTrack("trackBroadcastedTransaction", currentTime - swappingTime);

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


  try {
    var notiService = global.notiService
    notiService.callFunc("setNewTx", { hash: hash })
  } catch (e) {
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
  console.log({ account, e })
  var error = e
  if (!error) {
    var translate = getTranslate(store.getState().locale)
    var link = BLOCKCHAIN_INFO.ethScanUrl + "address/" + account.address
    error = translate("error.broadcast_tx", { link: link }) || "Potentially Failed! We likely couldn't broadcast the transaction to the blockchain. Please check on Etherscan to verify."
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
    // const remain = converter.hexToBigNumber(remainStr)
    // const sourceAmountBig = converter.hexToBigNumber(sourceAmount)


    var currenStep = yield call(checkStep, remainStr, sourceAmount)
    switch(currenStep){
      case 3:
        yield put(actions.showConfirm())
        yield call(fetchGasConfirmSnapshot)
        break
      case 2:
        yield put(actions.showApprove())
        yield call(fetchGasApproveSnapshot)
        break
      case 1:
        yield put(actions.showApproveZero())
        yield call(fetchGasApproveSnapshot, true)
        break
        
    }
    // if (!remain.isGreaterThanOrEqualTo(sourceAmountBig) && !isApproveTxPending()) {
    //   yield put(actions.showApprove())
    //   yield call(fetchGasApproveSnapshot)
    // } else {
    //   yield put(actions.showConfirm())
    //   yield call(fetchGasConfirmSnapshot)
    // }
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
      var result = yield call(processApproveByColdWallet, action)
      if (result) {
        yield put(actions.hideApprove())
        yield put(actions.showConfirm())
      }
      break
    case "metamask":
      var result = yield call(processApproveByMetamask, action)
      if (result) {
        yield put(actions.hideApprove())
        yield put(actions.showConfirm())
      }
      break
  }
}

export function* processApproveZero(action) {
  const { ethereum, sourceToken, sourceAmount, nonce, gas, gasPrice,
    keystring, password, accountType, account, keyService, sourceTokenSymbol } = action.payload
  switch (accountType) {
    case "trezor":
    case "ledger":
      var result = yield call(processApproveByColdWalletZero, action)
      if (result) {
        yield put(actions.hideApproveZero())
        yield put(actions.showApprove())
      }
      break
    case "metamask":
      var result = yield call(processApproveByMetamaskZero, action)
      if (result) {
        yield put(actions.hideApproveZero())
        yield put(actions.showApprove())
      }
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

    yield put(actions.fetchGasSuccess())
    return true
  } catch (e) {
    console.log(e)
    yield call(doTxFail, ethereum, account, e.message)
    return false
  }
}

export function* processApproveByColdWalletZero(action) {
  const { ethereum, sourceToken, sourceAmount, nonce, gas, gasPrice,
    keystring, password, accountType, account, keyService, sourceTokenSymbol } = action.payload
  //try {
  let rawApprove
  try {
    rawApprove = yield call(keyService.callSignTransaction, "getAppoveTokenZero", ethereum, sourceToken, sourceAmount, nonce, gas, gasPrice,
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
    yield put(actions.setApproveTxZero(hashApprove, sourceTokenSymbol))

    //increase nonce 
    yield put(incManualNonceAccount(account.address))

    yield put(actions.fetchGasSuccess())
    return true
  } catch (e) {
    console.log(e)
    yield call(doTxFail, ethereum, account, e.message)
    return false
  }
}

export function* processApproveByMetamask(action) {
  const { ethereum, sourceToken, sourceAmount, nonce, gas, gasPrice,
    keystring, password, accountType, account, keyService, sourceTokenSymbol } = action.payload
  try {
    const hashApprove = yield call(keyService.callSignTransaction, "getAppoveToken", ethereum, sourceToken, sourceAmount, nonce, gas, gasPrice,
      keystring, password, accountType, account.address)

    yield put(actions.setApproveTx(hashApprove, sourceTokenSymbol))
    console.log(hashApprove)
    //return
    //increase nonce 
    yield put(incManualNonceAccount(account.address))

    yield put(actions.fetchGasSuccess())
    return true
  } catch (e) {
    yield put(actions.setSignError(e.toString()))
    return false
  }
}

export function* processApproveByMetamaskZero(action) {
  const { ethereum, sourceToken, sourceAmount, nonce, gas, gasPrice,
    keystring, password, accountType, account, keyService, sourceTokenSymbol } = action.payload
  try {
    const hashApprove = yield call(keyService.callSignTransaction, "getAppoveTokenZero", ethereum, sourceToken, sourceAmount, nonce, gas, gasPrice,
      keystring, password, accountType, account.address)

    yield put(actions.setApproveTxZero(hashApprove, sourceTokenSymbol))
    console.log(hashApprove)
    //return
    //increase nonce 
    yield put(incManualNonceAccount(account.address))

    yield put(actions.fetchGasSuccess())
    return true
  } catch (e) {
    yield put(actions.setSignError(e.toString()))
    return false
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
      case "promo":
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
      case "promo":
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


function* checkStep(remain, sourceAmount) {
  var remain = converter.hexToBigNumber(remain)
  var sourceAmount = converter.hexToBigNumber(sourceAmount)

  if (converter.compareTwoNumber(remain, sourceAmount) !== -1) {
    return 3
  }

  const state = store.getState()
  const tokens = state.tokens.tokens
  const sourceTokenSymbol = state.exchange.sourceTokenSymbol

  if (remain != 0 && !!tokens[sourceTokenSymbol].approveZeroTx && !!tokens[sourceTokenSymbol].approveTx) {
    return 3
  }

  if (remain != 0 && !!tokens[sourceTokenSymbol].approveZeroTx && !tokens[sourceTokenSymbol].approveTx) {
    return 2
  }

  if (remain != 0 && !tokens[sourceTokenSymbol].approveZeroTx) {
    return 1
  }

  if (remain == 0 && !!tokens[sourceTokenSymbol].approveTx) {
    return 3
  }
  if (remain == 0 && !tokens[sourceTokenSymbol].approveTx) {
    return 2
  }
}

function* exchangeTokentoETHKeystore(action) {
  var { formId, ethereum, address, sourceToken,
    sourceAmount, destToken, destAddress,
    maxDestAmount, minConversionRate,
    throwOnFailure, nonce, gas,
    gasPrice, keystring, type, password, account, data, keyService, balanceData, sourceTokenSymbol, blockNo } = action.payload
  var remainStr = yield call([ethereum, ethereum.call], "getAllowanceAtLatestBlock", sourceToken, address)
  // console.log("remain: " + remainStr)
  // var remain = converter.hexToBigNumber(remainStr)
  // var sourceAmountBig = converter.hexToBigNumber(sourceAmount)

  // console.log("we_are_here")
  // console.log(remain)
  // return 

  var currentStep = yield call(checkStep, remainStr, sourceAmount)

  switch (currentStep) {
    case 3:
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
      break
    case 2:
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
      break
    case 1:
      var rawApproveZero
      try {
        rawApproveZero = yield call(keyService.callSignTransaction, "getAppoveTokenZero", ethereum, sourceToken, sourceAmount, nonce, gas, gasPrice,
          keystring, password, type, address)
      } catch (e) {
        console.log(e)
        yield put(actions.throwPassphraseError(e.message))
        return
      }
      try {
        yield put(actions.prePareBroadcast(balanceData))
        var hashApproveZero, txRaw
        //try {
        var hashApproveZero = yield call([ethereum, ethereum.callMultiNode], "sendRawTransaction", rawApproveZero)

        yield put(actions.setApproveTxZero(hashApproveZero, sourceTokenSymbol))
        console.log("approve_zero: " + hashApproveZero)
        //increase nonce 
        yield put(incManualNonceAccount(account.address))
        nonce++

        //aprove
        var rawApprove = yield call(keyService.callSignTransaction, "getAppoveToken", ethereum, sourceToken, sourceAmount, nonce, gas, gasPrice,
          keystring, password, type, address)
        var hashApprove = yield call([ethereum, ethereum.callMultiNode], "sendRawTransaction", rawApprove)

        yield put(actions.setApproveTx(hashApprove, sourceTokenSymbol))
        console.log("approve: " + hashApprove)
        //increase nonce 
        yield put(incManualNonceAccount(account.address))
        nonce++

        //send tx
        txRaw = yield call(keyService.callSignTransaction, "tokenToOthersFromAccount", formId, ethereum, address, sourceToken,
          sourceAmount, destToken, destAddress,
          maxDestAmount, minConversionRate,
          blockNo, nonce, gas,
          gasPrice, keystring, type, password)
        yield put(actions.prePareBroadcast(balanceData))
        // } catch (e) {
        //   console.log(e)
        //   yield call(doTxFail, ethereum, account, e.message)
        //   return
        // }
        var hash = yield call([ethereum, ethereum.callMultiNode], "sendRawTransaction", txRaw)
        yield call(runAfterBroadcastTx, ethereum, txRaw, hash, account, data)
      } catch (e) {
        console.log(e)
        yield call(doTxFail, ethereum, account, e.message)
        return
      }
      break

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

    var currentStep = yield call(checkStep, remainStr, sourceAmount)

    switch (currentStep) {
      case 3:
        try {
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
        break
      case 2:
        try {
          let rawApprove
          try {
            rawApprove = yield call(keyService.callSignTransaction, "getAppoveToken", ethereum, sourceToken, sourceAmount, nonce, gas, gasPrice,
              keystring, password, type, address)
          } catch (e) {
            yield put(actions.setSignError(e.message))
            return
          }

          var hashApprove = yield call([ethereum, ethereum.callMultiNode], "sendRawTransaction", rawApprove)
          yield put(actions.setApproveTx(hashApprove, sourceTokenSymbol))
          console.log(hashApprove)
          //increase nonce 
          yield put(incManualNonceAccount(account.address))
          nonce++

          var txRaw = yield call(keyService.callSignTransaction, "tokenToOthersFromAccount", formId, ethereum, address, sourceToken,
            sourceAmount, destToken, destAddress,
            maxDestAmount, minConversionRate,
            blockNo, nonce, gas,
            gasPrice, keystring, type, password)
          yield put(actions.prePareBroadcast(balanceData))
          var hash = yield call([ethereum, ethereum.callMultiNode], "sendRawTransaction", txRaw)
          yield call(runAfterBroadcastTx, ethereum, txRaw, hash, account, data)
        } catch (e) {
          console.log(e)
          yield call(doTxFail, ethereum, account, e.message)
          return
        }
        break;
      case 1:
        try {
          let rawApproveZero
          try {
            rawApproveZero = yield call(keyService.callSignTransaction, "getAppoveTokenZero", ethereum, sourceToken, sourceAmount, nonce, gas, gasPrice,
              keystring, password, type, address)
          } catch (e) {
            console.log(e)
            yield put(actions.setSignError(e.message))
            return
          }

          //yield put(actions.prePareBroadcast(balanceData))
          var hashApproveZero
          var hashApproveZero = yield call([ethereum, ethereum.callMultiNode], "sendRawTransaction", rawApproveZero)
          yield put(actions.setApproveTx(hashApproveZero, sourceTokenSymbol))
          console.log(hashApproveZero)
          yield put(incManualNonceAccount(account.address))
          nonce++

          var rawApprove = yield call(keyService.callSignTransaction, "getAppoveToken", ethereum, sourceToken, sourceAmount, nonce, gas, gasPrice,
            keystring, password, type, address)
          var hashApprove
          var hashApprove = yield call([ethereum, ethereum.callMultiNode], "sendRawTransaction", rawApprove)
          yield put(actions.setApproveTx(hashApprove, sourceTokenSymbol))
          console.log(hashApprove)
          yield put(incManualNonceAccount(account.address))
          nonce++

          var txRaw = yield call(keyService.callSignTransaction, "tokenToOthersFromAccount", formId, ethereum, address, sourceToken,
            sourceAmount, destToken, destAddress,
            maxDestAmount, minConversionRate,
            blockNo, nonce, gas,
            gasPrice, keystring, type, password)

          yield put(actions.prePareBroadcast(balanceData))
          var hash = yield call([ethereum, ethereum.callMultiNode], "sendRawTransaction", txRaw)
          yield call(runAfterBroadcastTx, ethereum, txRaw, hash, account, data)
        } catch (e) {
          console.log(e)
          yield call(doTxFail, ethereum, account, e.message)
          return
        }
        break
    }
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

function* getRate(ethereum, source, dest, sourceAmount, blockNo) {
  //console.log({source, dest, sourceAmount})
  try {
    //get latestblock
    //const lastestBlock = yield call([ethereum, ethereum.call], "getLatestBlock")
    // console.log(lastestBlock)
    const rate = yield call([ethereum, ethereum.call], "getRateAtSpecificBlock", source, dest, sourceAmount, blockNo)
    const expectedPrice = rate.expectedPrice ? rate.expectedPrice : "0"
    const slippagePrice = rate.slippagePrice ? rate.slippagePrice : "0"
    return { status: "success", data: { expectedPrice, slippagePrice, blockNo } }
  }
  catch (err) {
    console.log(err)
    return { status: "fail" }
    //yield put.resolve(actions.updateRateExchangeComplete(rateInit, "0", "0", 0))
    //yield put(actions.setRateSystemError())
  }
}



function* getSourceAmount(sourceTokenSymbol, sourceAmount) {
  var state = store.getState()
  var tokens = state.tokens.tokens

  var sourceAmountHex = "0x0"
  if (tokens[sourceTokenSymbol]) {
    var decimals = tokens[sourceTokenSymbol].decimals
    var rateSell = tokens[sourceTokenSymbol].rate
    sourceAmountHex = converter.calculateMinSource(sourceTokenSymbol, sourceAmount, decimals, rateSell)
  } else {
    sourceAmountHex = converter.stringToHex(sourceAmount, 18)
  }
  return sourceAmountHex
}

function* getSourceAmountZero(sourceTokenSymbol) {
  var state = store.getState()
  var tokens = state.tokens.tokens
  var sourceAmountHex = "0x0"
  if (tokens[sourceTokenSymbol]) {
    var decimals = tokens[sourceTokenSymbol].decimals
    var rateSell = tokens[sourceTokenSymbol].rate
    sourceAmountHex = converter.toHex(converter.getSourceAmountZero(sourceTokenSymbol, decimals, rateSell))
  }
  return sourceAmountHex
}

function* updateRatePending(action) {
  const { ethereum, source, dest, sourceTokenSymbol, isManual, refetchSourceAmount } = action.payload;
  let { sourceAmount } = action.payload;

  const state = store.getState();
  const translate = getTranslate(state.locale);
  const { destTokenSymbol, destAmount } = state.exchange;

  if (refetchSourceAmount) {
    try {
     sourceAmount = yield call([ethereum, ethereum.call], "getSourceAmount", sourceTokenSymbol, destTokenSymbol, destAmount);
    } catch (err) {
      console.log(err);
    }
  }

  var sourceAmoutRefined = yield call(getSourceAmount, sourceTokenSymbol, sourceAmount)
  var sourceAmoutZero = yield call(getSourceAmountZero, sourceTokenSymbol)

  try{
    var lastestBlock = yield call([ethereum, ethereum.call], "getLatestBlock")
    var rate = yield call([ethereum, ethereum.call], "getRateAtSpecificBlock", source, dest, sourceAmoutRefined, lastestBlock)
    var rateZero = yield call([ethereum, ethereum.call], "getRateAtSpecificBlock", source, dest, sourceAmoutZero, lastestBlock)
    var { expectedPrice, slippagePrice } = rate

    var percentChange = 0
    if(rateZero.expectedPrice != 0){
      percentChange = (rateZero.expectedPrice - rate.expectedPrice) / rateZero.expectedPrice 
      percentChange = Math.round(percentChange * 1000) / 10    
      if(percentChange <= 0.1) {
        percentChange = 0
      }
      if(percentChange >= 100){
        percentChange = 0
        expectedPrice = 0
        slippagePrice = 0
      }
    }    

    yield put.resolve(actions.updateRateExchangeComplete(rateZero.expectedPrice.toString(), expectedPrice, slippagePrice, lastestBlock, isManual, true, percentChange))

  }catch(err){
    console.log(err)
    if(isManual){
      yield put(utilActions.openInfoModal(translate("error.error_occurred") || "Error occurred",
      translate("error.node_error") || "There are some problems with nodes. Please try again in a while."))
      return
    }
  }

  // if (isManual) {
  //   const lastestBlock = yield call([ethereum, ethereum.call], "getLatestBlock")
  //   var rateRequest = yield call(getRate, ethereum, source, dest, sourceAmoutRefined, lastestBlock)
  //   var rateRequestZeroAmount = yield call(getRate, ethereum, source, dest, sourceAmoutZero, lastestBlock)
    
  //   if (rateRequest.status === "success") {      
  //     var { expectedPrice, slippagePrice, blockNo } = rateRequest.data  

  //     var rateInit = expectedPrice.toString()
  //     if (expectedPrice.toString() === "0"){
  //       var rateRequestZeroAmount = yield call(common.handleRequest, getRate, ethereum, source, dest, sourceAmoutZero)
  //       if (rateRequestZeroAmount.status === "success"){
  //         rateInit = rateRequestZeroAmount.data.expectedPrice
  //       }
  //       if (rateRequestZeroAmount.status === "timeout") {
  //         yield put(utilActions.openInfoModal(translate("error.error_occurred") || "Error occurred",
  //           translate("error.node_error") || "There are some problems with nodes. Please try again in a while."))
  //           return
  //       }
  //       if (rateRequestZeroAmount.status === "fail") {
  //         yield put(utilActions.openInfoModal(translate("error.error_occurred") || "Error occurred",
  //           translate("error.network_error") || "Cannot connect to node right now. Please check your network!"))
  //           return
  //       }
  //     }
  //     yield put.sync(actions.updateRateExchangeComplete(rateInit, expectedPrice, slippagePrice, lastestBlock, isManual, true))
  //   }
  //   if (rateRequest.status === "timeout") {
  //     yield put(utilActions.openInfoModal(translate("error.error_occurred") || "Error occurred",
  //       translate("error.node_error") || "There are some problems with nodes. Please try again in a while."))
  //   }
  //   if (rateRequest.status === "fail") {
  //     yield put(utilActions.openInfoModal(translate("error.error_occurred") || "Error occurred",
  //       translate("error.network_error") || "Cannot connect to node right now. Please check your network!"))
  //   }
  // } else {
  //   const rateRequest = yield call(getRate, ethereum, source, dest, sourceAmoutRefined)
  //   if (rateRequest.status === "success") {
  //     var { expectedPrice, slippagePrice, lastestBlock } = rateRequest.res
  //     var rateInit = expectedPrice.toString()
  //     if (expectedPrice.toString() === "0"){
  //       var rateRequestZeroAmount = yield call(common.handleRequest, getRate, ethereum, source, dest, sourceAmoutZero)
  //       if (rateRequestZeroAmount.status === "success"){
  //         rateInit = rateRequestZeroAmount.data.expectedPrice
  //       }
  //     }
  //     yield put.sync(actions.updateRateExchangeComplete(rateInit, expectedPrice, slippagePrice, lastestBlock, isManual, true))
  //   }
  // }
}

function* updateRateAndValidateSource(action) {
  const state = store.getState();
  const { sourceAmount } = action.payload;
  try {
    yield call(updateRatePending, action);
    if (state.account.account !== false) {
      yield call(verifyExchange);
    }
  } catch (err) {
    console.log(err);
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
      if (expectedPrice == 0) {
        yield put(utilActions.openInfoModal(translate("error.error_occurred") || "Error occurred",
          translate("error.node_error") || "There are some problems with nodes. Please try again in a while."))
        yield put(actions.hideApprove())
        yield put(actions.hideConfirm())
        yield put(actions.hidePassphrase())
      } else {
        yield put.resolve(actions.updateRateSnapshotComplete(rateInit, expectedPrice, slippagePrice))
        yield put(actions.caculateAmountInSnapshot())
      }
    } else {
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

    // yield put.resolve(actions.updateRateSnapshotComplete(rateInit, expectedPrice, slippagePrice))
    // yield put(actions.caculateAmountInSnapshot())
  }
  catch (err) {
    console.log(err)
  }
}

function* fetchGas() {
  // yield call(estimateGas)
  var state = store.getState()
  var exchange = state.exchange
  var gas = yield call(getMaxGasExchange)
  var gasApprove = 0
  if (exchange.sourceTokenSymbol !== "ETH"){
    gasApprove = yield call(getMaxGasApprove)
    gasApprove = gasApprove * 2
  }
  yield put(actions.setEstimateGas(gas, gasApprove))
}

function* estimateGasNormal() {
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

function* estimateGas() {
  var gasRequest = yield call(common.handleRequest, getGasUsed)
  if (gasRequest.status === "success") {
    const { gas, gas_approve } = gasRequest.data
    yield put(actions.setEstimateGas(gas, gas_approve))
  }
  if ((gasRequest.status === "timeout") || (gasRequest.status === "fail")) {
    console.log("timeout")
    // var state = store.getState()
    // const exchange = state.exchange

    // const sourceTokenSymbol = exchange.sourceTokenSymbol
    // var gas = yield call(getMaxGasExchange)
    // var gas_approve 
    // if(sourceTokenSymbol === "ETH"){
    //   gas_approve = 0
    // }else{
    //   gas_approve = yield call(getMaxGasApprove)
    // }

    // yield put(actions.setEstimateGas(gas, gas_approve))
    yield call(estimateGasNormal)
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
    if (sourceTokenSymbol === "ETH") {
      gas_approve = 0
    } else {
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

function* fetchGasApproveSnapshot(isZeroAmount = false) {
  var state = store.getState()
  const exchange = state.exchange
  var gas = yield call(getMaxGasExchange)
  var gas_approve

  var gasRequest = yield call(common.handleRequest, getGasApprove, isZeroAmount)
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


function* getMaxGasExchange() {
  var state = store.getState()
  const exchange = state.exchange
  const tokens = state.tokens.tokens

  var sourceTokenLimit = tokens[exchange.sourceTokenSymbol] ? tokens[exchange.sourceTokenSymbol].gasLimit : 0
  var destTokenLimit = tokens[exchange.destTokenSymbol] ? tokens[exchange.destTokenSymbol].gasLimit : 0

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

function* getMaxGasApprove() {
  var state = store.getState()
  var tokens = state.tokens.tokens
  const exchange = state.exchange
  var sourceSymbol = exchange.sourceTokenSymbol
  if (tokens[sourceSymbol] && tokens[sourceSymbol].gasApprove) {
    return tokens[sourceSymbol].gasApprove
  } else {
    return exchange.max_gas_approve
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
  var destTokenSymbol = exchange.destTokenSymbol

  var specialList = ["DAI", "TUSD"]
  if(specialList.indexOf(sourceTokenSymbol) !== -1 || specialList.indexOf(destTokenSymbol) !== -1){
    return { status: "success", res: gas }
  }

  if (tokens[sourceTokenSymbol]) {
    sourceDecimal = tokens[sourceTokenSymbol].decimals
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
    gas = Math.round(gas * 120 / 100) + 100000
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

function* getGasApprove(isZeroAmount) {
  var state = store.getState()
  const ethereum = state.connection.ethereum
  const exchange = state.exchange
  const sourceToken = exchange.sourceToken

  var account = state.account.account
  var address = account.address

  const maxGasApprove = yield call(getMaxGasApprove)
  var gas_approve = 0
  try {
    var dataApprove
    if (isZeroAmount){
      dataApprove = yield call([ethereum, ethereum.call], "approveTokenData", sourceToken, 0)
    }else{
      dataApprove = yield call([ethereum, ethereum.call], "approveTokenData", sourceToken, converter.biggestNumber())
    }
    
    var txObjApprove = {
      from: address,
      to: sourceToken,
      data: dataApprove,
      value: '0x0',
    }
    gas_approve = yield call([ethereum, ethereum.call], "estimateGas", txObjApprove)
    gas_approve = Math.round((gas_approve + 15000) * 120 / 100)
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
  var destTokenSymbol = exchange.destTokenSymbol

  //hard code for tusd
  // if(tokens[sourceTokenSymbol].cannot_estimate_gas){
  //   return { status: "success", res: { gas, gas_approve } }
  // }

  var specialList = ["DAI", "TUSD"]
  if(specialList.indexOf(sourceTokenSymbol) !== -1 || specialList.indexOf(destTokenSymbol) !== -1){
    return { status: "success", res: { gas: maxGas, gas_approve: maxGasApprove } }
  }
  

  if (tokens[sourceTokenSymbol]) {
    sourceDecimal = tokens[sourceTokenSymbol].decimals
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
    gas = Math.round(gas * 120 / 100) + 100000
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
    // console.log(tx.input)
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
  // console.log("debug_tx")
  // console.log(input)
  var networkIssues = {}
  // var reserveIssues = {}
  var translate = getTranslate(store.getState().locale)
  var gasCap = yield call([ethereum, ethereum.call], "wrapperGetGasCap", blockno)

  if(!input.transaction.status || input.transaction.status == "0x0"){
    if(input.transaction.gas != 0 && (input.transaction.gasUsed/input.transaction.gas >= 0.95)){
      networkIssues["gas_used"] = "Your transaction is run out of gas"
    }
  }
  // if (input.transaction.gasUsed === input.transaction.gas && !input.transaction.status) networkIssues["gas_used"] = "Your transaction is run out of gas"

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
    sourceDecimal = tokens[sourceTokenSymbol].decimals
    sourceName = tokens[sourceTokenSymbol].name
    rateSourceToEth = tokens[sourceTokenSymbol].rate
  }

  var destTokenSymbol = exchange.destTokenSymbol
  var destBalance = 0
  var destDecimal = 18
  var destName = "Kybernetwork"
  if (tokens[destTokenSymbol]) {
    destBalance = tokens[destTokenSymbol].balance
    destDecimal = tokens[destTokenSymbol].decimals
    destName = tokens[destTokenSymbol].name
  }

  var sourceAmount = exchange.sourceAmount

  let rate = rateSourceToEth;
  if (destTokenSymbol === 'ETH') {
    rate = offeredRate;
  }

  var validateAmount = validators.verifyAmount(sourceAmount,
    sourceBalance,
    sourceTokenSymbol,
    sourceDecimal,
    rate,
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
  try{
    var state = store.getState()
    const ethereum = state.connection.ethereum
    var account = state.account.account
    var address = account.address
    var enabled = yield call([ethereum, ethereum.call], "getExchangeEnable", address)
    if (!enabled.error && !enabled.kyced && (enabled.rich === true || enabled.rich === 'true')){
      var translate = getTranslate(state.locale)
      var kycLink = "/users/sign_up"
      yield put(utilActions.openInfoModal(translate("error.error_occurred") || "Error occurred",
        translate("error.exceed_daily_volumn", { link: kycLink }) || "You may want to register with us to have higher trade limits " + kycLink))
        yield put(actions.setExchangeEnable(false))
    }else{
      yield put(actions.setExchangeEnable(true))
    }
  }catch(e){
    console.log(e)
    yield put(actions.setExchangeEnable(true))
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
  yield takeEvery("EXCHANGE.PROCESS_APPROVE_ZERO", processApproveZero)
  yield takeEvery("EXCHANGE.CHECK_TOKEN_BALANCE_COLD_WALLET", checkTokenBalanceOfColdWallet)
  yield takeEvery("EXCHANGE.UPDATE_RATE_PENDING", updateRatePending)
  yield takeEvery("EXCHANGE.UPDATE_RATE_SNAPSHOT", updateRateSnapshot)
  yield takeEvery("EXCHANGE.UPDATE_RATE_AND_VALIDATE_SOURCE", updateRateAndValidateSource);
  yield takeEvery("EXCHANGE.ESTIMATE_GAS_USED", fetchGas)
  yield takeEvery("EXCHANGE.ANALYZE_ERROR", analyzeError)
  yield takeEvery("EXCHANGE.SELECT_TOKEN_ASYNC", selectToken)
  // yield takeEvery("EXCHANGE.INPUT_CHANGE", fetchGas)
  yield takeEvery("EXCHANGE.FETCH_GAS_SNAPSHOT", fetchGasSnapshot)
  yield takeEvery("EXCHANGE.CHECK_KYBER_ENABLE", checkKyberEnable)
  yield takeEvery("EXCHANGE.VERIFY_EXCHANGE", verifyExchange)
  yield takeEvery("EXCHANGE.FETCH_EXCHANGE_ENABLE", fetchExchangeEnable)
  yield takeEvery("EXCHANGE.ESTIMATE_GAS_USED_NORMAL", estimateGasNormal)
  yield takeEvery("EXCHANGE.SWAP_TOKEN", estimateGasNormal)
}
