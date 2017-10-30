import { take, put, call, fork, select, takeEvery, all } from 'redux-saga/effects'
import * as actions from '../actions/accountActions'
import { goToRoute, updateAllRate, updateAllRateComplete } from "../actions/globalActions"
import { randomToken, setRandomSelectedToken } from "../actions/exchangeActions"
import { randomForExchange } from "../utils/random"

import * as service from "../services/accounts"
import SupportedTokens from "../services/supported_tokens"
import constants from "../services/constants"
import { Rate, updateAllRatePromise } from "../services/rate"
// function* createNewAccount(action) {
//   const {address, keystring, name, desc} = action.payload
//   const account = yield call(service.newAccountInstance, address, keystring, name, desc)
//   yield put(actions.createAccountComplete(account))
// }

// function* addNewAccount(action) {
//   const {address, keystring, name, desc} = action.payload
//   const account = yield call(service.newAccountInstance, address, keystring, name, desc)
//   yield put(actions.addAccountComplete(account))
// }

function* updateAccount(action) {
  const {account, ethereum} = action.payload
  const newAccount = yield call(account.sync, ethereum, account)  
  yield put(actions.updateAccountComplete(newAccount))
}

function* importNewAccount(action){
  yield put(actions.importLoading())
  const {address, type, keystring, ethereum} = action.payload
  //console.log(type)
  const account = yield call(service.newAccountInstance, address, type, keystring)
  var rates = []
  for (var k = 0; k < constants.RESERVES.length; k++) {
    var reserve = constants.RESERVES[k];
    rates[k] = yield call(updateAllRatePromise, ethereum, SupportedTokens, constants.RESERVES[k], account.address)
  }
  var randomToken = randomForExchange(rates[0]);
  if(!randomToken[0]){
    //todo dispatch action waring no balanc
  } else {
    yield put.sync(setRandomSelectedToken(randomToken))
  }
  //todo set random token for exchange
  // yield put.sync(updateAllRateComplete(rates[0]));
  yield put(actions.closeImportLoading());
  yield put(actions.importNewAccountComplete(account));
  yield put(goToRoute('/exchange'));
}

export function* watchAccount() {
  yield takeEvery("ACCOUNT.UPDATE_ACCOUNT_PENDING", updateAccount)
  yield takeEvery("ACCOUNT.IMPORT_NEW_ACCOUNT_PENDING", importNewAccount)
}
