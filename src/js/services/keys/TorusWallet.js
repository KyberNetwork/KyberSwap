import Torus from "@toruslabs/torus-embed";
import Web3 from "web3";
import BLOCKCHAIN_INFO from "../../../../env"
import * as keyService from "./baseKey";

export default class TorusWallet {
  constructor() {
    this.torus = null;
    this.web3 = null;
    this.address = '';
  }
  
  async initiateWallet() {
    this.torus = new Torus();
  
    const params = {
      network: {
        host: BLOCKCHAIN_INFO["connections"]["http"][1]["endPoint"],
        chainId: BLOCKCHAIN_INFO.networkId,
        networkName: BLOCKCHAIN_INFO.chainName
      }
    };
  
    await this.torus.init(params);
    
    const addresses = await this.torus.login();
    
    this.address = addresses[0];
    this.web3 = new Web3(this.torus.provider);
  }
  
  clearSession = () => {
    // this.torus.cleanUp();
    this.torus.logout();
  };
  
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
        const {txParams} = result;
        this.sealTx(txParams).then(result => {
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
      this.web3.eth.sendTransaction(txParams, function (err, transactionHash) {
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
      return await this.web3.eth.personal.sign(message, account.address);
    } catch (err) {
      console.log(err);
      throw err
    }
  }
  
  getWalletName = () => {
    return 'Torus';
  }
}
