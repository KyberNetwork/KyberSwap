//import EthereumService from "../services/ethereum"


const initState = {
//  ethereum: new EthereumService(),
}

const connection = (state=initState, action) => {
  switch (action.type) {
    case "CONN.SET_CONNECTION":
      return {...state, ethereum: action.payload}
  }
  return state
}

export default connection
