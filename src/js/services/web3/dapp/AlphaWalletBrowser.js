import DappBrowser from "./DappBrowser"
import * as ethUtil from "ethereumjs-util";

export default class AlphaWalletBrowser extends DappBrowser {

  // personalCall = (message, account) => {
  //   return new Promise((resolve, reject)=>{
  //     web3.personal.sign(message, account, (error, result)=>{
  //       if(!error){
  //         resolve(result)
  //       }else{
  //         reject(error)
  //       }
  //     })
  //   })
  // }

  // async sign(message) {
  //   try {
  //     var account = await this.getCoinbase(true)
      
  //     var signature = await this.personalCall(message, account)

  //     var {v, r, s} = ethUtil.fromRpcSig(signature)
  //     r = ethUtil.bufferToHex(r)
  //     s = ethUtil.bufferToHex(s)

  //     signature = ethUtil.toRpcSig(v, r, s)

  //     return signature
  //   } catch(err) {
  //     console.log(err)
  //     throw err
  //   }
  // }
}
