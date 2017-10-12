export default class Token {
  constructor(name, icon, symbol, address, owner, balance = 0) {
    this.name = name
    this.icon = icon
    this.symbol = symbol
    this.address = address
    this.ownerAddress = owner
    this.balance = balance
  }

  shallowClone() {
    return new Token(
      this.name, this.icon, this.symbol, this.address,
      this.ownerAddress, this.balance)
  }

  sync(ethereum, callback) {
    ethereum.getTokenBalance(
      this.address, this.ownerAddress, (balance) => {
        const tok = this.shallowClone()
        tok.balance = balance
        callback(tok)
    })
  }
}
