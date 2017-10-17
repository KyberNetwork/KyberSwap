import BigNumber from "bignumber.js"

export default class Rate {
  constructor(name, symbol, icon, address, rate, reserve, balance = new BigNumber(0)){
    this.name = name;
    this.symbol = symbol;
    this.icon = icon;
    this.address = address;
    this.rate = rate;
    this.balance = balance;
  }
}

export function updateBalancePromise(ethereum, source, ownerAddr) {
  if (!ownerAddr || !ownerAddr.length) return new BigNumber(0);
  return new Promise((resolve, reject)=>{
    ethereum.getTokenBalance(source.address, ownerAddr, (result) => {
      resolve(result);
    })
  })  
}

