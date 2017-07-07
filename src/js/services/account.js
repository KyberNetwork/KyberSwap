export default class Account {
  constructor(address, keystring, name, desc, balance, nonce, tokens, manualNonce) {
    this.address = address
    this.key = keystring
    this.name = name
    this.description = desc
    this.balance = balance || 0
    this.nonce = nonce || 0
    this.tokens = tokens || {}
    this.manualNonce = manualNonce || 0
  }

  shallowClone() {
    return new Account(
      this.address, this.key, this.name, this.description,
      this.balance, this.nonce, this.tokens, this.manualNonce)
  }

  getUsableNonce() {
    var nonceFromNode = this.nonce
    var nonceManual = this.manualNonce
    return nonceFromNode < nonceManual ? nonceManual : nonceFromNode
  }

  setPrivKey(key) {
    const acc = this.shallowClone()
    acc.privKey = key;
    return acc
  }

  updateKey(keystring) {
    const acc = this.shallowClone()
    acc.key = keystring
    return acc
  }

  sync(ethereum, callback) {
    var promise
    promise = new Promise((resolve, reject) => {
      const acc = this.shallowClone()
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

    Object.keys(this.tokens).forEach((key) => {
      promise = promise.then((acc) => {
        return new Promise((resolve, reject) => {
          acc.tokens[key].sync(ethereum, (token) => {
            acc.tokens[key] = token
            resolve(acc)
          })
        })
      })
    })

    promise.then((acc) => {
      console.log("finally", acc)
      callback(acc)
    })
  }

  incManualNonce() {
    const acc = this.shallowClone()
    acc.manualNonce = acc.manualNonce + 1
    return acc
  }

  addToken(token) {
    const acc = this.shallowClone()
    acc.tokens[token.address] = token;
    return acc
  }
}
