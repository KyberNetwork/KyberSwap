import {REHYDRATE} from 'redux-persist/lib/constants'
import { clearInterval } from 'timers';
import {cloneAccount} from "../services/accounts"


const initState = {
  isStoreReady: false,
  account: false,
  loading: false,
  checkTimeImportLedger: false,
  error: {
    error: "",
    showError: false,
  },
  pKey: {
    error: '',
    modalOpen: false
  },
  promoCode: {
    error: '',
    modalOpen: false
  },
  walletName: '',
  isOnDAPP: false
}

const account = (state= JSON.parse(JSON.stringify(initState)), action) => {
  switch (action.type) {
    case REHYDRATE: {
      if (action.key === "account" && action.payload && action.payload.account != false) {
        var {address, type, keystring, walletType, info, balance, manualNonce, nonce, maxCap, rich } = action.payload.account
        var updatedAccount = cloneAccount(address, type, keystring, walletType, info, balance, nonce, manualNonce, maxCap, rich)

        return {...state, account: updatedAccount, loading: false}
      } 
      // else if (action.key === "account" && action.payload) {
      //   action.payload.loading = false
      // }

      return {...state}
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
      const {account, walletName} = action.payload      
      return {...state, account: account, loading: false, isStoreReady: true, walletName: walletName}
    }
    case "ACCOUNT.CLOSE_LOADING_IMPORT":{
      return {...state, loading: false}
    }
    case "ACCOUNT.CLOSE_LOADING_IMPORT": {
      return {...state, loading: false}
    }
    case "ACCOUNT.THROW_ERROR": { 
      var error =    {
        error: action.payload, showError: true
      }
      return {...state, error}
    }
    case "ACCOUNT.END_SESSION": {
      return JSON.parse(JSON.stringify(initState))
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
      const newState = {...state};
      newState.error.showError = false;
      return {...newState};
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
    case "ACCOUNT.PROMO_CODE_CHANGE": {
      let newState = {...state}
      newState.promoCode.error = ''
      return newState
    }
    case "ACCOUNT.PROMO_CODE_ERROR": {
      let newState = {...state}
      newState.promoCode.error = action.payload
      return newState
    }
    case "ACCOUNT.OPEN_PROMO_CODE_MODAL": {
      let newState = {...state}
      let promoCode = {
        error: '',
        modalOpen: true
      }
      newState.promoCode = promoCode
      return newState
    }
    case "ACCOUNT.CLOSE_PROMO_CODE_MODAL": {
      let newState = {...state}
      newState.promoCode.modalOpen = false
      return newState
    }
    case "GLOBAL.SET_BALANCE_TOKEN":{
      let newState = {...state}
      newState.isGetAllBalance = true
      return newState
    }  
    case "GLOBAL.CLEAR_SESSION_FULFILLED":{      
      var newState = JSON.parse(JSON.stringify(initState))    
      return {...newState}      
    }
    case "ACCOUNT.SET_ON_DAPP": {
      let newState = {...state}
      newState.isOnDAPP = true
      return newState
    }
  }
  return state
}

export default account;
