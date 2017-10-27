import { take, put, call, fork, select, takeEvery, all } from 'redux-saga/effects'
import * as actions from '../actions/accountActions'
import { goToRoute } from "../actions/globalActions"

import ACC_ACTION from "../constants/accActions"
import * as service from "../services/accounts"

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
  const {address, type, keystring} = action.payload
  //console.log(type)
  const account = yield call(service.newAccountInstance, address, type, keystring)
  yield put(actions.importNewAccountComplete(account))
  yield put(goToRoute('/exchange'));
}

export function* watchAccount() {
  // yield takeEvery(ACC_ACTION.NEW_ACCOUNT_CREATED_PENDING, createNewAccount)
  // yield takeEvery(ACC_ACTION.NEW_ACCOUNT_ADDED_PENDING, addNewAccount)
  yield takeEvery(ACC_ACTION.UPDATE_ACCOUNT_PENDING, updateAccount)
  yield takeEvery("IMPORT.IMPORT_NEW_ACCOUNT_PENDING", importNewAccount)
}
