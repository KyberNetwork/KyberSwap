import { fork, all, takeEvery, select } from 'redux-saga/effects'
import { watchAccount } from './accountActions';
import { watchWallet } from './walletActions';
import { watchGlobal } from './globalActions';
import { watchExchange } from './exchangeFormActions';
import { watchPayment } from './joinPaymentFormActions';
import { watchTx } from './txActions';


function* watchAndLog() {
  yield takeEvery('*', function* logger(action) {
    const state = yield select()

    console.log('action', action)
    console.log('state after', state)
  })
}

export default function* root() {
  yield all([
   	fork(watchAccount),    
   	fork(watchWallet),    
   	fork(watchGlobal), 
   	fork(watchExchange), 
   	fork(watchPayment), 
   	fork(watchTx), 
   	fork(watchAndLog), 
  ])
}