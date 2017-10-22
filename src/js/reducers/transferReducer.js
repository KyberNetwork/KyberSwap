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

const initFormState = constants.INIT_TRANSFER_FORM_STATE
const initState = initFormState

const transfer = (state=initState, action) => {
  var newState = {...state}
  switch (action.type) {
  	case "TRANSFER.SELECT_TOKEN":
      newState.tokenSymbol = action.payload.symbol
      newState.sourceToken = action.payload.address
      return newState
    case "TRANSFER.THOW_ERROR_SELECT_TOKEN":
      newState.error_select_token = action.payload
      return newState
    case "TRANSFER.GO_TO_STEP":
      newState.step = action.payload
      return newState
    case "TRANSFER.TRANSFER_SPECIFY_ADDRESS_RECEIVE":
      newState.destAddress = action.payload
      newState.errors.destAddress = ""
      return newState
    case "TRANSFER.TRANSFER_SPECIFY_AMOUNT":
      newState.amount = action.payload
      newState.errors.amountTransfer = ""
      return newState
    case "EXCHANGE_SPECIFY_GAS":
      newState.gas = action.payload
      return newState
    case "EXCHANGE_SPECIFY_GAS_PRICE":
      newState.gasPrice = action.payload
      return newState
    case "TRANSFER.SHOW_ADVANCE":
      newState.advance = true
      return newState
    case "TRANSFER.HIDE_ADVANCE":
      newState.advance = false
      return newState
    case "TRANSFER.OPEN_PASSPHRASE":
      newState.passphrase = true
      return newState      
    case "TRANSFER.HIDE_PASSPHRASE":
      newState.passphrase = false
      return newState
    case "TRANSFER.THROW_ERROR_DEST_ADDRESS":
      newState.errors.destAddress = action.payload
      return newState
    case "TRANSFER.THROW_AMOUNT_ERROR":{
      newState.errors.amountTransfer = action.payload
      return newState
    }    
    case "TRANSFER.CHANGE_PASSPHRASE":{
      newState.errors.passwordError = ""
      return newState
    }
    case "TRANSFER.THROW_ERROR_PASSPHRASE":{
      newState.errors.passwordError = action.payload
      return newState
    }
    case "TRANSFER.FINISH_TRANSACTION":{
      newState.passphrase = false
      newState.step = 2   
      return newState   
    }    
    case "TRANSFER.APPROVAL_TX_BROADCAST_PENDING": {
      newState.broadcasting = true
      newState.txHash = action.payload
      return newState
    }
    case "TRANSFER.APPROVAL_TX_BROADCAST_REJECTED": {
      newState.broadcasting = false
      newState.bcError = action.payload
      return newState
    }
    case "TRANSFER.TX_BROADCAST_PENDING": {
      newState.broadcasting = true
      newState.txHash = action.payload
      return newState
    }
    case "TRANSFER.TX_BROADCAST_FULFILLED": {
      newState.broadcasting = false
      newState.txHash = action.payload
      return newState
    }
    case "TRANSFER.TX_BROADCAST_REJECTED": {
      newState.broadcasting = false
      newState.bcError = action.payload
      return newState
    }
  }
  return state
}

export default transfer;
