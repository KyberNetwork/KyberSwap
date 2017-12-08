import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
//import session from 'redux-persist/lib/storage/session'
import localForage from 'localforage'

import { routerReducer } from 'react-router-redux'


import account from './accountReducer'
import tokens from './tokensReducer'
import exchange from './exchangeReducer'
import transfer from './transferReducer'
import global from './globalReducer'
import connection from './connection'
import utils from './utilsReducer'
import txs from './txsReducer'
import locale from './languageReducer'import { localeReducer } from 'react-localize-redux';

const appReducer = combineReducers({
  account, exchange, transfer, txs, connection, router: routerReducer,utils,
  tokens: persistReducer({
    key: 'tokens',
    storage: localForage
  }, tokens),  
  global: persistReducer({
    key: 'global',
    storage: localForage,
    blacklist: ['conn_checker']
  }, global), 
  locale: persistReducer({
    key: 'locale',
    storage: localForage
  }, localeReducer),  
  // locale: locale
})

const rootReducer = (state, action) => {
  if (action.type === 'GLOBAL.CLEAR_SESSION_FULFILLED') {
    state = {
              utils: state.utils, 
              tokens: state.tokens, 
              global: state.global,
              connection: state.connection,
              locale: state.locale
            }
  }
  return appReducer(state, action)
}

export default rootReducer

