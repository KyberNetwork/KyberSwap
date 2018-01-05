import { take, put, call, fork, select, takeEvery, all, cancel } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import * as actions from '../actions/accountActions'
import { clearSession, setGasPrice, setBalanceToken } from "../actions/globalActions"
import { openInfoModal } from '../actions/utilActions'

import { goToRoute, updateAllRate, updateAllRateComplete } from "../actions/globalActions"
import { randomToken, setRandomExchangeSelectedToken, setCapExchange } from "../actions/exchangeActions"
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
  try {
    const newAccount = yield call(account.sync, ethereum, account)
    yield put(actions.updateAccountComplete(newAccount))
  } catch (err) {
    console.log(err)
  }

}

export function* updateTokenBalance(action) {
  try {
    const { ethereum, address, tokens } = action.payload
    const balanceTokens = yield call([ethereum, ethereum.call("getAllBalancesToken")], address, tokens)
    yield put(setBalanceToken(balanceTokens))
  }
  catch (err) {
    console.log(err)
  }
}

export function* importNewAccount(action) {
  yield put(actions.importLoading())
  const { address, type, keystring, ethereum, tokens, metamask } = action.payload
  try {
    const account = yield call(service.newAccountInstance, address, type, keystring, ethereum)


    var maxCapOneExchange = yield call([ethereum, ethereum.call("getMaxCap")], address)
    yield put(setCapExchange(maxCapOneExchange))
    // if (maxCapOneExchange === '0'){
    //   yield put(actions.closeImportLoading())
    //   yield put(actions.throwError('Your address does not has enough cap for exchange'))
    //   return
    // }
    

    const balanceTokens = yield call([ethereum, ethereum.call("getAllBalancesToken")], address, tokens)
    //map balance
    var mapBalance = {}
    balanceTokens.map(token => {
      mapBalance[token.symbol] = token.balance
    })

    //update token and token balance
    var newTokens = {}
    Object.values(tokens).map(token => {
      var token = { ...token }
      token.balance = mapBalance[token.symbol]
      newTokens[token.symbol] = token
    })

    //var randomToken = randomForExchange(newTokens)
  //  console.log(tokens)
    var randomToken = [
    {
      address: newTokens['ETH'].address,
      symbol: newTokens['ETH'].symbol
    },
    {
      address: newTokens['KNC'].address,
      symbol: newTokens['KNC'].symbol
    },
    ]
    // if (!randomToken || !randomToken[0]) {
    //   //todo dispatch action waring no balanc
    //   yield put(actions.closeImportLoading())
    //   yield put(actions.throwError('Your address has no balance in any tokens. Please import another address.'))

    //   return
    // } else {
    //   yield put(setRandomExchangeSelectedToken(randomToken))
    //   yield call(ethereum.fetchRateExchange)
    //   yield put(setRandomTransferSelectedToken(randomToken))
    // }

    yield put(setRandomExchangeSelectedToken(randomToken))
    yield call(ethereum.fetchRateExchange)
    //yield put(setRandomTransferSelectedToken(randomToken))

    //todo set random token for exchange
    yield put(actions.closeImportLoading())

    yield put(setBalanceToken(balanceTokens))
    yield put(actions.importNewAccountComplete(account))

    //set gas price
   // yield put(setGasPrice(ethereum))

    yield put(goToRoute('/exchange'))

  }
  catch (err) {
    console.log(err)
    yield put(actions.throwError('Cannot connet to blockchain right now. Please try again later.'))
    yield put(actions.closeImportLoading())
  }




  //fork for metamask
  if (type === "metamask") {
    const { web3Service, address, networkId } = { ...metamask }
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
      yield put(actions.throwError(getTranslate(store.getState().locale)("error.network_not_match") || "Network is not match"))
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
  yield takeEvery("ACCOUNT.UPDATE_TOKEN_BALANCE", updateTokenBalance)
  
}
