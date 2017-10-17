import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import account from './importAccountReducer'
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

<<<<<<< HEAD
export default combineReducers({
  account, tokens, exchange, accounts, exchangeForm, global, importKeystore, txs,
  joinPaymentForm, wallets, paymentForm, connection,
  utils,
=======
const appReducer = combineReducers({
  account, accounts, exchangeForm, global, tokens, importKeystore, txs,
  joinPaymentForm, wallets, paymentForm, connection,transactions,utils,
>>>>>>> a94d82ff78248f3bd31278562d0aeabbca1346b6
  router: routerReducer, createKeyStore, modifyAccount, modifyWallet
})

const rootReducer = (state, action) => {
  if (action.type === 'GLOBAL.CLEAR_SESSION') {
    state = {}
  }
  return appReducer(state, action)
}

export default rootReducer

