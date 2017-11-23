import EthereumService from "../instance/ethereum/ethereum.fake"
let ethereum = new EthereumService({ default: 'http' })
import Account from "../../src/js/services/account"
import { KeyStore, Trezor, Ledger } from "../../src/js/services/keys"
import * as BaseKey from "../../src/js/services/keys/baseKey"
import FakeLedger from "../instance/ledger/Ledger.fake"
import FakeTrezor from "../instance/trezor/Trezor.fake"
import FakeKeyStore from "../instance/keystore/KeyStore.fake"
import { sealTxByKeystore} from "../../src/js/utils/sealer"

const account = new Account(
  "0xf34791ada19af51d5b0dc927b8420a2c7dc9b704", 
  "keystore",
  '{"version":3,"id":"04933224-8510-45f3-a3e2-882a8c149081","address":"f34791ada19af51d5b0dc927b8420a2c7dc9b704","crypto":{"ciphertext":"e4c51957a31da57e754498fd11da81d50424f3c2647fda816bc08ca51734f780","cipherparams":{"iv":"9f409c69b2c1eaf26c41e0ac8afd63cc"},"cipher":"aes-128-ctr","kdf":"pbkdf2","kdfparams":{"dklen":32,"salt":"07e47b0e900abe1aa4e2125e746a11ba7f6e87a696626c6ed0715113e3e4e75a","c":10240,"prf":"hmac-sha256"},"mac":"51d2dcb0a863a590d1c94bdbe315f0d9ec2ab3aa93f653d77922588a96ee2a65"}}'
);

const keystoreWrongPassphrase = {
  account: {
    address: "0xf34791ada19af51d5b0dc927b8420a2c7dc9b704",
    avatar: "url",
    balance: "312021173902076846",
    keystring: '{"version":3,"id":"04933224-8510-45f3-a3e2-882a8c149081","address":"f34791ada19af51d5b0dc927b8420a2c7dc9b704","crypto":{"ciphertext":"e4c51957a31da57e754498fd11da81d50424f3c2647fda816bc08ca51734f780","cipherparams":{"iv":"9f409c69b2c1eaf26c41e0ac8afd63cc"},"cipher":"aes-128-ctr","kdf":"pbkdf2","kdfparams":{"dklen":32,"salt":"07e47b0e900abe1aa4e2125e746a11ba7f6e87a696626c6ed0715113e3e4e75a","c":10240,"prf":"hmac-sha256"},"mac":"51d2dcb0a863a590d1c94bdbe315f0d9ec2ab3aa93f653d77922588a96ee2a65"}}',
    manualNonce: 22,
    nonce: 22,
    type: "keystore"
  },
  address: "0xf34791ada19af51d5b0dc927b8420a2c7dc9b704",
  data: {
    destAmount: "0.3302351",
    destTokenSymbol: "DGD",
    sourceAmount: "0.1",
    sourceTokenSymbol: "ETH"
  },
  
  destAddress: "0xf34791ada19af51d5b0dc927b8420a2c7dc9b704",
  destToken: "0xc94c72978bdcc50d763a541695d90a8416f050b2",
  ethereum: ethereum,
  formId: "exchange",
  gas: "0xf4240",
  gasPrice: "0x4a817c800",
  keyService: new KeyStore(),
  keystring: '{"version":3,"id":"04933224-8510-45f3-a3e2-882a8c149081","address":"f34791ada19af51d5b0dc927b8420a2c7dc9b704","crypto":{"ciphertext":"e4c51957a31da57e754498fd11da81d50424f3c2647fda816bc08ca51734f780","cipherparams":{"iv":"9f409c69b2c1eaf26c41e0ac8afd63cc"},"cipher":"aes-128-ctr","kdf":"pbkdf2","kdfparams":{"dklen":32,"salt":"07e47b0e900abe1aa4e2125e746a11ba7f6e87a696626c6ed0715113e3e4e75a","c":10240,"prf":"hmac-sha256"},"mac":"51d2dcb0a863a590d1c94bdbe315f0d9ec2ab3aa93f653d77922588a96ee2a65"}}',
  maxDestAmount: "0x8000000000000000000000000000000000000000000000000000000000000000",
  minConversionRate: "0x2dd44ed0b85356fb",
  nonce: 22,
  password: "123",
  sourceAmount: "0x16345785d8a0000",
  sourceToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  throwOnFailure: false,
  type: "keystore"
}

const trezorReject = {
  account: {
    address: "0x5a86e7a72573cdf89ef5184eca0deb7ac61cebbf",
    avatar: "url",
    balance: "1000000000000000000",
    keystring: "m/44'/60'/0'/0/95",
    manualNonce: 0,
    nonce: 0,
    type: "trezor"
  },
  
  address: "0x5a86e7a72573cdf89ef5184eca0deb7ac61cebbf",
  data: {
    destAmount: "1879.2525553",
    destTokenSymbol: "FUN",
    sourceAmount: "0.1",
    sourceTokenSymbol: "ETH",
  },
  destAddress: "0x5a86e7a72573cdf89ef5184eca0deb7ac61cebbf",
  destToken: "0xd3b0286ad5edac328bc9e625327853057e1a0e72",
  ethereum: ethereum,
  formId: "exchange",
  gas: "0xf4240",
  gasPrice: "0x4a817c800",
  keyService:  new FakeLedger('reject_sign'),
  keystring: "m/44'/60'/0'/0/95",
  maxDestAmount: "0x8000000000000000000000000000000000000000000000000000000000000000",
  minConversionRate: "0x3fabeae97b6cbd1fbe7",
  nonce: 0,
  password: "",
  sourceAmount: "0x16345785d8a0000",
  sourceToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  throwOnFailure: false,
  type: "trezor",
}

const trezorCheckTokenBalance = {
  account: {
    address: "0xf4682a4c0c092fd27d8b46a62a996df2313152dc",
    avatar: "url",
    balance: "0",
    keystring: "m/44'/60'/0'/0/96",
    manualNonce: 0,
    nonce: 0,
    type: "trezor"
  },
  
  address: "0xf4682a4c0c092fd27d8b46a62a996df2313152dc",
  data: {
    destAmount: "0.058117",
    destTokenSymbol: "ETH",
    sourceAmount: "20",
    sourceTokenSymbol: "KNC",
  },
  destAddress: "0xf4682a4c0c092fd27d8b46a62a996df2313152dc",
  destToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  ethereum: ethereum,
  formId: "exchange",
  gas: "0xf4240",
  gasPrice: "0x4a817c800",
  keyService:  new FakeLedger('reject_sign'),
  keystring: "m/44'/60'/0'/0/96",
  maxDestAmount: "0x8000000000000000000000000000000000000000000000000000000000000000",
  minConversionRate: "0xa52d8ba6b4047",
  nonce: 0,
  password: "",
  sourceAmount: "0x1158e460913d00000",
  sourceToken: "0x88c29c3f40b4e15989176f9546b80a1cff4a6b0d",
  throwOnFailure: false,
  type: "trezor",
}


const perfectKeyStore = {
  account: {
    address: "0x12f0453c1947269842c5646df98905533c1b9519",
    avatar: "url",
    balance: "9234398994782440172",
    keystring: '{"version":3,"id":"42a81fda-8d1b-4e61-a8ee-8703bc4137b5","address":"12f0453c1947269842c5646df98905533c1b9519","crypto":{"ciphertext":"5ac005ce89f9483b3415e8057e7410a1c06fb11611f811109df79a462fe868d3","cipherparams":{"iv":"8dccbd0a66094ae251f8ec79559fece2"},"cipher":"aes-128-ctr","kdf":"pbkdf2","kdfparams":{"dklen":32,"salt":"0c6d49adde05b145a29acec30fa9961f277fab5a99f09bfe4d25d6a41a9c5e7e","c":10240,"prf":"hmac-sha256"},"mac":"22f6275e7e7064a71768ece7215e2eea8c4d16971f1079b429c9ddefb9d061a2"}}',
    manualNonce: 192,
    nonce: 192,
    type: "keystore",
  },
  address: "0x12f0453c1947269842c5646df98905533c1b9519",
  data: {
    destAmount: "1.532857577",
    destTokenSymbol: "GNT",
    sourceAmount: "0.001",
    sourceTokenSymbol: "ETH",
  },
  destAddress: "0x12f0453c1947269842c5646df98905533c1b9519",
  destToken: "0xee45f2ff517f892e8c0d16b341d66f14a1372cff",
  ethereum: ethereum,
  formId: "exchange",
  gas: "0xf4240",
  gasPrice: "0x4a817c800",
  keyService: new FakeKeyStore('success'),
  keystring: '{"version":3,"id":"42a81fda-8d1b-4e61-a8ee-8703bc4137b5","address":"12f0453c1947269842c5646df98905533c1b9519","crypto":{"ciphertext":"5ac005ce89f9483b3415e8057e7410a1c06fb11611f811109df79a462fe868d3","cipherparams":{"iv":"8dccbd0a66094ae251f8ec79559fece2"},"cipher":"aes-128-ctr","kdf":"pbkdf2","kdfparams":{"dklen":32,"salt":"0c6d49adde05b145a29acec30fa9961f277fab5a99f09bfe4d25d6a41a9c5e7e","c":10240,"prf":"hmac-sha256"},"mac":"22f6275e7e7064a71768ece7215e2eea8c4d16971f1079b429c9ddefb9d061a2"}}',
  maxDestAmount: "0x8000000000000000000000000000000000000000000000000000000000000000",
  minConversionRate: "0x5318ac148df660d2f2",
  nonce: 192,
  password: "huyhoang",
  sourceAmount: "0x38d7ea4c68000",
  sourceToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  throwOnFailure: false,
  type: "keystore",
}

// const perfectKeyStore = {...keystoreWrongPassphrase, password: "huyhoang"}

export default {
  ethereum, keystoreWrongPassphrase, trezorReject, perfectKeyStore, trezorCheckTokenBalance
}