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
