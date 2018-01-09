'use strict';
import { call, put, take } from 'redux-saga/effects';
import { expectSaga, testSaga } from 'redux-saga-test-plan';
import { default as accountReducer } from "../../src/js/reducers/accountReducer"
import { default as connectionReducer } from "../../src/js/reducers/connection"
import { default as exchangeReducer } from "../../src/js/reducers/exchangeReducer"

import EthereumService from "../instance/ethereum/ethereum.fake"
let ethereum = new EthereumService({ default: 'http' })
jest.mock('vm')
jest.mock('jdenticon', () => {})
import { updateAccount, importNewAccount } from "../../src/js/sagas/accountActions"
import Account from "../../src/js/services/account"
var stringify = require('json-stringify-safe');

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
  "0xf34791ada19af51d5b0dc927b8420a2c7dc9b704", 
  "keystore",
  '{"version":3,"id":"04933224-8510-45f3-a3e2-882a8c149081","address":"f34791ada19af51d5b0dc927b8420a2c7dc9b704","crypto":{"ciphertext":"e4c51957a31da57e754498fd11da81d50424f3c2647fda816bc08ca51734f780","cipherparams":{"iv":"9f409c69b2c1eaf26c41e0ac8afd63cc"},"cipher":"aes-128-ctr","kdf":"pbkdf2","kdfparams":{"dklen":32,"salt":"07e47b0e900abe1aa4e2125e746a11ba7f6e87a696626c6ed0715113e3e4e75a","c":10240,"prf":"hmac-sha256"},"mac":"51d2dcb0a863a590d1c94bdbe315f0d9ec2ab3aa93f653d77922588a96ee2a65"}}'
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
  "0xd42a313bbe64c2525ff70d449f6bb589b6c6c6f5", 
  "keystore",
  '{"version":3,"id":"05272513-7306-4af2-882e-cee79a397c95","address":"d42a313bbe64c2525ff70d449f6bb589b6c6c6f5","crypto":{"ciphertext":"29c43c83b60a4fe76b26d2a724a440210037164136f03b9f5d67a4527d93b52a","cipherparams":{"iv":"506535b8298c83653a99e8326e2848e5"},"cipher":"aes-128-ctr","kdf":"pbkdf2","kdfparams":{"dklen":32,"salt":"03274eacc0f28b7bcaf5086707e9792b40573857e4000d013c70a1c8ca53b911","c":10240,"prf":"hmac-sha256"},"mac":"1d915b45d2d78197df3ba136e4b8b551356d672942b99dd5b6aa71e2b01a1c26"}}'
  );
  fakeAccount.balance = '1000000000000000000';
  fakeAccount.nonce = 0;
  fakeAccount.manualNonce = 0;

  return expectSaga(updateAccount, {payload : { account: fakeAccount, ethereum: ethereum}})
    .provide([
      [call(fakeAccount.sync, fakeAccount ), ethereum, fakeAccount]
    ])
    .put({
      type: 'ACCOUNT.UPDATE_ACCOUNT_FULFILLED',
      payload: fakeAccount,
    })
    .run(50000)
});


it('import new account pending', () => {
  let fakeAccount = new Account(
    "0xd42a313bbe64c2525ff70d449f6bb589b6c6c6f5", 
    "keystore",
    '{"version":3,"id":"05272513-7306-4af2-882e-cee79a397c95","address":"d42a313bbe64c2525ff70d449f6bb589b6c6c6f5","crypto":{"ciphertext":"29c43c83b60a4fe76b26d2a724a440210037164136f03b9f5d67a4527d93b52a","cipherparams":{"iv":"506535b8298c83653a99e8326e2848e5"},"cipher":"aes-128-ctr","kdf":"pbkdf2","kdfparams":{"dklen":32,"salt":"03274eacc0f28b7bcaf5086707e9792b40573857e4000d013c70a1c8ca53b911","c":10240,"prf":"hmac-sha256"},"mac":"1d915b45d2d78197df3ba136e4b8b551356d672942b99dd5b6aa71e2b01a1c26"}}'
  );
  fakeAccount.balance = "1000000000000000000";
  fakeAccount.nonce = 0;
  fakeAccount.manualNonce = 0;

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
    address: fakeAccount.address, 
    type: fakeAccount.type, 
    keystring: fakeAccount.keystring, 
    ethereum: ethereum, 
    avatar: fakeAccount.avatar, 
    tokens: tokens
  }})
  .withState(storeState)
  .run(100000)
  .then((result) => {
    const { effects, allEffects } = result;

    expect(effects.call).toHaveLength(1);
    expect(effects.put).toHaveLength(3);
    expect(effects.call[0]).toEqual(
      call(service.newAccountInstance, fakeAccount.address, fakeAccount.type, fakeAccount.keystring, fakeAccount.avatar, ethereum),
    );

    expect(effects.put[0]).toEqual(
      put({ type: 'ACCOUNT.LOADING' })
    );
    expect(effects.put[2]).toEqual(
      put({ type: 'ACCOUNT.CLOSE_LOADING_IMPORT' })
    );
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