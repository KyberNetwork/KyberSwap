import { take, put, call, fork, select, takeEvery, all } from 'redux-saga/effects'
import * as actions from '../actions/accountActions'
import { goToRoute, updateAllRate, updateAllRateComplete } from "../actions/globalActions"
import { randomToken } from "../actions/exchangeActions"

import ACC_ACTION from "../constants/accActions"
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
  yield put.sync(updateAllRateComplete(rates[0]));
  // yield put(randomToken());
  yield put(actions.closeImportLoading());
  yield put(actions.importNewAccountComplete(account));
  yield put(goToRoute('/exchange'));

  //// put action fetch all data
  // for (var k = 0; k < constants.RESERVES.length; k++) {
  //   var reserve = constants.RESERVES[k];
  //   yield put(updateAllRate(ethereum, SupportedTokens, reserve, account.address));
  // }
  // yield put(actions.closeImportLoading())
  // yield put(randomToken());
  // yield put(actions.importNewAccountComplete(account))
  // yield put(goToRoute('/exchange'));
  
}

export function* watchAccount() {
  // yield takeEvery(ACC_ACTION.NEW_ACCOUNT_CREATED_PENDING, createNewAccount)
  // yield takeEvery(ACC_ACTION.NEW_ACCOUNT_ADDED_PENDING, addNewAccount)
  yield takeEvery(ACC_ACTION.UPDATE_ACCOUNT_PENDING, updateAccount)
  yield takeEvery("IMPORT.IMPORT_NEW_ACCOUNT_PENDING", importNewAccount)
}
