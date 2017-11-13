'use strict';
import { call, put, take } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import { default as accountReducer } from "../../reducers/accountReducer"
jest.mock('vm');

// jest.mock('../../services/ethereum' );
// let EthereumService = require('../../services/ethereum/ethereum').default
// let ethereum = new EthereumService()

const initState = {
  isStoreReady: false,
  account: false,
  loading: false,
  error: "",
  showError: false
}

const fakeAddress = "0xB6E3b94D74003376409600208EDac4D8B29d7f3E";

function* accountLoading() {
  yield put({ type: 'ACCOUNT.LOADING' });
}

// function* updateAccountPending(){
//   yield put({
//     type: "ACCOUNT.UPDATE_ACCOUNT_PENDING",
//     payload: {
//       ethereum: ethereum, 
//       account: fakeAddress
//     }
//   })
// }


it('handle reducer and open loading modal', () => {
  return expectSaga(accountLoading)
    .withReducer(accountReducer)
    // .hasFinalState({
    //   ...initState,
    //   loading: true
    // })
    .run()
    .then((result) => {
      expect(result.storeState.loading).toEqual(true);
    })
})

// it('handle update account pending', () => {

//   console.log("====================")
//   console.log(ethereum)

//   return expectSaga(updateAccountPending)
//     .withReducer(accountReducer)
//     // .hasFinalState({
//     //     ...initState,
//     //     loading: true
//     //   })
//     .run()
//     .then((result) => {
//       expect(result.storeState.loading).toEqual(true);
//     })
// })

