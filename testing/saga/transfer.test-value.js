import EthereumService from "../instance/ethereum/ethereum.fake"
let ethereum = new EthereumService({ default: 'http' })
import Account from "../../src/js/services/account"
import { KeyStore, Trezor, Ledger } from "../../src/js/services/keys"
import * as BaseKey from "../../src/js/services/keys/baseKey"
import FakeLedger from "../instance/ledger/Ledger.fake"
import FakeTrezor from "../instance/trezor/Trezor.fake"
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
  amount:"0x2386f26fc10000",
  data:
  {
    amount: "0.01",
    destAddress: "0x028effd803e6f4dc4f597346602f98b693130bd9",
    tokenSymbol: "ETH",
  },
  destAddress: "0x028effd803e6f4dc4f597346602f98b693130bd9",
  ethereum: ethereum,
  formId: "transfer",
  gas: "0xf4240",
  gasPrice: "0x4a817c800",
  keyService: new KeyStore(),
  keystring: '{"version":3,"id":"04933224-8510-45f3-a3e2-882a8c149081","address":"f34791ada19af51d5b0dc927b8420a2c7dc9b704","crypto":{"ciphertext":"e4c51957a31da57e754498fd11da81d50424f3c2647fda816bc08ca51734f780","cipherparams":{"iv":"9f409c69b2c1eaf26c41e0ac8afd63cc"},"cipher":"aes-128-ctr","kdf":"pbkdf2","kdfparams":{"dklen":32,"salt":"07e47b0e900abe1aa4e2125e746a11ba7f6e87a696626c6ed0715113e3e4e75a","c":10240,"prf":"hmac-sha256"},"mac":"51d2dcb0a863a590d1c94bdbe315f0d9ec2ab3aa93f653d77922588a96ee2a65"}}',
  nonce: 22,
  password: "123",
  token: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  type: "keystore"
}

const ledgerSignError = {
  account: {
    address: "0x955fd7bb18f49d41d359d10a388c54280a0a0d72",
    avatar: "url",
    balance: "1000000000000000000",
    keystring: "m/44'/60'/0'/50",
    manualNonce: 0,
    nonce: 0,
    type: "ledger"
  },
  
  address: "0x955fd7bb18f49d41d359d10a388c54280a0a0d72",
  amount: "0x429d069189e0000",
  data: {
    amount: "0.3",
    destAddress: "0x52249ee04A2860c42704c0bbC74bd82cb9b56e98",
    tokenSymbol: "ETH"
  },
  
  destAddress: "0x52249ee04A2860c42704c0bbC74bd82cb9b56e98",
  ethereum: ethereum,
  formId: "transfer",
  gas: "0xf4240",
  gasPrice: "0x4a817c800",
  keyService: new FakeLedger('reject_sign'),
  keystring: "m/44'/60'/0'/50",
  nonce: 0,
  password: "",
  token: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  type: "ledger"
}
const trezorSignError = {
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
  amount: "0x429d069189e0000",
  data: {
    amount: "0.3",
    destAddress: "0x52249ee04A2860c42704c0bbC74bd82cb9b56e98",
    tokenSymbol: "ETH"
  },
  
  destAddress: "0x52249ee04A2860c42704c0bbC74bd82cb9b56e98",
  ethereum: ethereum,
  formId: "transfer",
  gas: "0xf4240",
  gasPrice: "0x4a817c800",
  keyService : new FakeTrezor('reject_sign'),
  keystring: "m/44'/60'/0'/0/95",
  nonce: 0,
  password: "",
  token: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  type: "trezor"
}
const perfectKeystore = {
  account:{
    address: "0x12f0453c1947269842c5646df98905533c1b9519",
    avatar: "url",
    balance: "7764062666516031961",
    keystring: '{"version":3,"id":"42a81fda-8d1b-4e61-a8ee-8703bc4137b5","address":"12f0453c1947269842c5646df98905533c1b9519","crypto":{"ciphertext":"5ac005ce89f9483b3415e8057e7410a1c06fb11611f811109df79a462fe868d3","cipherparams":{"iv":"8dccbd0a66094ae251f8ec79559fece2"},"cipher":"aes-128-ctr","kdf":"pbkdf2","kdfparams":{"dklen":32,"salt":"0c6d49adde05b145a29acec30fa9961f277fab5a99f09bfe4d25d6a41a9c5e7e","c":10240,"prf":"hmac-sha256"},"mac":"22f6275e7e7064a71768ece7215e2eea8c4d16971f1079b429c9ddefb9d061a2"}}',
    manualNonce: 185,
    nonce: 185,
    type: "keystore"
  },
  address: "0x12f0453c1947269842c5646df98905533c1b9519",
  amount: "0x0",
  data:{
    amount: "0",
    destAddress: "0x52249ee04A2860c42704c0bbC74bd82cb9b56e98",
    tokenSymbol: "ETH"
  },
  
  destAddress: "0x52249ee04A2860c42704c0bbC74bd82cb9b56e98",
  ethereum: ethereum,
  formId: "transfer",
  gas: "0xf4240",
  gasPrice: "0x4a817c800",
  keyService: new KeyStore(),
  keystring: '{"version":3,"id":"42a81fda-8d1b-4e61-a8ee-8703bc4137b5","address":"12f0453c1947269842c5646df98905533c1b9519","crypto":{"ciphertext":"5ac005ce89f9483b3415e8057e7410a1c06fb11611f811109df79a462fe868d3","cipherparams":{"iv":"8dccbd0a66094ae251f8ec79559fece2"},"cipher":"aes-128-ctr","kdf":"pbkdf2","kdfparams":{"dklen":32,"salt":"0c6d49adde05b145a29acec30fa9961f277fab5a99f09bfe4d25d6a41a9c5e7e","c":10240,"prf":"hmac-sha256"},"mac":"22f6275e7e7064a71768ece7215e2eea8c4d16971f1079b429c9ddefb9d061a2"}}',
  nonce: 185,
  password: "huyhoang",
  token: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  type: "keystore"
}

const { formId, address, token, amount, destAddress, nonce, gas,
  gasPrice, keystring, type, password} = perfectKeystore;
const { txParams } = BaseKey.sendEtherFromAccount(
  formId, ethereum, address,
  token, amount,
  destAddress, nonce, gas,
  gasPrice, keystring, type, password)
const signedTransaction = sealTxByKeystore(txParams, keystring, password);


export default {
  keystoreWrongPassphrase, ledgerSignError, perfectKeystore, trezorSignError, ethereum, signedTransaction
}