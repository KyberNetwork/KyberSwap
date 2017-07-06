export default class Rate {
  constructor(source, dest, reserve, rate, expirationBlock, balance) {
    this.source = source
    this.dest = dest
    this.reserve = reserve
    this.rate = rate
    this.expirationBlock = expirationBlock
    this.balance = balance
  }

  id() {
    return this.source.address + '-' + this.dest.address
  }
}
