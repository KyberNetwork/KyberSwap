import { REHYDRATE } from 'redux-persist/lib/constants'
import constants from "../services/constants"
import { calculateDest } from "../utils/converter"

//import { randomToken } from "../utils/random"

const initFormState = constants.INIT_TRANSFER_FORM_STATE
const initState = initFormState

const transfer = (state = initState, action) => {
  var newState = { ...state, errors: { ...state.errors } }
  switch (action.type) {
    // case REHYDRATE: {
    //   newState = initState;
    //   return {...newState};
    // }
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
      // newState.amount = ""
      newState.errors.amountTransfer = ""
      newState.errors.ethBalanceError = ""
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
      newState.errors.destAddress = ''
      newState.errors.amountTransfer = ''
      newState.errors.ethBalanceError = ""
      return newState
    case "TRANSFER.TRANSFER_SPECIFY_AMOUNT":
      newState.amount = action.payload
      newState.errors.destAddress = ''
      newState.errors.amountTransfer = ''
      newState.errors.ethBalanceError = ""
      return newState
    case "TRANSFER_SPECIFY_GAS":
      newState.gas = action.payload
      return newState
    case "TRANSFER_SPECIFY_GAS_PRICE":
      newState.gasPrice = action.payload
      newState.isEditGasPrice = true
      newState.errors.gasPrice = ""
      newState.errors.ethBalanceError = ""
      return newState
    case "TRANSFER.TOGGLE_ADVANCE":
      newState.advanced = !newState.advanced
      return newState
    case "TRANSFER.HIDE_CONFIRM": {
      newState.confirmColdWallet = false
      return newState
    }
    case "TRANSFER.SHOW_CONFIRM": {
      newState.confirmColdWallet = true
      return newState
    }
    case "TRANSFER.OPEN_PASSPHRASE":
      newState.passphrase = true
      return newState
    case "TRANSFER.HIDE_PASSPHRASE":
      newState.passphrase = false
      newState.errors.passwordError = ""
      return newState
    case "TRANSFER.THROW_ERROR_DEST_ADDRESS":
      newState.errors.destAddress = action.payload
      return newState
    case "TRANSFER.THROW_AMOUNT_ERROR": {
      newState.errors.amountTransfer = action.payload
      return newState
    }
    case "TRANSFER.THROW_ETH_BALANCE_ERROR": {
      newState.errors.ethBalanceError = action.payload
      return newState
    }
    case "TRANSFER.THROW_GAS_PRICE_ERROR": {
      newState.errors.gasPrice = action.payload
      return newState
    }
    case "TRANSFER.CHANGE_PASSPHRASE": {
      newState.errors.passwordError = ""
      return newState
    }
    case "TRANSFER.THROW_ERROR_PASSPHRASE": {
      newState.errors.passwordError = action.payload
      newState.isConfirming = false
      return newState
    }
    case "TRANSFER.TX_BROADCAST_PENDING": {
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
      newState.bcError = action.payload ? action.payload : ""
      newState.isConfirming = false
      newState.deviceError = action.payload ? action.payload : ''
      return newState
    }
    case "TRANSFER.SET_SIGN_ERROR": {
      newState.signError = action.payload ? action.payload : ""
      newState.isApproving = false
      newState.isConfirming = false
      return newState
    }
    case "TRANSFER.RESET_SIGN_ERROR": {
      newState.signError = ''
      return newState
    }
    case "TRANSFER.SET_BROADCAST_ERROR": {
      newState.broadcasting = false
      newState.broadcastError = action.payload ? action.payload : "Cannot broadcast transaction to blockchain"
      newState.confirmApprove = false
      newState.isApproving = false
      newState.isConfirming = false
      newState.step = 3
      return newState
    }
    case "TRANSFER.RESET_BROADCAST_ERROR": {
      newState.broadcastError = ''
      return newState
    }
    case "TRANSFER.FINISH_TRANSACTION": {
      newState.broadcasting = false
      return newState
    }
    case "TRANSFER.PREPARE_TRANSACTION": {
      newState.passphrase = false
      newState.confirmColdWallet = false
      newState.amount = 0
      newState.isConfirming = false
      newState.txRaw = ""
      newState.step = 2
      newState.bcError = ""
      newState.broadcasting = true
      newState.balanceData = {
        tokenName: action.payload.balanceData.name,
        tokenDecimal: action.payload.balanceData.decimals,
        tokenSymbol: action.payload.balanceData.tokenSymbol,
        amount: action.payload.balanceData.amount,
        // prev: action.payload.balanceData.balance,
        // next: 0
      }
      return newState
    }
    case "TRANSFER.THROW_ERROR_SIGN_TRANSACTION": {
      newState.errors.signTransaction = action.payload
      return newState
    }
    case "TRANSFER.PROCESS_TRANSFER": {
      newState.isConfirming = true
      newState.bcError = ""
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
    case "TRANSFER.UPDATE_CURRENT_BALANCE": {
      const { tokenBalance, txHash } = action.payload
      if (newState.txHash === txHash) {
        newState.balanceData.next = action.payload.tokenBalance
      }
      return newState
    }
    case "TRANSFER.SET_GAS_USED": {
      newState.gas = action.payload.gas
      return newState
    }
    case "TRANSFER.SET_GAS_USED_SNAPSHOT": {
      newState.snapshot.gas = action.payload.gas
      return newState
    }
    case "TRANSFER.FETCH_GAS_SNAPSHOT": {
      newState.snapshot.isFetchingGas = true
      return newState
    }
    case "TRANSFER.FETCH_SNAPSHOT_GAS_SUCCESS": {
      newState.snapshot.isFetchingGas = false
      return newState
    }
    case "TRANSFER.SET_GAS_PRICE_TRANSFER_COMPLETE": {
      if (!newState.isEditGasPrice) {
        var { safeLowGas, standardGas, fastGas, defaultGas, selectedGas } = action.payload

        var gasPriceSuggest = newState.gasPriceSuggest
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

    case "TRANSFER.SET_SNAPSHOT": {
      var snapshot = action.payload
      newState.snapshot = { ...snapshot }
      return newState
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

    case "GLOBAL.CLEAR_SESSION_FULFILLED": {
      var gasPrice = action.payload
      var resetState = { ...initState }
      resetState.token = newState.token

      // resetState.gasPrice = newState.gasPrice
      resetState.gasPrice = gasPrice
      resetState.selectedGas = newState.selectedGas
      resetState.isEditGasPrice = newState.isEditGasPrice
      resetState.gasPriceSuggest = newState.gasPriceSuggest

      resetState.tokenSymbol = newState.tokenSymbol
      return resetState
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
  }
  return state
}

export default transfer;
