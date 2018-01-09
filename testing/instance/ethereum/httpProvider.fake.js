import Web3 from "web3"
import BaseEthereumProvider from "./baseProvider.fake"

export default class HttpEthereumProvider extends BaseEthereumProvider {
    constructor(props) {
        super(props)
        this.rpcUrl = props.url
        this.rpc = new Web3(new Web3.providers.HttpProvider(this.rpcUrl, 9000))
        this.connection = true
        this.initContract()        
        this.intervalId = null
    }

    isConnected(){
        return this.connection
    }

    subcribeNewBlock(callBack){        
        callBack()
        this.intervalID = setInterval(callBack, 10000)
    }

    clearSubcription(){
        clearInterval(this.intervalID)
    }

}