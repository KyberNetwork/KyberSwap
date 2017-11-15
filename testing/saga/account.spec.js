'use strict';
import { call, put, take } from 'redux-saga/effects';
import { expectSaga, testSaga } from 'redux-saga-test-plan';
import { default as accountReducer } from "../../src/js/reducers/accountReducer"
import { default as connectionReducer } from "../../src/js/reducers/connection"
import { default as exchangeReducer } from "../../src/js/reducers/exchangeReducer"

import EthereumService from "../instance/ethereum/ethereum.fake"
let ethereum = new EthereumService({ default: 'http' })


import { updateAccount, importNewAccount } from "../../src/js/sagas/accountActions"
import Account from "../../src/js/services/account"

import * as BLOCKCHAIN_INFO from "../../env"
import * as service from "../../src/js/services/accounts"
import { updateAllRatePromise } from "../../src/js/services/rate"
import constants from "../../src/js/services/constants"

const initState = {
  isStoreReady: false,
  account: false,
  loading: false,
  error: "",
  showError: false
}

let tokens = []
Object.keys(BLOCKCHAIN_INFO.tokens).forEach((key, index) => {
  tokens[index] = BLOCKCHAIN_INFO.tokens[key]
  tokens[index].rate = 0
  tokens[index].rateEth = 0
  tokens[index].balance = 0    
}) 

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

const account = new Account(
  "0x52249ee04a2860c42704c0bbc74bd82cb9b56e98", 
  "keystore",
  '"{"version":3,"id":"34ae5306-f3bf-42d3-bb0e-ce2e0fe1821b","address":"52249ee04a2860c42704c0bbc74bd82cb9b56e98","crypto":{"ciphertext":"aa638616d99f6f7a11ba205cd8b6dc09f064511d92361736718ba86c61b50c9d","cipherparams":{"iv":"d6fc865281ac8ed91af38cf933e8b916"},"cipher":"aes-128-ctr","kdf":"pbkdf2","kdfparams":{"dklen":32,"salt":"d5358f4e1403c7c47f86b48f134b9e0fce57b3dd6eac726f0eed9e54d12735fe","c":10240,"prf":"hmac-sha256"},"mac":"086cab9258c953081d0d6f3ed077beca7ae6342229526a3fc8e3614d91e71636"}}"'
  );

  
// it('handle update account pending', () => {
//   testSaga(updateAccount, {payload : { account: account, ethereum: ethereum}})
//     .next()
//     .call(account.sync, ethereum, account)
//     .next()
//     .put({
//       type: 'ACCOUNT.UPDATE_ACCOUNT_FULFILLED',
//       payload: account,
//     })
//     .next()
//     .isDone();
// });

it('handle update account pending', () => {
  let fakeAccount = new Account(
  "0x52249ee04a2860c42704c0bbc74bd82cb9b56e98", 
  "keystore",
  '"{"version":3,"id":"34ae5306-f3bf-42d3-bb0e-ce2e0fe1821b","address":"52249ee04a2860c42704c0bbc74bd82cb9b56e98","crypto":{"ciphertext":"aa638616d99f6f7a11ba205cd8b6dc09f064511d92361736718ba86c61b50c9d","cipherparams":{"iv":"d6fc865281ac8ed91af38cf933e8b916"},"cipher":"aes-128-ctr","kdf":"pbkdf2","kdfparams":{"dklen":32,"salt":"d5358f4e1403c7c47f86b48f134b9e0fce57b3dd6eac726f0eed9e54d12735fe","c":10240,"prf":"hmac-sha256"},"mac":"086cab9258c953081d0d6f3ed077beca7ae6342229526a3fc8e3614d91e71636"}}"'
  );
  fakeAccount.balance = '8758614889938960741';
  fakeAccount.nonce = 157;
  fakeAccount.manualNonce = 157;

  return expectSaga(updateAccount, {payload : { account: account, ethereum: ethereum}})
    .provide([
      [call(account.sync, fakeAccount ), ethereum, account]
    ])
    .put({
      type: 'ACCOUNT.UPDATE_ACCOUNT_FULFILLED',
      payload: fakeAccount,
    })
    .run(50000)
});


it('import new account pending', () => {
  let fakeAccount = new Account(
  "0x52249ee04a2860c42704c0bbc74bd82cb9b56e98", 
  "keystore",
  '"{"version":3,"id":"34ae5306-f3bf-42d3-bb0e-ce2e0fe1821b","address":"52249ee04a2860c42704c0bbc74bd82cb9b56e98","crypto":{"ciphertext":"aa638616d99f6f7a11ba205cd8b6dc09f064511d92361736718ba86c61b50c9d","cipherparams":{"iv":"d6fc865281ac8ed91af38cf933e8b916"},"cipher":"aes-128-ctr","kdf":"pbkdf2","kdfparams":{"dklen":32,"salt":"d5358f4e1403c7c47f86b48f134b9e0fce57b3dd6eac726f0eed9e54d12735fe","c":10240,"prf":"hmac-sha256"},"mac":"086cab9258c953081d0d6f3ed077beca7ae6342229526a3fc8e3614d91e71636"}}"'
  );
  fakeAccount.balance = '8758614889938960741';
  fakeAccount.nonce = 157;
  fakeAccount.manualNonce = 157;

  const storeState = {
    connection: {
      ethereum: ethereum
    },
    exchange: {
      sourceToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      destToken: "0xee45f2ff517f892e8c0d16b341d66f14a1372cff"
    }
  };

  return expectSaga(importNewAccount, {payload : { 
    address: account.address, 
    type: account.type, 
    keystring: account.keystring, 
    ethereum: ethereum, 
    avatar: account.avatar, 
    tokens: tokens
  }})
  .withState(storeState)
  .run(100000)
  .then((result) => {
    const { effects, allEffects } = result;

    expect(effects.call).toHaveLength(3);
    expect(effects.put).toHaveLength(7);
    
    expect(effects.put[0]).toEqual(
      put({ type: 'ACCOUNT.LOADING' })
    );
    expect(effects.put[4]).toEqual(
      put({ type: 'ACCOUNT.CLOSE_LOADING_IMPORT' })
    );
    expect(effects.put[5]).toEqual(
      put({ 
        type: 'ACCOUNT.IMPORT_NEW_ACCOUNT_FULFILLED',
        payload: fakeAccount
     })
    );

    // expect(allEffects).toEqual([
    //   put({ type: 'ACCOUNT.LOADING' }),
    //   call(service.newAccountInstance, account.address, account.type, account.keystring, account.avatar, ethereum),
    //   call(updateAllRatePromise, ethereum, tokens, constants.RESERVES[0], account.address),
    //   put({type: 'GLOBAL.ALL_RATE_UPDATED_FULFILLED'}),

    // ]);

  })
});

function* accountCloseLoadingImport() {
  yield put({ type: 'ACCOUNT.CLOSE_LOADING_IMPORT' });
}
it('handle close loading import', () => {
  return expectSaga(accountCloseLoadingImport)
    .withReducer(accountReducer)
    .run()
    .then((result) => {
      expect(result.storeState.loading).toEqual(false);
    })
})

const initalAccount = {
  account: account,
  error: "",
  isStoreReady: true,
  loading: false,
  showError: false
}
function* updateAccountFullfilled() {
  yield put({ 
    type: 'ACCOUNT.UPDATE_ACCOUNT_FULFILLED',
    payload: account
  });
}
it('handle update account fullfilled', () => {
  return expectSaga(updateAccountFullfilled)
    .withReducer(accountReducer, initalAccount)
    .run()
    .then((result) => {
      expect(result.storeState.account).toEqual(account);
    })
})

const accountError = "this is account error"
function* throwError() {
  yield put({ 
    type: 'ACCOUNT.THROW_ERROR',
    payload: accountError
  });
}
it('handle throw error', () => {
  return expectSaga(throwError)
    .withReducer(accountReducer)
    .run()
    .then((result) => {
      expect(result.storeState.error).toEqual(accountError);
      expect(result.storeState.showError).toEqual(true);
    })
})

function* closeErrorModal() {
  yield put({ 
    type: 'ACCOUNT.CLOSE_ERROR_MODAL'
  });
}
it('handle close error modal', () => {
  return expectSaga(closeErrorModal)
    .withReducer(accountReducer)
    .run()
    .then((result) => {
      expect(result.storeState.showError).toEqual(false);
    })
})