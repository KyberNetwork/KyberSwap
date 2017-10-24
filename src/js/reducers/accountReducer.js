//import Account from "../services/account"
import Account from "../services/account"
import {REHYDRATE} from 'redux-persist/constants'
import IMPORT from "../constants/importAccountActions"
import ACC_ACTION from "../constants/accActions"

const initState = {
  isStoreReady: false,
  account: false
}

const account = (state=initState, action) => {
  switch (action.type) {  	
    case REHYDRATE: {
      var account = action.payload.account.account
      if (account) {
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
    case "IMPORT.IMPORT_NEW_ACCOUNT_FULFILLED": {
      return {...state, account: action.payload}
    }      
    case "IMPORT.THROW_ERROR": {            
      return {...state, error: action.payload}
    }
    case IMPORT.END_SESSION: {
      return {...initState}
    }
    case ACC_ACTION.UPDATE_ACCOUNT_FULFILLED:{
      return {...state, account: action.payload}
    }    
  }
  return state
}

export default account;
