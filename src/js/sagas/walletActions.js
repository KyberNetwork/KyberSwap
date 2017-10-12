/* eslint-disable no-constant-condition */

import { take, put, call, fork, select, takeEvery, all } from 'redux-saga/effects'
import * as actions from '../actions/walletActions'
import WALLET_ACTION from "../constants/walletActions"
import * as service from "../services/accounts"

function* addNewWallet(action) {
  const wallet = yield call(service.newWalletInstance, action.payload.address, action.payload.ownerAddress, action.payload.name, action.payload.desc)
  yield put(actions.addWalletComplete(wallet))
}

function* updateWallet(action) {
  const wallet = yield call(action.payload.wallet.sync, action.payload.ethereum, action.payload.wallet)
  yield put(actions.updateWalletComplete(wallet))
}

export function* watchWallet() {
  yield takeEvery(WALLET_ACTION.NEW_WALLET_ADDED_PENDING, addNewWallet)
  yield takeEvery(WALLET_ACTION.UPDATE_WALLET_PENDING, updateWallet)  
}


// export default function* root() {
//   yield all([
//     //fork(addNewAccount),
//     fork(watchAddNewAccount),    
//   ])
// }
