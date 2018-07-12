import { take, put, call, fork, select, takeEvery, all, cancel } from 'redux-saga/effects'
import EthereumService from "../services/ethereum/ethereum"
import { setConnection } from "../actions/connectionActions"
import { setMaxGasPrice } from "../actions/exchangeActions"
import { delay } from 'redux-saga'
import { store } from "../store"
import constants from "../services/constants"
import * as globalActions from "../actions/globalActions"
import Web3Service from "../services/web3"
import BLOCKCHAIN_INFO from "../../../env"
import * as converter from "../utils/converter"

import { getTranslate } from 'react-localize-redux'
import NotiService from "../services/noti_service/noti_service"



export function* createNewConnection(action) {
  var translate = getTranslate(store.getState().locale)
  var connectionInstance = new EthereumService()
  yield put(setConnection(connectionInstance))
  connectionInstance.subcribe()

  // var state = store.getState()
  // var ethereum = action.payload.ethereum
  // var ethereum = state.connection.ethereum
  yield put(setMaxGasPrice(connectionInstance))

  if (typeof web3 === "undefined") {
    yield put(globalActions.throwErrorMematamask(translate("error.metamask_not_installed") || "Metamask is not installed"))
  } else {
    const web3Service = new Web3Service(web3)
    const watchMetamask = yield fork(watchMetamaskAccount, connectionInstance, web3Service)
  }


  var notiService = new NotiService({ type: "session" })
  yield put(globalActions.setNotiHandler(notiService))

  //  const watchConnectionTask = yield fork(watchToSwitchConnection, connectionInstance)

  //yield take('GLOBAL.CLEAR_SESSION')
  //yield cancel(watchConnectionTask)
}

function* watchMetamaskAccount(ethereum, web3Service) {
  //check 
  var translate = getTranslate(store.getState().locale)
  while (true) {
    try {
      var state = store.getState()
      const account = state.account.account
      if (account === false){

      // if (state.router && state.router.location) {
      //   var pathname = state.router.location.pathname
      //   if (pathname === constants.BASE_HOST) {

          //test network id
          const currentId = yield call([web3Service, web3Service.getNetworkId])
          const networkId = BLOCKCHAIN_INFO.networkId
          if (parseInt(currentId, 10) !== networkId) {
            const currentName = converter.findNetworkName(parseInt(currentId, 10))
            const expectedName = converter.findNetworkName(networkId)
            yield put(globalActions.throwErrorMematamask(translate("error.network_not_match", {expectedName: expectedName, currentName: currentName}) || `Metamask should be on ${expectedName}. Currently on ${currentName}`))
            return
          }

          //test address
          try {
            const coinbase = yield call([web3Service, web3Service.getCoinbase])
            const balanceBig = yield call([ethereum, ethereum.call], "getBalanceAtLatestBlock", coinbase)
            const balance = converter.roundingNumber(converter.toEther(balanceBig))
            yield put(globalActions.updateMetamaskAccount(coinbase, balance))
          } catch (e) {
            console.log(e)
            yield put(globalActions.throwErrorMematamask(translate("error.cannot_connect_metamask") || `Cannot get metamask account. You probably did not login in Metamask`))
          }

        
      }
    } catch (e) {
      console.log(e)
      yield put(globalActions.throwErrorMematamask(e.message))
    }

    yield call(delay, 5000)
  }
}

function* watchToSwitchConnection(ethereum) {
  while (true) {
    try {
      yield call(delay, 10000)
      if (ethereum.currentLabel === "ws") {
        if (!ethereum.wsProvider.connection) {
          ethereum.setProvider(ethereum.httpProvider)
          ethereum.currentLabel = "http"
          ethereum.subcribe()
          yield put(setConnection(ethereum))
          // return
        }
      }

      if (ethereum.currentLabel === "http") {
        if (ethereum.wsProvider.reconnectTime > 10) {
          // yield put(clearIntervalConnection())
          return;
        }
        if (ethereum.wsProvider.connection) {
          ethereum.clearSubcription()
          ethereum.wsProvider.reconnectTime = 0

          ethereum.setProvider(ethereum.wsProvider)
          ethereum.currentLabel = "ws"
          ethereum.subcribe()
          yield put(setConnection(ethereum))
        } else {
          // increase reconnect time
          var reconnectTime = ethereum.wsProvider.reconnectTime
          ethereum.wsProvider = ethereum.getWebsocketProvider()
          ethereum.wsProvider.reconnectTime = reconnectTime + 1
          yield put(setConnection(ethereum))
        }
        // return
      }
    } catch (err) {
      console.log(err)
    }
  }
}




export function* watchConnection() {
  yield takeEvery("CONNECTION.CREATE_NEW_CONNECTION", createNewConnection)
}
