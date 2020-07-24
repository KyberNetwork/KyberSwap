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
import { calculateExpectedRateWithFee, calculateSrcAmountWithFee } from "../utils/converter";
import { fetchPlatformFee } from "../services/kyberSwapService";
import { calculateFeeByWalletId } from "../utils/common";

function* selectToken(action) {
  const state = store.getState();
  const translate = getTranslate(state.locale);
  const { sourceTokenSymbol, destTokenSymbol } = action.payload;

  yield put(actions.estimateGasNormal(false))

  if (sourceTokenSymbol === destTokenSymbol) {
    yield put(actions.throwErrorSourceAmount(constants.EXCHANGE_CONFIG.sourceErrors.sameToken, translate("error.select_same_token")))
    return;
  }

  yield put(actions.clearErrorSourceAmount(constants.EXCHANGE_CONFIG.sourceErrors.sameToken));
}

function* updateRatePending(action) {
  var { ethereum, sourceTokenSymbol, sourceToken, destTokenSymbol, destToken, sourceAmount, isManual, refetchSourceAmount } = action.payload;
  const state = store.getState();
  const translate = getTranslate(state.locale);
  const tokens = state.tokens.tokens;
  const srcTokenDecimal = tokens[sourceTokenSymbol].decimals;
  const destTokenDecimal = tokens[destTokenSymbol].decimals;
  const destAmount = state.exchange.destAmount;
  const srcTokenAddress = tokens[sourceTokenSymbol].address;
  const destTokenAddress = tokens[destTokenSymbol].address;

  yield put(globalActions.updateTitleWithRate())

  let platformFee = yield call(fetchPlatformFee, sourceToken, destToken);
  platformFee = calculateFeeByWalletId(platformFee, state.account.type);
  yield put(actions.setPlatformFee(platformFee))

  if (refetchSourceAmount) {
    try {
      sourceAmount = yield call([ethereum, ethereum.call], "getSourceAmount", srcTokenAddress, destTokenAddress, destAmount);
      sourceAmount = calculateSrcAmountWithFee(sourceAmount, platformFee);
    } catch (err) {
      console.log(err);
    }
  }

  try {
    const isProceeding = !!state.exchange.exchangePath.length;
    const { rate, rateZero } = yield call(common.getExpectedRateAndZeroRate, isProceeding, ethereum, tokens, sourceToken, destToken, sourceAmount, sourceTokenSymbol, destTokenSymbol);

    let { expectedPrice, slippagePrice } = rate;

    expectedPrice = calculateExpectedRateWithFee(expectedPrice, platformFee);

    let percentChange = 0
    const expectedRateInit = rateZero.expectedPrice;
    const noExpectedRateInit = expectedRateInit === "0" || expectedRateInit === 0 || expectedRateInit === undefined || expectedRateInit === null;
    let refPrice = expectedRateInit;
    let isRefPriceFromChainLink = false;

    if (noExpectedRateInit) {
      refPrice = 0;
    } else if (+rateZero.refExpectedPrice) {
      refPrice = rateZero.refExpectedPrice;
      isRefPriceFromChainLink = true;
    }

    if (refPrice != 0 && +sourceAmount) {
      percentChange = (refPrice - expectedPrice) / refPrice;
      percentChange = Math.round(percentChange * 1000) / 10;

      if (percentChange < BLOCKCHAIN_INFO.highSlippage) {
        percentChange = 0
      }

      if (percentChange >= 100) {
        percentChange = 0
        expectedPrice = 0
        slippagePrice = 0
      }
    }

    if (expectedPrice == "0") {
      if (noExpectedRateInit) {
        yield put(actions.throwErrorSourceAmount(constants.EXCHANGE_CONFIG.sourceErrors.rate, translate("error.kyber_maintain")))
      } else {
        yield put(actions.throwErrorSourceAmount(constants.EXCHANGE_CONFIG.sourceErrors.rate, translate("error.handle_amount")))
      }
    } else {
      yield put(actions.clearErrorSourceAmount(constants.EXCHANGE_CONFIG.sourceErrors.rate))
    }

    const calculatedSrcAmount = refetchSourceAmount ? converter.caculateSourceAmount(destAmount, expectedPrice, srcTokenDecimal) : state.exchange.sourceAmount;

    yield put(actions.estimateGasNormal(calculatedSrcAmount));
    yield put(actions.updateRateExchangeComplete(refPrice, expectedPrice, slippagePrice, isManual, percentChange, srcTokenDecimal, destTokenDecimal, isRefPriceFromChainLink))
    yield put(globalActions.updateTitleWithRate())
  } catch(err) {
    console.log(err)
    if(isManual){      
      yield put(utilActions.openInfoModal(translate("error.error_occurred") || "Error occurred",
      translate("error.node_error") || "There are some problems with nodes. Please try again in a while."))
    }
  }
}

function* fetchGas() {
  var state = store.getState()
  var exchange = state.exchange
  var gas = exchange.max_gas;
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
  var gas = exchange.max_gas;
  var gas_approve 

  if(sourceTokenSymbol === "ETH"){
    gas_approve = 0
  }else{
    gas_approve = yield call(getMaxGasApprove)
  }

  yield put(actions.setEstimateGas(gas, gas_approve))
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

function* checkKyberEnable(action) {
  const {ethereum} = action.payload
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
  var rateSourceToEth = 0
  if (tokens[sourceTokenSymbol]) {
    sourceBalance = tokens[sourceTokenSymbol].balance
    sourceDecimal = tokens[sourceTokenSymbol].decimals
    rateSourceToEth = tokens[sourceTokenSymbol].rate
  }
  const rate = sourceTokenSymbol === 'ETH' ? expectedRate : rateSourceToEth;
  
  var destTokenSymbol = exchange.destTokenSymbol
  var destDecimal = 18
  if (tokens[destTokenSymbol]) {
    destDecimal = tokens[destTokenSymbol].decimals
  }

  var sourceAmount = exchange.sourceAmount
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
    sourceAmount, exchange.gas, exchange.gasPrice)

  if (validateWithFee) {
    yield put(actions.throwErrorSourceAmount(constants.EXCHANGE_CONFIG.sourceErrors.balance, translate("error.eth_balance_not_enough_for_fee")))
  } else {
    yield put(actions.clearErrorSourceAmount(constants.EXCHANGE_CONFIG.sourceErrors.balance))
  }
}

function* doAfterAccountImported(action){
  var { account } = action.payload
  
  if (account.type === "promo"){
    var state = store.getState()
    var ethereum = state.connection.ethereum
    var exchange = state.exchange
    var tokens = state.tokens.tokens
    var promoToken = BLOCKCHAIN_INFO.promo_token

    if (promoToken && tokens[promoToken]){
      var promoAddr = tokens[promoToken].address
      var promoDecimal = tokens[promoToken].decimals
      var destTokenSymbol = exchange.destTokenSymbol
      
      if (account.info.destToken && tokens[account.info.destToken.toUpperCase()]){
        destTokenSymbol = account.info.destToken.toUpperCase()
      }
      
      var destAddress = tokens[destTokenSymbol].address
      var path = constants.BASE_HOST + "/swap/" + promoToken.toLowerCase() + "-" + destTokenSymbol.toLowerCase()
      
      path = commonUtils.getPath(path, constants.LIST_PARAMS_SUPPORTED)
      
      if (window.kyberBus) {
        window.kyberBus.broadcast('go.to.swap')
      }
      
      yield put(globalActions.goToRoute(path))
      yield put(actions.selectToken(promoToken, promoAddr,destTokenSymbol, destAddress, "promo"))

      try {
        var balanceSource = yield call([ethereum, ethereum.call], "getBalanceToken", account.address, promoAddr)
        var balance = converter.toT(balanceSource, promoDecimal)
        yield put(actions.inputChange('source', balance, promoDecimal, destTokenSymbol))
        yield put(actions.focusInput('source'));
      } catch(e) {
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

function* fetchMaxGasPrice(action) {
  const ethereum = action.payload;
  
  try {
    const maxGasPrice = yield call([ethereum, ethereum.call], "getMaxGasPrice");
    const maxGasPriceGwei = converter.weiToGwei(maxGasPrice);
  
    yield put(actions.setMaxGasPriceComplete(maxGasPriceGwei));
  } catch(err) {
    console.log(err)
  }
}

export function* watchExchange() {
  yield takeEvery("EXCHANGE.UPDATE_RATE_PENDING", updateRatePending)
  yield takeEvery("EXCHANGE.ESTIMATE_GAS_USED", fetchGas)
  yield takeEvery("EXCHANGE.SELECT_TOKEN", selectToken)
  yield takeEvery("EXCHANGE.CHECK_KYBER_ENABLE", checkKyberEnable)
  yield takeEvery("EXCHANGE.VERIFY_EXCHANGE", verifyExchange)
  yield takeEvery("EXCHANGE.ESTIMATE_GAS_USED_NORMAL", estimateGasNormal)
  yield takeEvery("EXCHANGE.FETCH_MAX_GAS_PRICE", fetchMaxGasPrice)
  yield takeEvery("ACCOUNT.IMPORT_NEW_ACCOUNT_FULFILLED", doAfterAccountImported)
}
