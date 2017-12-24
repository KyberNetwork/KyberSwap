import { take, put, call, fork, select, takeEvery, all } from 'redux-saga/effects'
import {joinedKyberWallet} from '../actions/accountActions'
import {updateTxComplete} from '../actions/txActions'

import * as exchangeActions from '../actions/exchangeActions'
import * as transferActions from '../actions/transferActions'

import { Rate } from "../services/rate"
import { updateAllRateComplete } from "../actions/globalActions"
import constants from "../services/constants"


function* getBalance(accAddr, tokenAddr, tokenSymbol, ethereum){
  var balance = 0
  if(tokenSymbol === "ETH"){
    balance = yield call([ethereum, ethereum.call("getBalance")], accAddr)
  }else{
    balance = yield call([ethereum, ethereum.call("getTokenBalance")], tokenAddr, accAddr)
  }
  return balance
}
function* updateTx(action) {
  const {tx, ethereum, tokens, account, listToken} = action.payload
  const newTx = yield call(tx.sync, ethereum, tx)	
  if(tx.type === "exchange"){
    var sourceBalance = yield call(getBalance, account.address, 
      listToken.source.address, listToken.source.symbol, ethereum)
    var destBalance = yield call(getBalance, account.address, 
      listToken.dest.address, listToken.dest.symbol, ethereum)
    yield put(exchangeActions.updateCurrentBalance(sourceBalance, destBalance))
  }else{
    var tokenBalance = yield call(getBalance, account.address, 
      listToken.token.address, listToken.token.symbol, ethereum)
    yield put(transferActions.updateCurrentBalance(tokenBalance))
  }
  yield put(updateTxComplete(newTx))    
}

export function* watchTx() {
  yield takeEvery("TX.UPDATE_TX_PENDING", updateTx)  
}

