import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import account from './accountReducer'
import tokens from './tokensReducer'
import exchange from './exchangeReducer'


import accounts from './accountsReducer'
import global from './globalReducer'
//import tokens from './tokensReducer'
import exchangeForm from './exchangeFormReducer'
import paymentForm from './paymentFormReducer'
import importKeystore from './importKeystoreReducer'
import joinPaymentForm from './joinPaymentFormReducer'
import connection from './connection'
import wallets from './walletsReducer'
import utils from './utilsReducer'
import txs from './txsReducer'
import createKeyStore from './createKeyStoreReducer'
import modifyAccount from './modifyAccountReducer'
import modifyWallet from './modifyWalletReducer'
import transactions from './transactionReducer'

const appReducer = combineReducers({
  account, accounts, exchange, exchangeForm, global, tokens, importKeystore, txs,
  joinPaymentForm, wallets, paymentForm, connection,transactions,utils,
  router: routerReducer, createKeyStore, modifyAccount, modifyWallet
})

const rootReducer = (state, action) => {
  if (action.type === 'GLOBAL.CLEAR_SESSION') {
    state = {}
  }
  return appReducer(state, action)
}

export default rootReducer

