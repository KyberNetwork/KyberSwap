import DappBrowser from "./DappBrowser"
import * as ethUtil from "ethereumjs-util";

export default class ImTokenBrowser extends DappBrowser {
  // async sign(message) {
  //   try {
  //     var account = await this.getCoinbase(true)
  //     var signature = await this.web3.eth.sign(message, account)

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
