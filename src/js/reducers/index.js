import { combineReducers } from 'redux'
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
  account, exchange, transfer, global, tokens, txs,
  connection, utils,
  router: routerReducer
})

const rootReducer = (state, action) => {
  if (action.type === 'GLOBAL.CLEAR_SESSION_FULFILLED') {
    state = {utils: state.utils}
  }
  return appReducer(state, action)
}

export default rootReducer

