import EthereumService from "../services/ethereum";

const initState = {
  ethereum: new EthereumService(),
  currentBlock: 0,
  connected: true,
  rates: {},
}

const global = (state=initState, action) => {
  switch (action.type) {
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
  }
  return state
}

export default global;
