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
      ethereum.call("getRate")(this.address, constants.ETHER_ADDRESS, reserve.index)
        .then(
        (result) => {
          var rate = new BigNumber(result[0])
          resolve(rate)
        })
    });

  }

  fetchRateEth(ethereum, reserve) {
    const _this = this;
    return new Promise((resolve, reject) => {
      ethereum.call("getRate")(constants.ETHER_ADDRESS, this.address, reserve.index)
        .then(
        (result) => {
          var rate = new BigNumber(result[0])
          resolve(rate)
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
        ethereum.call("getBalance")(ownerAddr).then((result) => {
          var balance = new BigNumber(result)
          resolve(balance)
        })
      }
      else {
        ethereum.call("getTokenBalance")(this.address, ownerAddr).then((result) => {
          var balance = new BigNumber(result)
          resolve(balance);
        })
      }
    });
  }
}

export function updateRatePromise(ethereum, source, rateTokenEth, rateEthToken, ownerAddr) {
  return new Promise((resolve) => {
    const rate = new Rate(
      source.name,
      source.symbol,
      source.icon,
      source.address,
      source.decimal
    )
    Promise.all([ Promise.resolve(new BigNumber(rateTokenEth)), Promise.resolve(new BigNumber(rateEthToken)), rate.updateBalance(ethereum, ownerAddr)])
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
  return new Promise((resolve) => {
    ethereum.call("getRateExchange")().then(
      (result) => {
        let tokenObj = {}
        result.map((token) => {
          tokenObj[token.source+'-'+token.dest] = token
        })
        var promises = tokens
        .filter((token) => {
          return tokenObj[token.symbol+'-'+constants.ETH.symbol] && tokenObj[constants.ETH.symbol+'-'+token.symbol]
        })
        .map((token) => {
          return updateRatePromise(ethereum, token, tokenObj[token.symbol+'-'+constants.ETH.symbol].rate, tokenObj[constants.ETH.symbol+'-'+token.symbol].rate, ownerAddr)
        });
        resolve(Promise.all(promises));
      }
    )
  });
}


export function fetchRate(ethereum, source, dest, reserve, callback) {
  ethereum.call("getRate")(source.address, dest.address, reserve.index)
          .then(
    (result) => {
      callback(new Rate(
        source, dest, reserve,
        result[0], result[1], result[2]))
    })
}

export function fetchRatePromise(ethereum, source, dest, reserve) {
  return new Promise((resolve, reject) => {
    ethereum.call("getRate")(source.address, dest.address, reserve.index)
            .then(
      (result) => {
        resolve(new Rate(
          source.name,
          source.symbol,
          source.icon,
          source.address,
          source.decimal,
          result[0],
          result[2]
        ))
      })
  })
}
