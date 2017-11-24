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


const appReducer = combineReducers({
  account, exchange, transfer, txs, connection, router: routerReducer,utils,
  tokens: persistReducer({
    key: 'tokens',
    storage: localForage
  }, tokens),  
  global: persistReducer({
    key: 'global',
    storage: localForage
  }, global),  
})

const rootReducer = (state, action) => {
  if (action.type === 'GLOBAL.CLEAR_SESSION_FULFILLED') {
    state = {
              utils: state.utils, 
              tokens: state.tokens, 
              global: state.global,
              connection: state.connection}
  }
  return appReducer(state, action)
}

export default rootReducer

