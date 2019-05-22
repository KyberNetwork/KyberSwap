import { fork, all, takeEvery, select } from 'redux-saga/effects'
import { watchAccount } from './accountActions';
import { watchGlobal } from './globalActions';
import { watchExchange } from './exchangeActions';
import { watchTransfer } from './transferActions';
import { watchConnection } from './connectionActions'
import { watchMarket } from './marketActions'

import {watchLimitOrder} from "./limitOrderActions"


export default function* root() {
  yield all([
    fork(watchAccount),
    fork(watchGlobal),
    fork(watchExchange),
    fork(watchTransfer),    
    fork(watchConnection),
    fork(watchMarket),
    fork(watchLimitOrder)
  ])
}