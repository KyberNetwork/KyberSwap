import { compose, applyMiddleware, createStore } from "redux"
import logger from "redux-logger"
//import thunk from "redux-thunk"
//import promise from "redux-promise-middleware"
import createSagaMiddleware from 'redux-saga'

import { persistStore } from 'redux-persist'
//import  session  from 'redux-persist/lib/storage/session'

import reducer from "./reducers/index"
import history from "./history"
import { routerMiddleware } from 'react-router-redux'

import rootSaga from './sagas'

const routeMiddleware = routerMiddleware(history)

const sagaMiddleware = createSagaMiddleware()

const middleware = applyMiddleware(
  //thunk,
  sagaMiddleware,
  logger,
  routeMiddleware,
)


const store = createStore(
  reducer, undefined, compose(middleware))
sagaMiddleware.run(rootSaga)

const persistor =  persistStore(store)

export {store, persistor}
