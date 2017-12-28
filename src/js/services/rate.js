import BigNumber from "bignumber.js"
import constants from "../services/constants"

export default class Rate {
  constructor(name, symbol, icon, address, decimal, rate = new BigNumber(0), balance = new BigNumber(0), rateEth = new BigNumber(0), rateUSD = 0) {
    this.name = name
    this.symbol = symbol
    this.icon = icon
    this.address = address
    this.rate = rate
    this.rateEth = rateEth
    this.rateUSD = rateUSD
    this.balance = balance
    this.decimal = decimal
  }
}