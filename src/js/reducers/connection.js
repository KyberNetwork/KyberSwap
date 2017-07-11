import EthereumService from "../services/ethereum"


const initState = {
  ethereum: new EthereumService(),
}

const connection = (state=initState, action) => {
  return state
}

export default connection
