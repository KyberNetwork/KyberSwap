'use strict';
import { call, put, take } from 'redux-saga/effects';
import { expectSaga, testSaga } from 'redux-saga-test-plan';
import { default as utilsReducer } from "../../src/js/reducers/utilsReducer"

function* openTokenModal(type, selected) {
  yield put({ 
    type: 'UTIL.OPEN_TOKEN_MODAL',
    payload: {
      type: type,
      selected: selected
    }
  });
}
it('handle open token modal', () => {
  return expectSaga(openTokenModal, "source", "ETH")
    .withReducer(utilsReducer)
    .run()
    .then((result) => {
      expect(result.storeState.tokenModal).toEqual({
        open: true,
        selected: "ETH",
        type: "source"
      });
    })
})




function* hideTokenModal() {
  yield put({ 
    type: 'UTIL.HIDE_TOKEN_MODAL'
  });
}
it('handle hide token modal', () => {
  return expectSaga(hideTokenModal)
    .withReducer(utilsReducer)
    .run()
    .then((result) => {
      expect(result.storeState.tokenModal).toEqual({
        open: false
      });
    })
})

const initState = {
  showNotify: false
}
function* toggleNotify() {
  yield put({ 
    type: 'UTIL.TOGGLE_NOTIFY'
  });
}
it('handle toggle notify', () => {
  return expectSaga(toggleNotify)
    .withReducer(utilsReducer, initState)
    .run()
    .then((result) => {
      expect(result.storeState).toEqual({
        showNotify: true
      });
    })
})



function* openInfoModal(title, content) {
  yield put({ 
    type: 'UTIL.OPEN_INFO_MODAL',
    payload: {
      title: title,
      content: content
    }
  });
}
it('handle toggle notify', () => {
  return expectSaga(openInfoModal, "this is title", "this is content")
    .withReducer(utilsReducer)
    .run()
    .then((result) => {
      expect(result.storeState.infoModal).toEqual({
        open: true,
        title: "this is title",
        content: "this is content"
      });
    })
})


function* exitInfoModal() {
  yield put({ 
    type: 'UTIL.EXIT_INFO_MODAL'
  });
}
it('handle exit info', () => {
  return expectSaga(exitInfoModal)
    .withReducer(utilsReducer)
    .run()
    .then((result) => {
      expect(result.storeState.infoModal).toEqual({
        open: false
      });
    })
})