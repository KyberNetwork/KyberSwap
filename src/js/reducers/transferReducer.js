//import Account from "../services/account"
//import Token from "../services/token"
import {REHYDRATE} from 'redux-persist/constants'
//import IMPORT from "../constants/importAccountActions"
import constants from "../services/constants"
import { calculateDest} from "../utils/converter"

import { randomToken } from "../utils/random"
import supported_tokens from "../services/supported_tokens"
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
    case REHYDRATE: {
      var transfer = action.payload.transfer;

      if(transfer && transfer.selected){
        newState.selected = transfer.selected;
        newState.token = transfer.token
        newState.tokenSymbol = transfer.tokenSymbol
      } else {
        var randomSelectToken = randomToken(1, Object.keys(supported_tokens).length);
        newState.token = Object.values(supported_tokens)[randomSelectToken].address
        newState.tokenSymbol = Object.values(supported_tokens)[randomSelectToken].symbol
      }
      return newState;
    }
    case "TRANSFER.MAKE_NEW_TRANSFER": 
      var transfer = {...state};
      newState = initState;
      if(transfer && transfer.selected){
        newState.selected = transfer.selected;
        newState.token = transfer.token
        newState.tokenSymbol = transfer.tokenSymbol
      } else {
        var randomSelectToken = randomToken(1, Object.keys(supported_tokens).length);
        newState.token = Object.values(supported_tokens)[randomSelectToken].address
        newState.tokenSymbol = Object.values(supported_tokens)[randomSelectToken].symbol
      }
      return newState;
  	case "TRANSFER.SELECT_TOKEN":
      newState.tokenSymbol = action.payload.symbol
      newState.sourceToken = action.payload.address
      newState.selected = true
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
    case "TRANSFER_SPECIFY_GAS":
      newState.gas = action.payload
      return newState
    case "TRANSFER_SPECIFY_GAS_PRICE":
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
    case "TRANSFERf.HIDE_PASSPHRASE":
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
