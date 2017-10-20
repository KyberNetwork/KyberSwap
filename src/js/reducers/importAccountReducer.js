//import Account from "../services/account"
//import Token from "../services/token"
import {REHYDRATE} from 'redux-persist/constants'
import IMPORT from "../constants/importAccountActions"

const initState = {
  address: '',
  keystore: '',
  type: '',
  error: ''
}

const account = (state=initState, action) => {
  switch (action.type) {
  	case IMPORT.SAVE_KEYSTORE: {
  	  var payload = action.payload  	  
      return {...state, address: payload.address, keystore: payload.keystore, type: 'keystore'}
    }
    case IMPORT.THROW_ERROR: {            
      return {...state, error: action.payload}
    }
    case IMPORT.END_SESSION: {
      return {...initState}
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
