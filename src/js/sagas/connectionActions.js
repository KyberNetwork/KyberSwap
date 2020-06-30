import { put, call, fork, takeEvery } from 'redux-saga/effects'
import EthereumService from "../services/ethereum/ethereum"
import { setConnection } from "../actions/connectionActions"
import { initTokens } from "../actions/tokenActions"
import { delay } from 'redux-saga'
import { store } from "../store"
import * as globalActions from "../actions/globalActions"
import * as web3Package from "../services/web3"
import BLOCKCHAIN_INFO from "../../../env"
import { getTranslate } from 'react-localize-redux'
import NotiService from "../services/noti_service/noti_service"

function filterTokens(tokens) {
  var newTokens = {}
  var now = Math.round(new Date().getTime() / 1000)
  tokens.map(val => {
    if (val.listing_time > now) return
    if (val.delist_time && val.delist_time <= now) return
    newTokens[val.symbol] = { ...val }
  })
  return newTokens
}

function getListTokens() {
  const tokenAPI = process.env.integrate ? `${BLOCKCHAIN_INFO.kyberswap_api}/currencies` : `${BLOCKCHAIN_INFO.tracker}/internal/currencies`;

  return new Promise((resolve, reject) => {
    fetch(tokenAPI, {
      method: 'GET',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
    }).then((response) => {
      return response.json()
    })
      .then((result) => {
        if (result.success) {
          const tokens = filterTokens(result.data)
          resolve(tokens)
        } else {
          resolve(BLOCKCHAIN_INFO.tokens)
        }
      })
      .catch((err) => {
        console.log(err)
        resolve(BLOCKCHAIN_INFO.tokens)
      })
  })
}

export function* createNewConnection() {
  var tokens = yield call(getListTokens)

  yield put.resolve(initTokens(tokens))

  var translate = getTranslate(store.getState().locale)
  var connectionInstance = new EthereumService()

  yield put.resolve(setConnection(connectionInstance))
  
  connectionInstance.subscribe()

  var web3Service = web3Package.newWeb3Instance()

  if (web3Service === false) {
    yield put.resolve(globalActions.throwErrorMematamask(translate("error.metamask_not_installed") || "Metamask is not installed"))
  } else {
    yield fork(watchMetamaskAccount, connectionInstance, web3Service)
  }

  var notiService = new NotiService({ type: "session" })
  yield put.resolve(globalActions.setNotiHandler(notiService))
}

function* watchMetamaskAccount(ethereum, web3Service) {
  while (true) {
    try {
      var state = store.getState()
      const account = state.account.account
      if (account !== false && account.type === "metamask") {
        const coinbase = yield call([web3Service, web3Service.getCoinbase])
        if (coinbase.toLowerCase() !== account.address.toLowerCase()) {
          yield put(globalActions.clearSession())
          return
        }

        const currentId = yield call([web3Service, web3Service.getNetworkId])
        if (parseInt(currentId, 10) !== BLOCKCHAIN_INFO.networkId) {
          console.log(currentId)
          yield put(globalActions.clearSession())
          return
        }
      } else {
        return
      }
    } catch (e) {
      console.log(e)
    }

    yield call(delay, 5000)
  }
}

export function* watchConnection() {
  yield takeEvery("CONNECTION.CREATE_NEW_CONNECTION", createNewConnection)
}
