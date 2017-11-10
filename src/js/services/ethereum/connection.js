//import Web3 from "web3"
//import HttpEthereumProvider from "./httpProvider"
//import WebsocketEthereumProvider from "./wsProvider"
import EthereumService from "./ethereum"

//import { updateBlock, updateBlockFailed, updateRate, updateAllRate } from "../actions/globalActions"
//import { updateAccount } from "../actions/accountActions"
//import { updateTx } from "../actions/txActions"
//import { updateRateExchange } from "../actions/exchangeActions"
import { setConnection } from "../../actions/connectionActions"
//import SupportedTokens from "./supported_tokens"
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
