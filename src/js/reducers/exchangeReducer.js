import constants from "../services/constants"
import * as converter from "../utils/converter"

var initState = constants.INIT_EXCHANGE_FORM_STATE
initState.snapshot = constants.INIT_EXCHANGE_FORM_STATE

const exchange = (state = initState, action) => {
  var newState = { ...state, errors: { ...state.errors } }
  switch (action.type) {
    case "EXCHANGE.SET_RANDOM_SELECTED_TOKEN":
      var exchange = { ...state }
      var random = action.payload
      exchange.sourceToken = random[0].address;
      exchange.sourceTokenSymbol = random[0].symbol;
      exchange.destToken = random[1].address;
      exchange.destTokenSymbol = random[1].symbol;
      return { ...exchange }
    case "EXCHANGE.MAKE_NEW_EXCHANGE": {
      var newState = { ...state };
      newState.selected = true;
      newState.sourceAmount = ""
      newState.destAmount = ""
      newState.errors = initState.errors
      newState.advanced = false
      newState.bcError = ""
      newState.step = initState.step
      newState.minConversionRate = newState.slippageRate
      newState.isEditRate = false
      newState.isAnalize = false
      newState.isAnalizeComplete = false
      
      return newState
    }
    case "EXCHANGE.SELECT_TOKEN_ASYNC": {
      newState.isSelectToken = true
      return newState
    }
    case "EXCHANGE.SELECT_TOKEN": {
      var { sourceTokenSymbol, sourceToken, destTokenSymbol, destToken, type } = action.payload
      newState.sourceTokenSymbol = sourceTokenSymbol
      newState.sourceToken = sourceToken
      newState.destTokenSymbol = destTokenSymbol
      newState.destToken = destToken

      //reset all error
      for (var key in newState.errors) {
        newState.errors[key] = {}
      }

      newState.selected = true
      newState.isEditRate = false
      return newState
    }
   
    case "EXCHANGE.TOGGLE_ADVANCE": {
      newState.advanced = !newState.advanced
      return newState
    }
    
    case "EXCHANGE.TX_BROADCAST_FULFILLED": {
      newState.broadcasting = false
      const { tx } = action.payload
      newState.tx = tx
      return newState
    }
   
    case "EXCHANGE.UPDATE_RATE_COMPLETE": {
      const {
        expectedRateInit, expectedPrice, slippagePrice,
        percentChange, srcTokenDecimal, destTokenDecimal, isRefPriceFromChainLink
      } = action.payload

      var slippageRate = slippagePrice == "0" ? converter.estimateSlippagerate(expectedRateInit, 18) : converter.toT(slippagePrice, 18)
      var expectedRate = expectedPrice == "0" ? expectedRateInit : expectedPrice

      newState.slippageRate = slippageRate
      newState.expectedRate = expectedRate
      newState.percentChange = percentChange

      if (newState.sourceAmount !== "") {
        newState.minDestAmount = converter.caculateDestAmount(newState.sourceAmount, expectedRate, destTokenDecimal)
      }

      //calculate source, dest
      if (newState.inputFocus === 'dest') {
        newState.sourceAmount = converter.caculateSourceAmount(newState.destAmount, expectedRate, srcTokenDecimal)
      }

      if (newState.inputFocus === 'source') {
        newState.destAmount = converter.caculateDestAmount(newState.sourceAmount, expectedRate, destTokenDecimal)
      }

      if (!newState.isEditRate) {
        newState.minConversionRate = slippageRate
      }

      newState.isSelectToken = false;
      newState.isRefPriceFromChainLink = isRefPriceFromChainLink;

      return newState
    }
    
    case "EXCHANGE.FINISH_EXCHANGE": {
      newState.broadcasting = false
      return newState
    }
   
    case "EXCHANGE.CACULATE_AMOUNT": {
      if (state.errors.selectSameToken) return newState

      var { sourceTokenDecimals, destTokenDecimals } = action.payload

      if (state.inputFocus == "dest") {
        newState.sourceAmount = converter.caculateSourceAmount(state.destAmount, state.expectedRate, sourceTokenDecimals)
      } else {
        newState.destAmount = converter.caculateDestAmount(state.sourceAmount, state.expectedRate, destTokenDecimals)
      }
      return newState
    }

    case "EXCHANGE.CHANGE_AMOUNT": {
      var { input, value } = action.payload
      if (input === "source") {
        newState.sourceAmount = value
      } else {
        newState.destAmount = value
      }
      return newState
    }
    case "EXCHANGE.INPUT_CHANGE": {
      const { focus, value, sourceTokenDecimals, destTokenDecimals } = action.payload;

      if (focus == "source") {
        newState.sourceAmount = value
        newState.errors.sourceAmountError = ""
        newState.errors.ethBalanceError = ""
        if (state.errors.selectSameToken) return newState
        newState.destAmount = converter.caculateDestAmount(value, state.expectedRate, destTokenDecimals)
      }
      else if (focus == "dest") {
        newState.destAmount = value
        newState.errors.destAmountError = ""
        newState.errors.sourceAmountError = ""
        if (state.errors.selectSameToken) return newState
        newState.sourceAmount = converter.caculateSourceAmount(value, state.expectedRate, sourceTokenDecimals)
      }
      return newState
    }

    case "EXCHANGE.FOCUS_INPUT": {
      newState.inputFocus = action.payload
      return newState
    }

    case "EXCHANGE.SET_TERM_AND_SERVICES": {
      newState.termAgree = action.payload.value
      return newState
    }
    case "EXCHANGE.SET_MIN_RATE": {
      newState.minConversionRate = action.payload.value
      newState.errors.rateError = ''
      newState.isEditRate = true
      return newState
    }
   
    case "EXCHANGE.RESET_MIN_RATE": {
      newState.minConversionRate = newState.expectedRate
      newState.isEditRate = true
      newState.errors.rateError = ''
      return newState
    }
    case "EXCHANGE.SET_GAS_USED": {
      const { gas, gas_approve } = action.payload
      newState.gas = gas
      newState.gas_approve = gas_approve
      return newState
    }
    case "EXCHANGE.SET_GAS_USED_SNAPSHOT": {
      const { gas, gas_approve } = action.payload
      newState.snapshot.gas = gas
      newState.snapshot.gas_approve = gas_approve
      return newState
    }
    
    case "EXCHANGE.SWAP_TOKEN": {
      var tempSourceToken = newState.sourceToken
      var tempSourceTokenSymbol = newState.sourceTokenSymbol
      newState.sourceToken = newState.destToken
      newState.sourceTokenSymbol = newState.destTokenSymbol
      newState.destToken = tempSourceToken
      newState.destTokenSymbol = tempSourceTokenSymbol
      newState.isSelectToken = true
      newState.isEditRate = false

      newState.errors.sourceAmountError = initState.errors.sourceAmountError
      newState.errors.ethBalanceError = initState.errors.ethBalanceError

      return newState
    }
    case "GLOBAL.SET_GAS_PRICE_COMPLETE": {
      if (!newState.isEditGasPrice) {
        const { safeLowGas, standardGas, fastGas, superFastGas, defaultGas, selectedGas } = action.payload
        let gasPriceSuggest = { ...newState.gasPriceSuggest }

        gasPriceSuggest.superFastGas = Math.round(superFastGas * 10) / 10
        gasPriceSuggest.fastGas = Math.round(fastGas * 10) / 10
        gasPriceSuggest.standardGas = Math.round(standardGas * 10) / 10
        gasPriceSuggest.safeLowGas = Math.round(safeLowGas * 10) / 10

        newState.gasPriceSuggest = { ...gasPriceSuggest }
        newState.gasPrice = Math.round(defaultGas * 10) / 10

        newState.selectedGas = selectedGas;
      }
      return newState
    }
    case "EXCHANGE.SET_GAS_PRICE_SUGGEST": {
      newState.gasPriceSuggest = action.payload;
      return newState;
    }
    case "EXCHANGE.SET_MAX_GAS_PRICE_COMPLETE": {
      newState.maxGasPrice = action.payload
      return newState
    }
    case "EXCHANGE.UPDATE_RATE_PENDING": {
      const isManual = action.payload.isManual
      if (isManual) {
        newState.isSelectToken = true
      }
      return newState
    }
    
    case "EXCHANGE.SET_SNAPSHOT": {
      var snapshot = action.payload
      newState.snapshot = { ...snapshot }
      return newState
    }
    
    case "EXCHANGE.SET_SELECTED_GAS": {
      const { level } = action.payload
      newState.selectedGas = level
      return newState
    }
    case "EXCHANGE.OPEN_IMPORT_ACCOUNT": {
      newState.isOpenImportAcount = true
      return newState
    }
    case "EXCHANGE.CLOSE_IMPORT_ACCOUNT": {
      newState.isOpenImportAcount = false
      return newState
    }
    

    case "EXCHANGE.TOGGLE_BALANCE_CONTENT": {
      newState.isBalanceActive = !newState.isBalanceActive;
      return newState;
    }
    case "EXCHANGE.TOGGLE_ADVANCE_CONTENT": {
      newState.isAdvanceActive = !newState.isAdvanceActive
      return newState;
    }
    case "EXCHANGE.SET_IS_OPEN_ADVANCE": {
      newState.isOpenAdvance = action.payload;
      return newState;
    }

    case "EXCHANGE.SET_SELECTED_GAS_PRICE": {
      const { gasPrice, gasLevel } = action.payload

      newState.gasPrice = gasPrice
      newState.selectedGas = gasLevel

      return newState
    }

    case "EXCHANGE.SET_IS_SELECT_TOKEN_BALANCE": {
      newState.isSelectTokenBalance = action.payload;
      return newState;
    }
    case "EXCHANGE.SET_SWAPPING_TIME": {
      newState.swappingTime = action.payload;
      return newState;
    }
    case "EXCHANGE.SET_CUSTOM_RATE_INPUT_ERROR": {
      newState.customRateInput.isError = action.payload;
      return newState;
    }
    case "EXCHANGE.SET_CUSTOM_RATE_INPUT_DIRTY": {
      newState.customRateInput.isDirty = action.payload;
      return newState;
    }
    case "EXCHANGE.SET_CUSTOM_RATE_INPUT_VALUE": {
      newState.customRateInput.value = action.payload;
      return newState;
    }
    case "EXCHANGE.SET_IS_SELECT_CUSTOM_RATE_INPUT": {
      newState.customRateInput.isSelected = action.payload;
      return newState;
    }

    case "EXCHANGE.UPDATE_EXCHANGE_PATH": {
      const { exchangePath, currentPathIndex } = action.payload
      newState.exchangePath = exchangePath
      newState.currentPathIndex = currentPathIndex
      return newState
    }

    case "EXCHANGE.RESET_EXCHANGE_PATH": {
      newState.currentPathIndex = 0
      newState.exchangePath = []
      return newState
    }
    case "EXCHANGE.FORWARD_EXCHANGE_PATH": {
      newState.currentPathIndex += 1
      return newState
    }
    case "EXCHANGE.THROW_ERROR_SOURCE_AMOUNT": {
      const { key, message } = action.payload
      var errors = newState.errors
      errors.sourceAmount[key] = message
      newState.errors = errors
      return newState
    }

    case "EXCHANGE.THROW_ERROR_SLIPPAGE_RATE": {
      const { key, message } = action.payload
      var errors = newState.errors
      errors.slippageRate[key] = message
      newState.errors = errors
      return newState
    }

    case "EXCHANGE.CLEAR_ERROR_SOURCE_AMOUNT": {
      const { key } = action.payload
      var errors = newState.errors
      delete errors.sourceAmount[key];
      newState.errors = errors
      return newState
    }
    case "GLOBAL.CLEAR_SESSION_FULFILLED": {
      newState.errors.sourceAmount = {};
      return newState
    }
    case "EXCHANGE.SET_PLATFORM_FEE": {
      newState.platformFee = action.payload;
      return newState
    }
  }
  return state
}

export default exchange;
