//import Account from "../services/account"
//import Token from "../services/token"
import {REHYDRATE} from 'redux-persist/constants'
//import IMPORT from "../constants/importAccountActions"

const initState = { 
  	 "DGD":{
	    name: "Digix",
	    symbol: "DGD",
	    icon: "/assets/digix-logo.png",
	    address: "0x950b87923d52b09b1050abda589f91521e17e606",
	    balance: 0
	  },
		"GNO" : {
	    name: "Gnosis",
	    symbol: "GNO",
	    icon: "/assets/gnosis-logo.png",
	    address: "0x2c018fc6c9bb2b7653136dc7c5b7b588f2d11986",
	    balance: 0
	  }
  
}

const tokens = (state=initState, action) => {
  switch (action.type) {
  	// case IMPORT.SAVE_KEYSTORE: {
  	//   var payload = action.payload  	  
   //    return {...state, address: payload.address, keystore: payload.keystore, type: 'keystore'}
   //  }
   //  case IMPORT.THROW_ERROR: {            
   //    return {...state, error: action.payload}
   //  }
   //  case IMPORT.END_SESSION: {
   //    return {...initState}
   //  }
  }
  return state
}

export default tokens;
