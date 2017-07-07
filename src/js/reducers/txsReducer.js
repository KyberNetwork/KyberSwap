const initState = {
}

const txs = (state=initState, action) => {
  switch (action.type) {
    case "TX_ADDED": {
      var newState = {...state}
      newState[action.payload.hash] = action.payload
      return newState
    }
    case "UPDATE_TX_FULFILLED": {
      var newState = {...state}
      newState[action.payload.hash] = action.payload
      return newState
    }
  }
  return state
}

export default txs
