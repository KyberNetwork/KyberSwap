import { take, put, call, fork, select, takeEvery, all, cancel } from 'redux-saga/effects'
import EthereumService from "../services/ethereum/ethereum"
import { setConnection } from "../actions/connectionActions"
import { setMaxGasPrice } from "../actions/exchangeActions"
import { delay } from 'redux-saga'

export function* createNewConnection(action) {
  var connectionInstance = new EthereumService()
  yield put(setConnection(connectionInstance))
  connectionInstance.subcribe()

  // var state = store.getState()
  // var ethereum = action.payload.ethereum
  // var ethereum = state.connection.ethereum
  yield put(setMaxGasPrice(connectionInstance))
//  const watchConnectionTask = yield fork(watchToSwitchConnection, connectionInstance)

  //yield take('GLOBAL.CLEAR_SESSION')
  //yield cancel(watchConnectionTask)
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
