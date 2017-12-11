import { take, put, call, fork, select, takeEvery, all, cancel } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import * as actions from '../actions/accountActions'
import { clearSession, setGasPrice } from "../actions/globalActions"
import { openInfoModal } from '../actions/utilActions'
import { getRandomAvatar } from "../utils/keys"
//import { setInterval } from "timers"
//import { setSubprovider } from '../actions/connectionActions'

import { goToRoute, updateAllRate, updateAllRateComplete } from "../actions/globalActions"
import { randomToken, setRandomExchangeSelectedToken } from "../actions/exchangeActions"
import { setRandomTransferSelectedToken } from "../actions/transferActions"
import { randomForExchange } from "../utils/random"

import * as service from "../services/accounts"
import constants from "../services/constants"
import { Rate, updateAllRatePromise } from "../services/rate"
import { clearInterval } from 'timers';

import { getTranslate } from 'react-localize-redux'
import { store } from "../store"

export function* updateAccount(action) {
  const { account, ethereum } = action.payload
  const newAccount = yield call(account.sync, ethereum, account)
  yield put(actions.updateAccountComplete(newAccount))
}

export function* importNewAccount(action) {
  yield put(actions.importLoading())
  const { address, type, keystring, ethereum, avatar, tokens, metamask } = action.payload
  const account = yield call(service.newAccountInstance, address, type, keystring, avatar, ethereum)
  var rates = []
  for (var k = 0; k < constants.RESERVES.length; k++) {
    var reserve = constants.RESERVES[k];
    rates[k] = yield call(updateAllRatePromise, ethereum, tokens, constants.RESERVES[k], account.address)
  }
  yield put.sync(updateAllRateComplete(rates[0], true))
  var randomToken = randomForExchange(rates[0])
  if (!randomToken || !randomToken[0]) {
    //todo dispatch action waring no balanc
    yield put(actions.closeImportLoading())
    yield put(actions.throwError('Your address has no balance in any tokens. Please import another address.'))

    return
  } else {
    yield put.sync(setRandomExchangeSelectedToken(randomToken))
    yield call(ethereum.fetchRateExchange)
    yield put.sync(setRandomTransferSelectedToken(randomToken))
  }
  //todo set random token for exchange
  yield put(actions.closeImportLoading())
  yield put(actions.importNewAccountComplete(account))

  //set gas price
  yield put(setGasPrice(ethereum))

  yield put(goToRoute('/exchange'))



  //fork for metamask
  if (type === "metamask") {
    const {web3Service, address, networkId} = {...metamask}
    const watchCoinbaseTask = yield fork(watchCoinbase, web3Service, address, networkId)

    yield take('GLOBAL.CLEAR_SESSION')
    yield cancel(watchCoinbaseTask)
  }
}

export function* importMetamask(action) {
  const { web3Service, networkId, ethereum, tokens } = action.payload
  try {
    const currentId = yield call([web3Service, web3Service.getNetworkId])
    if (parseInt(currentId, 10) !== networkId) {
      console.log(currentId)
      yield put(actions.throwError("Network is not match"))
      return
    }
    //get coinbase
    const address = yield call([web3Service, web3Service.getCoinbase])
    yield call([web3Service, web3Service.setDefaultAddress, address])

    const metamask = { web3Service, address, networkId }
    yield put(actions.importNewAccount(
      address,
      "metamask",
      web3Service,
      ethereum,
      getRandomAvatar(address),
      tokens,
      metamask
    ))
  } catch (e) {
    console.log(e)
    yield put(actions.throwError(getTranslate(store.getState().locale)("error.cannot_connect_metamask") || "Cannot get metamask account"))
  }
}

function* watchCoinbase(web3Service, address, networkId) {
  while (true) {
    try {
      yield call(delay, 500)
      const coinbase = yield call([web3Service, web3Service.getCoinbase])
      if (coinbase !== address) {
        yield put(clearSession())
        return
      }
      const currentId = yield call([web3Service, web3Service.getNetworkId])
      if (parseInt(currentId, 10) !== networkId) {
        console.log(currentId)
        yield put(clearSession())
        return
      }
      //check 
    } catch (error) {
      console.log(error)
      yield put(clearSession())
      return;
    }
  }
}

export function* watchAccount() {
  yield takeEvery("ACCOUNT.UPDATE_ACCOUNT_PENDING", updateAccount)
  yield takeEvery("ACCOUNT.IMPORT_NEW_ACCOUNT_PENDING", importNewAccount)
  yield takeEvery("ACCOUNT.IMPORT_ACCOUNT_METAMASK", importMetamask)
}
