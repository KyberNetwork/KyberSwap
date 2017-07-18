import BigNumber from 'bignumber.js'
import supported_tokens from "../services/supported_tokens"
import constants from "../services/constants"
import { calculateRate, calculateDest } from "../utils/converter"


const initState = {
  selectedAccount: "",
  sourceToken: constants.ETHER_ADDRESS,
  sourceTokenSymbol: "",
  sourceAmount: 0,
  destToken: constants.ETHER_ADDRESS,
  destTokenSymbol: "",
  minConversionRate: 0,
  destAddress: "",
  minDestAmount: 0,
  maxDestAmount: (new BigNumber(2)).pow(255).toString(10),
  offeredRateExpiryBlock: 0,
  offeredRateBalance: 0,
  offeredRate: 0,
  throwOnFailure: false,
  gas: 1000000,
  gasPrice: 20000000000,
  step: 1,
  errors: {
    selectedAccountError: "",
    destAddressError: "",
    sourceTokenError: "",
    sourceAmountError: "",
    destTokenError: "",
    maxDestAmountError: "",
    minDestAmountError: "",
    gasPriceError: "",
    gasError: "",
    passwordError: "",
  }
}

const exchangeForm = (state=initState, action) => {
  switch (action.type) {
    case "ACCOUNT_SELECTED": {
      return {...state, selectedAccount: action.payload}
    }
    case "SOURCE_TOKEN_SELECTED": {
      if (action.payload == constants.ETHER_ADDRESS) {
        return {...state,
          sourceToken: action.payload,
          sourceTokenSymbol: "ETH",
        }
      } else {
        var token
        for (var i = 0; i < supported_tokens.length; i++) {
          var tok = supported_tokens[i]
          if (tok.address == action.payload) {
            token = tok
            break
          }
        }
        return {...state,
          sourceToken: token.address,
          sourceTokenSymbol: token.symbol,
        }
      }
    }
    case "DEST_TOKEN_SELECTED": {
      if (action.payload == constants.ETHER_ADDRESS) {
        return {...state,
          destToken: action.payload,
          destTokenSymbol: "ETH",
        }
      } else {
        var token
        for (var i = 0; i < supported_tokens.length; i++) {
          var tok = supported_tokens[i]
          if (tok.address == action.payload) {
            token = tok
            break
          }
        }
        return {...state,
          destToken: token.address,
          destTokenSymbol: token.symbol,
        }
      }
    }
    case "SOURCE_AMOUNT_SPECIFIED": {
      var sourceAmount = action.payload
      var minAmount = calculateDest(
        sourceAmount, state.minConversionRate).toString(10)
      return {...state, sourceAmount: action.payload, minDestAmount: minAmount}
    }
    case "MIN_AMOUNT_SPECIFIED": {
      var minAmount = action.payload
      var minRate = calculateRate(state.sourceAmount, minAmount).toString(10)
      return {...state, minDestAmount: minAmount, minConversionRate: minRate}
    }
    case "RECIPIENT_SPECIFIED": {
      return {...state, destAddress: action.payload}
    }
    case "GAS_PRICE_SPECIFIED": {
      return {...state, gasPrice: action.payload}
    }
    case "GAS_SPECIFIED": {
      return {...state, gas: action.payload}
    }
    case "ERROR_THREW": {
      return {...state, errors: {...state.errors, ...action.payload}}
    }
    case "EXCHANGE_FORM_EMPTIED": {
      var step = state.step
      return {...initState, step: step}
    }
    case "EXCHANGE_FORM_RESET_STEP": {
      return {...state, step: 1 }
    }
    case "EXCHANGE_FORM_NEXT_STEP": {
      return {...state, step: state.step + 1}
    }
    case "EXCHANGE_FORM_PREVIOUS_STEP": {
      return {...state, step: state.step - 1}
    }
    case "EXCHANGE_FORM_SUGGEST_RATE": {
      var minRate = action.payload.rate
      var minAmount, block, balance, rate
      if ((new BigNumber(minRate)).toNumber() == 0) {
        minAmount = 0
        block = 0
        balance = 0
        rate = 0
      } else {
        minAmount = calculateDest(state.sourceAmount, minRate).toString(10)
        block = action.payload.expirationBlock
        rate = action.payload.rate
        balance = action.payload.balance
      }
      return {...state,
        minConversionRate: minRate,
        minDestAmount: minAmount,
        offeredRateBalance: balance,
        offeredRateExpiryBlock: block,
        offeredRate: rate,
      }
    }
  }
  return state
}

export default exchangeForm

