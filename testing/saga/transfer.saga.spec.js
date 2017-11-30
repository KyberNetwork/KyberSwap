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
import { processTransfer } from "../../src/js/sagas/transferActions"
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


const perfectKeystore = transferTestValue.perfectKeystore
const signedTransaction = transferTestValue.signedTransaction

it('handle process transfer true keystore and passphrase', () => {
  return expectSaga(processTransfer, { payload: perfectKeystore})
    .provide([
      [call(new KeyStore().callSignTransaction, "sendEtherFromAccount", perfectKeystore.formId, perfectKeystore.ethereum, perfectKeystore.address,
      perfectKeystore.token, perfectKeystore.amount,
      perfectKeystore.destAddress, perfectKeystore.nonce, perfectKeystore.gas,
      perfectKeystore.gasPrice, perfectKeystore.keystring, perfectKeystore.type, perfectKeystore.password), "signedTransaction"],
      [matchers.call.fn(new KeyStore().callSignTransaction, "sendEtherFromAccount", perfectKeystore.formId, perfectKeystore.ethereum, perfectKeystore.address, signedTransaction)]
    ])
    .run()
    .then((result) => {
      const { effects, allEffects } = result;

      expect(effects.put).toHaveLength(1);
      expect(effects.call).toHaveLength(2);

      expect(effects.put[0].PUT.action.type).toEqual("TRANSFER.PREPARE_TRANSACTION");
      expect(stringify(effects.call[0]))
      .toEqual(
        stringify(call((new KeyStore()).callSignTransaction, "sendEtherFromAccount", perfectKeystore.formId, perfectKeystore.ethereum, perfectKeystore.address,
          perfectKeystore.token, perfectKeystore.amount,
          perfectKeystore.destAddress, perfectKeystore.nonce, perfectKeystore.gas,
          perfectKeystore.gasPrice, perfectKeystore.keystring, perfectKeystore.type, perfectKeystore.password))
      );

      expect(stringify(effects.call[1])).toEqual(
        stringify(call(ethereum.call("sendRawTransaction"), signedTransaction, ethereum))
      );
    })
})

