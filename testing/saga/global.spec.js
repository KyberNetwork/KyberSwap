'use strict';
import { call, put, take } from 'redux-saga/effects';
import { expectSaga, testSaga } from 'redux-saga-test-plan';
import { getLatestBlock } from "../../src/js/sagas/globalActions"


import EthereumService from "../instance/ethereum/ethereum.fake"
let ethereum = new EthereumService({ default: 'http' })

it('handle new block include pending', () => {
  return expectSaga(getLatestBlock, {payload : ethereum})
    .run(100000)
    .then((result) => {
      const { effects, allEffects } = result;

      expect(effects.call).toHaveLength(1);
      expect(effects.put).toHaveLength(1);

      expect(effects.put[0].PUT.action.type).toEqual(
        'GLOBAL.NEW_BLOCK_INCLUDED_FULFILLED')

        expect(JSON.stringify(effects.call[0])).toEqual(JSON.stringify((call(ethereum.call("getLatestBlock")))));
    })
})