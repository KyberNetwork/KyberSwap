import { REHYDRATE } from 'redux-persist/lib/constants'
import constants from "../services/constants"
//import { calculateDest, caculateDestAmount, caculateSourceAmount } from "../utils/converter"
import * as converter from "../utils/converter"
//import { randomToken, randomForExchange } from "../utils/random"
import BLOCKCHAIN_INFO from "../../../env"


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
      //newState.gasPrice = initState.gasPrice
      newState.bcError = ""
      newState.step = initState.step
      newState.minConversionRate = newState.slippageRate

      newState.isEditRate = false
      //newState.isEditGasPrice = false

      newState.isAnalize = false
      newState.isAnalizeComplete = false
      return newState
    }
    case "EXCHANGE.SELECT_TOKEN_ASYNC": {
      newState.isSelectToken = true
      return newState
    }
    case "EXCHANGE.SELECT_TOKEN": {
      if (action.payload.type === "source") {
        newState.sourceTokenSymbol = action.payload.symbol
        newState.sourceToken = action.payload.address

        // if (newState.sourceTokenSymbol === 'ETH') {
        //   if (newState.destTokenSymbol === 'ETH') {
        //     newState.destTokenSymbol = 'KNC'
        //     newState.destToken = BLOCKCHAIN_INFO.tokens['KNC'].address
        //   }
        // } else {
        //   newState.destTokenSymbol = 'ETH'
        //   newState.destToken = BLOCKCHAIN_INFO.tokens['ETH'].address
        // }
      } else if (action.payload.type === "des") {
        newState.destTokenSymbol = action.payload.symbol
        newState.destToken = action.payload.address

        // if (newState.destTokenSymbol === 'ETH') {
        //   if (newState.sourceTokenSymbol === 'ETH') {
        //     newState.sourceTokenSymbol = 'KNC'
        //     newState.sourceToken = BLOCKCHAIN_INFO.tokens['KNC'].address
        //   }
        // } else {
        //   newState.sourceTokenSymbol = 'ETH'
        //   newState.sourceToken = BLOCKCHAIN_INFO.tokens['ETH'].address
        // }
      }

      //reset all error
      for (var key in newState.errors) {
        newState.errors[key] = ""
      }
      
      newState.sourceAmount = ""
      newState.destAmount = 0

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
      // if ((newState.sourceTokenSymbol !== "ETH") &&
      //   (newState.destTokenSymbol !== "ETH")) {
      //   newState.errors.selectSameToken = ''
      //   newState.errors.selectTokenToken = "error.select_token_token"
      //   return newState
      // }
      newState.errors.selectSameToken = ''
      newState.errors.selectTokenToken = ''
      newState.errors.sourceAmountError = ''
      return newState
    }
    case "EXCHANGE.THROW_SOURCE_AMOUNT_ERROR": {
      newState.errors.sourceAmountError = action.payload
      return newState
    }
    case "EXCHANGE.THROW_ETH_BALANCE_ERROR": {
      newState.errors.ethBalanceError = action.payload
      return newState
    }
    case "EXCHANGE.THROW_GAS_PRICE_ERROR": {
      newState.errors.gasPriceError = action.payload
      return newState
    }
    case "EXCHANGE.THROW_RATE_ERROR": {
      newState.errors.rateError = action.payload
      return newState
    }
    case "EXCHANGE.GO_TO_STEP": {
      newState.step = action.payload
      return newState
    }
    case "EXCHANGE.SPECIFY_GAS_PRICE": {
      newState.gasPrice = action.payload
      newState.isEditGasPrice = true
      newState.errors.gasPriceError = ""
      newState.errors.ethBalanceError = ""
      return newState
    }
    case "EXCHANGE.TOGGLE_ADVANCE": {
      newState.advanced = !newState.advanced
      return newState
    }
    case "EXCHANGE.APPROVAL_TX_BROADCAST_REJECTED": {
      newState.broadcasting = false
      newState.bcError = action.payload ? action.payload : ""
      newState.showConfirmApprove = false
      newState.isApproving = false
      return newState
    }
    case "EXCHANGE.SET_SIGN_ERROR": {
      newState.signError = action.payload ? action.payload : ""
      newState.isApproving = false
      newState.isConfirming = false
      return newState
    }
    case "EXCHANGE.RESET_SIGN_ERROR": {
      newState.signError = ''
      return newState
    }
    case "EXCHANGE.SET_BROADCAST_ERROR": {
      newState.broadcasting = false
      if (action.payload){
        newState.broadcastError = action.payload
      }else{
        newState.broadcastError = "Cannot broadcast transaction to blockchain"
      }
      newState.confirmApprove = false
      newState.isApproving = false
      newState.isConfirming = false
      newState.step = 3
      return newState
    }
    case "EXCHANGE.RESET_BROADCAST_ERROR": {
      newState.broadcastError = ''
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
      newState.deviceError = action.payload ? action.payload : ''
      return newState
    }
    case "EXCHANGE.HANDLE_AMOUNT":{
      newState.errors.rateSystem = "error.handle_amount"
      return newState
    }
    case "EXCHANGE.UPDATE_RATE":{
      const { rateInit, expectedPrice, slippagePrice, blockNo ,isManual, isSuccess} = action.payload

     // console.log({rateInit, expectedPrice, slippagePrice, blockNo ,isManual, isSuccess})
      
      if (!isSuccess) {
        newState.errors.rateSystem = "error.get_rate"
      }else{
        if(expectedPrice === "0"){
          if(rateInit === "0" || rateInit === 0 || rateInit === undefined || rateInit === null){
            newState.errors.rateSystem = "error.kyber_maintain"
          }else{
            newState.errors.rateSystem = "error.handle_amount"
          }
        }else{
          newState.errors.rateSystem = ""
        }
      }
    
      var slippageRate = slippagePrice === "0" ? converter.estimateSlippagerate(rateInit, 18) : converter.toT(slippagePrice, 18)
      var expectedRate = expectedPrice === "0" ? rateInit : expectedPrice


    
      newState.slippageRate = slippageRate
      newState.offeredRate = expectedRate
      newState.blockNo = blockNo

      if (newState.sourceAmount !== "") {
        newState.minDestAmount = converter.calculateDest(newState.sourceAmount, expectedRate).toString(10)
      }
      //newState.offeredRateBalance = action.payload.reserveBalance
      // newState.offeredRateExpiryBlock = action.payload.expirationBlock
      if (!newState.isEditRate) {
        newState.minConversionRate = slippageRate
      }
      newState.isSelectToken = false
      return newState
    }
    case "EXCHANGE.UPDATE_RATE_SNAPSHOT_COMPLETE": {
      var { rateInit, expectedPrice, slippagePrice, rateInitSlippage } = action.payload


      var slippageRate = slippagePrice === "0" ? rateInitSlippage : slippagePrice
      var expectedRate = expectedPrice === "0" ? rateInit : expectedPrice

      newState.snapshot.slippageRate = slippagePrice
      newState.snapshot.offeredRate = expectedRate

      if (newState.sourceAmount !== "") {
        newState.snapshot.minDestAmount = converter.calculateDest(newState.snapshot.sourceAmount, expectedRate).toString(10)
      }
      //newState.offeredRateBalance = action.payload.reserveBalance
      // newState.offeredRateExpiryBlock = action.payload.expirationBlock
      if (!newState.isEditRate) {
        newState.snapshot.minConversionRate = slippageRate
      }
      newState.snapshot.isSelectToken = false

      return newState

    }
    // case "EXCHANGE.SET_RATE_ERROR_SYSTEM":{
    //   newState.errors.rateSystem = "Kyber exchange is under maintainance this pair"
    //   return newState
    // }
    // case "EXCHANGE.SET_RATE_ERROR_FAIL":{
    //   newState.errors.rateSystem = "Kyber exchange is under maintainance this pair"
    //   return newState
    // }
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
      newState.isFetchingGas = true
      return newState
    }
    case "EXCHANGE.HIDE_APPROVE": {
      newState.confirmApprove = false
      newState.isApproving = false
      newState.signError = ''
      return newState
    }
    case "EXCHANGE.SHOW_APPROVE": {
      newState.confirmApprove = true
      newState.isFetchingGas = true
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
        sourceSymbol: action.payload.balanceData.sourceSymbol,
      //  prevSource: action.payload.balanceData.source,
        //nextSource: 0,

        destName: action.payload.balanceData.destName,
        destDecimal: action.payload.balanceData.destDecimal,
        destSymbol: action.payload.balanceData.destSymbol,

        sourceAmount: action.payload.balanceData.sourceAmount,
        destAmount: action.payload.balanceData.destAmount,
       // prevDest: action.payload.balanceData.dest,
       // nextDest: 0
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
      if (state.errors.selectSameToken || state.errors.selectTokenToken) return newState
      if (state.inputFocus == "dest") {
        newState.sourceAmount = converter.caculateSourceAmount(state.destAmount, state.offeredRate, 6)
      } else {
        newState.destAmount = converter.caculateDestAmount(state.sourceAmount, state.offeredRate, 6)
      }
      return newState
    }
    case "EXCHANGE.CACULATE_AMOUNT_SNAPSHOT": {
      if (newState.snapshot.errors.selectSameToken || state.snapshot.errors.selectTokenToken) return newState
      if (newState.snapshot.inputFocus == "dest") {
        newState.snapshot.sourceAmount = converter.caculateSourceAmount(state.snapshot.destAmount, state.snapshot.offeredRate, 6)
      } else {
        newState.snapshot.destAmount = converter.caculateDestAmount(state.snapshot.sourceAmount, state.snapshot.offeredRate, 6)
      }
      newState.snapshot.isFetchingRate = false
    //  console.log("***************")
    //  console.log(newState)
      return newState
    }
    case "EXCHANGE.INPUT_CHANGE": {
      let focus = action.payload.focus
      let value = action.payload.value
      if (focus == "source") {
        newState.sourceAmount = value
        newState.errors.sourceAmountError = ""
        newState.errors.ethBalanceError = ""
        if (state.errors.selectSameToken || state.errors.selectTokenToken) return newState
        newState.destAmount = converter.caculateDestAmount(value, state.offeredRate, 6)
      }
      else if (focus == "dest") {
        newState.destAmount = value
        newState.errors.destAmountError = ""
        newState.errors.sourceAmountError = ""
        if (state.errors.selectSameToken || state.errors.selectTokenToken) return newState
        newState.sourceAmount = converter.caculateSourceAmount(value, state.offeredRate, 6)
      }
      return newState
    }
    case "EXCHANGE.FOCUS_INPUT": {
      newState.inputFocus = action.payload
      return newState
    }
    case "EXCHANGE.UPDATE_CURRENT_BALANCE": {
      const {sourceBalance, destBalance, txHash} = action.payload
      if (txHash === newState.txHash) {
        newState.balanceData.nextSource = sourceBalance
        newState.balanceData.nextDest = destBalance
      }
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
    // case "EXCHANGE.ERROR_RATE_ZERO":{
    //   newState.rateEqualZero = true
    //   return newState
    // }
    // case "EXCHANGE.CLEAR_ERROR_RATE_ZERO":{
    //   newState.rateEqualZero = false
    //   newState.errors.rateEqualZero = ""
    //   return newState
    // }
    // case "EXCHANGE.SET_RATE_ERROR_ZERO":{
    //   newState.errors.rateEqualZero = "Cannot get rate from exchange"
    // }
    case "EXCHANGE.RESET_MIN_RATE": {
      newState.minConversionRate = newState.offeredRate
      newState.isEditRate = true
      newState.errors.rateError = ''
      return newState
    }
    case "EXCHANGE.SET_GAS_USED": {
      const {gas, gas_approve} = action.payload      
      newState.gas = gas
      newState.gas_approve = gas_approve
      return newState
    }
    case "EXCHANGE.SET_GAS_USED_SNAPSHOT": {
      const {gas, gas_approve} = action.payload      
      newState.snapshot.gas = gas
      newState.snapshot.gas_approve = gas_approve
      return newState
    }
    case "EXCHANGE.SET_PREV_SOURCE": {
      newState.prevAmount = action.payload.value
      return newState
    }
    case "EXCHANGE.SWAP_TOKEN": {
      var tempSourceToken = newState.sourceToken
      var tempSourceTokenSymbol = newState.sourceTokenSymbol
      newState.sourceToken = newState.destToken
      newState.sourceTokenSymbol = newState.destTokenSymbol
      newState.destToken = tempSourceToken
      newState.destTokenSymbol = tempSourceTokenSymbol
      newState.sourceAmount = ""
      newState.destAmount = 0
      newState.isSelectToken = true
      newState.isEditRate = false

      newState.errors.sourceAmountError = initState.errors.sourceAmountError
      newState.errors.ethBalanceError = initState.errors.ethBalanceError

      return newState
    }
    case "EXCHANGE.SET_CAP_EXCHANGE": {
      newState.maxCap = action.payload.maxCap
      return newState
    }
    case "EXCHANGE.SET_GAS_PRICE_SWAP_COMPLETE": {

      if (!newState.isEditGasPrice) {
        var { safeLowGas, standardGas, fastGas, defaultGas, selectedGas } = action.payload

        var gasPriceSuggest = {...newState.gasPriceSuggest}
        
        gasPriceSuggest.fastGas = Math.round(fastGas * 10)/10
        gasPriceSuggest.standardGas = Math.round(standardGas * 10)/10
        gasPriceSuggest.safeLowGas = Math.round(safeLowGas * 10)/10

        newState.gasPriceSuggest = {...gasPriceSuggest}
        newState.gasPrice = Math.round(defaultGas * 10)/10

        newState.selectedGas = selectedGas
      }
      return newState
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
    case "EXCHANGE.ANALYZE_ERROR": {
      const {txHash} = action.payload
      if (txHash === newState.txHash){
        newState.isAnalize = true
      }
      return newState
    }
    case "EXCHANGE.SET_ANALYZE_ERROR": {
      const { networkIssues, txHash } = action.payload
      if (txHash === newState.txHash){
        newState.analizeError = { ...networkIssues }
        newState.isAnalize = false
        newState.isAnalizeComplete = true
      }
      return newState
    }
    // case "EXCHANGE.FETCH_GAS":{
    //   newState.isFetchingGas = true
    //   return newState
    // }
    // case "EXCHANGE.FETCH_GAS_SUCCESS":{
    //   newState.isFetchingGas = false
    //   return newState
    // }
    case "EXCHANGE.FETCH_GAS_SNAPSHOT":{
      newState.snapshot.isFetchingGas = true
      return newState
    }
    case "EXCHANGE.FETCH_GAS_SUCCESS_SNAPSHOT":{
      newState.snapshot.isFetchingGas = false
      return newState
    }
    case "EXCHANGE.SET_KYBER_ENABLE":{
      newState.kyber_enabled = action.payload
      return newState
    }
    case "EXCHANGE.SET_SNAPSHOT": {
      var snapshot  = action.payload
      newState.snapshot = {...snapshot}
      return newState
    }
    case "EXCHANGE.THROW_NOT_POSSESS_KGT_ERROR": {
      newState.errorNotPossessKgt = action.payload
      return newState
    }
    case "EXCHANGE.SET_EXCHANGE_ENABLE":{
      if(!action.payload){
        newState.errors.exchange_enable = ""
      }else{
        newState.errors.exchange_enable = "error.exchange_enable"
      }
      return newState
    }
    case "EXCHANGE.UPDATE_BALANCE_DATA":{
      const {balanceData, hash} = action.payload
      if (hash === newState.txHash){
        newState.balanceData.sourceAmount = balanceData.srcAmount
        newState.balanceData.destAmount = balanceData.destAmount
      }
      return newState
    }
    case "EXCHANGE.SET_SELECTED_GAS":{
      const {level} = action.payload
      newState.selectedGas = level
      return newState
    }
    case "GLOBAL.CLEAR_SESSION_FULFILLED":{
      var resetState = {...initState}
      resetState.sourceToken = newState.sourceToken
      resetState.sourceTokenSymbol = newState.sourceTokenSymbol
      
      resetState.gasPrice = newState.gasPrice
      resetState.selectedGas = newState.selectedGas
      resetState.isEditGasPrice = newState.isEditGasPrice
      
      resetState.destToken = newState.destToken
      resetState.destTokenSymbol = newState.destTokenSymbol

      return resetState
    }
  }
  return state
}

export default exchange;
