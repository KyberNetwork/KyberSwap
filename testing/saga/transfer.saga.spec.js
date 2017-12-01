'use strict';
import { call, put, take } from 'redux-saga/effects';
import { expectSaga, testSaga } from 'redux-saga-test-plan';
import * as CircularJSON from "circular-json";
var stringify = require('json-stringify-safe');


jest.mock('vm')
jest.mock('jdenticon', () => {})
import * as matchers from 'redux-saga-test-plan/matchers';
import { default as transferReducer } from "../../src/js/reducers/transferReducer"
import transferTestValue from "./transfer.test-value"
var ethereum = transferTestValue.ethereum
import { processTransfer, runAfterBroadcastTx } from "../../src/js/sagas/transferActions"
import { KeyStore, Ledger, Trezor} from "../../src/js/services/keys"

const keystoreWrongPassphrase = transferTestValue.keystoreWrongPassphrase
it('handle process transfer with keystore and wrong passphrase', () => {
  return expectSaga(processTransfer, { payload: keystoreWrongPassphrase})
    .run()
    .then((result) => {
      const { effects } = result;
      expect(effects.put).toHaveLength(1);

      expect(effects.put[0]).toEqual(
        put({
          payload:"Key derivation failed - possibly wrong password",
          type:"TRANSFER.THROW_ERROR_PASSPHRASE"
        }))
    })
})


const ledgerSignError = transferTestValue.ledgerSignError
it('handle process transfer with ledger and reject sign', () => {
  return expectSaga(processTransfer, { payload: ledgerSignError})
    .run()
    .then((result) => {
      const { effects } = result;
      expect(effects.put).toHaveLength(2);

      expect(effects.put[0]).toEqual(
        put({
          payload:"Cannot sign transaction",
          type:"TRANSFER.TX_BROADCAST_REJECTED"
        }));
        expect(effects.put[0].PUT.action.type).toEqual("TRANSFER.TX_BROADCAST_REJECTED");
        expect(effects.put[1].PUT.action.type).toEqual('ACCOUNT.UPDATE_ACCOUNT_PENDING');
    })
})


const trezorSignError = transferTestValue.trezorSignError
it('handle process transfer with trezor and reject sign', () => {
  return expectSaga(processTransfer, { payload: trezorSignError})
    .run()
    .then((result) => {
      const { effects } = result;
      expect(effects.put).toHaveLength(2);

      expect(effects.put[0]).toEqual(
        put({
          payload:"Cannot sign transaction",
          type:"TRANSFER.TX_BROADCAST_REJECTED"
        }));
      // expect(effects.put[1].PUT.action.type).toEqual('ACCOUNT.INC_MANUAL_NONCE_ACCOUNT');
      expect(effects.put[1].PUT.action.type).toEqual('ACCOUNT.UPDATE_ACCOUNT_PENDING');
    })
})


var basicAccount = transferTestValue.account

describe('testing trasfer saga successfully', () => { 
  var transferSuccess = transferTestValue.transferSuccess
  let account = null
  beforeAll(() => basicAccount.sync(ethereum, basicAccount).then(response => {
    account = response

  }));


  it('handle process transfer with keystore successfully', () => {
    // console.log(perfectKeyStore)
    transferSuccess.account = account
    transferSuccess.nonce = account.nonce
    
    transferSuccess.keyService = new KeyStore()
    transferSuccess.type = account.type
    transferSuccess.address = account.address
    transferSuccess.keystring = account.keystring
    return expectSaga(processTransfer, { payload: transferSuccess})
      .run(200000)
      .then((result) => {
        const { effects } = result;

        expect(effects.put).toHaveLength(6);
        expect(effects.call).toHaveLength(6);

        expect(effects.put[0].PUT.action.type).toEqual("TRANSFER.PREPARE_TRANSACTION");
        expect(effects.put[1].PUT.action.type).toEqual("ACCOUNT.INC_MANUAL_NONCE_ACCOUNT");
        expect(effects.put[2].PUT.action.type).toEqual("ACCOUNT.UPDATE_ACCOUNT_PENDING");
        expect(effects.put[3].PUT.action.type).toEqual("TX.TX_ADDED");
        expect(effects.put[4].PUT.action.type).toEqual("TRANSFER.TX_BROADCAST_FULFILLED");
        expect(effects.put[5].PUT.action.type).toEqual("TRANSFER.FINISH_TRANSACTION");

        expect(stringify(effects.call[2].CALL.fn)).toEqual(
          stringify(ethereum.call("sendRawTransaction"))
        )
      })
  })
});


var ledgerAccount = transferTestValue.ledgerAccount

describe('testing trasfer saga successfully', () => { 
  var transferSuccess = transferTestValue.transferSuccess
  let account = null
  beforeAll(() => ledgerAccount.sync(ethereum, ledgerAccount).then(response => {
    account = response
  }));


  it('handle process transfer with ledger successfully', () => {
    // console.log(perfectKeyStore)
    transferSuccess.account = account
    transferSuccess.nonce = account.nonce
    
    transferSuccess.keyService = new KeyStore()
    transferSuccess.type = account.type
    transferSuccess.address = account.address
    transferSuccess.keystring = account.keystring

    return expectSaga(processTransfer, { payload: transferSuccess})
      .run(200000)
      .then((result) => {
        const { effects } = result;

        expect(effects.put).toHaveLength(6);
        expect(effects.call).toHaveLength(6);

        expect(effects.put[0].PUT.action.type).toEqual("TRANSFER.PREPARE_TRANSACTION");
        expect(effects.put[1].PUT.action.type).toEqual("ACCOUNT.INC_MANUAL_NONCE_ACCOUNT");
        expect(effects.put[2].PUT.action.type).toEqual("ACCOUNT.UPDATE_ACCOUNT_PENDING");
        expect(effects.put[3].PUT.action.type).toEqual("TX.TX_ADDED");
        expect(effects.put[4].PUT.action.type).toEqual("TRANSFER.TX_BROADCAST_FULFILLED");
        expect(effects.put[5].PUT.action.type).toEqual("TRANSFER.FINISH_TRANSACTION");

        expect(stringify(effects.call[2].CALL.fn)).toEqual(
          stringify(ethereum.call("sendRawTransaction"))
        )
      })
  })
});



var trezorAccount = transferTestValue.trezorAccount

describe('testing trasfer saga successfully', () => { 
  var transferSuccess = transferTestValue.transferSuccess
  let account = null
  beforeAll(() => trezorAccount.sync(ethereum, trezorAccount).then(response => {
    account = response
  }));


  it('handle process transfer with trezor successfully', () => {
    // console.log(perfectKeyStore)
    transferSuccess.account = account
    transferSuccess.nonce = account.nonce
    
    transferSuccess.keyService = new KeyStore()
    transferSuccess.type = account.type
    transferSuccess.address = account.address
    transferSuccess.keystring = account.keystring

    return expectSaga(processTransfer, { payload: transferSuccess})
      .run(200000)
      .then((result) => {
        const { effects } = result;

        expect(effects.put).toHaveLength(6);
        expect(effects.call).toHaveLength(6);

        expect(effects.put[0].PUT.action.type).toEqual("TRANSFER.PREPARE_TRANSACTION");
        expect(effects.put[1].PUT.action.type).toEqual("ACCOUNT.INC_MANUAL_NONCE_ACCOUNT");
        expect(effects.put[2].PUT.action.type).toEqual("ACCOUNT.UPDATE_ACCOUNT_PENDING");
        expect(effects.put[3].PUT.action.type).toEqual("TX.TX_ADDED");
        expect(effects.put[4].PUT.action.type).toEqual("TRANSFER.TX_BROADCAST_FULFILLED");
        expect(effects.put[5].PUT.action.type).toEqual("TRANSFER.FINISH_TRANSACTION");

        expect(stringify(effects.call[2].CALL.fn)).toEqual(
          stringify(ethereum.call("sendRawTransaction"))
        )
      })
  })
});



var pKeyAccount = transferTestValue.pKeyAccount

describe('testing trasfer saga successfully', () => { 
  var transferSuccess = transferTestValue.transferSuccess
  let account = null
  beforeAll(() => pKeyAccount.sync(ethereum, pKeyAccount).then(response => {
    account = response
  }));


  it('handle process transfer with private key successfully', () => {
    // console.log(perfectKeyStore)
    transferSuccess.account = account
    transferSuccess.nonce = account.nonce
    
    transferSuccess.keyService = new KeyStore()
    transferSuccess.type = account.type
    transferSuccess.address = account.address
    transferSuccess.keystring = account.keystring
    return expectSaga(processTransfer, { payload: transferSuccess})
      .run(200000)
      .then((result) => {
        const { effects } = result;

        expect(effects.put).toHaveLength(6);
        expect(effects.call).toHaveLength(6);

        expect(effects.put[0].PUT.action.type).toEqual("TRANSFER.PREPARE_TRANSACTION");
        expect(effects.put[1].PUT.action.type).toEqual("ACCOUNT.INC_MANUAL_NONCE_ACCOUNT");
        expect(effects.put[2].PUT.action.type).toEqual("ACCOUNT.UPDATE_ACCOUNT_PENDING");
        expect(effects.put[3].PUT.action.type).toEqual("TX.TX_ADDED");
        expect(effects.put[4].PUT.action.type).toEqual("TRANSFER.TX_BROADCAST_FULFILLED");
        expect(effects.put[5].PUT.action.type).toEqual("TRANSFER.FINISH_TRANSACTION");

        expect(stringify(effects.call[2].CALL.fn)).toEqual(
          stringify(ethereum.call("sendRawTransaction"))
        )
      })
  })
});


var metaMaskAccount = transferTestValue.metaMaskAccount

describe('testing trasfer saga successfully', () => { 
  var transferSuccess = transferTestValue.transferSuccess
  let account = null
  beforeAll(() => metaMaskAccount.sync(ethereum, metaMaskAccount).then(response => {
    account = response
  }));


  it('handle process transfer with metamask successfully', () => {
    // console.log(perfectKeyStore)
    transferSuccess.account = account
    transferSuccess.nonce = account.nonce
    
    transferSuccess.keyService = new KeyStore()
    transferSuccess.type = account.type
    transferSuccess.address = account.address
    transferSuccess.keystring = account.keystring

    return expectSaga(processTransfer, { payload: transferSuccess})
      .run(200000)
      .then((result) => {
        const { effects } = result;

        expect(effects.put).toHaveLength(6);
        expect(effects.call).toHaveLength(5);

        expect(effects.put[0].PUT.action.type).toEqual("TRANSFER.PREPARE_TRANSACTION");
        expect(effects.put[1].PUT.action.type).toEqual("ACCOUNT.INC_MANUAL_NONCE_ACCOUNT");
        expect(effects.put[2].PUT.action.type).toEqual("ACCOUNT.UPDATE_ACCOUNT_PENDING");
        expect(effects.put[3].PUT.action.type).toEqual("TX.TX_ADDED");
        expect(effects.put[4].PUT.action.type).toEqual("TRANSFER.TX_BROADCAST_FULFILLED");
        expect(effects.put[5].PUT.action.type).toEqual("TRANSFER.FINISH_TRANSACTION");
      })
  })
});