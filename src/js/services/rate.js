import BigNumber from "bignumber.js"
import constants from "../services/constants"

export default class Rate {
  constructor(name, symbol, icon, address, rate = new BigNumber(0), balance = new BigNumber(0)){
    this.name = name;
    this.symbol = symbol;
    this.icon = icon;
    this.address = address;
    this.rate = rate;
    this.balance = balance;
  }

  fetchRate(ethereum, reserve){
    const _this= this;
    return new Promise((resolve, reject)=>{
      ethereum.getRate(this.address, constants.ETHER_ADDRESS, reserve.index,
        (result) => {
          _this.rate = result[0];
          resolve(_this);
        }) 
    });
    
  }

  updateBalance(ethereum, ownerAddr){
    const _this= this;
    return new Promise((resolve, reject)=>{
      if (!ownerAddr || !ownerAddr.length) {
        resolve(new BigNumber(0));
      }
      else {
        ethereum.getTokenBalance(this.address, ownerAddr, (result) => {
          _this.balance = result;
          resolve(_this);
        })
      }
    });
  }
}
