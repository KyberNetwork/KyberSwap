'use strict';
import { call, put, take } from 'redux-saga/effects';
import { expectSaga, testSaga } from 'redux-saga-test-plan';
var stringify = require('json-stringify-safe');

import { processExchange, processExchangeAfterConfirm } from "../../src/js/sagas/exchangeActions"
import exchangeTestValue from "./exchange.test-value"



const keystoreWrongPassphrase = exchangeTestValue.keystoreWrongPassphrase
it('handle process exchange with keystore and wrong passphrase', () => {
  return expectSaga(processExchange, { payload: keystoreWrongPassphrase})
    .run()
    .then((result) => {
      const { effects } = result;
      expect(effects.put).toHaveLength(1);

      expect(effects.put[0]).toEqual(
        put({
          payload:"Key derivation failed - possibly wrong passphrase",
          type:"EXCHANGE.THROW_ERROR_PASSPHRASE"
        }))
    })
})


const trezorReject = exchangeTestValue.trezorReject
it('handle process exchange with trezor and open confirm', () => {
  return expectSaga(processExchange, { payload: trezorReject})
    .run()
    .then((result) => {
      const { effects } = result;
      expect(effects.put).toHaveLength(1);

      expect(effects.put[0]).toEqual(
        put({
          type:"EXCHANGE.SHOW_CONFIRM"
        }));
    })
})


it('handle process exchange with trezor and reject ', () => {
  return expectSaga(processExchangeAfterConfirm, { payload: trezorReject})
    .run()
    .then((result) => {
      const { effects } = result;
      expect(effects.put).toHaveLength(2);
      
      expect(effects.put[0]).toEqual(
        put({
          payload:"Cannot sign transaction",
          type:"EXCHANGE.TX_BROADCAST_REJECTED"
        }));
      expect(effects.put[1].PUT.action.type).toEqual('ACCOUNT.UPDATE_ACCOUNT_PENDING');
    })
})

// const perfectKeyStore = exchangeTestValue.perfectKeyStore
// it('handle process exchange with keystore successfully', () => {

//   console.log(perfectKeyStore)
//   return expectSaga(processExchangeAfterConfirm, { payload: perfectKeyStore})
//     .run(200000)
//     .then((result) => {
//       const { effects } = result;

//       console.log(effects.put[0])
//       console.log(effects.put[1])
//       console.log(effects.put[2])

//       console.log(effects.call[0])
//       console.log(effects.call[1])
//       console.log(effects.call[2])
//       console.log(effects.call[3])

//       expect(effects.put).toHaveLength(2);
      
//       expect(effects.put[0]).toEqual(
//         put({
//           payload:"Cannot sign transaction",
//           type:"EXCHANGE.TX_BROADCAST_REJECTED"
//         }));
//       expect(effects.put[1].PUT.action.type).toEqual('ACCOUNT.UPDATE_ACCOUNT_PENDING');
//     })
// })
