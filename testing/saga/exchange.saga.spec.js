'use strict';
import { call, put, take } from 'redux-saga/effects';
import { expectSaga, testSaga } from 'redux-saga-test-plan';
var stringify = require('json-stringify-safe');
const ethereum = exchangeTestValue.ethereum
import { processExchange, exchangeETHtoTokenColdWallet, 
  checkTokenBalanceOfColdWallet, exchangeETHtoTokenKeystore,
  exchangeETHtoTokenPrivateKey, runAfterBroadcastTx } from "../../src/js/sagas/exchangeActions"
import exchangeTestValue from "./exchange.test-value"
import KeyStore from '../../src/js/services/keys/privateKey';

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
      
      expect(stringify(effects.call[1])).toEqual(
        stringify(call(ethereum.call("sendRawTransaction"), '0xe64892ae67b8df29092e2573c1062b9c0de21ebee1310ef2c126d68f2d63e4e6', ethereum)))
    })
})

var basicAccount = exchangeTestValue.account
var exchangeSuccess = exchangeTestValue.exchangeSuccess
describe('testing exchange saga successfully', () => { 
  let account = null
  beforeAll(() => basicAccount.sync(ethereum, basicAccount).then(response => {
    account = response
  }));


  it('handle process exchange with keystore successfully', () => {
    // console.log(perfectKeyStore)
    exchangeSuccess.account = account
    exchangeSuccess.nonce = account.nonce
    console.log("________________")
    console.log(exchangeSuccess)
    return expectSaga(exchangeETHtoTokenKeystore, { payload: exchangeSuccess})
      .run(200000)
      .then((result) => {
        const { effects } = result;
        expect(effects.put).toHaveLength(6);
        expect(effects.call).toHaveLength(4);

        expect(effects.put[0]).toEqual(
          put({
            type:"EXCHANGE.PREPARE_BROADCAST"
          })
        );
        expect(effects.put[1].PUT.action.type).toEqual("ACCOUNT.INC_MANUAL_NONCE_ACCOUNT");
        expect(effects.put[2].PUT.action.type).toEqual("ACCOUNT.UPDATE_ACCOUNT_PENDING");
        expect(effects.put[3].PUT.action.type).toEqual("TX.TX_ADDED");
        expect(effects.put[4].PUT.action.type).toEqual("EXCHANGE.TX_BROADCAST_FULFILLED");
        expect(effects.put[5].PUT.action.type).toEqual("EXCHANGE.FINISH_EXCHANGE");

        expect(stringify(effects.call[0])).toEqual(
          stringify(call( new KeyStore().callSignTransaction, "etherToOthersFromAccount", exchangeSuccess.formId, ethereum, exchangeSuccess.address, exchangeSuccess.sourceToken,
          exchangeSuccess.sourceAmount, exchangeSuccess.destToken, exchangeSuccess.destAddress,
          exchangeSuccess.maxDestAmount, exchangeSuccess.minConversionRate,
          exchangeSuccess.throwOnFailure, exchangeSuccess.nonce, exchangeSuccess.gas,
          exchangeSuccess.gasPrice, exchangeSuccess.keystring, exchangeSuccess.type, exchangeSuccess.password))
        )
        expect(stringify(effects.call[1].CALL.fn)).toEqual(
          stringify(ethereum.call("sendRawTransaction"))
        )

        expect(effects.call[2].CALL.fn).toEqual(
          runAfterBroadcastTx
        )

      })
  })


  
});