import EthereumService from "./ethereum"
import { setConnection, setIntervalConnection, clearIntervalConnection } from "../../actions/connectionActions"
import { store } from "../../store"
import constants from "../../services/constants"

export function createNewConnection() {
    var connectionInstance = new EthereumService({ default: constants.CONNECTIONS_MODE.HTTP })    
    store.dispatch(setConnection(connectionInstance))
    connectionInstance.subcribe()

    var connetionInterval = setInterval(() => {
        //check which connection is success
        var state = store.getState()
        var ethereum = state.connection.ethereum
        if (ethereum.currentLabel === constants.CONNECTIONS_MODE.WS) {
            if (!ethereum.wsProvider.connection) {
                ethereum.clearSubcription()
                ethereum.setProvider(ethereum.httpProvider)
                ethereum.currentLabel = constants.CONNECTIONS_MODE.HTTP
                ethereum.subcribe()
                store.dispatch(setConnection(ethereum))
                return
            }
        }

        if (ethereum.currentLabel === constants.CONNECTIONS_MODE.HTTP) {
            if (ethereum.wsProvider.reconnectTime > 10) {
                store.dispatch(clearIntervalConnection())
            }
            if (ethereum.wsProvider.connection) {
                ethereum.clearSubcription()
                ethereum.wsProvider.reconnectTime = 0
                ethereum.setProvider(ethereum.wsProvider)
                ethereum.currentLabel = constants.CONNECTIONS_MODE.WS
                ethereum.subcribe()
                store.dispatch(setConnection(ethereum))
            } else {
                var reconnectTime = ethereum.wsProvider.reconnectTime
                ethereum.wsProvider = ethereum.getWebsocketProvider()
                ethereum.wsProvider.reconnectTime = reconnectTime + 1
                store.dispatch(setConnection(ethereum))
            }
            return
        }
    }, 10000)
    store.dispatch(setIntervalConnection(connetionInterval))
}
