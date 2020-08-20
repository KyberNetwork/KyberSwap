import { put, call, takeEvery } from 'redux-saga/effects'
import * as limitOrderActions from '../actions/limitOrderActions'
import { store } from '../store'
import { getTranslate } from 'react-localize-redux';
import * as common from "./common"
import limitOrderServices from "../services/limit_order"
import {isUserLogin} from "../utils/common"
import * as utilActions from '../actions/utilActions'
import * as constants from "../services/constants"
import { multiplyOfTwoNumber } from "../utils/converter"

function* updateRatePending(action) {
  const { ethereum, sourceTokenSymbol, sourceToken, destTokenSymbol, destToken, isManual, type } = action.payload;

  const state = store.getState();
  const translate = getTranslate(state.locale)
  const tokens = state.tokens.tokens;

  try {
    const baseToQuoteRate = yield call(common.getExpectedRateAndZeroRate, false, ethereum, tokens, sourceToken, destToken, false, sourceTokenSymbol);
    const quoteToBaseRate = yield call(common.getExpectedRateAndZeroRate, false, ethereum, tokens, destToken, sourceToken, false, destTokenSymbol);
    
    const sellRate = baseToQuoteRate.rateZero.expectedPrice;
    const buyRate = quoteToBaseRate.rateZero.expectedPrice;

    yield put.resolve(limitOrderActions.updateRateComplete(buyRate, sellRate, type))
  } catch(err) {
    console.log(err);
    if (isManual) {
      yield put(utilActions.openInfoModal(translate("error.error_occurred") || "Error occurred",
      translate("error.node_error") || "There are some problems with nodes. Please try again in a while."))
    }
  }
}

function* fetchFee(action){
  var { userAddr, src, dest, srcAmount, destAmount } = action.payload
  try{
    var result = yield call(limitOrderServices.getFee, userAddr, src, dest, srcAmount, destAmount);

    const fee = multiplyOfTwoNumber(result.non_discounted_fee, 100);
    const feeAfterDiscount = multiplyOfTwoNumber(result.fee, 100);
    const discountPercentage = result.discount_percent;

    yield put(limitOrderActions.fetchFeeComplete(fee, feeAfterDiscount, discountPercentage))
  }catch(err){
    console.log(err)
    yield put(limitOrderActions.fetchFeeComplete(constants.LIMIT_ORDER_CONFIG.maxFee, constants.LIMIT_ORDER_CONFIG.maxFee, 0, err))
  }

}

function* triggerAfterAccountImport(action){
  const { pathname } = window.location;

  if (pathname.includes(constants.LIMIT_ORDER_CONFIG.path)) {
    const state = store.getState()
    var limitOrder = state.limitOrder
    var account = state.account.account

    if (isUserLogin()){
      yield put(limitOrderActions.fetchFee(account.address, limitOrder.sourceTokenSymbol, limitOrder.destTokenSymbol))    
    }
  }
}

function*  fetchOpenOrderStatus() {
  const state = store.getState()
  var listOrder = state.limitOrder.listOrder
  var idArr = []
  listOrder.map(value => {
    if(value.status === constants.LIMIT_ORDER_CONFIG.status.OPEN || value.status === constants.LIMIT_ORDER_CONFIG.status.IN_PROGRESS){
      idArr.push(value.id)
    }
  })
  try{
    var orders = yield call(limitOrderServices.getOrdersByIdArr, idArr)
    //update order
    for (var j = 0; j <orders.length; j++){
      for (var i = 0; i < listOrder.length; i++){
            if (listOrder[i].id === orders[j].id){
                listOrder[i] = orders[j]
                break
            }
        }
    }
    yield put(limitOrderActions.addListOrder(listOrder))


  }catch(err){
    console.log(err)
  }
}

function* updateFilter({ addressFilter, pairFilter, statusFilter, timeFilter, pageIndex, dateSort, typeFilter }) {
  if (addressFilter) {
    yield put(limitOrderActions.setAddressFilter(addressFilter));
  }
  if (pairFilter) {
    yield put(limitOrderActions.setPairFilter(pairFilter));
  }
  if (statusFilter) {
    yield put(limitOrderActions.setStatusFilter(statusFilter));
  }
  if (timeFilter) {
    yield put(limitOrderActions.setTimeFilter(timeFilter));
  }
  if (pageIndex) {
    yield put(limitOrderActions.setOrderPageIndex(pageIndex));
  }
  if (dateSort) {
    yield put(limitOrderActions.setOrderDateSort(dateSort));
  }
  if (typeFilter){
    yield put(limitOrderActions.setTypeFilter(typeFilter));
  }
}

/**
 * If count < 50, do filter at client side.
 * Otherwise fetch orders by requesting to server.
 * @param {} action
 */
function* getOrdersByFilter(action) {
  yield* updateFilter(action.payload);

  const { limitOrder, tokens } = store.getState();
  try {
    if (limitOrder.filterMode === "client") {
      return;
    }

    // Convert pair token to pair address in order to request
    const pairAddressFilter = limitOrder.pairFilter.map(item => {
      const [sourceTokenSymbol, destTokenSymbol] = item.split("-");
      const sourceToken = tokens.tokens[sourceTokenSymbol].address;
      const destToken = tokens.tokens[destTokenSymbol].address;

      return `${sourceToken}_${destToken}`;
    });

    // Only get open + in_progress orders in open tab,
    // And only get invalidated + filled + cancelled orders in history tab
    const listStatus = limitOrder.activeOrderTab === "open" ?
      [constants.LIMIT_ORDER_CONFIG.status.OPEN, constants.LIMIT_ORDER_CONFIG.status.IN_PROGRESS]
    : [constants.LIMIT_ORDER_CONFIG.status.FILLED, constants.LIMIT_ORDER_CONFIG.status.CANCELLED, constants.LIMIT_ORDER_CONFIG.status.INVALIDATED];

    let statusFilter = listStatus;
    if (limitOrder.statusFilter.length !== 0) {
      statusFilter = listStatus.filter(item => {
        return limitOrder.statusFilter.indexOf(item) !== -1;
      });
    }

    const { orders, itemsCount, pageCount, pageIndex } = yield call(limitOrderServices.getOrdersByFilter, limitOrder.addressFilter, pairAddressFilter, limitOrder.typeFilter, statusFilter, limitOrder.timeFilter, limitOrder.dateSort, limitOrder.pageIndex);

    yield put(limitOrderActions.setOrdersCount(itemsCount));
    yield put(limitOrderActions.addListOrder(orders));
  } catch (err) {
    console.log(err)
  }
}

function* getListFilter() {
  try {
    const { pairs, addresses } = yield call(limitOrderServices.getUserStats);

    yield put(limitOrderActions.getListFilterComplete(pairs, addresses));

  } catch (err) {
    console.log(err);
  }
}

function* fetchPendingBalances(action) {
  const { address } = action.payload;
  const state = store.getState();
  const currentPendingTxs = state.limitOrder.pendingTxs;

  try {
    const result = yield call(limitOrderServices.getPendingBalances, address);

    const newPendingBalances = result.data;
    const newPendingTxs = result.pending_txs;
    const { pendingBalances, pendingTxs } = validatePendingBalances(currentPendingTxs, newPendingBalances, newPendingTxs);

    yield put(limitOrderActions.getPendingBalancesComplete(pendingBalances, pendingTxs));
  } catch (err) {
    console.log(err);
  }
}

function validatePendingBalances(currentPendingTxs, newPendingBalances, newPendingTxs) {
  let pendingTxs = [];

  newPendingTxs.forEach(newPendingTx => {
    const existingTx = currentPendingTxs.find((currentPendingTx) => {
      return currentPendingTx.tx_hash === newPendingTx.tx_hash;
    });

    if (!existingTx || !existingTx.status) {
      newPendingTx.status = 0;
      pendingTxs.push(newPendingTx);
    } else if (existingTx.status === 1) {
      newPendingTx.status = 1;
      pendingTxs.push(newPendingTx);
    }
  });

  return { pendingBalances: newPendingBalances, pendingTxs };
}

function* changeOrderTab(action) {
  const { tab } = action.payload;

  yield put(limitOrderActions.changeOrderTabComplete(tab));
  
  yield put(limitOrderActions.getOrdersByFilter({
    statusFilter: [],
    addressFilter: [],
    pairFilter: [],
    pageIndex: 1
  }));
}

export function* watchLimitOrder() {
    yield takeEvery("LIMIT_ORDER.UPDATE_RATE_PENDING", updateRatePending);
    yield takeEvery("LIMIT_ORDER.FETCH_FEE", fetchFee);
    yield takeEvery("ACCOUNT.IMPORT_NEW_ACCOUNT_FULFILLED", triggerAfterAccountImport);
    yield takeEvery("LIMIT_ORDER.FETCH_OPEN_ORDER_STATUS", fetchOpenOrderStatus);
    yield takeEvery("LIMIT_ORDER.GET_ORDERS_BY_FILTER", getOrdersByFilter);
    yield takeEvery("LIMIT_ORDER.GET_LIST_FILTER_PENDING", getListFilter);
    yield takeEvery("LIMIT_ORDER.GET_PENDING_BALANCES", fetchPendingBalances);
    yield takeEvery("LIMIT_ORDER.CHANGE_ORDER_TAB", changeOrderTab);
  }
