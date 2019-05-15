import * as keyService from "./baseKey"
import EthereumTx from "ethereumjs-tx"
import EthereumService from "../ethereum/ethereum"

import ethUtils from "ethereumjs-util"


export default class PrivateKey {


  async signSignature(message, account){
    const privateKey = account.keystring    
    var sig = ethUtils.ecsign(ethUtils.toBuffer(message), ethUtils.toBuffer("0x" + privateKey))
    var rpcSig = ethUtils.toRpcSig(sig.v,  sig.r, sig.s)
    return rpcSig
  }
  
  async broadCastTx(funcName, ...args) {
    try{
      var txRaw = await this.callSignTransaction(funcName, ...args)
      try{
        var ethereum = new EthereumService()
        var txHash = await ethereum.callMultiNode("sendRawTransaction", txRaw)
        return txHash
      }catch(err){
        console.log(err)
        throw err
      }
      
    }catch(err){
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

    // const { txParams, keystring, } = keyService[funcName](...args)
    // console.log(txParams, keystring)
    // const tx = this.sealTx(txParams, keystring)
    // console.log(tx)
    // return new Promise((resolve) => {
    //   resolve(tx)
    // })
  }

  sealTx = (params, keystring) => {
    const tx = new EthereumTx(params)
    const privateKey = Buffer.from(keystring, 'hex')
    tx.sign(privateKey)
    return tx
  }
}
