import {REHYDRATE} from 'redux-persist/constants'
import Rate from "../services/rate"
import BigNumber from "bignumber.js"
import GLOBAL from "../constants/globalActions"

const token = (state={}, action) => {
  switch (action.type) {
    case REHYDRATE: {
      if (action.payload.tokens) {
        var loadedTokens = action.payload.tokens
        var tokens = {}
        if(loadedTokens){
            Object.keys(loadedTokens).forEach((id) => {
                var tokenMap = loadedTokens[id]
                var token = new Rate(
                  tokenMap.name,
                  tokenMap.symbol,
                  tokenMap.icon,
                  tokenMap.address,
                  new BigNumber(tokenMap.rate),
                  new BigNumber(tokenMap.balance)
                )
                tokens[id] = token
            })
            return Object.assign({}, state, tokens)
        } else {
            return state;
        }
      }
      return state
    }
    case GLOBAL.RATE_UPDATED_FULFILLED: {
      var tokens = {...state.tokens}
      var token = action.payload
      tokens[token.symbol] = token
      return Object.assign({}, state, tokens)
    }
    default: return state
  }
}

export default token
