import * as BLOCKCHAIN_INFO from "../../../env"
import * as converter from "../utils/converter"

function initState (tokens = BLOCKCHAIN_INFO.tokens) {
  let wrapperTokens = {}
  var timeStampNew = Math.floor(new Date().getTime() /1000) - 604800

  Object.keys(tokens).forEach((key) => {
    wrapperTokens[key] = {
      ...tokens[key],
      exchange_tx_approve_zero: null,
      exchange_tx_approve_max: null,
      limit_order_tx_approve_zero: null,
      limit_order_tx_approve_max: null
    }

    if(tokens[key].listing_time && tokens[key].listing_time > timeStampNew){            
      wrapperTokens[key].isNew = true
    }

    wrapperTokens[key].rate = 0
    wrapperTokens[key].minRate = 0
    wrapperTokens[key].rateEth = 0
    wrapperTokens[key].minRateEth = 0
    wrapperTokens[key].balance = 0
    wrapperTokens[key].rateUSD = 0
  })

  return wrapperTokens
}

const tokens = (state = {tokens: initState()}, action) => {
  switch (action.type) {
    case 'TOKEN.INIT_TOKEN':{
      const {tokens} = action.payload
      var wrappeTokens = initState(tokens)
      return Object.assign({}, state, { tokens: wrappeTokens })
    }
    case 'GLOBAL.ALL_RATE_UPDATED_FULFILLED': {
      var tokens = { ...state.tokens }
      var {rates, rateUSD} = action.payload
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

          var rateByUSD = converter.roundingRateNumber(converter.toT(rate.rate, 18)*rateUSD.replace(",", ""))
          mapToken[rate.source].rateUSD = rateByUSD.replace(",", "")
        } else {
          if (!mapToken[rate.dest]) {
            mapToken[rate.dest] = {}
          }
          mapToken[rate.dest].rateEth = rate.rate
          mapToken[rate.dest].minRateEth = converter.getMinrate(rate.rate, rate.minRate) 
        }
      })

      var newTokens = {}
      Object.keys(tokens).map(key => {
        var token = tokens[key]

        if (key === "ETH"){
          token.rateUSD = rateUSD
        }else{
          token.rateUSD = mapToken[key] ? mapToken[key].rateUSD: 0
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
      let tokens = {...state.tokens};
      
      Object.keys(state.tokens).forEach((symbol) => {
        tokens[symbol].balance = 0;
        tokens[symbol].balanceInETH = 0;
      });
      
      state.tokens = tokens;
      
      return state
    }
    case 'EXCHANGE.SET_APPROVE_TX':{
      const {hash, symbol} = action.payload
      var tokens = { ...state.tokens }
      tokens[symbol].approveTx = hash
      console.log(tokens)
      return Object.assign({}, state, { tokens: tokens }) 
    }

    case 'EXCHANGE.SET_APPROVE_TX_ZERO':{
      const {hash, symbol} = action.payload
      var tokens = { ...state.tokens }
      tokens[symbol].approveTxZero = hash
      console.log(tokens)
      return Object.assign({}, state, { tokens: tokens }) 
    }

    case 'EXCHANGE.REMOVE_APPROVE_TX':{
      const {symbol} = action.payload
      var tokens = { ...state.tokens }
      delete tokens[symbol].approveTx
      return Object.assign({}, state, { tokens: tokens }) 
    }

    case "LIMIT_ORDER.SAVE_APPROVE_ZERO_TX": {
      const { sourceTokenSymbol, txHash } = action.payload;
      const tokens = JSON.parse(JSON.stringify(state.tokens));
      tokens[sourceTokenSymbol.toUpperCase()].limit_order_tx_approve_zero = txHash;
      return Object.assign({}, state, { tokens: tokens });
    }

    case "LIMIT_ORDER.SAVE_APPROVE_MAX_TX": {
      const { sourceTokenSymbol, txHash } = action.payload;
      const tokens = JSON.parse(JSON.stringify(state.tokens));
      tokens[sourceTokenSymbol.toUpperCase()].limit_order_tx_approve_max = txHash;
      return Object.assign({}, state, { tokens: tokens });
    }

    case "EXCHANGE.SAVE_APPROVE_ZERO_TX": {
      const { sourceTokenSymbol, txHash } = action.payload;
      const tokens = JSON.parse(JSON.stringify(state.tokens));
      tokens[sourceTokenSymbol.toUpperCase()].exchange_tx_approve_zero = txHash;
      return Object.assign({}, state, { tokens: tokens });
    }

    case "EXCHANGE.SAVE_APPROVE_MAX_TX": {
      const { sourceTokenSymbol, txHash } = action.payload;
      const tokens = JSON.parse(JSON.stringify(state.tokens));
      tokens[sourceTokenSymbol.toUpperCase()].exchange_tx_approve_max = txHash;
      return Object.assign({}, state, { tokens: tokens });
    }

    default: return state
  }
}

export default tokens
