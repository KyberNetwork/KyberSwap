import BigNumber from "bignumber.js"
import constants from "../services/constants"

export default class Rate {
  constructor(name, symbol, icon, address, decimal, rate = new BigNumber(0), balance = new BigNumber(0), rateEth = new BigNumber(0)) {
    this.name = name;
    this.symbol = symbol;
    this.icon = icon;
    this.address = address;
    this.rate = rate;
    this.rateEth = rateEth;
    this.balance = balance;
    this.decimal = decimal;
  }

  fetchRate(ethereum, reserve) {
    const _this = this;
    return new Promise((resolve, reject) => {
      ethereum.getRate(this.address, constants.ETHER_ADDRESS, reserve.index,
        (result) => {
          resolve(result[0]);
        })
    });

  }

  fetchRateEth(ethereum, reserve) {
    const _this = this;
    return new Promise((resolve, reject) => {
      ethereum.getRate(constants.ETHER_ADDRESS, this.address, reserve.index,
        (result) => {
          resolve(result[0]);
        })
    });

  }

  updateBalance(ethereum, ownerAddr) {
    const _this = this;
    return new Promise((resolve, reject) => {
      if (!ownerAddr || !ownerAddr.length) {
        resolve(new BigNumber(0));
      }
      else if (this.address === constants.ETHER_ADDRESS) {
        ethereum.getBalance(ownerAddr, (result) => {
          resolve(result);
        })
      }
      else {
        ethereum.getTokenBalance(this.address, ownerAddr, (result) => {
          resolve(result);
        })
      }
    });
  }
}

export function updateRatePromise(ethereum, source, reserve, ownerAddr) {
  return new Promise((resolve) => {
    const rate = new Rate(
      source.name,
      source.symbol,
      source.icon,
      source.address,
      source.decimal
    )

    Promise.all([rate.fetchRate(ethereum, reserve), rate.fetchRateEth(ethereum, reserve), rate.updateBalance(ethereum, ownerAddr)])
      .then(values => {
        if (rate.symbol.toLowerCase() == "eth") {
          rate.rate = new BigNumber(1)
          rate.rateEth = new BigNumber(1)
        } else {
          rate.rate = values[0]
          rate.rateEth = values[1]
        }
        rate.balance = values[2]
        resolve(rate);
      })
  });
}

export function updateAllRatePromise(ethereum, tokens, reserve, ownerAddr) {
  var promises = tokens.map((token) => {
    return updateRatePromise(ethereum, token, reserve, ownerAddr)
  });
  return Promise.all(promises);
}