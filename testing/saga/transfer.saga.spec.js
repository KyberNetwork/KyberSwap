'use strict';
import { call, put, take } from 'redux-saga/effects';
import { expectSaga, testSaga } from 'redux-saga-test-plan';

import { default as transferReducer } from "../../src/js/reducers/transferReducer"
import transferTestValue from "./transfer.test-value"
import { processTransfer } from "../../src/js/sagas/transferActions"


const keystoreWrongPassphrase = transferTestValue.keystoreWrongPassphrase
it('handle process transfer with keystore and wrong passphrase', () => {
  return expectSaga(processTransfer, { payload: keystoreWrongPassphrase})
    .run()
    .then((result) => {
      const { effects } = result;
      expect(effects.put).toHaveLength(1);

      expect(effects.put[0]).toEqual(
        put({
          payload:"Key derivation failed - possibly wrong passphrase",
          type:"TRANSFER.THROW_ERROR_PASSPHRASE"
        }))
    })
})
