import {compose, applyMiddleware, createStore} from "redux"
import logger from "redux-logger"
import thunk from "redux-thunk"
import promise from "redux-promise-middleware"
import {persistStore, autoRehydrate} from 'redux-persist'
import reducer from "./reducers/index"
import history from "./history"
import { routerMiddleware } from 'react-router-redux'


const routeMiddleware = routerMiddleware(history)

const middleware = applyMiddleware(
  thunk,
  promise(),
  logger,
  routeMiddleware,
)

const store = createStore(
  reducer, undefined, compose(middleware, autoRehydrate()))

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
