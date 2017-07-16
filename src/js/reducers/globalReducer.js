import {REHYDRATE} from 'redux-persist/constants'
import Rate from "../services/rate"
import BigNumber from "bignumber.js"


const initState = {
  currentBlock: 0,
  connected: true,
  termOfServiceAccepted: false,
  nodeName: "Infura Kovan",
  nodeURL: "https://kovan.infura.io/0BRKxQ0SFvAxGL72cbXi",
  rates: {},
}

const global = (state=initState, action) => {
  switch (action.type) {
    case REHYDRATE: {
      if (action.payload.global) {
        var loadedRates = action.payload.global.rates
        var rates = {}
        Object.keys(loadedRates).forEach((id) => {
          var rateMap = loadedRates[id]
          var rate = new Rate(
            rateMap.source,
            rateMap.dest,
            rateMap.reserve,
            new BigNumber(rateMap.rate),
            new BigNumber(rateMap.expirationBlock),
            new BigNumber(rateMap.balance),
          )
          rates[id] = rate
        })
        var newState = {...state, ...action.payload.global, rates: rates}
        return newState
      }
      return state
    }
    case "NEW_BLOCK_INCLUDED": {
      return {...state, currentBlock: action.payload}
    }
    case "GET_NEW_BLOCK_FAILED": {
      return {...state, connected: false}
    }
    case "RATE_UPDATED_FULFILLED": {
      var newRates = {...state.rates}
      var rate = action.payload
      newRates[rate.id()] = rate
      return {...state, rates: newRates }
    }
    case "TERM_OF_SERVICE_ACCEPTED": {
      return {...state, termOfServiceAccepted: true}
    }
  }
  return state
}

export default global
