import { take, put, call, fork, select, takeEvery, all } from 'redux-saga/effects'
import * as actions from '../actions/walletActions'
import WALLET_ACTION from "../constants/walletActions"
import * as service from "../services/accounts"

function* addNewWallet(action) {
  const {address, ownerAddress, name, desc} = action.payload
  const wallet = yield call(service.newWalletInstance, address, ownerAddress, name, desc)
  yield put(actions.addWalletComplete(wallet))
}

function* updateWallet(action) {
  const {wallet, ethereum} = action.payload
  const newWallet = yield call(wallet.sync, ethereum, wallet)
  yield put(actions.updateWalletComplete(newWallet))
}

export function* watchWallet() {
  yield takeEvery(WALLET_ACTION.NEW_WALLET_ADDED_PENDING, addNewWallet)
  yield takeEvery(WALLET_ACTION.UPDATE_WALLET_PENDING, updateWallet)  
}
