//import Account from "../services/account"
//import Token from "../services/token"
import {REHYDRATE} from 'redux-persist/constants'
//import IMPORT from "../constants/importAccountActions"
import constants from "../services/constants"
import { calculateDest} from "../utils/converter"
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
  var newState = {...state}
  switch (action.type) {
  	case "EXCHANGE.SELECT_TOKEN":{
      if(action.payload.type === "source"){
        newState.sourceTokenSymbol = action.payload.symbol
         newState.sourceToken = action.payload.address      
       }else if (action.payload.type === "des"){
         newState.destTokenSymbol = action.payload.symbol
         newState.destToken = action.payload.address
 
       }
       return newState
    }  		  		
    case "EXCHANGE.CHECK_SELECT_TOKEN":{
      if (newState.sourceTokenSymbol === newState.destTokenSymbol){
        newState.errors.selectSameToken = "Cannot exchange the same token"
        newState.errors.selectTokenToken = ""
        return newState
      }
      if ((newState.sourceToken !== constants.ETHER_ADDRESS) &&
                (newState.destToken !== constants.ETHER_ADDRESS)){
        newState.errors.selectSameToken = ""
        newState.errors.selectTokenToken = "This pair token is not supported"
        return newState
      }      
      newState.errors.selectSameToken = ""
      newState.errors.selectTokenToken = ""      
      return newState
    }
    case "EXCHANGE.THROW_SOURCE_AMOUNT_ERROR":{
      newState.errors.sourceAmountError = action.payload
      return newState
    }
    case "THOW_ERROR_SELECT_TOKEN":
      newState.error_select_token = action.payload
      return newState
    case "EXCHANGE.GO_TO_STEP":
      newState.step = action.payload
      return newState
    case "EXCHANGE_SPECIFY_GAS":
      newState.gas = action.payload
      return newState
    case "EXCHANGE_SPECIFY_GAS_PRICE":
      newState.gasPrice = action.payload
      return newState
    case "EXCHANGE.SHOW_ADVANCE":
      newState.advanced = true
      return newState
    case "EXCHANGE.HIDE_ADVANCE":
      newState.advanced = false
      return newState
    case "EXCHANGE.CHANGE_SOURCE_AMOUNT":{
      newState.sourceAmount = action.payload
      newState.errors.sourceAmountError = ""
      return newState
    }
    case "EXCHANGE.APPROVAL_TX_BROADCAST_PENDING": {
      newState.broadcasting = true
      newState.txHash = action.payload
      return newState
    }
    case "EXCHANGE.APPROVAL_TX_BROADCAST_REJECTED": {
      newState.broadcasting = false
      newState.bcError = action.payload
      return newState
    }
    case "EXCHANGE.TX_BROADCAST_PENDING": {
      newState.broadcasting = true
      newState.txHash = action.payload
      return newState
    }
    case "EXCHANGE.TX_BROADCAST_FULFILLED": {
      newState.broadcasting = false
      newState.txHash = action.payload
      return newState
    }
    case "EXCHANGE.TX_BROADCAST_REJECTED": {
      newState.broadcasting = false
      newState.bcError = action.payload
      return newState
    }
    case "EXCHANGE.UPDATE_RATE":
      var rate = action.payload.offeredRate
      newState.minConversionRate = rate
      newState.minDestAmount = calculateDest(newState.sourceAmount, rate).toString(10)
      newState.offeredRateBalance = action.payload.reserveBalance
      newState.offeredRateExpiryBlock = action.payload.expirationBlock
      newState.offeredRate = rate
      return newState
    case "EXCHANGE.OPEN_PASSPHRASE":{
      newState.passphrase = true
      return newState      
    }      
    case "EXCHANGE.HIDE_PASSPHRASE":{
      newState.passphrase = false
      return newState
    }      
    case "EXCHANGE.CHANGE_PASSPHRASE":{
      newState.errors.passwordError = ""
      return newState
    }
    case "EXCHANGE.THROW_ERROR_PASSPHRASE":{
      newState.errors.passwordError = action.payload
      return newState
    }
  }
  return state
}

export default exchange;
