import EthereumService from "./ethereum.fake"
import { setConnection, setIntervalConnection, clearIntervalConnection } from "../../actions/connectionActions"
import { store } from "../../store"


export function createNewConnection() {
    var connectionInstance = new EthereumService({ default: 'http' })    
    store.dispatch(setConnection(connectionInstance))
    // connectionInstance.subcribe()

    // var connetionInterval = setInterval(() => {
    //     //check which connection is success
    //     var state = store.getState()
    //     var ethereum = state.connection.ethereum
    //     if (ethereum.currentLabel === "ws") {
    //         if (!ethereum.wsProvider.connection) {
    //             ethereum.clearSubcription()
    //             ethereum.setProvider(ethereum.httpProvider)
    //             ethereum.currentLabel = "http"
    //             ethereum.subcribe()
    //             store.dispatch(setConnection(ethereum))
    //             return
    //         }
    //     }

    //     if (ethereum.currentLabel === "http") {
    //         if (ethereum.wsProvider.reconnectTime > 10) {
    //             store.dispatch(clearIntervalConnection())
    //         }
    //         if (ethereum.wsProvider.connection) {
    //             ethereum.clearSubcription()
    //             ethereum.wsProvider.reconnectTime = 0
    //             ethereum.setProvider(ethereum.wsProvider)
    //             ethereum.currentLabel = "ws"
    //             ethereum.subcribe()
    //             store.dispatch(setConnection(ethereum))
    //         } else {
    //             var reconnectTime = ethereum.wsProvider.reconnectTime
    //             ethereum.wsProvider = ethereum.getWebsocketProvider()
    //             ethereum.wsProvider.reconnectTime = reconnectTime + 1
    //             store.dispatch(setConnection(ethereum))
    //         }
    //         return
    //     }
    // }, 10000)
    // store.dispatch(setIntervalConnection(connetionInterval))
    return connectionInstance;
}
