//import Account from "../services/account"
import Account from "../services/account"
import {REHYDRATE} from 'redux-persist/constants'
import IMPORT from "../constants/importAccountActions"
import ACC_ACTION from "../constants/accActions"

const initState = {
}

const account = (state=initState, action) => {
  switch (action.type) {  	
    case REHYDRATE: {
      var account = action.payload.account
      if (account) {
        return new Account (
          account.address,
          account.type,
          account.keystring,
          account.balance,
          account.nonce,
          account.manualNonce
        )        
      }
    }
    case "IMPORT.IMPORT_NEW_ACCOUNT_FULFILLED": {
      return action.payload
    }      
    case "IMPORT.THROW_ERROR": {            
      return {...state, error: action.payload}
    }
    case IMPORT.END_SESSION: {
      return {...initState}
    }
    case ACC_ACTION.UPDATE_ACCOUNT_FULFILLED:{
        return action.payload
    }
    case 'IMPORT.SCAN_LEDGER_COMPLETE': {
      var wallets = action.payload;
      console.log('SCAN_LEDGER_COMPLETE---------------------');
      console.log(wallets);
      // getLedgerAddress(path, 0, 5);
      return {...state};
    }
    case 'IMPORT.SCAN_LEDGER_FAILED': {
      var err = action.payload;
      console.log("------------- scan ledger err------");
      console.log(err);
      return {...state};
    }
  }
  return state
}

export default account;
