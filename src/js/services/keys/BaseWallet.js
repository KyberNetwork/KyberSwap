import * as keyService from "./baseKey";

export default class BaseWallet {
  constructor() {
    this.web3 = null;
    this.needToBeInitiated = false;
  }
  
  async broadCastTx(funcName, ...args) {
    try {
      return await this.callSignTransaction(funcName, ...args);
    } catch (err) {
      console.log(err);
      throw err
    }
  }
  
  callSignTransaction = (funcName, ...args) => {
    return new Promise((resolve, reject) => {
      keyService[funcName](...args).then(result => {
        this.sealTx(result.txParams).then(result => {
          resolve(result)
        }).catch(e => {
          console.log(e.message);
          reject(e)
        })
      })
    })
  };
  
  sealTx = (txParams) => {
    txParams.gas = txParams.gasLimit;
    delete (txParams.gasLimit);
    
    return new Promise((resolve, reject) => {
      const eth = this.web3.eth ? this.web3.eth : this.web3.web3.eth;
      
      eth.sendTransaction(txParams, function (err, transactionHash) {
        if (!err) {
          resolve(transactionHash)
        } else {
          console.log(err);
          reject(err.message)
        }
      })
    })
  };
  
  async signSignature(message, account) {
    try {
      const ethPersonal = this.web3.eth ? this.web3.eth.personal : this.web3;
      return await ethPersonal.sign(message, account.address);
    } catch (err) {
      console.log(err);
      throw err
    }
  }
}
