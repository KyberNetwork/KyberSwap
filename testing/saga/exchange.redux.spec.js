'use strict';
import { call, put, take } from 'redux-saga/effects';
import { expectSaga, testSaga } from 'redux-saga-test-plan';
import { default as exchangeReducer } from "../../src/js/reducers/exchangeReducer"
import constants from "../../src/js/services/constants"

const initState = constants.INIT_EXCHANGE_FORM_STATE


//-----------------------------------------------------------
function* setRandomSelectToken(random) {
  yield put({
    type: 'EXCHANGE.SET_RANDOM_SELECTED_TOKEN',
    payload: random
  });
}
it('set random select token', () => {
  var random = [
    {
      address: "0x9f1a678b0079773b5c4f5aa8573132d2b8bcb1e7",
      symbol: "ETH"
    },
    {
      address: "0x9f1a678b0079773b5c4f5aa8573132d2b8bcb1e6",
      symbol: "KNC"
    }
  ]
  return expectSaga(setRandomSelectToken, random)
    .withReducer(exchangeReducer)
    .run()
    .then((result) => {
      expect(result.storeState.sourceToken).toEqual("0x9f1a678b0079773b5c4f5aa8573132d2b8bcb1e7")
      expect(result.storeState.sourceTokenSymbol).toEqual("ETH")
      expect(result.storeState.destToken).toEqual("0x9f1a678b0079773b5c4f5aa8573132d2b8bcb1e6")
      expect(result.storeState.destTokenSymbol).toEqual("KNC")
    })
})

//-----------------------------------------------------------
function* makeNewExchange(random) {
  yield put({
    type: 'EXCHANGE.MAKE_NEW_EXCHANGE'
  });
}
it('make new exchange', () => {
  return expectSaga(makeNewExchange)
    .withReducer(exchangeReducer)
    .run()
    .then((result) => {
      expect(result.storeState.selected).toEqual(true)
      expect(result.storeState.sourceAmount).toEqual("")
      expect(result.storeState.errors).toEqual(initState.errors)
      expect(result.storeState.gasPrice).toEqual(initState.gasPrice)
      expect(result.storeState.bcError).toEqual("")
      expect(result.storeState.step).toEqual(initState.step)
    })
})

//-----------------------------------------------------------
function* selectTokenAsync(symbol, address, type, ethereum) {
  yield put({
    type: "EXCHANGE.SELECT_TOKEN_ASYNC",
    payload: { symbol, address, type, ethereum }
  })
}
it('select token async', () => {
  return expectSaga(selectTokenAsync)
    .withReducer(exchangeReducer)
    .run()
    .then((result) => {
      expect(result.storeState.isSelectToken).toEqual(true)
    })
})

//-----------------------------------------------------------
function* selectToken(symbol, address, type) {
  yield put({
    type: "EXCHANGE.SELECT_TOKEN",
    payload: { symbol, address, type }
  })
}
it('select source token', () => {
  return expectSaga(selectToken, "KNC", "0x9f1a678b0079773b5c4f5aa8573132d2b8bcb1e7", "source")
    .withReducer(exchangeReducer)
    .run()
    .then((result) => {
      expect(result.storeState.sourceTokenSymbol).toEqual("KNC")
      expect(result.storeState.sourceToken).toEqual("0x9f1a678b0079773b5c4f5aa8573132d2b8bcb1e7")
      expect(result.storeState.selected).toEqual(true)
    })
})
it('select dest token', () => {
  return expectSaga(selectToken, "OMG", "0x9f1a678b0079773b5c4f5aa8573132d2b8bcb1e7", "des")
    .withReducer(exchangeReducer)
    .run()
    .then((result) => {
      expect(result.storeState.destTokenSymbol).toEqual("OMG")
      expect(result.storeState.destToken).toEqual("0x9f1a678b0079773b5c4f5aa8573132d2b8bcb1e7")
      expect(result.storeState.selected).toEqual(true)
    })
})


//-----------------------------------------------------------
function* checkSelectToken() {
  yield put({
    type: "EXCHANGE.CHECK_SELECT_TOKEN"
  })
}
it('check select token with two tokens are same', () => {
  var currentState = initState
  currentState.sourceTokenSymbol = "KNC"
  currentState.destTokenSymbol = "KNC"
  return expectSaga(checkSelectToken)
    .withReducer(exchangeReducer, currentState)
    .run()
    .then((result) => {
      expect(result.storeState.errors.selectSameToken).toEqual("error.select_same_token")
      expect(result.storeState.errors.selectTokenToken).toEqual("")
    })
})


//----------------------------------------------------------------
it('check select token with two tokens not include ether', () => {
  var currentState = initState
  currentState.sourceTokenSymbol = "OMG"
  currentState.destTokenSymbol = "KNC"
  return expectSaga(checkSelectToken)
    .withReducer(exchangeReducer, currentState)
    .run()
    .then((result) => {
      expect(result.storeState.errors.selectSameToken).toEqual("")
      expect(result.storeState.errors.selectTokenToken).toEqual("error.select_token_token")
    })
})

//------------------------------------------------------------------
it('check select 2 tokens validated', () => {
  var currentState = initState
  currentState.sourceTokenSymbol = "KNC"
  currentState.destTokenSymbol = "ETH"
  return expectSaga(checkSelectToken)
    .withReducer(exchangeReducer, currentState)
    .run()
    .then((result) => {
      expect(result.storeState.errors.selectSameToken).toEqual("")
      expect(result.storeState.errors.selectTokenToken).toEqual("")
    })
})


//------------------------------------------------------------------
function* thowErrorSourceAmount(message) {
  yield put({
    type: 'EXCHANGE.THROW_SOURCE_AMOUNT_ERROR',
    payload: message
  })
}

it('throw source amount error', () => {
  return expectSaga(thowErrorSourceAmount, "Source amount is not number")
    .withReducer(exchangeReducer)
    .run()
    .then((result) => {
      expect(result.storeState.errors.sourceAmountError).toEqual("Source amount is not number")
    })
})

//------------------------------------------------------------------
function* thowErrorGasPrice(message) {
  yield put({
    type: 'EXCHANGE.THROW_GAS_PRICE_ERROR',
    payload: message
  })
}

it('throw gas price error', () => {
  return expectSaga(thowErrorGasPrice, "Gas price is not number")
    .withReducer(exchangeReducer)
    .run()
    .then((result) => {
      expect(result.storeState.errors.gasPriceError).toEqual("Gas price is not number")
    })
})

//-------------------------------------------------------------------
function* goToStep(step) {
  yield put({
    type: "EXCHANGE.GO_TO_STEP",
    payload: step
  })
}

it('go to step', () => {
  return expectSaga(goToStep, 2)
    .withReducer(exchangeReducer)
    .run()
    .then((result) => {
      expect(result.storeState.step).toEqual(2)
    })
})

//----------------------------------------------------------------------
function* specifyGasPrice(value) {
  yield put({
    type: "EXCHANGE.SPECIFY_GAS_PRICE",
    payload: value
  })
}

it('specify gas', () => {
  return expectSaga(specifyGasPrice, 30)
    .withReducer(exchangeReducer)
    .run()
    .then((result) => {
      expect(result.storeState.gasPrice).toEqual(30)
      expect(result.storeState.errors.gasPriceError).toEqual("")
    })
})

//----------------------------------------------------------------------------
function* showAdvance() {
  yield put({
    type: "EXCHANGE.SHOW_ADVANCE",
  })
}
it('show advance=', () => {
  return expectSaga(showAdvance)
    .withReducer(exchangeReducer)
    .run()
    .then((result) => {
      expect(result.storeState.advanced).toEqual(true)
    })
})

//------------------------------------------------------------------------------
function* hideAdvance() {
  yield put({
    type: "EXCHANGE.HIDE_ADVANCE",
  })
}
it('show advance=', () => {
  return expectSaga(hideAdvance)
    .withReducer(exchangeReducer)
    .run()
    .then((result) => {
      expect(result.storeState.advanced).toEqual(false)
    })
})

//-------------------------------------------------------------------------------
// function* changeSourceAmout(amount) {
//   yield put({
//     type: "EXCHANGE.CHANGE_SOURCE_AMOUNT",
//     payload: amount
//   })
// }
// it('change source amount', () => {
//   return expectSaga(changeSourceAmout, "0.1")
//     .withReducer(exchangeReducer)
//     .run()
//     .then((result) => {
//       expect(result.storeState.sourceAmount).toEqual("0.1")
//       expect(result.storeState.errors.sourceAmountError).toEqual("")
//     })
// })

//-----------------------------------------------------------------------------
function* doApprovalTransactionFail(error) {
  yield put({
    type: "EXCHANGE.APPROVAL_TX_BROADCAST_REJECTED",
    payload: error,
  })
}
it('do approve transaction fail', () => {
  return expectSaga(doApprovalTransactionFail, "Tx has the same hash")
    .withReducer(exchangeReducer)
    .run()
    .then((result) => {
      expect(result.storeState.broadcasting).toEqual(false)
      expect(result.storeState.bcError).toEqual("Tx has the same hash")
      expect(result.storeState.confirmApprove).toEqual(false)
      expect(result.storeState.showConfirmApprove).toEqual(false)
      expect(result.storeState.isApproving).toEqual(false)
    })
})

//--------------------------------------------------------------------------
function* doTransactionComplete(txHash) {
  yield put({
    type: "EXCHANGE.TX_BROADCAST_FULFILLED",
    payload: txHash,
  })
}

it('do approve transaction complete', () => {
  return expectSaga(doTransactionComplete, "0x1a06f2aa99d1bf4105151b16405037fb23956f4f09aaf32bdb6d735035ebd6be")
    .withReducer(exchangeReducer)
    .run()
    .then((result) => {
      expect(result.storeState.broadcasting).toEqual(false)
      expect(result.storeState.txHash).toEqual("0x1a06f2aa99d1bf4105151b16405037fb23956f4f09aaf32bdb6d735035ebd6be")
    })
})

//--------------------------------------------------------------------------
function* doTransactionFail(error) {
  yield put({
    type: "EXCHANGE.TX_BROADCAST_REJECTED",
    payload: error
  })
}

it('reject transaction broadcasting', () => {
  return expectSaga(doTransactionFail, "Gas limit is too low")
    .withReducer(exchangeReducer)
    .run()
    .then((result) => {
      expect(result.storeState.broadcasting).toEqual(false)
      expect(result.storeState.bcError).toEqual("Gas limit is too low")
      expect(result.storeState.isConfirming).toEqual(false)
    })
})


//-------------------------------------------------------------------
function* updateRateExchange(offeredRate, expirationBlock, reserveBalance) {
  yield put({
    type: "EXCHANGE.UPDATE_RATE",
    payload: { offeredRate, expirationBlock, reserveBalance }
  })
}

it('update rate of exchange', () => {
  return expectSaga(updateRateExchange, "10000000", "454000", "200000")
    .withReducer(exchangeReducer)
    .run()
    .then((result) => {
      expect(result.storeState.minConversionRate).toEqual("10000000")
      expect(result.storeState.offeredRateBalance).toEqual("200000")
      expect(result.storeState.offeredRateExpiryBlock).toEqual("454000")
      expect(result.storeState.offeredRate).toEqual("10000000")
      expect(result.storeState.isSelectToken).toEqual(false)
    })
})

//-------------------------------------------------------------------------
function* openPassphrase() {
  yield put({
    type: "EXCHANGE.OPEN_PASSPHRASE",
  })
}
it('open passphrase', () => {
  return expectSaga(openPassphrase)
    .withReducer(exchangeReducer)
    .run()
    .then((result) => {
      expect(result.storeState.passphrase).toEqual(true)
    })
})


//---------------------------------------------------------
function* hidePassphrase() {
  yield put({
    type: "EXCHANGE.HIDE_PASSPHRASE",
  })
}
it('hide passphrase', () => {
  return expectSaga(hidePassphrase)
    .withReducer(exchangeReducer)
    .run()
    .then((result) => {
      expect(result.storeState.passphrase).toEqual(false)
    })
})

//---------------------------------------------------
function* hideConfirm() {
  yield put({
    type: "EXCHANGE.HIDE_CONFIRM",
  })
}
it('hide confirm', () => {
  return expectSaga(hideConfirm)
    .withReducer(exchangeReducer)
    .run()
    .then((result) => {
      expect(result.storeState.confirmColdWallet).toEqual(false)
    })
})

//--------------------------------------------------------
function* showConfirm() {
  yield put({
    type: "EXCHANGE.SHOW_CONFIRM",
  })
}
it('show confirm', () => {
  return expectSaga(showConfirm)
    .withReducer(exchangeReducer)
    .run()
    .then((result) => {
      expect(result.storeState.confirmColdWallet).toEqual(true)
      expect(result.storeState.showConfirmApprove).toEqual(false)
      expect(result.storeState.confirmApprove).toEqual(false)
    })
})

//-----------------------------------------------------------------------
function* hideApprove() {
  yield put({
    type: "EXCHANGE.HIDE_APPROVE",
  })
}
it('hide approve', () => {
  return expectSaga(hideApprove)
    .withReducer(exchangeReducer)
    .run()
    .then((result) => {
      expect(result.storeState.confirmApprove).toEqual(false)
    })
})

//----------------------------------------------------
function* showApprove() {
  yield put({
    type: "EXCHANGE.SHOW_APPROVE",
  })
}
it('show approve', () => {
  return expectSaga(showApprove)
    .withReducer(exchangeReducer)
    .run()
    .then((result) => {
      expect(result.storeState.confirmApprove).toEqual(true)
    })
})

//----------------------------------------------------------
function* changePassword() {
  yield put({
    type: "EXCHANGE.CHANGE_PASSPHRASE",
  })
}
it('change password', () => {
  return expectSaga(changePassword)
    .withReducer(exchangeReducer)
    .run()
    .then((result) => {
      expect(result.storeState.errors.passwordError).toEqual("")
    })
})


//-------------------------------------------------------------
function* throwPassphraseError(message) {
  yield put({
    type: "EXCHANGE.THROW_ERROR_PASSPHRASE",
    payload: message
  })
}
it('throw error password', () => {
  return expectSaga(throwPassphraseError, "Key failed")
    .withReducer(exchangeReducer)
    .run()
    .then((result) => {
      expect(result.storeState.errors.passwordError).toEqual("Key failed")
    })
})

//------------------------------------------------------------------
function* finishExchange() {
  yield put({
    type: "EXCHANGE.FINISH_EXCHANGE"
  })
}
it('finish exchange', () => {
  return expectSaga(finishExchange)
    .withReducer(exchangeReducer)
    .run()
    .then((result) => {
      expect(result.storeState.broadcasting).toEqual(false)
    })
})


//-----------------------------------------------------------------
function* prePareBroadcast() {
  yield put({
    type: "EXCHANGE.PREPARE_BROADCAST",
    payload: { balanceData: {
      source: "ETH",
      dest: "KNC"
    }}
  })
}

it('prepare broadcast', () => {
  return expectSaga(prePareBroadcast)
    .withReducer(exchangeReducer)
    .run()
    .then((result) => {
      expect(result.storeState.passphrase).toEqual(false)
      expect(result.storeState.confirmColdWallet).toEqual(false)
      expect(result.storeState.confirmApprove).toEqual(false)
      expect(result.storeState.isApproving).toEqual(false)
      expect(result.storeState.isConfirming).toEqual(false)
      expect(result.storeState.sourceAmount).toEqual("")
      expect(result.storeState.step).toEqual(3)
      expect(result.storeState.broadcasting).toEqual(true)
    })
})


//------------------------------------------------
function* doApprove(ethereum, sourceToken, sourceAmount, nonce, gas, gasPrice,
  keystring, password, accountType, account, keyService) {
  yield put({
    type: "EXCHANGE.PROCESS_APPROVE",
    payload: {
      ethereum, sourceToken, sourceAmount, nonce, gas, gasPrice,
      keystring, password, accountType, account, keyService
    }
  })
}
it('proccess approve', () => {
  return expectSaga(doApprove)
    .withReducer(exchangeReducer)
    .run()
    .then((result) => {
      expect(result.storeState.isApproving).toEqual(true)
    })
})

//----------------------------------------------------------------------
function* processExchangeAfterConfirm(formId, ethereum, address, sourceToken,
  sourceAmount, destToken, destAddress,
  maxDestAmount, minConversionRate,
  throwOnFailure, nonce, gas,
  gasPrice, keystring, type, password, account, data, keyService) {
  yield put({
    type: "EXCHANGE.PROCESS_EXCHANGE_AFTER_CONFIRM",
    payload: {
      formId, ethereum, address, sourceToken,
      sourceAmount, destToken, destAddress,
      maxDestAmount, minConversionRate,
      throwOnFailure, nonce, gas,
      gasPrice, keystring, type, password, account, data, keyService
    }
  })
}
it('proccess exchange after confirm', () => {
  return expectSaga(processExchangeAfterConfirm)
    .withReducer(exchangeReducer)
    .run()
    .then((result) => {
      expect(result.storeState.isConfirming).toEqual(false)
      expect(result.storeState.bcError).toEqual("")
    })
})

//-------------------------------------------------------------------

function* inputChange(focus, value) {
  yield put({
    type: "EXCHANGE.INPUT_CHANGE",
    payload: { focus, value }
  })
}
it('inout change', () => {
  return expectSaga(inputChange, "source", "10")
    .withReducer(exchangeReducer, { offeredRate: "123000000000000000000", errors: {} })
    .run()
    .then((result) => {
      expect(result.storeState.sourceAmount).toEqual("10")
      expect(result.storeState.destAmount).toEqual("1230.000000")
    })
})

//-------------------------------------------------------------------

function* focusInput(focus) {
  yield put({
    type: "EXCHANGE.FOCUS_INPUT",
    payload: focus
  })
}
it('focus input', () => {
  return expectSaga(focusInput, "source")
    .withReducer(exchangeReducer)
    .run()
    .then((result) => {
      expect(result.storeState.inputFocus).toEqual("source")
    })
})