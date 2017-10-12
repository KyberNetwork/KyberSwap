import { fork, all } from 'redux-saga/effects'
import { watchAccount } from './accountActions';
import { watchWallet } from './walletActions';
import { watchGlobal } from './globalActions';
import { watchExchange } from './exchangeFormActions';
import { watchPayment } from './joinPaymentFormActions';
import { watchTx } from './txActions';

export default function* root() {
  yield all([
   	fork(watchAccount),    
   	fork(watchWallet),    
   	fork(watchGlobal), 
   	fork(watchExchange), 
   	fork(watchPayment), 
   	fork(watchTx), 
  ])
}