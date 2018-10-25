
import DappBrowser from "./DappBrowser"

export default class TrustBrowser extends DappBrowser {

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
    return "0xf1aa99c69715f423086008eb9d06dc1e35cc504d"
  }

}