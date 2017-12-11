import { take, put, call, fork, select, takeEvery, all } from 'redux-saga/effects'
import * as actions from '../../src/js/actions/globalActions'
import { updateHistoryExchange, checkConnection, changelanguage } from '../../src/js/sagas/globalActions'
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

describe('checkConnection', () => {
  describe('isConnectNode resolve true', () => {
    let ethereum = {
      call: (callback) => {
        return ethFunc[callback];
      }
    }
    let ethFunc = {
      isConnectNode: () => Promise.resolve(true),
    }
    let action = { payload: { ethereum: ethereum, count: 0, isCheck: true, maxCount: 2 } };

    it('isCheck = false', () => {
      action.payload.isCheck = false
      return expectSaga(checkConnection, action)
        .put({
          type: 'GLOBAL.CONNECTION_UPDATE_IS_CHECK',
          payload: true,
        })
        .put({
          type: "GLOBAL.CONNECTION_UPDATE_COUNT",
          payload: 0
        }).run();
    })

    it('isCheck = true', () => {
      action.payload.isCheck = true
      return expectSaga(checkConnection, action)
        .not.put({
          type: 'GLOBAL.CONNECTION_UPDATE_IS_CHECK',
          payload: true,
        })
        .not.put({
          type: "GLOBAL.CONNECTION_UPDATE_COUNT",
          payload: 0
        }).run();
    })
  })

  describe('isConnectNode resolve false', () => {
    let ethereum = {
      call: (callback) => {
        return ethFunc[callback];
      }
    }
    let ethFunc = {
      isConnectNode: () => Promise.resolve(false),
    }
    let action = { payload: { ethereum: ethereum, count: 0, isCheck: true, maxCount: 2 } };

    it('isCheck = true, count > maxCount', () => {
      action.payload.count = 5;
      return expectSaga(checkConnection, action)
        .put({
          type: "GLOBAL.CONNECTION_UPDATE_IS_CHECK",
          payload: false
        })
        .put({
          type: "GLOBAL.CONNECTION_UPDATE_COUNT",
          payload: 0
        })
        .run();
    })

    it('isCheck = true, count = maxCount', () => {
      action.payload.count = 2;
      return expectSaga(checkConnection, action)
        .put({
          type: "UTIL.OPEN_INFO_MODAL",
          payload: {
            title: 'Error modal',
            content: 'Cannot connect to node right now. Please check your network!'
          }
        })
        .put({
          type: "GLOBAL.CONNECTION_UPDATE_COUNT",
          payload: 3
        })
        .run();
    })

    it('isCheck = true, count < maxCount', () => {
      action.payload.count = 1;
      return expectSaga(checkConnection, action)
        .put({
          type: "GLOBAL.CONNECTION_UPDATE_COUNT",
          payload: 2
        })
        .run();
    })

    it('isCheck = false, count > maxCount', () => {
      action.payload.isCheck = false;
      action.payload.count = 5;
      return expectSaga(checkConnection, action)
        .not.put({
          type: "GLOBAL.CONNECTION_UPDATE_IS_CHECK",
          payload: false
        })
        .not.put({
          type: "GLOBAL.CONNECTION_UPDATE_COUNT",
          payload: 0
        })
        .run();
    })

    it('isCheck = false, count = maxCount', () => {
      action.payload.isCheck = false;
      action.payload.count = 2;
      return expectSaga(checkConnection, action)
        .not.put({
          type: "UTIL.OPEN_INFO_MODAL",
          payload: {
            title: 'Error modal',
            content: 'Cannot connect to node right now. Please check your network!'
          }
        })
        .not.put({
          type: "GLOBAL.CONNECTION_UPDATE_COUNT",
          payload: 3
        })
        .run();
    })

    it('isCheck = false, count = maxCount', () => {
      action.payload.isCheck = false;
      action.payload.count = 1;
      return expectSaga(checkConnection, action)
        .not.put({
          type: "GLOBAL.CONNECTION_UPDATE_COUNT",
          payload: 2
        })
        .run();
    })

    it('handle change language', () => {
      return expectSaga(changelanguage, { payload: {
        ethereum: ethereum,
        lang: 'vi'
      }})
      .run()
      .then((result) => {
        const { effects } = result;
        expect(effects.put).toHaveLength(1);

        expect(effects.put[0].PUT.action.type).toEqual("@@localize/SET_ACTIVE_LANGUAGE")
      })
    })
  })
})