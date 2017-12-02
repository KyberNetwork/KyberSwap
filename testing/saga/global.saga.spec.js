import { take, put, call, fork, select, takeEvery, all } from 'redux-saga/effects'
import * as actions from '../../src/js/actions/globalActions'
import { updateHistoryExchange } from '../../src/js/sagas/globalActions'
import { expectSaga, testSaga } from 'redux-saga-test-plan';
import EthereumService from "../instance/ethereum/ethereum.fake"
jest.mock('vm')
jest.mock('jdenticon', () => {})

var stringify = require('json-stringify-safe');
let ethereum = new EthereumService({ default: 'http' })

it('handle update history exchange', () => {
  return expectSaga(updateHistoryExchange, { payload: {
    ethereum: ethereum,
    currentBlock: undefined,
    isFirstPage: false,
    range: undefined
  }})
    .run(200000)
    .then((result) => {
      const { effects } = result;
      expect(stringify(effects.call[0])).toEqual(
        stringify(call(ethereum.call("getLatestBlock")))
      )
    })
})