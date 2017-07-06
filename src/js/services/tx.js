export default class Tx {
  constructor(
    hash, from, gas, gasPrice, nonce, status,
    source, sourceAmount, dest, minConversionRate,
    recipient, maxDestAmount
    ) {
    this.hash = hash
    this.from = from
    this.gas = gas
    this.gasPrice = gasPrice
    this.nonce = nonce
    this.status = status
    this.source = source
    this.sourceAmount = sourceAmount
    this.dest = dest
    this.minConversionRate = minConversionRate
    this.recipient = recipient
    this.maxDestAmount = maxDestAmount
  }

  shallowClone() {
    return new Tx(
    this.hash, this.from, this.gas, this.gasPrice, this.nonce,
    this.status, this.source, this.sourceAmount, this.dest,
    this.minConversionRate, this.recipient, this.maxDestAmount)
  }

  sync = (ethereum) => {
    var newTx = this.shallowClone()
    if (ethereum.txMined(newTx.hash)) {
      newTx.status = "mined"
    } else {
      newTx.status = "pending"
    }
    return newTx
  }
}
