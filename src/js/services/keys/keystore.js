import * as keyService from "./baseKey"
import EthereumTx from "ethereumjs-tx"
import { unlock } from "../../utils/keys"
import EthereumService from "../ethereum/ethereum"
import secp256k1 from "secp256k1"
import ethUtils from "ethereumjs-util"

export default class KeyStore {


  async signSignature(data, account){
    const privateKey = unlock(account.keystring, account.password, true)
    const sig = secp256k1.sign(data, ethUtils.toBuffer(privateKey))
    return sig.signature
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


  callSignTransaction = (funcName, ...args) =>{
    return new Promise((resolve, reject) => {
      keyService[funcName](...args).then(result => {
        const { txParams, keystring, password } = result
        try {
          const tx = this.sealTx(txParams, keystring, password)
          resolve(tx)
        }catch(e) {
          console.log(e)
          reject(e)
        }
      })
    })
  }

  sealTx = (txParams, keystring, password) => {
    const tx = new EthereumTx(txParams)
    const privKey = unlock(keystring, password, true)
    tx.sign(privKey)
    return tx
  }
}
