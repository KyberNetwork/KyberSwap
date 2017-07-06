import EthereumService from "../services/ethereum";

const initState = {
  ethereum: new EthereumService(),
  currentBlock: 0,
  connected: true,
  rates: {},
}

const global = (state=initState, action) => {
  switch (action.type) {
    case "GLOBAL_INIT": {
      return {...state, ethereum: action.payload}
    }
    case "NEW_BLOCK_INCLUDED": {
      return {...state, currentBlock: action.payload}
    }
    case "GET_NEW_BLOCK_FAILED": {
      return {...state, connected: false}
    }
    case "RATES_UPDATED": {
      return {...state, rates: action.payload}
    }
  }
  return state
}

export default global;
