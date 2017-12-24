import { REHYDRATE } from 'redux-persist/lib/constants'
import Rate from "../services/rate"
import BigNumber from "bignumber.js"
import * as BLOCKCHAIN_INFO from "../../../env"
import constants from "../services/constants"

const initState = function () {
  let tokens = {}
  Object.keys(BLOCKCHAIN_INFO.tokens).forEach((key) => {
    tokens[key] = BLOCKCHAIN_INFO.tokens[key]
    tokens[key].rate = 0
    tokens[key].rateEth = 0
    tokens[key].balance = 0
  })
  return {
    tokens: tokens,
    count: { storageKey: constants.STORAGE_KEY }
  }
}()

const tokens = (state = initState, action) => {
  switch (action.type) {
    case REHYDRATE: {
      if (action.key === "tokens") {
        var payload = action.payload
        var tokens = {}
        if (payload) {
          // check load from loaclforage or initstate
          var loadedTokens = payload.tokens
          if (payload.count && payload.count.storageKey !== constants.STORAGE_KEY) {
            loadedTokens = initState.tokens
          }

          Object.keys(loadedTokens).forEach((id) => {
            var tokenMap = loadedTokens[id]
            var token = new Rate(
              tokenMap.name,
              tokenMap.symbol,
              tokenMap.icon,
              tokenMap.address,
              tokenMap.decimal,
              tokenMap.rate ? tokenMap.rate : 0,
              0,
              tokenMap.rateEth ? tokenMap.rateEth : 0,
              tokenMap.rateUSD ? tokenMap.rateUSD : 0
            )
            tokens[id] = token
          })
          return Object.assign({}, state, {
            tokens: tokens,
            count: { storageKey: constants.STORAGE_KEY }
          })
        } else {
          return state;
        }
      }
      return state
    }
    case 'GLOBAL.ALL_RATE_UPDATED_FULFILLED': {
      var tokens = { ...state.tokens }
      var rates = action.payload.rates

      //map token
      var mapToken = {}
      rates.map(rate => {
        if (rate.source !== "ETH") {
          if (!mapToken[rate.source]) {
            mapToken[rate.source] = {}
          }
          mapToken[rate.source].rate = rate.rate
        } else {
          if (!mapToken[rate.dest]) {
            mapToken[rate.dest] = {}
          }
          mapToken[rate.dest].rateEth = rate.rate
        }
      })

      //push data
      var newTokens = {}
      Object.keys(tokens).map(key => {
        var token = tokens[key]
        if (mapToken[key] && mapToken[key].rate) {
          token.rate = mapToken[key].rate
        }
        if (mapToken[key] && mapToken[key].rateEth) {
          token.rate = mapToken[key].rateEth
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
    default: return state
  }
}

export default tokens
