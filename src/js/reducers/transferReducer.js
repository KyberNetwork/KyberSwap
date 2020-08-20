import constants from "../services/constants"

const initFormState = constants.INIT_TRANSFER_FORM_STATE
const initState = initFormState

const transfer = (state = initState, action) => {
  var newState = { ...state, errors: { ...state.errors } }
  switch (action.type) {
    case "TRANSFER.SET_RANDOM_SELECTED_TOKEN":
      var transfer = { ...state }
      var random = action.payload
      transfer.token = random[0].address;
      transfer.tokenSymbol = random[0].symbol;
      return { ...transfer }
    case "TRANSFER.MAKE_NEW_TRANSFER":
      var transfer = { ...state };
      newState = initState;
      newState.selected = true;
      newState.token = transfer.token
      newState.tokenSymbol = transfer.tokenSymbol
      newState.gasPrice = transfer.gasPrice
      newState.selectedGas = transfer.selectedGas
      newState.advanced = false
      newState.isEditGasPrice = transfer.isEditGasPrice
      return newState
    case "TRANSFER.SELECT_TOKEN":
      newState.tokenSymbol = action.payload.symbol
      newState.token = action.payload.address
      if (newState.tokenSymbol === 'ETH') {
        newState.gas_estimate = newState.gas_limit_transfer_eth
      } else {
        newState.gas_estimate = newState.gas_limit_transfer_token
      }
      newState.errors.sourceAmount = {}
      newState.selected = true
      return newState
    case "TRANSFER.THOW_ERROR_SELECT_TOKEN":
      newState.error_select_token = action.payload
      return newState
    case "TRANSFER.GO_TO_STEP":
      newState.step = action.payload
      return newState
    case "TRANSFER.SET_DEST_ETH_NAME_AND_ADDRESS":
      const { destEthName, destAddress } = action.payload;
      newState.destEthName = destEthName;
      newState.destAddress = destAddress;
      return newState;
    case "TRANSFER.CLEAR_TRANSFER_ERROR":
      newState.errors.destAddress = {};
      newState.errors.sourceAmount = {};
      return newState;
    case "TRANSFER.TRANSFER_SPECIFY_AMOUNT":
      newState.amount = action.payload
      newState.errors.destAddress = {}
      newState.errors.sourceAmount = {}
      return newState
    case "TRANSFER_SPECIFY_GAS":
      newState.gas = action.payload
      return newState
    case "TRANSFER_SPECIFY_GAS_PRICE":
      newState.gasPrice = action.payload
      newState.isEditGasPrice = true
      delete newState.errors.sourceAmount[constants.TRANSFER_CONFIG.sourceErrors.balance]
      return newState
    case "TRANSFER.TOGGLE_ADVANCE":
      newState.advanced = !newState.advanced
      return newState

    case "TRANSFER.THROW_ERROR_DEST_ADDRESS":
      var {key, message} = action.payload
      var errors = newState.errors
      errors.destAddress[key] = message
      newState.errors = errors
      return newState

    case "TRANSFER.CLEAR_ERROR_DEST_ADDRESS": {
      var {key} = action.payload
      var errors = newState.errors
      delete errors.destAddress[key]
      newState.errors = errors
      return newState
    }
    case "TRANSFER.THROW_AMOUNT_ERROR": {
      var {key, message} = action.payload
      var errors = newState.errors
      errors.sourceAmount[key] = message
      newState.errors = errors
      return newState
    }
    case "TRANSFER.CLEAR_ERROR_AMOUNT": {
      var {key} = action.payload
      var errors = newState.errors
      delete errors.sourceAmount[key]
      newState.errors = errors
      return newState
    }

    case "TRANSFER.TX_BROADCAST_FULFILLED": {
      var {tx} = action.payload
      newState.broadcasting = false
      newState.tx = tx
      return newState
    }
   
    case "TRANSFER.FINISH_TRANSACTION": {
      newState.broadcasting = false
      return newState
    }
    
    case "TRANSFER.SET_GAS_USED": {
      newState.gas = action.payload.gas
      return newState
    }
    
    case "GLOBAL.SET_GAS_PRICE_COMPLETE": {
      if (!newState.isEditGasPrice) {
        var { safeLowGas, standardGas, fastGas, superFastGas, defaultGas, selectedGas } = action.payload

        var gasPriceSuggest = newState.gasPriceSuggest
        gasPriceSuggest.superFastGas = Math.round(superFastGas * 10) / 10
        gasPriceSuggest.fastGas = Math.round(fastGas * 10) / 10
        gasPriceSuggest.standardGas = Math.round(standardGas * 10) / 10
        gasPriceSuggest.safeLowGas = Math.round(safeLowGas * 10) / 10

        newState.gasPriceSuggest = { ...gasPriceSuggest }
        newState.gasPrice = Math.round(defaultGas * 10) / 10
        newState.selectedGas = selectedGas
      }
      return newState
    }

    case "TRANSFER.SET_GAS_PRICE_SUGGEST": {
      newState.gasPriceSuggest = action.payload;
      return newState;
    }

    case "TRANSFER.SET_SELECTED_GAS": {
      const { level } = action.payload
      newState.selectedGas = level
      return newState
    }

    case "TRANSFER.OPEN_IMPORT_ACCOUNT": {
      newState.isOpenImportAcount = true
      return newState
    }
    case "TRANSFER.CLOSE_IMPORT_ACCOUNT": {
      newState.isOpenImportAcount = false
      return newState
    }

    case "TRANSFER.TOGGLE_BALANCE_CONTENT": {
      newState.isBalanceActive = !newState.isBalanceActive;
      return newState;
    }
    case "TRANSFER.TOGGLE_ADVANCE_CONTENT": {
      newState.isAdvanceActive = !newState.isAdvanceActive;
      return newState;
    }
    case "TRANSFER.SET_IS_OPEN_ADVANCE": {
      newState.isOpenAdvance = action.payload;
      return newState;
    }
    case "TRANSFER.SET_SELECTED_GAS_PRICE": {
      const { gasPrice, gasLevel } = action.payload

      newState.gasPrice = gasPrice
      newState.selectedGas = gasLevel

      return newState
    }

    case "TRANSFER.SET_IS_SELECT_TOKEN_BALANCE": {
      newState.isSelectTokenBalance = action.payload;
      return newState;
    }

    case "TRANSFER.UPDATE_TRANSFER_PATH":{
      const {transferPath, currentPathIndex} = action.payload
      newState.transferPath = transferPath
      newState.currentPathIndex = currentPathIndex
      return newState
    }

    case "TRANSFER.RESET_TRANSFER_PATH":{
      newState.currentPathIndex = 0
      newState.transferPath = []
      return newState
    }

    case "TRANSFER.FORWARD_TRANSFER_PATH":{
      newState.currentPathIndex += 1
      return newState
    }
    case "GLOBAL.CLEAR_SESSION_FULFILLED": {
      newState.errors.sourceAmount = {};
      return newState
    }
  }
  return state
}

export default transfer;
