import { take, put, call, fork, select, takeEvery, all } from 'redux-saga/effects'
import * as actions from '../actions/globalActions'
import * as actionsExchange from '../actions/exchangeActions'
import * as actionsTransfer from '../actions/transferActions'
import * as actionsLimitOrder from "../actions/limitOrderActions";
import * as actionsUtils from '../actions/utilActions'
import { closeImportLoading } from '../actions/accountActions'
import { Rate } from "../services/rate"
import { push } from 'react-router-redux';
import { addTranslationForLanguage, setActiveLanguage, getActiveLanguage } from 'react-localize-redux';
import { getTranslate } from 'react-localize-redux';
import { getLanguage } from "../services/language"
import Language from "../../../lang"
import constants from "../services/constants"
import * as common from "../utils/common";

import * as converter from "../utils/converter"
import { store } from '../store'

export function* getLatestBlock(action) {
  const ethereum = action.payload
  try{
    const block = yield call([ethereum, ethereum.call], "getLatestBlock")
    yield put(actions.updateBlockComplete(block))
  }catch(e){
    console.log(e)
  }
  
}

// export function* updateHistoryExchange(action) {
//   try{
//     const { ethereum, page, itemPerPage, isAutoFetch } = action.payload
//     var latestBlock = yield call([ethereum, ethereum.call], "getLatestBlock")
//     const newLogs = yield call([ethereum, ethereum.call], "getLog")
//     yield put(actions.updateHistory(newLogs, latestBlock, page, isAutoFetch))
//   }catch(e){
//     console.log(e)
//   }
// }

export function* goToRoute(action) {
  yield put(push(action.payload));
}

export function* clearSession(action) {
  yield put(actions.clearSessionComplete(action.payload))
  //yield put(actions.goToRoute(constants.BASE_HOST));
}

export function* updateAllRate(action) {
  var state = store.getState()
  
  var rateUSD = state.tokens.tokens.ETH.rateUSD
  const { ethereum, tokens } = action.payload
  if (!rateUSD) {
    try {
      console.log("run here")
      rateUSD = yield call([ethereum, ethereum.call],"getRateETH")
      yield put(actions.updateAllRateUSDComplete(rateUSD))
      yield put(actions.showBalanceUSD())
    }
    catch(err) {
      console.log(err.message)
      rateUSD = "0"
    }
  }
  try {
    const rates = yield call([ethereum, ethereum.call],"getAllRates", tokens)
    yield put(actions.updateAllRateComplete(rates, rateUSD))
    yield call(updateTitleWithRate);
  }
  catch (err) {
    //get rate from blockchain
    console.log(err.message)
  }
}

export function* updateTitle() {
  try {
    yield call(updateTitleWithRate);
  } catch (err) {
    console.log(err);
  }
}

function updateTitleWithRate() {
  const state = store.getState();
  let title = state.global.documentTitle;
  const { pathname } = window.location;

  if (common.isAtSwapPage(pathname)) {
    let { sourceTokenSymbol, destTokenSymbol } = common.getTokenPairFromRoute(pathname);
    sourceTokenSymbol = sourceTokenSymbol.toUpperCase();
    destTokenSymbol = destTokenSymbol.toUpperCase();

    if (sourceTokenSymbol !== destTokenSymbol) {
      if (sourceTokenSymbol === "ETH") {
        // 1 token = 1 / rateEth (Eth)
        const rateEth = converter.convertBuyRate(state.tokens.tokens[destTokenSymbol].rateEth);
        if (rateEth != 0) {
          title = `${converter.roundingNumber(rateEth)} ${title}`;
        }
      } else {
        // 1 src token = rate src token * rateEth dest token
        const rateSourceToEth = converter.toT(state.tokens.tokens[sourceTokenSymbol].rate);
        const rateEthToDest = converter.toT(state.tokens.tokens[destTokenSymbol].rateEth);
        const rate = rateSourceToEth * rateEthToDest;
        if (rate != 0) {
          title = `${converter.roundingNumber(rate)} ${title}`;
        }
      }
    } 
  }

  document.title = title;
}

export function* updateRateUSD(action) {
  const { ethereum } = action.payload
  try {
    const rateETHUSD = yield call([ethereum, ethereum.call],"getRateETH")
    yield put(actions.updateAllRateUSDComplete(rateETHUSD))
    yield put(actions.showBalanceUSD())     
  }
  catch (err) {
    yield put(actions.updateAllRateUSDComplete(0))
    yield put(actions.hideBalanceUSD())
  }
}



export function* checkConnection(action) {
  var { ethereum, count, maxCount, isCheck } = action.payload
  try {
    const isConnected = yield call([ethereum, ethereum.call], "isConnectNode")
    if (isConnected){
      yield put(actions.setNetworkError(""))
      yield put(actions.updateCountConnection(0))
    }
    // if (!isCheck) {
    //   yield put(actions.updateIsCheck(true))
    //   yield put(actions.updateCountConnection(0))
    // }
  }catch(err){
    console.log(err)
    //if (isCheck) {
      // if (count > maxCount) {
      //   yield put(actions.updateIsCheck(false))
      //   yield put(actions.updateCountConnection(0))
      //   return
      // }
      if (count >= maxCount) {
        let translate = getTranslate(store.getState().locale)
        yield put(actions.setNetworkError(translate('error.network_error') || 'Cannot connect to node right now. Please check your network!'))

        // let titleModal = translate('error.error_occurred') || 'Error occurred'
        // let contentModal = translate('error.network_error') || 'Cannot connect to node right now. Please check your network!'
        // yield put(actionsUtils.openInfoModal(titleModal, contentModal))
        // yield put(closeImportLoading())
        yield put(actions.updateCountConnection(++count))
        return
      }
      if (count < maxCount) {
        yield put(actions.updateCountConnection(++count))
        return
      }
    //}
  }
}


// export function* setMaxGasPrice(action) {
//   var state = store.getState()
//   var ethereum = state.connection.ethereum
//   try {
//     const maxGasPrice = yield call([ethereum, ethereum.call], "getMaxGasPrice")
//     var maxGasPriceGwei = converter.weiToGwei(maxGasPrice)
//     yield put(actionsExchange.setMaxGasPriceComplete(maxGasPriceGwei))
//   } catch (err) {
//     console.log(err)
//   }
// }

// export function* getMaxGasPrice(action){
//   var state = store.getState()
//   var ethereum = state.connection.ethereum
//   try {
//     const maxGasPrice = yield call([ethereum, ethereum.call], "getMaxGasPrice")
//     var maxGasPriceGwei = converter.weiToGwei(maxGasPrice)
//     return maxGasPriceGwei
//   } catch (err) {
//     console.log(err)
//     return 50
//   }
// }


export function* setGasPrice(action) {
  var safeLowGas, standardGas, fastGas, defaultGas, superFastGas
  var state = store.getState();
  var ethereum = state.connection.ethereum;
  var accountType = state.account.account.type;

  var maxGasPrice = state.exchange.maxGasPrice

  try {
    const gasPrice = yield call([ethereum, ethereum.call], "getGasPrice")

    safeLowGas = gasPrice.low
    standardGas = gasPrice.standard
    defaultGas = gasPrice.default
    fastGas = gasPrice.fast
    superFastGas = 2 * fastGas;
    
    var selectedGas = 's'
    var fastGasFloat = parseFloat(fastGas)

    if (fastGasFloat <= 20){
      defaultGas = gasPrice.fast
      selectedGas = 'f'
    }

    if (fastGasFloat <= 10) {
      superFastGas = 20;
    }

    // yield put(actionsTransfer.setGasPriceTransferComplete(safeLowGas, standardGas, fastGas, superFastGas, defaultGas, selectedGas))

    // var gasExchange = getGasExchange(safeLowGas, standardGas, fastGas, superFastGas, defaultGas, maxGasPrice)
    // yield put(actionsExchange.setGasPriceSwapComplete(gasExchange.safeLowGas, gasExchange.standardGas, gasExchange.fastGas, gasExchange.superFastGas, gasExchange.defaultGas, selectedGas))

    yield put(actions.setGasPriceComplete(safeLowGas, standardGas, fastGas, superFastGas, defaultGas, selectedGas));

    // yield put(actionsLimitOrder.setGasPriceLimitOrderComplete(safeLowGas, standardGas, fastGas, defaultGas, selectedGas));
  }catch (err) {
    console.log(err.message)
  }
}



export function* changelanguage(action) {
  const { ethereum, lang, locale } = action.payload

  if (Language.supportLanguage.indexOf(lang) < 0) return
  try {
    var activeLang = lang
    if (!Language.loadAll && lang !== Language.defaultLanguage) {
      activeLang = lang == Language.defaultLanguage ? Language.defaultLanguage : Language.defaultAndActive[1]
      if (!locale || locale.translations["pack"][1] !== lang) {
        var languagePack = yield call(ethereum.call,"getLanguagePack", lang)
        if (!languagePack) return;

        yield put.resolve(addTranslationForLanguage(languagePack, activeLang))
      }
    }
    yield put(setActiveLanguage(activeLang))
  } catch (err) {
    console.log(err)
  }
}

export function* watchGlobal() {
  yield takeEvery("GLOBAL.NEW_BLOCK_INCLUDED_PENDING", getLatestBlock)

  yield takeEvery("GLOBAL.GO_TO_ROUTE", goToRoute)
  yield takeEvery("GLOBAL.CLEAR_SESSION", clearSession)

  //yield takeEvery("GLOBAL.UPDATE_HISTORY_EXCHANGE", updateHistoryExchange)
  yield takeEvery("GLOBAL.CHANGE_LANGUAGE", changelanguage)
  yield takeEvery("GLOBAL.CHECK_CONNECTION", checkConnection)
  yield takeEvery("GLOBAL.SET_GAS_PRICE", setGasPrice)

  yield takeEvery("GLOBAL.RATE_UPDATE_ALL_PENDING", updateAllRate)
  yield takeEvery("GLOBAL.UPDATE_RATE_USD_PENDING", updateRateUSD)


  // yield takeEvery("GLOBAL.SET_MAX_GAS_PRICE", setMaxGasPrice)
  yield takeEvery("GLOBAL.UPDATE_TITLE_WITH_RATE", updateTitle)
}
