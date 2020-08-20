import * as keyService from "./baseKey"
import EthereumTx from "ethereumjs-tx"
import EthereumService from "../ethereum/ethereum"
import * as ethUtils from "ethereumjs-util"

export default class PrivateKey {
  async signSignature(message, account){
    const privateKey = account.keystring    
    var prefixHash = ethUtils.hashPersonalMessage(ethUtils.toBuffer(message))
    var sig = ethUtils.ecsign(ethUtils.toBuffer(prefixHash), ethUtils.toBuffer("0x" + privateKey))
    var rpcSig = ethUtils.toRpcSig(sig.v,  sig.r, sig.s)
    
    return rpcSig
  }
  
  async broadCastTx(funcName, ...args) {
    try {
      var txRaw = await this.callSignTransaction(funcName, ...args)
      var ethereum = new EthereumService()
      var txHash = await ethereum.callMultiNode("sendRawTransaction", txRaw)
      
      return txHash
    } catch(err) {
      console.log(err)
      throw err
    }
  }

  callSignTransaction = (funcName, ...args) => {
    return new Promise((resolve, reject) => {
      keyService[funcName](...args).then(result => {
        const { txParams, keystring, } = result
        const tx = this.sealTx(txParams, keystring)
        resolve(tx)
      }).catch(e => {
        console.log(e)
        reject(e)
      })
    })
  }

  sealTx = (params, keystring) => {
    const tx = new EthereumTx(params)
    const privateKey = Buffer.from(keystring, 'hex')
    tx.sign(privateKey)
    return tx
  }
  
  getWalletName = () => {
    return 'Private Key';
  }
}
