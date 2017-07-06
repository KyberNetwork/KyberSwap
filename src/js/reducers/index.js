import { combineReducers } from 'redux'

import accounts from './accountsReducer'
import global from './globalReducer'
import exchangeForm from './exchangeFormReducer'
import importKeystore from './importKeystoreReducer'
import txs from './txsReducer'

export default combineReducers({
  accounts, exchangeForm, global, importKeystore, txs
});
