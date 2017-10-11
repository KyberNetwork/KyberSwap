import { fork, all } from 'redux-saga/effects'
import { watchAddNewAccount, addNewAccount } from './accountActions';

export default function* root() {
  yield all([
   	fork(watchAddNewAccount),    
  ])
}