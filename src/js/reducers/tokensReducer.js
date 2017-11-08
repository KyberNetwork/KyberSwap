import {REHYDRATE} from 'redux-persist/constants'
import Rate from "../services/rate"
import BigNumber from "bignumber.js"
import SUPPORT_TOKENS from "../services/supported_tokens"

const initState = function(){
  let tokens = {}
  SUPPORT_TOKENS.forEach( (token) => {
    tokens[token.symbol] = token
    tokens[token.symbol].rate = 0
    tokens[token.symbol].rateEth = 0
    tokens[token.symbol].balance = 0    
  })
  return tokens
}()

const token = (state=initState, action) => {
  switch (action.type) {
    case REHYDRATE: {
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
                  tokenMap.decimal,
                  new BigNumber(tokenMap.rate ? tokenMap.rate: 0),
                  new BigNumber(tokenMap.balance ? tokenMap.balance : 0),
                  new BigNumber(tokenMap.rateEth ? tokenMap.rateEth : 0)
                )
                tokens[id] = token
            })
            return Object.assign({}, state, tokens)
        } else {
            return state;
        }            
    }
    // case "GLOBAL.RATE_UPDATED_FULFILLED": {
    //   var tokens = {...state.tokens}
    //   var token = action.payload
    //   tokens[token.symbol] = token
    //   return Object.assign({}, state, tokens)
    // }
    case 'GLOBAL.ALL_RATE_UPDATED_FULFILLED': {
      var tokens = {...state.tokens}
      var tokensData = action.payload;
      tokensData.forEach((data) => {
        tokens[data.symbol] = data
      })
      return Object.assign({}, state, tokens)
    }
    default: return state
  }
}

export default token
