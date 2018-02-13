


export default class Web3Service {
  constructor(web3Instance) {
    this.web3 = web3Instance
  }

  isTrust = () => {
    if (web3.provider.isTrust === true){
      return true
    }
    return false
  }
  getNetworkId = ()=> {
    return new Promise((resolve, reject)=>{
      this.web3.version.getNetwork((error, result) => { 
        if (error || !result) {
          var error = new Error("Cannot get network id")
          reject(error)
        }else{
          resolve(result)
        }
      })
    })
  }

  getCoinbase(){
    return new Promise((resolve, reject)=>{
      this.web3.eth.getCoinbase((error, result) => {
        if (error || !result) {
          var error = new Error("Cannot get coinbase")
          reject(error)
        }else{
          resolve(result)
        }
      })
    })
  }
  setDefaultAddress(address){
    web3.eth.defaultAccount = address
  }
}
