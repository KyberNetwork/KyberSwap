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
    // console.log(this.address)
    // console.log(reserve.index)
    
    return new Promise((resolve, reject)=>{
      ethereum.getRate(this.address, constants.ETHER_ADDRESS, reserve.index,
        (result) => {
          // _this.rate = result[0];
          // resolve(_this);
          resolve(result[0]);
        }) 
    });
    
  }

  updateBalance(ethereum, ownerAddr){
    const _this= this;
    return new Promise((resolve, reject)=>{
      if (!ownerAddr || !ownerAddr.length) {
        resolve(new BigNumber(0));
      }
      else if (this.address === constants.ETHER_ADDRESS){
        ethereum.getBalance(ownerAddr, (result) => {
          // _this.balance = result;
          // resolve(_this);
          resolve(result);
        })
      }
      else {
        ethereum.getTokenBalance(this.address, ownerAddr, (result) => {
          // _this.balance = result;
          // resolve(_this);
          resolve(result);
        })
      }
    });
  }
}

export function updateRatePromise(ethereum, source, reserve, ownerAddr){
  return new Promise((resolve) => {
    const rate = new Rate(
      source.name,
      source.symbol,
      source.icon,
      source.address
    )
    
    Promise.all([rate.fetchRate(ethereum, reserve), rate.updateBalance(ethereum, ownerAddr)])
      .then(values => {
        rate.rate = values[0];
        rate.balance = values[1];
        resolve(rate);
      })
  });
}

export function updateAllRatePromise(ethereum, tokens, reserve, ownerAddr){
  var promises = tokens.map((token) => {
    return updateRatePromise(ethereum, token, reserve, ownerAddr)
  });
  return Promise.all(promises);
}