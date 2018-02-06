import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
//import session from 'redux-persist/lib/storage/session'
import localForage from 'localforage'

import { routerReducer } from 'react-router-redux'
import * as BLOCKCHAIN_INFO from "../../../env"
import constants from "../services/constants"

import account from './accountReducer'
import tokens from './tokensReducer'
import exchange from './exchangeReducer'
import transfer from './transferReducer'
import global from './globalReducer'
import connection from './connection'
import utils from './utilsReducer'
import txs from './txsReducer'
import locale from './languageReducer'
// import { localeReducer } from 'react-localize-redux';

const appReducer = combineReducers({
  account, exchange, transfer, txs, connection, router: routerReducer,utils,
  locale: persistReducer({
    key: 'locale',
    storage: localForage
  }, locale),  
  tokens: persistReducer({
    key: 'tokens',
    storage: localForage
  }, tokens),  
  global: persistReducer({
    key: 'global',
    storage: localForage,
    blacklist: ['conn_checker', 'analizeError', 'isOpenAnalyze']
  }, global)
})

const rootReducer = (state, action) => {
  let isGoToRoot = action.type === '@@router/LOCATION_CHANGE' && action.payload.pathname === '/'
  if (action.type === 'GLOBAL.CLEAR_SESSION_FULFILLED' || isGoToRoot) {
    state = {
      utils: state.utils, 
      global: state.global,
      connection: state.connection,
      locale: state.locale
    }
  }
  
  let isGoToExchange = action.type === '@@router/LOCATION_CHANGE' && action.payload.pathname === '/exchange'
  if(isGoToExchange && !state.account.account){
    window.location.href = '/'
  }
  return appReducer(state, action)
}

export default rootReducer

