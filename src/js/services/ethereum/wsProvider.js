import Web3 from "web3"
import BaseEthereumProvider from "./baseProvider"

export default class WebsocketEthereumProvider extends BaseEthereumProvider {
    constructor(props) {
        super(props)
        this.connection = true
        this.reconnectTime = 0
        this.rpcUrl = props.url
        this.provider = new Web3.providers.WebsocketProvider(this.rpcUrl)
        this.provider.on('end', (err) => {
            console.log(err)
            props.failEvent()
        })
        this.provider.on('error', (err) => {
            console.log(err)
            props.failEvent()
        })

        this.rpc = new Web3(this.provider)
        this.initContract()
    }


    isConnected() {
        return this.connection
    }

    subcribeNewBlock(callBack) {
        this.rpc.eth.subscribe("newBlockHeaders", callBack)
    }

    clearSubcription() {
        this.rpc.currentProvider.reset()
        this.provider.reset()
    }
}