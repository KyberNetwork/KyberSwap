import { compose, applyMiddleware, createStore } from "redux"
import logger from "redux-logger"
import createSagaMiddleware from 'redux-saga'

import { persistStore } from 'redux-persist'

import reducer from "./reducers/index"
import history from "./history"
import { routerMiddleware } from 'react-router-redux'

import { initialize, addTranslation, addTranslationForLanguage, setActiveLanguage } from 'react-localize-redux';
import rootSaga from './sagas'
import localForage from 'localforage'

const en = require("../../lang/en.json")

const languages = ['en', 'vi', 'fr'];

const routeMiddleware = routerMiddleware(history)

const sagaMiddleware = createSagaMiddleware()

const middleware = applyMiddleware(
  sagaMiddleware,
  logger,
  routeMiddleware,
)


const store = createStore(
  reducer, undefined, compose(middleware))
sagaMiddleware.run(rootSaga)


const onMissingTranslation = (key, languageCode) => {
  // here you can do whatever you want e.g. call back end service that will 
  console.log("-------------- missing transsaction")
  console.log(key)
  console.log(languageCode)
};

store.dispatch(initialize(languages, { 
  missingTranslationCallback: onMissingTranslation, 
  showMissingTranslationMsg: false,
  defaultLanguage: 'en' 
}));
store.dispatch(addTranslationForLanguage(en, 'en'));

// check selected language pack from localForage
Promise.all([
  localForage.getItem('activeLanguage'),
  localForage.getItem('activeLanguageData')
]).then((result) => {
  if(result[0] !== 'en' && result[0] && result[1]){
    store.dispatch(addTranslationForLanguage(result[1], result[0]));
    store.dispatch(setActiveLanguage(result[0]))
  }
})

const persistor =  persistStore(store)

export {store, persistor}
