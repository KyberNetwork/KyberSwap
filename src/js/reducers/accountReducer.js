//import Account from "../services/account"
import Account from "../services/account"
import {REHYDRATE} from 'redux-persist/constants'

const initState = {
  isStoreReady: false,
  account: false,
  loading: false,
  error: "",
  showError: false
}

const account = (state=initState, action) => {
  switch (action.type) {  	
    case REHYDRATE: {
      var account = action.payload.account     
      if (account && account.account) {
        account = account.account
        return {...state, account: new Account (
          account.address,
          account.type,
          account.keystring,
          account.balance,
          account.nonce,
          account.manualNonce
        ), isStoreReady: true}        
      }else{
        return {...state, isStoreReady: true}
      }
    }
    case "ACCOUNT.LOADING": {
      return {...state, loading: true}
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
  }
  return state
}

export default account;
