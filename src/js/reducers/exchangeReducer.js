//import Account from "../services/account"
//import Token from "../services/token"
import {REHYDRATE} from 'redux-persist/constants'
//import IMPORT from "../constants/importAccountActions"
import constants from "../services/constants"
// const initState = {
//   token_source: 'GNT',
//   token_des: 'DGD',
//   error_select_token:'',
//   step : 1,
//   gas: 
// }

const initFormState = constants.INIT_EXCHANGE_FORM_STATE
const initState = initFormState

const exchange = (state=initState, action) => {
  switch (action.type) {
  	case "SELECT_TOKEN":
  		var newState = {...state}
  		if(action.payload.type === "source"){
			newState.sourceTokenSymbol = action.payload.symbol
  		}else if (action.payload.type === "des"){
  			newState.destTokenSymbol = action.payload.symbol
  		}
      return newState
    case "THOW_ERROR_SELECT_TOKEN":
      var newState = {...state}
      newState.error_select_token = action.payload
      return newState
    case "GO_TO_STEP":
      var newState = {...state}
      newState.step = action.payload
      return newState
    case "EXCHANGE_SPECIFY_GAS":
      var newState = {...state}
      newState.gas = action.payload
      return newState
    case "EXCHANGE_SPECIFY_GAS_PRICE":
      var newState = {...state}
      newState.gasPrice = action.payload
      return newState
    case "EXCHANGE.SHOW_ADVANCE":
      var newState = {...state}
      newState.advance = true
      return newState
    case "EXCHANGE.HIDE_ADVANCE":
      var newState = {...state}
      newState.advance = false
      return newState
    case "EXCHANGE.CHANGE_SOURCE_AMOUNT":
      var newState = {...state}
      newState.sourceAmount = action.payload
      return newState
    case "EXCHANGE.UPDATE_RATE":
      return {...state, rate: action.payload}
  }
  return state
}

export default exchange;
