import EthereumTx from "ethereumjs-tx"

export default class FakeKeyStore {
  constructor(type){
    this.type = type
  }

  callSignTransaction = (funcName, ...args) => {
    switch(this.type) {
      case "reject_sign":
        return Promise.reject({
          message: "Cannot sign transaction"
        })
        break;
      case 'success':
        var response = {
          r: "5de2db8eada099d8b056557a8a3aa7486dad333071cf882da779d485347e7da6",
          s: "3c271d0582f4030296c05b31efc92832449a3b87f6a62a187789a30ff8afcfc1",
          success: true,
          v: 120
        }
        var v = new Buffer([response.v]);
        var r = new Buffer(response.r, 'hex');
        var s = new Buffer(response.s, 'hex');
        var tx = new EthereumTx({
          nonce: 191,
          gasPrice: "0x4a817c800",
          gasLimit: "0xf4240",
          to: "0x00a8a6f8db6793174d500b0eb9e1f5b2402f80c3",
          value: "0x16345785d8a0000",
          data: "0x93766a57000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee000000000000000000000000000000000000000000000000016345785d8a000000000000000000000000000088c29c3f40b4e15989176f9546b80a1cff4a6b0d0000000000000000000000000d225f12898e0ca01867290a61f4cbfe11a1da8a800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001677b59fde7b1dd0e50000000000000000000000000000000000000000000000000000000000000000",
          v: v,
          r: r,
          s: s
        })
        return Promise.resolve(tx)
        break;
      default:
        return Promise.reject("caw")
    }
  }
}
