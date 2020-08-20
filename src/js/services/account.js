export default class Account {
  constructor(address, type, keystring, walletType, info, balance = 0, nonce = 0, manualNonce = 0, maxCap = "infinity", rich= false) {
    this.address = address
    this.type = type
    this.keystring = keystring
    this.balance = balance
    this.nonce = nonce
    this.manualNonce = manualNonce
    this.walletType = walletType
    this.info = info
    this.maxCap = maxCap
    this.rich = rich
  }

  shallowClone() {    
    return new Account(
      this.address, this.type, this.keystring, this.walletType, this.info,
      this.balance, this.nonce, this.manualNonce, this.maxCap, this.rich)
  }

  getUsableNonce() {
    var nonceFromNode = this.nonce
    var nonceManual = this.manualNonce
    return nonceFromNode < nonceManual ? nonceManual : nonceFromNode
  }

  sync(ethereum, account) {
    var promise
    const _this = account ? account : this
    promise = new Promise((resolve, reject) => {
      const acc = _this.shallowClone()
      ethereum.call("getBalanceAtLatestBlock", acc.address)
      .then((balance) => {
        acc.balance = balance
        resolve(acc)
      })
      .catch((err) => {
        reject(err)
      })
    })

    promise = promise.then((acc) => {
      return new Promise((resolve, reject) => {
        ethereum.call("getNonce", acc.address)
        .then((nonce) => {
          acc.nonce = nonce
          if (acc.nonce > acc.manualNonce) {
            acc.manualNonce = acc.nonce
          }
          resolve(acc)
        })
        .catch((err) => {
          reject(err)
        })
      })
    })
    return promise
  }

  incManualNonce() {
    const acc = this.shallowClone()
    acc.manualNonce = acc.manualNonce + 1
    return acc
  }
}
