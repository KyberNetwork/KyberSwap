import { compose, applyMiddleware, createStore } from "redux"
import logger from "redux-logger"
import createSagaMiddleware from 'redux-saga'

import { persistStore } from 'redux-persist'

import reducer from "./reducers/index"
import history from "./history"
import { routerMiddleware } from 'react-router-redux'

import { initialize, addTranslation, addTranslationForLanguage, setActiveLanguage, localeReducer } from 'react-localize-redux';
import rootSaga from './sagas'
import Language from "../../lang"

import  constantsVar from "../js/services/constants"
import {initLanguage} from "../js/services/language"

const routeMiddleware = routerMiddleware(history)

const sagaMiddleware = createSagaMiddleware()

var middlewareArray = [sagaMiddleware, routeMiddleware]
if(process.env && process.env.logger){
  // middlewareArray.push(logger)
}

const middleware = applyMiddleware(
  ...middlewareArray
)


const store = createStore(
  reducer, undefined, compose(middleware))
sagaMiddleware.run(rootSaga)


initLanguage(store);


const persistor =  persistStore(store)

export {store, persistor}
