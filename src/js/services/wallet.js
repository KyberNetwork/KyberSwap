import SupportedTokens from "./supported_tokens"
import Token from "./token"

export default class Wallet {
  constructor(address, ownerAddress, name, desc, balance = 0, tokens = {}, createdTime = Date.now()) {
    this.address = address
    this.ownerAddress = ownerAddress
    this.name = name
    this.description = desc
    this.balance = balance
    this.tokens = tokens
    this.createdTime = createdTime
  }

  shallowClone() {
    return new Wallet(
      this.address, this.ownerAddress, this.name, this.description,
      this.balance, this.tokens, this.createdTime )
  }

  sync(ethereum, wallet) {
    var promise
    var _this = wallet? wallet: this

    _this.tokens = {}
    for (var i = 0; i < SupportedTokens.length; i++ ) {
      var tok = SupportedTokens[i];
      wallet.addToken(
        new Token(tok.name, tok.icon, tok.symbol, tok.address, _this.address)
      )
    }

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
