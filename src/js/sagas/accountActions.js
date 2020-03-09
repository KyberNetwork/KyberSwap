import { take, put, call, fork, takeEvery, cancel } from 'redux-saga/effects'
import * as actions from '../actions/accountActions'
import * as globalActions from '../actions/globalActions'
import { clearSession, setGasPrice, setBalanceToken, closeChangeWallet } from "../actions/globalActions"
import { getPendingBalancesComplete } from "../actions/limitOrderActions"
import * as utilActions from '../actions/utilActions'
import * as common from "./common"
import * as service from "../services/accounts"
import constants from "../services/constants"
import { convertToETHBalance, findNetworkName, sumOfTwoNumber } from "../utils/converter"
import { getTranslate } from 'react-localize-redux'
import { store } from '../store';
import { getWallet } from "../services/keys"
import { sortBy } from "underscore";

export function* updateAccount(action) {
  const { account, ethereum } = action.payload
  try {
    const newAccount = yield call(account.sync, ethereum, account)
    yield put(actions.updateAccountComplete(newAccount))
  } catch (err) {
    console.log(err)
  }
}

export function* updateTokenBalance(action) {
  try {
    const { ethereum, address, tokens } = action.payload;
    const latestBlock = yield call([ethereum, ethereum.call], "getLatestBlock");
    const balanceTokens = yield call([ethereum, ethereum.call], "getAllBalancesTokenAtSpecificBlock", address, tokens, latestBlock)
    const limitOrder = store.getState().limitOrder;
    
    yield call(processLimitOrderPendingBalance, ethereum, limitOrder.pendingBalances, limitOrder.pendingTxs, latestBlock);
    yield put(setBalanceToken(balanceTokens))
  }
  catch (err) {
    console.log(err)
  }
}

function* processLimitOrderPendingBalance(ethereum, pendingBalances, pendingTxs, latestBlock) {
  if (ethereum && pendingTxs.length <= 3) {
    let isModified = false;

    for (var i = 0; i < pendingTxs.length; i++) {
      if (pendingTxs.status === 1) continue;

      const isTxMined = yield call(common.checkTxMined, ethereum, pendingTxs[i].tx_hash, latestBlock, constants.LIMIT_ORDER_TOPIC);
      if (isTxMined) {
        pendingTxs[i].status = 1;
        isModified = true;
      }
    }

    if (isModified) {
      yield put(getPendingBalancesComplete(pendingBalances, pendingTxs));
    }
  }
}

function* createNewAccount(address, type, keystring, ethereum, walletType, info){
  try{
    const account = yield call(service.newAccountInstance, address, type, keystring, ethereum, walletType, info)
    return {status: "success", data: account}
  }catch(e){
    console.log(e)
    return {status: "fail"}
  }
}

export function* importNewAccount(action) {
  yield put(actions.importLoading())
  let { address, type, keystring, ethereum, walletType, walletName, info, wallet } = action.payload;
  const state = store.getState();
  const global = state.global;
  const tokens = state.tokens.tokens;
  const translate = getTranslate(state.locale);
  
  try {
    let account;
    const accountRequest = yield call(createNewAccount, address, type, keystring, ethereum, walletType, info);

    if (accountRequest.status === "timeout") {
      yield put(actions.closeImportLoading())
      yield put(utilActions.openInfoModal(
        translate("error.error_occurred") || "Error occurred",
        translate("error.node_error") || "There are some problems with nodes. Please try again in a while.")
      );
      return
    }
    
    if (accountRequest.status === "fail") {
      yield put(actions.closeImportLoading())
      yield put(utilActions.openInfoModal(
        translate("error.error_occurred") || "Error occurred",
        translate("error.network_error") || "Cannot connect to node right now. Please check your network!")
      );
      return
    }

    if (accountRequest.status === "success") {
      account = accountRequest.data
    }

    yield put(setGasPrice());
    yield put(actions.closeImportLoading());

    if (wallet === null) {
      wallet = getWallet(account.type);
    }

    yield put(actions.importNewAccountComplete(account, wallet, walletName));
    yield put(globalActions.checkUserEligible(ethereum));

    if (global.isChangingWallet) yield put(closeChangeWallet());

    global.analytics.callTrack("loginWallet", type);
    
    let supportedTokens = [];
    Object.keys(tokens).forEach((key) => {
      supportedTokens.push(tokens[key])
    });
    const balanceTokens = yield call([ethereum, ethereum.call], "getAllBalancesTokenAtLatestBlock", address, supportedTokens);
    let mapBalance = {};

    balanceTokens.map(token => {
      mapBalance[token.symbol] = token.balance
    });

    yield put(setBalanceToken(balanceTokens));

    if (window.kyberBus) { window.kyberBus.broadcast('wallet.import', address) }
    
    if (wallet.getDisconnected){
      const subcribeClearSessionTask = yield fork(subcribeWalletDisconnect, wallet);
      yield take('GLOBAL.CLEAR_SESSION');
      yield cancel(subcribeClearSessionTask);
    }
  }
  catch (err) {
    console.log(err)
    yield put(actions.throwError(translate("error.network_error") || "Cannot connect to node right now. Please check your network!"))
    yield put(actions.closeImportLoading())
  }
}

function* subcribeWalletDisconnect(wallet){  
  yield call([wallet, wallet.getDisconnected])  
  yield put(clearSession())
}

export function* importMetamask(action) {
  const { web3Service, networkId, ethereum, translate, walletType } = action.payload
  try {
    const currentId = yield call([web3Service, web3Service.getNetworkId])
    if (parseInt(currentId, 10) !== networkId) {
      var currentName = findNetworkName(parseInt(currentId, 10))
      var expectedName = findNetworkName(networkId)
      if (currentName) {
        yield put(actions.throwError(translate("error.network_not_match", { currentName: currentName, expectedName: expectedName }) || "Network is not match"))
        if (walletType !== null && walletType !== "metamask"){
          let title = translate("error.error_occurred") || "Error occurred"
          let content = translate("error.network_not_match", { currentName: currentName, expectedName: expectedName }) || "Network is not match"
          yield put(utilActions.openInfoModal(title, content))
        }
        return
      } else {
        yield put(actions.throwError(translate("error.network_not_match_unknow", { expectedName: expectedName }) || "Network is not match"))
        if (walletType !== null && walletType !== "metamask"){
          let title = translate("error.error_occurred") || "Error occurred"
          let content = translate("error.network_not_match_unknow", { expectedName: expectedName }) || "Network is not match"
          yield put(utilActions.openInfoModal(title, content))
        }
        return
      }
    }

    const address = yield call([web3Service, web3Service.getCoinbase], true)
    yield call([web3Service, web3Service.setDefaultAddress, address])

    const metamask = { web3Service, address, networkId }
    yield put(actions.importNewAccount(
      address,
      "metamask",
      web3Service.getWalletId(),
      ethereum,
      walletType,
      metamask,
      "Metamask"
    ))
  } catch (e) {
    console.log(e)
    yield put(actions.throwError(translate("error.cannot_connect_metamask") || "Cannot get metamask account. You probably did not login in Metamask"))
    if (walletType !== null && walletType !== "metamask"){
      let title = translate("error.error_occurred") || "Error occurred"
      let content = translate("error.cannot_connect_metamask") || "Cannot get metamask account. You probably did not login in Metamask"
      yield put(utilActions.openInfoModal(title, content))
    }
  }
}

export function* setBalanceTokenComplete() {
  const state = store.getState();
  const tokens = state.tokens.tokens;

  let availableTokens = Object.keys(tokens).filter((symbol) => {
    return tokens[symbol].balance != 0;
  }).map(function(symbol) {
    const token = tokens[symbol];
    token.balanceInETH = convertToETHBalance(token.balance, token.decimals, token.symbol, token.rate)
    return token;
  });

  const totalBalanceInETH = availableTokens.reduce((total, token) => {
    return +sumOfTwoNumber(total, token.balanceInETH);
  }, 0);

  availableTokens = sortBy(availableTokens, (token) => -token.balanceInETH);

  yield put(actions.setTotalBalanceAndAvailableTokens(totalBalanceInETH, availableTokens));
}

export function* watchAccount() {
  yield takeEvery("ACCOUNT.UPDATE_ACCOUNT_PENDING", updateAccount)
  yield takeEvery("ACCOUNT.IMPORT_NEW_ACCOUNT_PENDING", importNewAccount)
  yield takeEvery("ACCOUNT.IMPORT_ACCOUNT_METAMASK", importMetamask)
  yield takeEvery("ACCOUNT.UPDATE_TOKEN_BALANCE", updateTokenBalance)
  yield takeEvery("GLOBAL.SET_BALANCE_TOKEN", setBalanceTokenComplete)
}
