import { REHYDRATE } from 'redux-persist/lib/constants'
import Rate from "../services/rate"
import * as BLOCKCHAIN_INFO from "../../../env"
import constants from "../services/constants"

import * as converter from "../utils/converter"

function initState (tokens = BLOCKCHAIN_INFO.tokens) {
  let wrapperTokens = {}

  //var timeNow = new Date()
  var timeStampNew = Math.floor(new Date().getTime() /1000) - 604800

  Object.keys(tokens).forEach((key) => {
    wrapperTokens[key] = {...tokens[key]}

    if(tokens[key].listing_time && tokens[key].listing_time > timeStampNew){            
      wrapperTokens[key].isNew = true
    }
    // if(tokens[key].expireDate){            
    //     var timeExpire = new Date(BLOCKCHAIN_INFO.tokens[key].expireDate)
    //     var expireTimeStamp = timeExpire.getTime()
    //     if (timeStampNow > expireTimeStamp) {
    //         tokens[key].isNew = false
    //     }
    // }

    wrapperTokens[key].rate = 0
    wrapperTokens[key].minRate = 0
    wrapperTokens[key].rateEth = 0
    wrapperTokens[key].minRateEth = 0
    wrapperTokens[key].balance = 0
    wrapperTokens[key].rateUSD = 0
  })

  return wrapperTokens
  // return {
  //   tokens: tokens,
  //   count: { storageKey: constants.STORAGE_KEY }
  // }
}

const tokens = (state = {tokens: initState()}, action) => {
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
    case 'TOKEN.INIT_TOKEN':{
      const {tokens} = action.payload
      var wrappeTokens = initState(tokens)
      return Object.assign({}, state, { tokens: wrappeTokens })
    }
    case 'GLOBAL.ALL_RATE_UPDATED_FULFILLED': {
      var tokens = { ...state.tokens }
      var {rates, rateUSD} = action.payload
      console.log("mapToken")
      if (!rates){
        return state
      }
      //map token
      var mapToken = {}
      rates.map(rate => {
        if (!tokens[rate.source] || !tokens[rate.dest]) return
        if (rate.source !== "ETH") {
          if (!mapToken[rate.source]) {
            mapToken[rate.source] = {}
          }
          mapToken[rate.source].rate = rate.rate          
          mapToken[rate.source].minRate = converter.getMinrate(rate.rate, rate.minRate)

          mapToken[rate.source].rateUSD = converter.roundingNumber(converter.toT(rate.rate, 18)*rateUSD)
          //mapToken[rate.source].rateUSD = rateUSD
        } else {
          if (!mapToken[rate.dest]) {
            mapToken[rate.dest] = {}
          }
          mapToken[rate.dest].rateEth = rate.rate
          mapToken[rate.dest].minRateEth = converter.getMinrate(rate.rate, rate.minRate) 

         // mapToken[rate.dest].rateUSD = converter.roundingNumber(converter.toT(rate.rate, 18)*rateUSD)
        }
      })
      // console.log("mapToken")
      // console.log(mapToken)
      // console.log(tokens)
      //push data
      var newTokens = {}
      Object.keys(tokens).map(key => {

        if (!mapToken[key]){
          console.log(key)
          return
        }
        var token = tokens[key]

        if (key === "ETH"){
          token.rateUSD = rateUSD
        }else{
          token.rateUSD = mapToken[key].rateUSD
        }

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
      var newTokens = { ...state.tokens }
      var rateETHUSD = action.payload.rateETHUSD

      //push data
      newTokens['ETH'].rateUSD = rateETHUSD
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
  //   case 'GLOBAL.UPDATE_TOKEN_STATUS': {
  //     var timeNow = new Date()
  //     var timeStampNow = timeNow.getTime()
  //     var tokens = { ...state.tokens }
  //     Object.keys(tokens).map(key => {
  //         if (!tokens[key]) return
  //         var timeExpire = new Date(tokens[key].expireDate)
  //         var expireTimeStamp = timeExpire.getTime()
  //         if (timeStampNow > expireTimeStamp) {
  //             tokens[key].isNew = false
  //         }
  //     })
  //     return Object.assign({}, state, { tokens: tokens }) 
  // }
    default: return state
  }
}

export default tokens
