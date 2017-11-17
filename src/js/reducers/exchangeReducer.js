import { REHYDRATE } from 'redux-persist/lib/constants'
import constants from "../services/constants"
import { calculateDest } from "../utils/converter"
import { randomToken, randomForExchange } from "../utils/random"

const initState = constants.INIT_EXCHANGE_FORM_STATE

const exchange = (state = initState, action) => {
  var newState = { ...state, errors: { ...state.errors } }
  switch (action.type) {
    // case REHYDRATE: {
    //   newState = initState      
    //   return {...newState}
    // }
    case "EXCHANGE.SET_RANDOM_SELECTED_TOKEN":
      var exchange = { ...state }
      var random = action.payload
      exchange.sourceToken = random[0].address;
      exchange.sourceTokenSymbol = random[0].symbol;
      exchange.destToken = random[1].address;
      exchange.destTokenSymbol = random[1].symbol;
      return { ...exchange }
    case "EXCHANGE.MAKE_NEW_EXCHANGE":{
      var newState = { ...state };
      newState.selected = true;
      newState.sourceAmount = ""
      newState.destAmount = ""
      newState.errors = initState.errors
      newState.gasPrice = initState.gasPrice
      newState.bcError = ""
      newState.step = initState.step
      return newState
    }
    case "EXCHANGE.SELECT_TOKEN_ASYNC":{
      newState.isSelectToken = true      
      return newState
    }
    case "EXCHANGE.SELECT_TOKEN": {
      if (action.payload.type === "source") {
        newState.sourceTokenSymbol = action.payload.symbol
        newState.sourceToken = action.payload.address
      } else if (action.payload.type === "des") {
        newState.destTokenSymbol = action.payload.symbol
        newState.destToken = action.payload.address
      }
      newState.selected = true
      return newState
    }
    case "EXCHANGE.CHECK_SELECT_TOKEN": {
      if (newState.sourceTokenSymbol === newState.destTokenSymbol) {
        newState.errors.selectSameToken = "Cannot exchange the same token"
        newState.errors.selectTokenToken = ""
        return newState
      }
      if ((newState.sourceTokenSymbol !== "ETH") &&
        (newState.destTokenSymbol !== "ETH")) {
        newState.errors.selectSameToken = ""
        newState.errors.selectTokenToken = "This pair token is not supported"
        return newState
      }
      newState.errors.selectSameToken = ""
      newState.errors.selectTokenToken = ""
      return newState
    }
    case "EXCHANGE.THROW_SOURCE_AMOUNT_ERROR": {
      newState.errors.sourceAmountError = action.payload
      return newState
    }
    case "EXCHANGE.THROW_GAS_PRICE_ERROR":{
      newState.errors.gasPriceError = action.payload
      return newState
    }
    case "EXCHANGE.GO_TO_STEP":
      newState.step = action.payload
      return newState
    case "EXCHANGE.SPECIFY_GAS":
      newState.gas = action.payload
      return newState
    case "EXCHANGE.SPECIFY_GAS_PRICE":
      newState.gasPrice = action.payload
      newState.errors.gasPriceError = ""
      return newState
    case "EXCHANGE.SHOW_ADVANCE":
      newState.advanced = true
      return newState
    case "EXCHANGE.HIDE_ADVANCE":
      newState.advanced = false
      return newState
    case "EXCHANGE.CHANGE_SOURCE_AMOUNT": {
      newState.sourceAmount = action.payload
      newState.errors.sourceAmountError = ""
      return newState
    }
    case "EXCHANGE.CHANGE_DEST_AMOUNT": {
      newState.destAmount = action.payload
      newState.errors.destAmountError = ""
      return newState
    }
    case "EXCHANGE.APPROVAL_TX_BROADCAST_REJECTED": {
      newState.broadcasting = false
      newState.bcError = action.payload ? action.payload : ""
      newState.confirmApprove = false
      newState.showConfirmApprove = false
      newState.isApproving = false
      return newState
    }
    case "EXCHANGE.TX_BROADCAST_FULFILLED": {
      newState.broadcasting = false
      newState.txHash = action.payload
      return newState
    }
    case "EXCHANGE.TX_BROADCAST_REJECTED": {
      newState.broadcasting = false
      newState.bcError = action.payload ? action.payload : ""
      newState.isConfirming = false
      return newState
    }
    case "EXCHANGE.UPDATE_RATE":
      var rate = action.payload.offeredRate
      newState.minConversionRate = rate
      if (newState.sourceAmount !== "") {
        newState.minDestAmount = calculateDest(newState.sourceAmount, rate).toString(10)
      }
      newState.offeredRateBalance = action.payload.reserveBalance
      newState.offeredRateExpiryBlock = action.payload.expirationBlock
      newState.offeredRate = rate
      newState.isSelectToken = false    
      return newState
    case "EXCHANGE.OPEN_PASSPHRASE": {
      newState.passphrase = true
      return newState
    }
    case "EXCHANGE.HIDE_PASSPHRASE": {
      newState.passphrase = false
      return newState
    }
    case "EXCHANGE.HIDE_CONFIRM": {
      newState.confirmColdWallet = false
      return newState
    }
    case "EXCHANGE.SHOW_CONFIRM": {
      newState.confirmApprove = false
      newState.showConfirmApprove = false
      newState.confirmColdWallet = true
      return newState
    }
    case "EXCHANGE.HIDE_APPROVE": {
      newState.confirmApprove = false
      return newState
    }
    case "EXCHANGE.SHOW_APPROVE": {
      newState.confirmApprove = true
      return newState
    }
    case "EXCHANGE.CHANGE_PASSPHRASE": {
      newState.errors.passwordError = ""
      return newState
    }
    case "EXCHANGE.THROW_ERROR_PASSPHRASE": {
      newState.errors.passwordError = action.payload
      return newState
    }
    case "EXCHANGE.FINISH_EXCHANGE": {
      newState.broadcasting = false
      return newState
    }
    case "EXCHANGE.PREPARE_BROADCAST": {
      newState.passphrase = false
      newState.confirmColdWallet = false
      newState.confirmApprove = false
      //newState.showConfirmApprove = false
      newState.isApproving = false
      newState.isConfirming = false
      newState.sourceAmount = ""
      //newState.txRaw = ""
      newState.step = 3
      newState.broadcasting = true
      return newState
    }
    case "EXCHANGE.PROCESS_APPROVE": {
      newState.isApproving = true
      return newState
    }
    case "EXCHANGE.PROCESS_EXCHANGE": {
      newState.isConfirming = true
      return newState
    }    
    case "TX.TX_ADDED": {
      newState.tempTx = action.payload
      return newState
    }
    case "TX.UPDATE_TX_FULFILLED": {
      if (newState.tempTx.hash === action.payload.hash) {
        newState.tempTx = action.payload
      }
      return newState
    }
  }
  return state
}

export default exchange;
