export default class Tx {
  constructor(
    hash, from, gas, gasPrice, nonce, status,
    type, data, address) {
    this.hash = hash
    this.from = from
    this.gas = gas
    this.gasPrice = gasPrice
    this.nonce = nonce
    this.status = status
    this.type = type
    this.data = data // data can be used to store wallet name
    this.address = address
  }

  shallowClone() {
    return new Tx(
    this.hash, this.from, this.gas, this.gasPrice, this.nonce,
    this.status, this.type, this.data, this.address)
  }

  sync = (ethereum, callback) => {
    ethereum.txMined(this.hash, (mined, address) => {
      var newTx = this.shallowClone()
      if (mined) {
        newTx.status = "mined"
      }
      else {
        newTx.status = "pending"
      }
      newTx.address = address
      callback(newTx)
    })
  }
}
