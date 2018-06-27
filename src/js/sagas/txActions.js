import { take, put, call, fork, select, takeEvery, all } from 'redux-saga/effects'
import { updateTxComplete, removeApproveTx } from '../actions/txActions'

import * as exchangeActions from '../actions/exchangeActions'
import * as transferActions from '../actions/transferActions'

import { Rate } from "../services/rate"
import { updateAllRateComplete } from "../actions/globalActions"
import constants from "../services/constants"

import * as converters from "../utils/converter"

import { store } from '../store'

function* getBalance(accAddr, tokenAddr, tokenSymbol, ethereum, blockNumber) {
  var balance = 0
  if (tokenSymbol === "ETH") {
    balance = yield call([ethereum, ethereum.call], "getBalanceAtSpecificBlock", accAddr, blockNumber)
  } else {
    balance = yield call([ethereum, ethereum.call], "getTokenBalanceAtSpecificBlock", tokenAddr, accAddr, blockNumber)
  }
  return balance
}

function* updateTx(action) {
  try {
    const { tx, ethereum, tokens, account, listToken } = action.payload
    var newTx
    try {
      newTx = yield call(tx.sync, ethereum, tx)
    }catch(err){
      console.log(err)
      return
    }
    
    //console.log("new tx: ")
    //console.log(newTx)
    if (newTx.status === "success") {
     // var blockNumber = newTx.blockNumber
      if (newTx.type === "exchange") {
        //update balance if tokens
        // var sourceBalance = yield call(getBalance, account.address,
        //   listToken.source.address, listToken.source.symbol, ethereum, blockNumber)

        // var destBalance = yield call(getBalance, account.address,
        //   listToken.dest.address, listToken.dest.symbol, ethereum, blockNumber)

        // yield put(exchangeActions.updateCurrentBalance(sourceBalance, destBalance, newTx.hash))

        //update source amount in header
        const { src, dest, srcAmount, destAmount } = yield call([ethereum, ethereum.call], "extractExchangeEventData", newTx.eventTrade)

        //console.log("new tx")
        //console.log({src, dest, srcAmount, destAmount})

        yield put(exchangeActions.updateBalanceData({src, dest, srcAmount, destAmount}, newTx.hash))

        var state = store.getState()
        const tokens = state.tokens.tokens
        const sourceDecimal = tokens[newTx.data.sourceTokenSymbol].decimal
        const destDecimal = tokens[newTx.data.destTokenSymbol].decimal
        newTx.data.sourceAmount = converters.toT(srcAmount, sourceDecimal)
        newTx.data.destAmount = converters.toT(destAmount, destDecimal)

      } 
      //else {
        // var tokenBalance = yield call(getBalance, account.address,
        //   listToken.token.address, listToken.token.symbol, ethereum, blockNumber)

        //yield put(transferActions.updateCurrentBalance(tokenBalance, newTx.hash))

      //  yield put(transferActions.updateBalanceData({src, dest, srcAmount, destAmount}, newTx.hash))
      //}
    }

    try{
      var state = store.getState()
      var notiService = state.global.notiService
      notiService.callFunc("changeStatusTx",newTx)
    }catch(e){
      console.log(e)
    }
    
    
    yield put(updateTxComplete(newTx))
  }
  catch (e) {
    console.log(e)
  }

}

function* updateApproveTxs(){
  var state = store.getState()
  const tokens = state.tokens.tokens
  const ethereum = state.connection.ethereum
  for (var key in tokens) {
    if(tokens[key].approveTx){
      try{
        var receipt = yield call([ethereum, ethereum.call], "txMined", tokens[key].approveTx)
        yield put(exchangeActions.removeApproveTx(key))
      }catch(err){
        console.log(err)
        yield put(exchangeActions.removeApproveTx(key))
      }
    }
  }
}

export function* watchTx() {
  yield takeEvery("TX.UPDATE_TX_PENDING", updateTx)
  yield takeEvery("TX.UPDATE_APPROVE_TXS", updateApproveTxs)
}

