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

export default combineReducers({
  account, tokens, exchange, accounts, exchangeForm, global, importKeystore, txs,
  joinPaymentForm, wallets, paymentForm, connection,
  utils,
  router: routerReducer, createKeyStore, modifyAccount, modifyWallet
})
