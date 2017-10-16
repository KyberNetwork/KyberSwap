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
  }
  return state
}

export default account;
