import constants from "../services/constants"

export default class Rate {
  constructor(name, symbol, icon, address, decimal, rate = 0, minRate = 0, 
                      balance = 0, rateEth = 0, minRateEth = 0, rateUSD = 0) {
    this.name = name
    this.symbol = symbol
    this.icon = icon
    this.address = address
    this.rate = rate
    this.minRate = minRate
    this.rateEth = rateEth
    this.minRateEth = minRateEth
    this.rateUSD = rateUSD
    this.balance = balance
    this.decimal = decimal
  }
}