const initMarket = {
  tokens: []
}

const market = (state = initMarket, action) => {
  let newState = { ...state }
  switch (action.type) {
    case 'MARKET.GET_MARKET_INFO_SUCCESS': {
      return  {
        ...newState,
        tokens: action.payload
      };
    }
    default: return state
  }
}

export default market
