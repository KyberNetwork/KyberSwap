import {REHYDRATE} from 'redux-persist/lib/constants'
import Rate from "../services/rate"
import BigNumber from "bignumber.js"
import * as BLOCKCHAIN_INFO from "../../../env"

const initState = function(){
  let tokens = {}
  Object.keys(BLOCKCHAIN_INFO.tokens).forEach((key) => {
    tokens[key] = BLOCKCHAIN_INFO.tokens[key]
    tokens[key].rate = 0
    tokens[key].rateEth = 0
    tokens[key].balance = 0    
  }) 
  return {tokens: tokens}
}()

const tokens = (state=initState, action) => {
  switch (action.type) {
    case REHYDRATE: {
      var payload = action.payload
        var tokens = {}        
        if(payload){
          var loadedTokens = payload.tokens
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
            return Object.assign({}, state, {tokens: tokens})
        } else {
            return state;
        }            
    }
    case 'GLOBAL.ALL_RATE_UPDATED_FULFILLED': {
      var tokens = {...state.tokens}
      var tokensData = action.payload;
      tokensData.forEach((data) => {
        tokens[data.symbol] = data
      })
      return Object.assign({}, state, {tokens: tokens})
    }
    default: return state
  }
}

export default tokens
