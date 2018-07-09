import { fork, all, takeEvery, select } from 'redux-saga/effects'
import { watchAccount } from './accountActions';
import { watchGlobal } from './globalActions';
import { watchExchange } from './exchangeActions';
import { watchTransfer } from './transferActions';
import { watchTx } from './txActions';
import { watchConnection } from './connectionActions'
import { watchMarket } from './marketActions'
// function* watchAndLog() {
//   yield takeEvery('*', function* logger(action) {
//     const state = yield select()

//       console.log('action', action)
//       console.log('state after', state)
//   })
// }

export default function* root() {
  yield all([
    fork(watchAccount),
    fork(watchGlobal),
    fork(watchExchange),
    fork(watchTransfer),
    fork(watchTx),
    fork(watchConnection),
    fork(watchMarket)
  ])
}