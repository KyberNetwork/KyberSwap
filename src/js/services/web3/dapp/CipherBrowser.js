
import DappBrowser from "./DappBrowser"

export default class CipherBrowser extends DappBrowser {

  getCoinbase() {
    return new Promise((resolve, reject) => {
      this.web3.eth.getCoinbase((error, result) => {
        console.log(error)
        if (error || !result) {
          var error = new Error("Cannot get coinbase")
          reject(error)
        } else {
          resolve(result)
        }
      })
    })
  } 

  getWalletId(){
    return "0xdd61803d4a56c597e0fc864f7a20ec7158c6cba5"
  }

}