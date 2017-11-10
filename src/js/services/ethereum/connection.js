import EthereumService from "./ethereum"
import { setConnection } from "../../actions/connectionActions"
import { store } from "../../store"


export function createNewConnection(){
    var connectionInstance = new EthereumService()
    connectionInstance.subcribe()
    store.dispatch(setConnection(connectionInstance))    

    setInterval(()=>{
        //check which connection is success
        var state = store.getState()
        var ethereum = state.connection.ethereum
        if (ethereum.currentLabel === "ws"){
            if(!ethereum.wsProvider.connection){
                ethereum.clearSubcription()
                ethereum.setProvider(ethereum.httpProvider)
                ethereum.currentLabel = "http"
                ethereum.subcribe()
                store.dispatch(setConnection(ethereum))                
                return
            }    
        }

        if (ethereum.currentLabel === "http"){            
            if(ethereum.wsProvider.connection){
                ethereum.clearSubcription()
                ethereum.setProvider(ethereum.wsProvider)
                ethereum.currentLabel = "ws"
                ethereum.subcribe()
                store.dispatch(setConnection(ethereum))                                
            }else{
                ethereum.wsProvider = ethereum.getWebsocketProvider()
                store.dispatch(setConnection(ethereum))                
            }   
            return         
        }
    },10000)
    
}
