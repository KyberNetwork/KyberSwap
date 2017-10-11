/* eslint-disable no-constant-condition */

import { take, put, call, fork, select, takeEvery, all } from 'redux-saga/effects'
import * as actions from '../actions/accountActions'
import ACC_ACTION from "../constants/accActions"
import * as service from "../services/accounts"

export function* addNewAccount(action) {
  /*******************************
  // Code in here will look synchronous
  *****************************/
  const account = yield call(service.newAccountInstance, action.payload.address, action.payload.keystring, action.payload.name, action.payload.desc)
  yield put(actions.createAccountComplete(account))
}


export function* watchAddNewAccount() {
	//console.log(constants.ACCOUNT_ACTION_NEW_ACCOUNT_CREATED_PENDING)
  yield takeEvery(ACC_ACTION.NEW_ACCOUNT_CREATED_PENDING, addNewAccount)
}


// export default function* root() {
//   yield all([
//     //fork(addNewAccount),
//     fork(watchAddNewAccount),    
//   ])
// }
