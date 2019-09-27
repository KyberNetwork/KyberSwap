import { put, call, takeEvery } from 'redux-saga/effects'
import * as actions from '../actions/exchangeActions'
import * as globalActions from "../actions/globalActions"
import * as common from "./common"
import * as validators from "../utils/validators"
import * as utilActions from '../actions/utilActions'
import constants from "../services/constants"
import * as converter from "../utils/converter"
import { getTranslate } from 'react-localize-redux';
import { store } from '../store'
import BLOCKCHAIN_INFO from "../../../env"
import * as commonUtils from "../utils/common"

function* selectToken(action) {
  const { sourceTokenSymbol, destTokenSymbol } = action.payload

  if (sourceTokenSymbol === destTokenSymbol){
    var state = store.getState()
    var translate = getTranslate(state.locale)
    yield put(actions.throwErrorSourceAmount(constants.EXCHANGE_CONFIG.sourceErrors.sameToken, translate("error.select_same_token")))
  } else {
    yield put(actions.clearErrorSourceAmount(constants.EXCHANGE_CONFIG.sourceErrors.sameToken))
  }
  
  yield call(estimateGasNormal)
}

function* updateRatePending(action) {
  var { ethereum, sourceTokenSymbol, sourceToken, destTokenSymbol, destToken, sourceAmount, isManual, refetchSourceAmount, type } = action.payload;


  const state = store.getState();
  const translate = getTranslate(state.locale);
  const tokens = state.tokens.tokens;
  const srcTokenDecimal = tokens[sourceTokenSymbol].decimals;
  const destTokenDecimal = tokens[destTokenSymbol].decimals;

  if (refetchSourceAmount) {
    try {
      var destAmount = state.exchange.destAmount
     sourceAmount = yield call([ethereum, ethereum.call], "getSourceAmount", sourceTokenSymbol, destTokenSymbol, destAmount);
    } catch (err) {
      console.log(err);
    }
  }

  var sourceAmoutRefined = yield call(common.getSourceAmount, sourceTokenSymbol, sourceAmount)
  var sourceAmoutZero = yield call(common.getSourceAmountZero, sourceTokenSymbol)

  try{
    var lastestBlock = yield call([ethereum, ethereum.call], "getLatestBlock")
    var rate = yield call([ethereum, ethereum.call], "getRateAtSpecificBlock", sourceToken, destToken, sourceAmoutRefined, lastestBlock)
    var rateZero = yield call([ethereum, ethereum.call], "getRateAtSpecificBlock", sourceToken, destToken, sourceAmoutZero, lastestBlock)
    var { expectedPrice, slippagePrice } = rate

    var percentChange = 0
    var expectedRateInit = rateZero.expectedPrice
    if(expectedRateInit != 0){
      percentChange = (expectedRateInit - expectedPrice) / expectedRateInit
      percentChange = Math.round(percentChange * 1000) / 10    
      if(percentChange <= 0.1) {
        percentChange = 0
      }
      if(percentChange >= 100){
        percentChange = 0
        expectedPrice = 0
        slippagePrice = 0
      }
    }    

    if (expectedPrice == "0") {
      if (expectedRateInit == "0" || expectedRateInit == 0 || expectedRateInit === undefined || expectedRateInit === null) {
        yield put(actions.throwErrorSourceAmount(constants.EXCHANGE_CONFIG.sourceErrors.rate, translate("error.kyber_maintain")))
      } else {
        yield put(actions.throwErrorSourceAmount(constants.EXCHANGE_CONFIG.sourceErrors.rate, translate("error.handle_amount")))
      }
    } else {
      yield put(actions.clearErrorSourceAmount(constants.EXCHANGE_CONFIG.sourceErrors.rate))
    }

    yield put(actions.updateRateExchangeComplete(expectedRateInit, expectedPrice, slippagePrice, lastestBlock, isManual, percentChange, srcTokenDecimal, destTokenDecimal))

  }catch(err){
    console.log(err)
    if(isManual){      
      yield put(utilActions.openInfoModal(translate("error.error_occurred") || "Error occurred",
      translate("error.node_error") || "There are some problems with nodes. Please try again in a while."))
      return
    }
  }
}

function* fetchGas() {
  // yield call(estimateGas)
  var state = store.getState()
  var exchange = state.exchange
  var gas = yield call(getMaxGasExchange)
  var gasApprove = 0
  if (exchange.sourceTokenSymbol !== "ETH"){
    gasApprove = yield call(getMaxGasApprove)
    gasApprove = gasApprove * 2
  }
  yield put(actions.setEstimateGas(gas, gasApprove))
}

function* estimateGasNormal() {
  var state = store.getState()
  const exchange = state.exchange

  const sourceTokenSymbol = exchange.sourceTokenSymbol
  var gas = yield call(getMaxGasExchange)
  var gas_approve 

  if(sourceTokenSymbol === "ETH"){
    gas_approve = 0
  }else{
    gas_approve = yield call(getMaxGasApprove)
  }

  yield put(actions.setEstimateGas(gas, gas_approve))
}

function* estimateGas() {
  var gasRequest = yield call(common.handleRequest, getGasUsed)
  if (gasRequest.status === "success") {
    const { gas, gas_approve } = gasRequest.data
    yield put(actions.setEstimateGas(gas, gas_approve))
  }
  if ((gasRequest.status === "timeout") || (gasRequest.status === "fail")) {
    console.log("timeout")
    yield call(estimateGasNormal)
  }
}


function* getMaxGasExchange() {
  var state = store.getState()
  const exchange = state.exchange
  const tokens = state.tokens.tokens

  var sourceTokenLimit = tokens[exchange.sourceTokenSymbol] ? tokens[exchange.sourceTokenSymbol].gasLimit : 0
  var destTokenLimit = tokens[exchange.destTokenSymbol] ? tokens[exchange.destTokenSymbol].gasLimit : 0

  var sourceGasLimit = sourceTokenLimit ? parseInt(sourceTokenLimit) : exchange.max_gas
  var destGasLimit = destTokenLimit ? parseInt(destTokenLimit) : exchange.max_gas

  return sourceGasLimit + destGasLimit

}

function* getMaxGasApprove() {
  var state = store.getState()
  var tokens = state.tokens.tokens
  const exchange = state.exchange
  var sourceSymbol = exchange.sourceTokenSymbol
  if (tokens[sourceSymbol] && tokens[sourceSymbol].gasApprove) {
    return tokens[sourceSymbol].gasApprove
  } else {
    return exchange.max_gas_approve
  }
}

function* getGasUsed() {
  var state = store.getState()
  const ethereum = state.connection.ethereum
  const exchange = state.exchange
  const kyber_address = BLOCKCHAIN_INFO.network


  const maxGas = yield call(getMaxGasExchange)

  const maxGasApprove = yield call(getMaxGasApprove)
  var gas = maxGas
  var gas_approve = 0

  var account = state.account.account
  var address = account.address

  var tokens = state.tokens.tokens
  var sourceDecimal = 18
  var sourceTokenSymbol = exchange.sourceTokenSymbol
  var destTokenSymbol = exchange.destTokenSymbol

  var specialList = ["DAI", "TUSD"]
  if(specialList.indexOf(sourceTokenSymbol) !== -1 || specialList.indexOf(destTokenSymbol) !== -1){
    return { status: "success", res: { gas: maxGas, gas_approve: maxGasApprove } }
  }
  

  if (tokens[sourceTokenSymbol]) {
    sourceDecimal = tokens[sourceTokenSymbol].decimals
  }
  try {
    const sourceToken = exchange.sourceToken
    const sourceAmount = converter.stringToHex(exchange.sourceAmount, sourceDecimal)
    const destToken = exchange.destToken
    const maxDestAmount = converter.biggestNumber()
    const minConversionRate = converter.numberToHex(converter.toTWei(exchange.slippageRate, 18))
    const blockNo = converter.numberToHexAddress(exchange.blockNo)
    //const throwOnFailure = "0x0000000000000000000000000000000000000000"
    var data = yield call([ethereum, ethereum.call], "exchangeData", sourceToken, sourceAmount,
      destToken, address,
      maxDestAmount, minConversionRate, blockNo)
    var value = '0'
    if (exchange.sourceTokenSymbol === 'ETH') {
      value = sourceAmount
    } else {
      //calculate gas approve
      const remainStr = yield call([ethereum, ethereum.call], "getAllowanceAtLatestBlock", sourceToken, address)
      const remain = converter.hexToBigNumber(remainStr)
      const sourceAmountBig = converter.hexToBigNumber(sourceAmount)
      if (!remain.isGreaterThanOrEqualTo(sourceAmountBig)) {
        //calcualte gas approve
        var dataApprove = yield call([ethereum, ethereum.call], "approveTokenData", sourceToken, converter.biggestNumber())
        var txObjApprove = {
          from: address,
          to: sourceToken,
          data: dataApprove,
          value: '0x0',
        }
        gas_approve = yield call([ethereum, ethereum.call], "estimateGas", txObjApprove)
        gas_approve = Math.round(gas_approve * 120 / 100)
        if (gas_approve > maxGasApprove) {
          gas_approve = maxGasApprove
        }
      } else {
        gas_approve = 0
      }
    }
    var txObj = {
      from: address,
      to: kyber_address,
      data: data,
      value: value
    }

    gas = yield call([ethereum, ethereum.call], "estimateGas", txObj)
    gas = Math.round(gas * 120 / 100) + 100000
    //console.log("gas ne: " + gas)
    if (gas > maxGas) {
      gas = maxGas
    }

    return { status: "success", res: { gas, gas_approve } }
  } catch (e) {
    console.log("Cannot estimate gas")
    console.log(e)
    return { status: "fail", err: e }
  }
 
}

function* checkKyberEnable(action) {
  const {ethereum} = action.payload
  var state = store.getState()
  try {
    var enabled = yield call([ethereum, ethereum.call], "checkKyberEnable")
    if (enabled){
      yield put(actions.clearErrorSourceAmount(constants.EXCHANGE_CONFIG.sourceErrors.kyberEnable))
    }else{
      yield put(actions.throwErrorSourceAmount(constants.EXCHANGE_CONFIG.sourceErrors.kyberEnable, "Kyber is not enabled at the momment. Please try again for a while"))
    }
  } catch (e) {
    console.log(e.message)
    yield put(actions.clearErrorSourceAmount(constants.EXCHANGE_CONFIG.sourceErrors.kyberEnable))
  }

}

function* verifyExchange() {
  var state = store.getState()
  var translate = getTranslate(state.locale)
  const exchange = state.exchange
  const expectedRate = state.exchange.expectedRate
  var sourceTokenSymbol = exchange.sourceTokenSymbol
  var tokens = state.tokens.tokens
  var sourceBalance = 0
  var sourceDecimal = 18
  var sourceName = "Ether"
  var rateSourceToEth = 0
  if (tokens[sourceTokenSymbol]) {
    sourceBalance = tokens[sourceTokenSymbol].balance
    sourceDecimal = tokens[sourceTokenSymbol].decimals
    sourceName = tokens[sourceTokenSymbol].name
    rateSourceToEth = tokens[sourceTokenSymbol].rate
  }

  var destTokenSymbol = exchange.destTokenSymbol
  var destBalance = 0
  var destDecimal = 18
  var destName = "Kybernetwork"
  if (tokens[destTokenSymbol]) {
    destBalance = tokens[destTokenSymbol].balance
    destDecimal = tokens[destTokenSymbol].decimals
    destName = tokens[destTokenSymbol].name
  }

  var sourceAmount = exchange.sourceAmount

  let rate = rateSourceToEth;
  if (destTokenSymbol === 'ETH') {
    rate = expectedRate;
  }

  if ( sourceAmount === "") {
    return
  }

  if (!state.account.isGetAllBalance){
    return
  }

  var maxCap = state.account.account.maxCap
  var validateAmount = validators.verifyAmount(sourceAmount,
    sourceBalance,
    sourceTokenSymbol,
    sourceDecimal,
    rate,
    destTokenSymbol,
    destDecimal,
    maxCap)

  var isNotNumber = false
  switch (validateAmount) {
    case "not a number":
      yield put(actions.throwErrorSourceAmount(constants.EXCHANGE_CONFIG.sourceErrors.input, translate("error.source_amount_is_not_number")))
      isNotNumber = true
      break
    case "too high":
      yield put(actions.throwErrorSourceAmount(constants.EXCHANGE_CONFIG.sourceErrors.input, translate("error.source_amount_too_high")))
      break
    case "too high cap":
      var maxCap = converter.toEther(maxCap)
      if (sourceTokenSymbol !== "ETH"){
        maxCap = maxCap * constants.EXCHANGE_CONFIG.MAX_CAP_PERCENT
      }
      yield put(actions.throwErrorSourceAmount(constants.EXCHANGE_CONFIG.sourceErrors.input, translate("error.source_amount_too_high_cap", { cap: maxCap })))      
      break
    case "too small":
      yield put(actions.throwErrorSourceAmount(constants.EXCHANGE_CONFIG.sourceErrors.input, translate("error.source_amount_too_small", { minAmount: converter.toEther(constants.EXCHANGE_CONFIG.EPSILON)})))
      break
    case "too high for reserve":
      yield put(actions.throwErrorSourceAmount(constants.EXCHANGE_CONFIG.sourceErrors.input, translate("error.source_amount_too_high_for_reserve")))
      break
  }
  if(!validateAmount){
    yield put(actions.clearErrorSourceAmount(constants.EXCHANGE_CONFIG.sourceErrors.input))
  }

  if (isNaN(sourceAmount) || sourceAmount === "") {
    sourceAmount = 0
  }

  const account = state.account.account
  var validateWithFee = validators.verifyBalanceForTransaction(account.balance, sourceTokenSymbol,
    sourceAmount, exchange.gas + exchange.gas_approve, exchange.gasPrice)

  if (validateWithFee) {
    yield put(actions.throwErrorSourceAmount(constants.EXCHANGE_CONFIG.sourceErrors.balance, translate("error.eth_balance_not_enough_for_fee")))
  } else {
    yield put(actions.clearErrorSourceAmount(constants.EXCHANGE_CONFIG.sourceErrors.balance))
  }
}


export function* fetchUserCap(action) {  
  try{
    var {ethereum} = action.payload
    var state = store.getState()
    var account = state.account.account
    var address = account.address
    var enabled = yield call([ethereum, ethereum.call], "getUserMaxCap", address)
    if (!enabled.error && !enabled.kyced && (enabled.rich === true || enabled.rich === 'true')){
      var translate = getTranslate(state.locale)
      // var kycLink = "/users/sign_up"
      var content = translate("error.exceed_daily_volumn") || "You may want to register with us to have higher trade limits."
      yield put(actions.throwErrorSourceAmount(constants.EXCHANGE_CONFIG.sourceErrors.richGuy, content))
        
    }else{
      yield put(actions.clearErrorSourceAmount(constants.EXCHANGE_CONFIG.sourceErrors.richGuy))
    }
  }catch(e){
    console.log(e)
    yield put(actions.clearErrorSourceAmount(constants.EXCHANGE_CONFIG.sourceErrors.richGuy))
  }
}

export function* doAfterAccountImported(action){
  var {account, walletName} = action.payload
  if (account.type === "promo"){
    var state = store.getState()
    var exchange = state.exchange
    var tokens = state.tokens.tokens
    var ethereum = state.connection.ethereum

    var sourceToken = exchange.sourceTokenSymbol.toLowerCase()
    var promoToken = BLOCKCHAIN_INFO.promo_token

    if (promoToken && tokens[promoToken]){
      var promoAddr = tokens[promoToken].address
      var promoDecimal = tokens[promoToken].decimals

      var destTokenSymbol = exchange.destTokenSymbol
      if (account.info.destToken && tokens[account.info.destToken.toUpperCase()]){
        destTokenSymbol = account.info.destToken.toUpperCase()
      }
      var destAddress = tokens[destTokenSymbol].address
      // sourceToken = promoToken.toLowerCase()
      
      

      var path = constants.BASE_HOST + "/swap/" + promoToken.toLowerCase() + "-" + destTokenSymbol.toLowerCase()
      path = commonUtils.getPath(path, constants.LIST_PARAMS_SUPPORTED)
      if (window.kyberBus){
        window.kyberBus.broadcast('go.to.swap')
      }
      yield put(globalActions.goToRoute(path))

      yield put(actions.selectToken(promoToken, promoAddr,destTokenSymbol, destAddress, "promo"))

      try{
        var balanceSource = yield call([ethereum, ethereum.call], "getBalanceToken", account.address, promoAddr)
        var balance = converter.toT(balanceSource, promoDecimal)
        yield put(actions.inputChange('source', balance, promoDecimal, destTokenSymbol))
        yield put(actions.focusInput('source'));
      }catch(e){
        console.log(e)
      }

      yield put(actions.setGasPriceSuggest({
        ...exchange.gasPriceSuggest,
        fastGas: exchange.gasPriceSuggest.fastGas + 2
      }));

      if (!exchange.isEditGasPrice) {
        yield put(actions.setSelectedGasPrice(exchange.gasPriceSuggest.fastGas + 2, "f"));
      }
    }
  }
}

export function* watchExchange() {
  yield takeEvery("EXCHANGE.UPDATE_RATE_PENDING", updateRatePending)
  yield takeEvery("EXCHANGE.ESTIMATE_GAS_USED", fetchGas)
  yield takeEvery("EXCHANGE.SELECT_TOKEN", selectToken)
  yield takeEvery("EXCHANGE.CHECK_KYBER_ENABLE", checkKyberEnable)
  yield takeEvery("EXCHANGE.VERIFY_EXCHANGE", verifyExchange)
  yield takeEvery("EXCHANGE.FETCH_USER_CAP", fetchUserCap)
  yield takeEvery("EXCHANGE.ESTIMATE_GAS_USED_NORMAL", estimateGasNormal)
  yield takeEvery("EXCHANGE.SWAP_TOKEN", estimateGasNormal)
  yield takeEvery("ACCOUNT.IMPORT_NEW_ACCOUNT_FULFILLED", doAfterAccountImported)
}
