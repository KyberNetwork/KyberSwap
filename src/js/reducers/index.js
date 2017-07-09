import { combineReducers } from 'redux'

import accounts from './accountsReducer'
import global from './globalReducer'
import exchangeForm from './exchangeFormReducer'
import importKeystore from './importKeystoreReducer'
import joinPaymentForm from './joinPaymentFormReducer'
import wallets from './walletsReducer'
import txs from './txsReducer'

export default combineReducers({
  accounts, exchangeForm, global, importKeystore, txs,
  joinPaymentForm, wallets
})
