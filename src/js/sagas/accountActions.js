import { take, put, call, fork, takeEvery, cancel } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import * as actions from '../actions/accountActions'
import { clearSession, setGasPrice, setBalanceToken, closeChangeWallet } from "../actions/globalActions"
import { getPendingBalancesComplete } from "../actions/limitOrderActions"
import * as utilActions from '../actions/utilActions'
import * as common from "./common"
import * as service from "../services/accounts"
import constants from "../services/constants"
import { findNetworkName } from "../utils/converter"
import { getTranslate } from 'react-localize-redux'
import { store } from '../store';
import {getWallet} from "../services/keys"

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
  const { address, type, keystring, ethereum, tokens, metamask, walletType, walletName, info } = action.payload
  const global = store.getState().global;
  var translate = getTranslate(store.getState().locale)
  var isChangingWallet = global.isChangingWallet
  try {
    var  account
    var accountRequest = yield call(createNewAccount, address, type, keystring, ethereum, walletType, info)

    if (accountRequest.status === "timeout") {
      console.log("timeout")
      let translate = getTranslate(store.getState().locale)
      yield put(actions.closeImportLoading())
      yield put(utilActions.openInfoModal(translate("error.error_occurred") || "Error occurred", 
                                          translate("error.node_error") || "There are some problems with nodes. Please try again in a while."))
      return
    }
    if (accountRequest.status === "fail") {
      let translate = getTranslate(store.getState().locale)
      yield put(actions.closeImportLoading())
      yield put(utilActions.openInfoModal(translate("error.error_occurred") || "Error occurred", 
                                          translate("error.network_error") || "Cannot connect to node right now. Please check your network!"))
      return
    }

    if (accountRequest.status === "success") {
      account = accountRequest.data
    }    

    var newTokens = {}
    Object.values(tokens).map(token => {
      var token = { ...token }
      newTokens[token.symbol] = token
    })

    yield put(setGasPrice());
    yield put(actions.closeImportLoading())

    var wallet = getWallet(account.type)

    yield put(actions.importNewAccountComplete(account, wallet, walletName))

    if (isChangingWallet) yield put(closeChangeWallet())

    global.analytics.callTrack("loginWallet", type)

    var newTokens = {}
    Object.values(tokens).map(token => {
      var token = { ...token }
      newTokens[token.symbol] = token
    })

    console.log(address)
    const balanceTokens = yield call([ethereum, ethereum.call], "getAllBalancesTokenAtLatestBlock", address, tokens)
    var mapBalance = {}

    balanceTokens.map(token => {
      mapBalance[token.symbol] = token.balance
    })

    yield put(setBalanceToken(balanceTokens))

    if (window.kyberBus) { window.kyberBus.broadcast('wallet.import', address); }


    if (wallet.getDisconnected){
      const subcribeClearSessionTask = yield fork(subcribeWalletDisconnect, wallet)
      yield take('GLOBAL.CLEAR_SESSION')
      yield cancel(subcribeClearSessionTask)
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
  return
}

export function* importMetamask(action) {
  const { web3Service, networkId, ethereum, tokens, translate, walletType } = action.payload
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
      tokens,
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


export function* watchAccount() {
  yield takeEvery("ACCOUNT.UPDATE_ACCOUNT_PENDING", updateAccount)
  yield takeEvery("ACCOUNT.IMPORT_NEW_ACCOUNT_PENDING", importNewAccount)
  yield takeEvery("ACCOUNT.IMPORT_ACCOUNT_METAMASK", importMetamask)
  yield takeEvery("ACCOUNT.UPDATE_TOKEN_BALANCE", updateTokenBalance)
}
