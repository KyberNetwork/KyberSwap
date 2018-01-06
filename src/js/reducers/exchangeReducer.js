import { REHYDRATE } from 'redux-persist/lib/constants'
import constants from "../services/constants"
import { calculateDest, caculateDestAmount, caculateSourceAmount } from "../utils/converter"
//import { randomToken, randomForExchange } from "../utils/random"


const initState = constants.INIT_EXCHANGE_FORM_STATE

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
    case "EXCHANGE.MAKE_NEW_EXCHANGE":{
      var newState = { ...state };
      newState.selected = true;
      newState.sourceAmount = ""
      newState.destAmount = ""
      newState.errors = initState.errors
      //newState.gasPrice = initState.gasPrice
      newState.bcError = ""
      newState.step = initState.step
      newState.offeredRate = newState.minConversionRate
      newState.isEditRate = false
      newState.isEditGasPrice = false
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
      newState.isEditRate = false
      return newState
    }
    case "EXCHANGE.CHECK_SELECT_TOKEN": {
      if (newState.sourceTokenSymbol === newState.destTokenSymbol) {
        newState.errors.selectSameToken = "error.select_same_token"
        newState.errors.selectTokenToken = ''
        return newState
      }
      if ((newState.sourceTokenSymbol !== "ETH") &&
        (newState.destTokenSymbol !== "ETH")) {
        newState.errors.selectSameToken = ''
        newState.errors.selectTokenToken = "error.select_token_token"
        return newState
      }
      newState.errors.selectSameToken = ''
      newState.errors.selectTokenToken = ''
      newState.errors.sourceAmountError = ''
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
    case "EXCHANGE.THROW_RATE_ERROR":{
      newState.errors.rateError = action.payload
      return newState
    }
    case "EXCHANGE.GO_TO_STEP":{
      newState.step = action.payload
      return newState
    }
    case "EXCHANGE.SPECIFY_GAS_PRICE":{
      newState.gasPrice = action.payload
      newState.isEditGasPrice = true
      newState.errors.gasPriceError = ""
      return newState
    }
    case "EXCHANGE.SHOW_ADVANCE":{
      newState.advanced = true
      return newState
    }
    case "EXCHANGE.HIDE_ADVANCE":{
      newState.advanced = false
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
      var rate = action.payload.minConversionRate
      newState.minConversionRate = rate
      if (newState.sourceAmount !== "") {
        newState.minDestAmount = calculateDest(newState.sourceAmount, rate).toString(10)
      }
      //newState.offeredRateBalance = action.payload.reserveBalance
     // newState.offeredRateExpiryBlock = action.payload.expirationBlock
      if(!newState.isEditRate){
        newState.offeredRate = rate
      }
      newState.isSelectToken = false    
      return newState
    case "EXCHANGE.OPEN_PASSPHRASE": {
      newState.passphrase = true
      return newState
    }
    case "EXCHANGE.HIDE_PASSPHRASE": {
      newState.passphrase = false
      newState.errors.passwordError = ""
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
      newState.isConfirming = false
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
      newState.bcError = ""
      newState.step = 3
      newState.broadcasting = true
      newState.balanceData = {
        sourceName: action.payload.balanceData.sourceName,
        sourceDecimal: action.payload.balanceData.sourceDecimal,
        prevSource : action.payload.balanceData.source,
        nextSource: 0,

        destName: action.payload.balanceData.destName,
        destDecimal: action.payload.balanceData.destDecimal,
        prevDest: action.payload.balanceData.dest,
        nextDest: 0
      }
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
    case "EXCHANGE.CACULATE_AMOUNT": {
      if(state.errors.selectSameToken || state.errors.selectTokenToken) return newState
      if(state.inputFocus == "dest"){
        newState.sourceAmount = caculateSourceAmount(state.destAmount, state.offeredRate, 6)
      } else {
        newState.destAmount = caculateDestAmount(state.sourceAmount, state.offeredRate, 6)
      }
      return newState
    }
    case "EXCHANGE.INPUT_CHANGE": {
      let focus = action.payload.focus
      let value = action.payload.value
      if(focus == "source"){
        newState.sourceAmount = value
        newState.errors.sourceAmountError = ""
        if(state.errors.selectSameToken || state.errors.selectTokenToken) return newState
        newState.destAmount = caculateDestAmount(value, state.offeredRate, 6)
      }
      else if(focus == "dest"){
        newState.destAmount = value
        newState.errors.destAmountError = ""
        newState.errors.sourceAmountError = ""
        if(state.errors.selectSameToken || state.errors.selectTokenToken) return newState
        newState.sourceAmount = caculateSourceAmount(value, state.offeredRate, 6)
      }
      return newState
    }
    case "EXCHANGE.FOCUS_INPUT": {
      newState.inputFocus = action.payload
      return newState
    }
    case "EXCHANGE.UPDATE_CURRENT_BALANCE":{
      newState.balanceData.nextSource = action.payload.sourceBalance 
      newState.balanceData.nextDest = action.payload.destBalance
      return newState
    }
    case "EXCHANGE.SET_TERM_AND_SERVICES":{
      newState.termAgree = action.payload.value
      return newState
    }
    case "EXCHANGE.SET_OFFERED_RATE":{
      newState.offeredRate = action.payload.value
      newState.errors.rateError = ''
      newState.isEditRate = true
      return newState
    }
    case "EXCHANGE.RESET_OFFERED_RATE":{
      newState.offeredRate = newState.minConversionRate
      newState.isEditRate = false
      newState.errors.rateError = ''
      return newState
    }
    case "EXCHANGE.SET_ESTIMATE_GAS_USED":{
      newState.gas_estimate = action.payload.estimatedGas
      return newState
    }
    case "EXCHANGE.SET_PREV_SOURCE":{
      newState.prevAmount = action.payload.value
      return newState
    }
    case "EXCHANGE.SWAP_TOKEN":{
      var tempSourceToken = newState.sourceToken
      var tempSourceTokenSymbol = newState.sourceTokenSymbol
      newState.sourceToken = newState.destToken
      newState.sourceTokenSymbol = newState.destTokenSymbol
      newState.destToken = tempSourceToken
      newState.destTokenSymbol = tempSourceTokenSymbol
      newState.sourceAmount = ""
      newState.destAmount = 0
      newState.isSelectToken = true
      return newState
    }
    case "EXCHANGE.SET_CAP_EXCHANGE":{
      newState.maxCap = action.payload.maxCap
      return newState
    }
    case "EXCHANGE.TOGGLE_CONFIG":{
      newState.isOpenTxConfig = !newState.isOpenTxConfig
      return newState
    }
    case "GLOBAL.SET_GAS_PRICE_COMPLETE":{
      if(!newState.isEditGasPrice){
        if (action.payload > newState.maxGasPrice){
          newState.gasPrice = newState.maxGasPrice
        }else{
          newState.gasPrice = action.payload
        }
      }
      return newState
    }    
  }
  return state
}

export default exchange;
