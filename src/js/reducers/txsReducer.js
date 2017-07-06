const initState = {
}

const txs = (state=initState, action) => {
  switch (action.type) {
    case "TX_ADDED": {
      var newState = {...state}
      newState[action.payload.hash] = action.payload
      return newState
    }
    case "UPDATE_TXS": {
      return {...state, ...action.payload}
    }
  }
  return state
}

export default txs
