import BigNumber from "bignumber.js"
import { combineReducers } from 'redux'

import account from '../../src/js/reducers/accountReducer'
import tokens from '../../src/js/reducers/tokensReducer'
import exchange from '../../src/js/reducers/exchangeReducer'
import transfer from '../../src/js/reducers/transferReducer'
import global from '../../src/js/reducers/globalReducer'
import connection from '../../src/js/reducers/connection'
import utils from '../../src/js/reducers/utilsReducer'
import txs from '../../src/js/reducers/txsReducer'
import { routerReducer } from 'react-router-redux'
import { createStore } from 'redux';
import { localeReducer } from 'react-localize-redux';

const initState = createStore(combineReducers({
  account, exchange, transfer, txs, connection, router: routerReducer, utils,
  locale: localeReducer,
  global,tokens
})).getState()

const ratesExpect = {
  ADX: {
    name: "Adex", 
    symbol: "ADX", 
    icon: "/assets/img/tokens/adx.svg", 
    address: "0xf15f87db547796266cb33da7bd52a9aae6055698", 
    rate: new BigNumber(123),
    rateEth: new BigNumber(321),
    balance: new BigNumber(11),
    decimal: 4
  },
  BAT: {
    name: "BasicAttention", 
    symbol: "BAT", 
    icon: "/assets/img/tokens/bat.svg", 
    address: "0xc12e72373eae8f3b901f6d47b7124e025e55fb2b", 
    rate: new BigNumber(123),
    rateEth: new BigNumber(321),
    balance: new BigNumber(11),
    decimal: 4
  },
  CVC: {
    name: "Civic", 
    symbol: "CVC", 
    icon: "/assets/img/tokens/cvc.svg", 
    address: "0x91cacf7aea3b0d945a2873eff7595cb4de0d7297", 
    rate: new BigNumber(123),
    rateEth: new BigNumber(321),
    balance: new BigNumber(11),
    decimal: 4
  },
  DGD: {
    name: "Digix", 
    symbol: "DGD", 
    icon: "/assets/img/tokens/dgd.svg", 
    address: "0xc94c72978bdcc50d763a541695d90a8416f050b2", 
    rate: new BigNumber(123),
    rateEth: new BigNumber(321),
    balance: new BigNumber(11),
    decimal: 4
  }
}

const rates = [
  {
    name: "Adex", 
    symbol: "ADX", 
    icon: "/assets/img/tokens/adx.svg", 
    address: "0xf15f87db547796266cb33da7bd52a9aae6055698", 
    rate: new BigNumber(123),
    rateEth: new BigNumber(321),
    balance: new BigNumber(11),
    decimal: 4
  },
  {
    name: "BasicAttention", 
    symbol: "BAT", 
    icon: "/assets/img/tokens/bat.svg", 
    address: "0xc12e72373eae8f3b901f6d47b7124e025e55fb2b", 
    rate: new BigNumber(123),
    rateEth: new BigNumber(321),
    balance: new BigNumber(11),
    decimal: 4
  },
  {
    name: "Civic", 
    symbol: "CVC", 
    icon: "/assets/img/tokens/cvc.svg", 
    address: "0x91cacf7aea3b0d945a2873eff7595cb4de0d7297", 
    rate: new BigNumber(123),
    rateEth: new BigNumber(321),
    balance: new BigNumber(11),
    decimal: 4
  },
  {
    name: "Digix", 
    symbol: "DGD", 
    icon: "/assets/img/tokens/dgd.svg", 
    address: "0xc94c72978bdcc50d763a541695d90a8416f050b2", 
    rate: new BigNumber(123),
    rateEth: new BigNumber(321),
    balance: new BigNumber(11),
    decimal: 4
  }
]

export default {
  rates, ratesExpect, initState
}