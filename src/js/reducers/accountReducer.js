import {REHYDRATE} from 'redux-persist/lib/constants'
import { clearInterval } from 'timers';

const initState = {
  isStoreReady: false,
  account: false,
  loading: false,
  checkTimeImportLedger: false,
  error: "",
  showError: false,
  pKey: {
    error: '',
    modalOpen: false
  }
}

const account = (state=initState, action) => {
  switch (action.type) {  	
    case REHYDRATE: {      
      return {...state, isStoreReady: true}      
    }
    case "ACCOUNT.LOADING": {
      return {...state, loading: true}
    }
    case "ACCOUNT.CHECK_TIME_IMPORT_LEDGER": {
      return {...state, checkTimeImportLedger: true}
    }
    case "ACCOUNT.RESET_CHECK_TIME_IMPORT_LEDGER": {
      return {...state, checkTimeImportLedger: false}
    }
    case "ACCOUNT.IMPORT_NEW_ACCOUNT_FULFILLED": {
      return {...state, account: action.payload, loading: false, isStoreReady: true}
    }
    case "ACCOUNT.CLOSE_LOADING_IMPORT":{
      return {...state, loading: false}
    }
    case "ACCOUNT.CLOSE_LOADING_IMPORT": {
      return {...state, loading: false}
    }
    case "ACCOUNT.THROW_ERROR": {            
      return {...state, error: action.payload, showError: true}
    }
    case "ACCOUNT.END_SESSION": {
      return {...initState}
    }
    case "ACCOUNT.UPDATE_ACCOUNT_FULFILLED":{
      var oldState = {...state}
      var newAccount = action.payload
      if ((oldState.account) && (oldState.account.address === newAccount.address)){        
        if (newAccount.manualNonce < oldState.account.manualNonce){
          newAccount.manualNonce = oldState.account.manualNonce
        }
        return {...state, account: newAccount}
      }
      
    } 
    case "ACCOUNT.CLOSE_ERROR_MODAL":{
      return {...state, showError: false}
    }
    case "ACCOUNT.INC_MANUAL_NONCE_ACCOUNT":{
      var oldState = {...state}
      var address = action.payload
      if ((oldState.account) && (oldState.account.address === address)){
        var account = oldState.account.incManualNonce()
        return {...state,
          account: account}
      }
    }
    case "ACCOUNT.PKEY_CHANGE": {
      let newState = {...state}
      newState.pKey.error = ''
      return newState
    }
    case "ACCOUNT.PKEY_ERROR": {
      let newState = {...state}
      newState.pKey.error = action.payload
      return newState
    }
    case "ACCOUNT.OPEN_PKEY_MODAL": {
      let newState = {...state}
      let pKey = {
        error: '', modalOpen: true
      }
      newState.pKey = pKey
      return newState
    }
    case "ACCOUNT.CLOSE_PKEY_MODAL": {
      let newState = {...state}
      newState.pKey.modalOpen = false
      return newState
    }
    case "GLOBAL.SET_BALANCE_TOKEN":{
      let newState = {...state}
      newState.isGetAllBalance = true
      return newState
    }  
  }
  return state
}

export default account;
