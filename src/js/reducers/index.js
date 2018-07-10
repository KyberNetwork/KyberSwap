import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import session from 'redux-persist/lib/storage/session'
//import localForage from 'localforage'

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
import market from './marketReducer'

import { localeReducer } from 'react-localize-redux';
// import { localeReducer } from 'react-localize-redux';

const appReducer = combineReducers({
  account, exchange, transfer, txs, connection, router: routerReducer,utils, market,global,
  // market: persistReducer({
  //   key: 'market',
  //   storage: localForage
  // }, market),  
  locale : localeReducer,
  tokens,
  // locale: persistReducer({
  //   key: 'locale',
  //   storage: localForage
  // }, locale),  
  txs: persistReducer({
    key: 'txs',
    storage: session
  }, txs),  
  // global: persistReducer({
  //   key: 'global',
  //   storage: localForage,
  //   blacklist: ['conn_checker', 'analizeError', 'isOpenAnalyze', 'termOfServiceAccepted']
  // }, global)
})

const rootReducer = (state, action) => {
  //let isGoToRoot = action.type === '@@router/LOCATION_CHANGE' && action.payload.pathname === constants.BASE_HOST
  // if (action.type === 'GLOBAL.CLEAR_SESSION_FULFILLED') {
  //   var global = {...state.global}
  //   global.termOfServiceAccepted = true

  //   var initState = constants.INIT_EXCHANGE_FORM_STATE
  //   initState.snapshot = constants.INIT_EXCHANGE_FORM_STATE

  //   initState.maxGasPrice = state.exchange.maxGasPrice
  //   initState.gasPrice = state.exchange.gasPrice

  //   initState.gasPriceSuggest = {...state.exchange.gasPriceSuggest}
  //   var exchange = {...initState}

  //   state = {
  //     utils: state.utils, 
  //     global: global,
  //     connection: state.connection,
  //     locale: state.locale,
  //     tokens: state.tokens,
  //     txs: state.txs,
  //     exchange: exchange
  //   }
  // }
  
  // let isGoToExchange = action.type === '@@router/LOCATION_CHANGE' && ( (action.payload.pathname === constants.BASE_HOST + '/swap')&&(action.payload.pathname === constants.BASE_HOST + '/transfer') )
  // if(isGoToExchange && !state.account.account){
  //   window.location.href = '/'
  // }
  return appReducer(state, action)
}

export default rootReducer

