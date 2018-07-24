import { REHYDRATE } from 'redux-persist/lib/constants'
import Rate from "../services/rate"
import * as BLOCKCHAIN_INFO from "../../../env"
import constants from "../services/constants"

import * as converter from "../utils/converter"

const initState = function () {
  let tokens = {}
  Object.keys(BLOCKCHAIN_INFO.tokens).forEach((key) => {
    tokens[key] = BLOCKCHAIN_INFO.tokens[key]
    tokens[key].rate = 0
    tokens[key].minRate = 0
    tokens[key].rateEth = 0
    tokens[key].minRateEth = 0
    tokens[key].balance = 0
    tokens[key].rateUSD = 0
  })
  return {
    tokens: tokens,
    count: { storageKey: constants.STORAGE_KEY }
  }
}()

const tokens = (state = initState, action) => {
  switch (action.type) {
    // case REHYDRATE: {
    //   if (action.key === "tokens") {
    //     var payload = action.payload
    //     var tokens = {}
    //     if (payload) {
    //       // check load from loaclforage or initstate
    //       var loadedTokens = payload.tokens
    //       if (payload.count && payload.count.storageKey !== constants.STORAGE_KEY) {
    //         loadedTokens = initState.tokens
    //       }

    //       Object.keys(loadedTokens).forEach((id) => {
    //         var tokenMap = loadedTokens[id]
    //         var token = new Rate(
    //           tokenMap.name,
    //           tokenMap.symbol,
    //           tokenMap.icon,
    //           tokenMap.address,
    //           tokenMap.decimal,
    //           tokenMap.rate ? tokenMap.rate : 0,
    //           tokenMap.minRate ? tokenMap.minRate : 0,
    //           0,
    //           tokenMap.rateEth ? tokenMap.rateEth : 0,
    //           tokenMap.minRateEth ? tokenMap.minRateEth : 0,
    //           tokenMap.rateUSD ? tokenMap.rateUSD : 0
    //         )
    //         tokens[id] = token
    //       })
    //       return Object.assign({}, state, {
    //         tokens: tokens,
    //         count: { storageKey: constants.STORAGE_KEY }
    //       })
    //     } else {
    //       return state;
    //     }
    //   }
    //   return state
    // }
    case 'GLOBAL.ALL_RATE_UPDATED_FULFILLED': {
      var tokens = { ...state.tokens }
      var rates = action.payload.rates
      if (!rates){
        return state
      }
      //map token
      var mapToken = {}
      rates.map(rate => {
        if (rate.source !== "ETH") {
          if (!mapToken[rate.source]) {
            mapToken[rate.source] = {}
          }
          mapToken[rate.source].rate = rate.rate          
          mapToken[rate.source].minRate = converter.getMinrate(rate.rate, rate.minRate)
        } else {
          if (!mapToken[rate.dest]) {
            mapToken[rate.dest] = {}
          }
          mapToken[rate.dest].rateEth = rate.rate
          mapToken[rate.dest].minRateEth = converter.getMinrate(rate.rate, rate.minRate) 
        }
      })

      //push data
      var newTokens = {}
      Object.keys(tokens).map(key => {
        var token = tokens[key]
        if (mapToken[key] && mapToken[key].rate) {
          token.rate = mapToken[key].rate
          token.minRate = mapToken[key].minRate
        }
        if (mapToken[key] && mapToken[key].rateEth) {
          token.rateEth = mapToken[key].rateEth
          token.minRateEth = mapToken[key].minRateEth
        }
        newTokens[key] = token
      })

      return Object.assign({}, state, { tokens: newTokens })
    }
    case 'GLOBAL.UPDATE_RATE_USD_FULFILLED': {
      var tokens = { ...state.tokens }
      var rates = action.payload.rates
      //map token
      var mapToken = {}
      rates.map(rate => {
        mapToken[rate.symbol] = rate.price_usd
      })

      //push data
      var newTokens = {}
      Object.keys(tokens).map(key => {
        var token = tokens[key]
        token.rateUSD = mapToken[token.symbol]
        newTokens[key] = token
      })
      return Object.assign({}, state, { tokens: newTokens })
    }
    case 'GLOBAL.SET_BALANCE_TOKEN':{
      var tokens = { ...state.tokens }
      
      var balances = action.payload.balances
      var mapBalance = {}
      balances.map(balance=>{
        mapBalance[balance.symbol] = balance.balance
      })

      var newTokens = {}
      Object.keys(tokens).map(key => {
        var token = tokens[key]
        token.balance = mapBalance[token.symbol]
        newTokens[key] = token
      })
      return Object.assign({}, state, { tokens: newTokens }) 
    }
    case 'GLOBAL.CLEAR_SESSION_FULFILLED': {
      let tokens = {...state.tokens}
      Object.keys(state.tokens).forEach((key) => {
        tokens[key].balance = 0
      })
      state.tokens = tokens
      return state
    }
    case 'EXCHANGE.SET_APPROVE_TX':{
      const {hash, symbol} = action.payload
      var tokens = { ...state.tokens }
      tokens[symbol].approveTx = hash
      console.log(tokens)
      return Object.assign({}, state, { tokens: tokens }) 
    }
    case 'EXCHANGE.REMOVE_APPROVE_TX':{
      const {symbol} = action.payload
      var tokens = { ...state.tokens }
      delete tokens[symbol].approveTx
      return Object.assign({}, state, { tokens: tokens }) 
    }
    default: return state
  }
}

export default tokens
