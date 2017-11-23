'use strict';
import { call, put, take } from 'redux-saga/effects';
import { expectSaga, testSaga } from 'redux-saga-test-plan';
var stringify = require('json-stringify-safe');

import { processExchange, exchangeETHtoTokenColdWallet, 
  checkTokenBalanceOfColdWallet, exchangeETHtoTokenKeystore,
  exchangeETHtoTokenPrivateKey } from "../../src/js/sagas/exchangeActions"
import exchangeTestValue from "./exchange.test-value"

jest.mock('vm')
jest.mock('jdenticon', () => {})

const keystoreWrongPassphrase = exchangeTestValue.keystoreWrongPassphrase
it('handle process exchange with keystore and wrong passphrase', () => {
  return expectSaga(processExchange, { payload: keystoreWrongPassphrase})
    .run()
    .then((result) => {
      const { effects } = result;

      expect(effects.put).toHaveLength(1);

      expect(effects.put[0]).toEqual(
        put({
          payload:"Key derivation failed - possibly wrong password",
          type:"EXCHANGE.THROW_ERROR_PASSPHRASE"
        })
      )
    })
})

const ethereum = exchangeTestValue.ethereum
const trezorReject = exchangeTestValue.trezorReject

it('handle process exchange with trezor and reject ', () => {
  return expectSaga(processExchange, { payload: trezorReject})
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

const perfectKeyStore = exchangeTestValue.perfectKeyStore
it('handle process exchange with keystore successfully', () => {

  // console.log(perfectKeyStore)
  return expectSaga(exchangeETHtoTokenKeystore, { payload: perfectKeyStore})
    .run(200000)
    .then((result) => {
      const { effects } = result;

      expect(effects.put).toHaveLength(3);
      
      expect(effects.put[0]).toEqual(
        put({
          type:"EXCHANGE.PREPARE_BROADCAST"
        }))

      expect(effects.put[1]).toEqual(
        put({
          payload:"tx.serialize is not a function",
          type:"EXCHANGE.TX_BROADCAST_REJECTED"
        })
      );
      expect(effects.put[2].PUT.action.type).toEqual('ACCOUNT.UPDATE_ACCOUNT_PENDING');
    })
})

const trezorCheckTokenBalance = exchangeTestValue.trezorCheckTokenBalance
it('handle check token balance of cold wallet', () => {
  return expectSaga(checkTokenBalanceOfColdWallet, { payload: trezorCheckTokenBalance})
    .run()
    .then((result) => {
      const { effects } = result;
      expect(effects.call).toHaveLength(1);

      expect(stringify(effects.call[0])).toEqual(
        stringify(call(ethereum.call("getAllowance"), trezorCheckTokenBalance.sourceToken, trezorCheckTokenBalance.address))
      )
  })
})

const perfectPrivateKey = exchangeTestValue.perfectPrivateKey
it('handle exchange eth to token with private key', () => {
  return expectSaga(exchangeETHtoTokenPrivateKey, { payload: perfectPrivateKey})
    .run()
    .then((result) => {
      const { effects } = result;

      console.log("====================");
      console.log(effects)

      console.log(effects.put[0])
      console.log(effects.put[1])
      console.log(effects.put[2])

      console.log(effects.call[0])
      console.log(effects.call[1])
      console.log(effects.call[2])
      console.log(effects.call[3])

      expect(effects.put).toHaveLength(3);
      expect(effects.call).toHaveLength(4);

      expect(effects.put[0]).toEqual(
        put({
          type:"EXCHANGE.PREPARE_BROADCAST"
        })
      );
      expect(effects.put[1]).toEqual(
        put({
          type:"EXCHANGE.TX_BROADCAST_REJECTED",
          payload: "tx.serialize is not a function"
        })
      );
      expect(effects.put[2].PUT.action.type).toEqual("ACCOUNT.UPDATE_ACCOUNT_PENDING");

      // expect(stringify(effects.call[0])).toEqual(
      //   stringify(call(ethereum.call("getAllowance"), trezorCheckTokenBalance.sourceToken, trezorCheckTokenBalance.address))
      // )
  })
})