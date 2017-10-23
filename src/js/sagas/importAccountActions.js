import { take, put, call, fork, select, takeEvery, all } from 'redux-saga/effects'
import * as actions from '../actions/accountActions'
// import { connectLedger, getLedgerPublicKey, getLedgerAddress } from "../services/ledger"

function* scanLedger(action) {
  const path = action.payload;
  try{
    const eth = yield call(connectLedger, path);
    const ledgerData = yield call(getLedgerPublicKey, eth, path);
    const wallets = yield call(getLedgerAddress, ledgerData, path, 0, 5);
    yield put(actions.scanLedgerComplete(wallets))
  } catch(err) {
    yield put(actions.scanLedgerFailed(err));
  }
  

  // const wallets = yield call(ledgerService.getLedgerAddress(path, 0, 5));
}

export function* watchImportAccount() {
  yield takeEvery('IMPORT.SCAN_LEDGER', scanLedger)
}