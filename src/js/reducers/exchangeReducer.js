//import Account from "../services/account"
//import Token from "../services/token"
import {REHYDRATE} from 'redux-persist/constants'
//import IMPORT from "../constants/importAccountActions"

const initState = {
 
}

const exchange = (state=initState, action) => {
  switch (action.type) {
  	case "SELECT_TOKEN":
  		var newState = {...state}
  		if(action.payload.type === "source"){
			newState.source_token = action.payload.symbol
  		}else if (action.payload.type === "des"){
  			newState.des_token = action.payload.symbol
  		}
  }
  return state
}

export default exchange;
