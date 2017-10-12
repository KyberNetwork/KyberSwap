import BigNumber from 'bignumber.js'
import supported_tokens from "../services/supported_tokens"
import constants from "../services/constants"
import { calculateRate, calculateDest, calculateMinAmount, getToken } from "../utils/converter"
import EXCHANGE from "../constants/exchangeFormActions"

const initFormState = constants.INIT_EXCHANGE_FORM_STATE
const initState = {}

const exchangeForm = (state=initState, action) => {
  var id = action.meta
  var newState = {...state}
  var formState = state[id] || initFormState
  newState[id] = {...formState}
  switch (action.type) {
    case EXCHANGE.ACCOUNT_SELECTED: {
      //check if new account is selected
      if(newState[id].selectedAccount != action.payload){
        //reset item
        newState[id] = initFormState        
      }
      newState[id].selectedAccount = action.payload
      newState[id].errors = {...newState[id].errors, selectedAccountError: ""}
      return newState
    }
    case EXCHANGE.CROSS_SEND_SELECTED: {
      newState[id].isCrossSend = true
      return newState
    }
    case EXCHANGE.CROSS_SEND_DESELECTED: {
      newState[id].isCrossSend = false
      return newState
    }
    case EXCHANGE.ADVANCE_SELECTED: {
      newState[id].advanced = true
      return newState
    }
    case EXCHANGE.ADVANCE_DESELECTED: {
      newState[id].advanced = false
      return newState
    }
    case EXCHANGE.SOURCE_TOKEN_SELECTED: {
      var token = getToken(action.payload)
      newState[id].sourceToken = token.address
      newState[id].sourceTokenSymbol = token.symbol
      newState[id].errors = {...newState[id].errors, sourceTokenError: ""}
      return newState
    }
    case EXCHANGE.DEST_TOKEN_SELECTED: {
      var token = getToken(action.payload)
      newState[id].destToken = token.address
      newState[id].destTokenSymbol = token.symbol
      newState[id].errors = {...newState[id].errors, destTokenError: ""}
      return newState
    }
    case EXCHANGE.SOURCE_AMOUNT_SPECIFIED: {
      var sourceAmount = action.payload
      var minAmount = calculateDest(
        sourceAmount, newState[id].minConversionRate).toString(10)
      newState[id].sourceAmount = action.payload
      newState[id].minDestAmount = minAmount
      newState[id].errors = {...newState[id].errors, sourceAmountError: ""}
      return newState
    }
    case EXCHANGE.MIN_AMOUNT_SPECIFIED: {
      var minAmount = action.payload
      var minRate = calculateRate(newState[id].sourceAmount, minAmount).toString(10)
      newState[id].minDestAmount = minAmount
      newState[id].minConversionRate = minRate
      newState[id].errors = {...newState[id].errors, minDestAmountError: ""}
      return newState
    }
    case EXCHANGE.MIN_CONVERSION_RATE_SPECIFIED: {
      var minRate = action.payload
      var minAmount = calculateMinAmount(newState[id].sourceAmount, minRate).toString(10)
      newState[id].minDestAmount = minAmount
      newState[id].minConversionRate = minRate
      return newState
    }
    case EXCHANGE.RECIPIENT_SPECIFIED: {
      newState[id].destAddress = action.payload
      newState[id].errors = {...newState[id].errors, destAddressError: ""}
      return newState
    }
    case EXCHANGE.GAS_PRICE_SPECIFIED: {
      newState[id].gasPrice = action.payload
      newState[id].errors = {...newState[id].errors, gasPriceError: ""}
      return newState
    }
    case EXCHANGE.GAS_SPECIFIED: {
      newState[id].gas = action.payload
      newState[id].errors = {...newState[id].errors, gasError: ""}
      return newState
    }
    case EXCHANGE.ERROR_THREW: {
      newState[id].errors = {...newState[id].errors, ...action.payload}
      return newState
    }
    case EXCHANGE.EXCHANGE_FORM_EMPTIED: {
      var step = newState[id].step
      newState[id] = {...initFormState, step: step}
      return newState
    }
    case EXCHANGE.EXCHANGE_FORM_RESET_STEP: {
      newState[id].step = 1
      return newState
    }
    case EXCHANGE.EXCHANGE_FORM_NEXT_STEP: {
      if (newState[id].advanced && newState[id].step == 2) {
        newState[id].step = "advance"
      } else if (newState[id].advanced && newState[id].step == "advance"){
        newState[id].step = 3
      } else {
        newState[id].step = newState[id].step + 1
      }
      return newState
    }
    case EXCHANGE.EXCHANGE_FORM_PREVIOUS_STEP: {
      if (newState[id].advanced && newState[id].step == 3) {
        newState[id].step = "advance"
      } else if (newState[id].advanced && newState[id].step == "advance"){
        newState[id].step = 2
      } else {
        newState[id].step = newState[id].step - 1
      }
      return newState
    }
    case EXCHANGE.EXCHANGE_FORM_STEP_SPECIFIED: {
      newState[id].step = action.payload
      return newState
    }
    case EXCHANGE.EXCHANGE_FORM_APPROVAL_TX_BROADCAST_PENDING: {
      newState[id].broadcasting = true
      newState[id].txHash = action.payload
      return newState
    }
    case EXCHANGE.EXCHANGE_FORM_APPROVAL_TX_BROADCAST_REJECTED: {
      newState[id].broadcasting = false
      newState[id].bcError = action.payload
      return newState
    }
    case EXCHANGE.EXCHANGE_FORM_TX_BROADCAST_PENDING: {
      newState[id].broadcasting = true
      newState[id].txHash = action.payload
      return newState
    }
    case EXCHANGE.EXCHANGE_FORM_TX_BROADCAST_FULFILLED: {
      newState[id].broadcasting = false
      newState[id].txHash = action.payload
      return newState
    }
    case EXCHANGE.EXCHANGE_FORM_TX_BROADCAST_REJECTED: {
      newState[id].broadcasting = false
      newState[id].bcError = action.payload
      return newState
    }
    case EXCHANGE.EXCHANGE_FORM_SUGGEST_RATE: {
      var minRate = action.payload.rate
      var minAmount, block, balance, rate
      if ((new BigNumber(minRate)).toNumber() == 0) {
        minAmount = 0
        block = 0
        balance = 0
        rate = 0
      } else {
        minAmount = calculateDest(newState[id].sourceAmount, minRate).toString(10)
        block = action.payload.expirationBlock
        rate = action.payload.rate
        balance = action.payload.balance
      }
      newState[id].minConversionRate = minRate
      newState[id].minDestAmount = minAmount
      newState[id].offeredRateBalance = balance
      newState[id].offeredRateExpiryBlock = block
      newState[id].offeredRate = rate
      return newState
    }
  }
  return state
}

export default exchangeForm

