export default class Wallet {
  constructor(address, ownerAddress, name, desc, balance, tokens, createdTime) {
    this.address = address
    this.ownerAddress = ownerAddress
    this.name = name
    this.description = desc
    this.balance = balance || 0
    this.tokens = tokens || {}
    this.createdTime = createdTime ? createdTime : Date.now()
  }

  shallowClone() {
    return new Wallet(
      this.address, this.ownerAddress, this.name, this.description,
      this.balance, this.tokens, this.createdTime )
  }

  sync(ethereum, wallet) {
    var promise
    var _this = wallet? wallet: this
    promise = new Promise((resolve, reject) => {
      const acc = _this.shallowClone()
      ethereum.getBalance(acc.address, (balance) => {
        acc.balance = balance
        resolve(acc)
      })
    })

    promise = promise.then((acc) => {
      return new Promise((resolve, reject) => {
        ethereum.getNonce(acc.address, (nonce) => {
          acc.nonce = nonce
          if (acc.nonce > acc.manualNonce) {
            acc.manualNonce = acc.nonce
          }
          resolve(acc)
        })
      })
    })

    Object.keys(_this.tokens).forEach((key) => {
      promise = promise.then((acc) => {
        return new Promise((resolve, reject) => {
          acc.tokens[key].sync(ethereum, (token) => {
            acc.tokens[key] = token
            resolve(acc)
          })
        })
      })
    })

    return promise
    // promise.then((acc) => {
    //   callback(acc)
    // })
  }

  addToken(token) {
    const acc = this.shallowClone()
    acc.tokens[token.address] = token;
    return acc
  }
}
