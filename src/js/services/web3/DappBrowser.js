
import Web3 from "web3"


export default class DappBrowser {
  constructor() {
    this.web3 = new Web3(Web3.givenProvider)
  }

  getNetworkId = () => {
    return new Promise((resolve, reject) => {
      this.web3.eth.net.getId((error, result) => {
        // alert(error)
        // alert(result)
        if (error || !result) {
          var error = new Error("Cannot get network id")
          reject(error)
        } else {
          resolve(result)
        }
      })
    })
  }

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


  setDefaultAddress(address) {
    this.web3.eth.defaultAccount = address
  }

  getWalletId(){

  }

}