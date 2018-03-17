


export default class Web3Service {
  constructor(web3Instance) {
    this.web3 = web3Instance
  }

  isTrust = () => {
    //is trust
    if (web3.currentProvider && web3.currentProvider.isTrust === true){
      return true
    }

    //is cipher
    // if(!!window.CIPHER){
    //   return true
    // }
   if (web3.currentProvider && web3.currentProvider.constructor && web3.currentProvider.constructor.name === "CipherProvider"){
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
