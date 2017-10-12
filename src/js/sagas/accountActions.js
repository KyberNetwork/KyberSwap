/* eslint-disable no-constant-condition */

import { take, put, call, fork, select, takeEvery, all } from 'redux-saga/effects'
import * as actions from '../actions/accountActions'
import ACC_ACTION from "../constants/accActions"
import * as service from "../services/accounts"

function* createNewAccount(action) {
  const account = yield call(service.newAccountInstance, action.payload.address, action.payload.keystring, action.payload.name, action.payload.desc)
  yield put(actions.createAccountComplete(account))
}

function* addNewAccount(action) {
  const account = yield call(service.newAccountInstance, action.payload.address, action.payload.keystring, action.payload.name, action.payload.desc)
  yield put(actions.addAccountComplete(account))
}

function* updateAccount(action) {
  const account = yield call(action.payload.account.sync, action.payload.ethereum, action.payload.account)
  yield put(actions.updateAccountComplete(account))
}

export function* watchAccount() {
  yield takeEvery(ACC_ACTION.NEW_ACCOUNT_CREATED_PENDING, createNewAccount)
  yield takeEvery(ACC_ACTION.NEW_ACCOUNT_ADDED_PENDING, addNewAccount)
  yield takeEvery(ACC_ACTION.UPDATE_ACCOUNT_PENDING, updateAccount)
}


// export default function* root() {
//   yield all([
//     //fork(addNewAccount),
//     fork(watchAddNewAccount),    
//   ])
// }
