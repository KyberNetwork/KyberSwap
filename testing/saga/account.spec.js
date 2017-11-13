'use strict';
import { call, put, take } from 'redux-saga/effects';
import { expectSaga, testSaga } from 'redux-saga-test-plan';
import { default as accountReducer } from "../../src/js/reducers/accountReducer"
jest.mock('vm');

jest.mock('../../src/js/services/ethereum/ethereum' );
let EthereumService = require('../../src/js/services/ethereum/ethereum').default
let ethereum = new EthereumService({ default: 'http' })

import { updateAccount } from "../../src/js/sagas/accountActions"
import Account from "../../src/js/services/account"

const initState = {
  isStoreReady: false,
  account: false,
  loading: false,
  error: "",
  showError: false
}

const fakeAddress = "0xB6E3b94D74003376409600208EDac4D8B29d7f3E";

function* accountLoading() {
  yield put({ type: 'ACCOUNT.LOADING' });
}
it('handle reducer and open loading modal', () => {
  return expectSaga(accountLoading)
    .withReducer(accountReducer)
    // .hasFinalState({
    //   ...initState,
    //   loading: true
    // })
    .run()
    .then((result) => {
      expect(result.storeState.loading).toEqual(true);
    })
})


function* updateAccountPending(){
  yield put({
    type: "ACCOUNT.UPDATE_ACCOUNT_PENDING",
    payload: {
      ethereum: ethereum, 
      account: fakeAddress
    }
  })
}

// const account = {
//   address: "0x52249ee04a2860c42704c0bbc74bd82cb9b56e98",
//   avatar: undefined,
//   balance: "8758614889938960741",
//   manualNonce: 157,
//   nonce: 157,
//   type: "keystore"
// }

const account = new Account(
  "0x52249ee04a2860c42704c0bbc74bd82cb9b56e98", 
  "keystore",
  '"{"version":3,"id":"34ae5306-f3bf-42d3-bb0e-ce2e0fe1821b","address":"52249ee04a2860c42704c0bbc74bd82cb9b56e98","crypto":{"ciphertext":"aa638616d99f6f7a11ba205cd8b6dc09f064511d92361736718ba86c61b50c9d","cipherparams":{"iv":"d6fc865281ac8ed91af38cf933e8b916"},"cipher":"aes-128-ctr","kdf":"pbkdf2","kdfparams":{"dklen":32,"salt":"d5358f4e1403c7c47f86b48f134b9e0fce57b3dd6eac726f0eed9e54d12735fe","c":10240,"prf":"hmac-sha256"},"mac":"086cab9258c953081d0d6f3ed077beca7ae6342229526a3fc8e3614d91e71636"}}"'
  )
it('handle update account pending', () => {
  testSaga(updateAccount, {payload : { account: account, ethereum: ethereum}})
    .next()
    // .withReducer(accountReducer)
    .call(account.sync, ethereum, account)
    .next()


    // .next()
    // .take("ACCOUNT.UPDATE_ACCOUNT_PENDING")
    // .next(account)
    .put({
      type: 'ACCOUNT.UPDATE_ACCOUNT_FULFILLED',
      payload: account,
    })
    .next()
    .isDone();
});

