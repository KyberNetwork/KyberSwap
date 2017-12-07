import { compose, applyMiddleware, createStore } from "redux"
import logger from "redux-logger"
import createSagaMiddleware from 'redux-saga'

import { persistStore } from 'redux-persist'

import reducer from "./reducers/index"
import history from "./history"
import { routerMiddleware } from 'react-router-redux'

import { initialize, addTranslation, addTranslationForLanguage, setActiveLanguage, localeReducer } from 'react-localize-redux';
import rootSaga from './sagas'
import localForage from 'localforage'
import Language from "../../lang"
import { constants } from "zlib";

import  constantsVar from "../js/services/constants"



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
const defaultLanguagePack = require("../../lang/" + Language.defaultLanguage + ".json")

var arrayLangInit = Language.loadAll? Language.supportLanguage : Language.defaultAndActive 

console.log("================")
console.log(arrayLangInit)

store.dispatch(initialize(arrayLangInit, { 
  missingTranslationCallback: onMissingTranslation, 
  showMissingTranslationMsg: false,
  // defaultLanguage: Language.defaultLanguage
}));
store.dispatch(addTranslationForLanguage(defaultLanguagePack, Language.defaultLanguage));

if(Language.loadAll){
  Language.otherLang.map((langName) => {
    try{
      let langData = require("../../lang/" + langName + ".json")
      store.dispatch(addTranslationForLanguage(langData, langName));
    }catch(err){
      console.log(err)
    }
  })
}


// // check selected language pack from localForage
// Promise.all([
//   localForage.getItem('activeLanguage'),
//   localForage.getItem('activeLanguageData'),
//   localForage.getItem('storageKey')
// ]).then((result) => {
//   if(result[0] !== Language.defaultLanguage && result[0] && result[1]){
//     if(result[2] !== constantsVar.STORAGE_KEY){
//       console.log("-----------update language package-------------")
//       try{
//         var updateLang = require("../../lang/" + result[0] + ".json")
//         localForage.setItem('activeLanguageData', updateLang)
//         localForage.setItem('storageKey', constantsVar.STORAGE_KEY)
//         store.dispatch(addTranslationForLanguage(updateLang, result[0]));
//       } catch(err){
//         console.log(err)
//       }
//     } else {
//       store.dispatch(addTranslationForLanguage(result[1], result[0]));
//     }
//     store.dispatch(setActiveLanguage(result[0]))
//   }
// })


const persistor =  persistStore(store)

export {store, persistor}
