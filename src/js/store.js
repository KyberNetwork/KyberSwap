import {compose, applyMiddleware, createStore} from "redux"
//import logger from "redux-logger"
//import thunk from "redux-thunk"
//import promise from "redux-promise-middleware"
import createSagaMiddleware from 'redux-saga'

import {persistStore, autoRehydrate} from 'redux-persist'
import reducer from "./reducers/index"
import history from "./history"
import { routerMiddleware } from 'react-router-redux'

import rootSaga from './sagas'


const routeMiddleware = routerMiddleware(history)

const sagaMiddleware = createSagaMiddleware()

const middleware = applyMiddleware(
  //thunk,
  sagaMiddleware,
  //logger,
  routeMiddleware,
)

const store = createStore(
  reducer, undefined, compose(middleware, autoRehydrate()))

sagaMiddleware.run(rootSaga)

persistStore(store, {blacklist: [
  'connection',
  'exchangeForm',
  'paymentForm',
  'joinPaymentForm',
  'createKeyStore',
  'importKeystore',
  'utils',
  ]})

export default store
