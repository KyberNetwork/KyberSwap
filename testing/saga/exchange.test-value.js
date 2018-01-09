import EthereumService from "../instance/ethereum/ethereum.fake"
let ethereum = new EthereumService({ default: 'http' })
import Account from "../../src/js/services/account"
import { KeyStore, Trezor, Ledger } from "../../src/js/services/keys"
import * as BaseKey from "../../src/js/services/keys/baseKey"
import FakeLedger from "../instance/ledger/Ledger.fake"
import FakeTrezor from "../instance/trezor/Trezor.fake"
import FakeKeyStore from "../instance/keystore/KeyStore.fake"

var account = new Account(
  "0xee41a6c2b36d80d6698641b83fc883c0e11af683", 
  "keystore",
  '{"version":3,"id":"143cecac-8639-4c12-9bb7-ca32e6ac3873","address":"ee41a6c2b36d80d6698641b83fc883c0e11af683","crypto":{"ciphertext":"c7368f3f9a5b2bd578985877b9f0afd10f1ad75cedcb030d508a045f96b2e213","cipherparams":{"iv":"aec29019a6ed80c939488cf9e03ff6aa"},"cipher":"aes-128-ctr","kdf":"pbkdf2","kdfparams":{"dklen":32,"salt":"f0d255037e3017e548ec2f8abc39141b21d914a1ba1e55ced76e38b9e08dcd67","c":10240,"prf":"hmac-sha256"},"mac":"7833dba575e38b5a43391c94716ed5ea9c53a616e700ee77223d5ab906e580bd"}}'
);

var ledgerAccount = new Account(
  "0xdc5b1a4ed7a548aa208843c5f70d6e13696f272a",
  "ledger",
  '{"version":3,"id":"d552930a-d78e-438b-ae39-1a95611d1940","address":"dc5b1a4ed7a548aa208843c5f70d6e13696f272a","crypto":{"ciphertext":"110ffb09ee29eb97e479913e48ad5ca74e60658de7a124218dcef78b24ed1662","cipherparams":{"iv":"0d50c43b5d258dc5a276f8cbe5116aa1"},"cipher":"aes-128-ctr","kdf":"pbkdf2","kdfparams":{"dklen":32,"salt":"5b2e1723806b8faa4a21856b266acb6080eb993b5395050a782fdf22bc550ed1","c":10240,"prf":"hmac-sha256"},"mac":"12624988e26e574d6d09d0a11c0b3a88e6eb0eb1bdd1ba18b7c7ba13aa5a7a88"}}'
)

var trezorAccount = new Account(
  "0x157022fc2da0fbecebcd1ed7766bd27316e44b5e",
  "trezor",
  '{"version":3,"id":"15acaca3-681c-4045-8d6c-572db8c780d2","address":"157022fc2da0fbecebcd1ed7766bd27316e44b5e","crypto":{"ciphertext":"966b44de71b0cbd1a0236b66055b6def2882ca5f68f55e9186fafe054a4465d8","cipherparams":{"iv":"210b2a32e33a65b89af160f04328b9d1"},"cipher":"aes-128-ctr","kdf":"pbkdf2","kdfparams":{"dklen":32,"salt":"9e6414abe2b84a180c087cea59876b716c5ad0196822616b072ab506d3090a16","c":10240,"prf":"hmac-sha256"},"mac":"329e71f1b2b06b3811cfc4bea16147d48fc4df297bb9eb2f577329293001f1cb"}}'
)

var pKeyAccount = new Account(
  "0x7427b84be85da9ea619f525d09e77d858e8ada49",
  "privateKey",
  '{"version":3,"id":"7131238e-aab1-4c49-a084-44ea34046504","address":"7427b84be85da9ea619f525d09e77d858e8ada49","crypto":{"ciphertext":"906cf9784d86df2a2ba1ccaa7c4f929f6fffe47717f002620b7c0a5ca40b01e0","cipherparams":{"iv":"828e7caa3ab9574cb18132d89a014245"},"cipher":"aes-128-ctr","kdf":"pbkdf2","kdfparams":{"dklen":32,"salt":"200b21b722c8dd46907f56735356b63f185279a8ece031fffc998171e0812799","c":10240,"prf":"hmac-sha256"},"mac":"759a088d26e836afa55951b19cecf51c44fb6b4c66cf0c65904048fd08bc3796"}}'
)

var metaMaskAccount = new Account(
  "0x7b2462642d995aa483cc9515c71003878499732f",
  "metaMask",
  '{"version":3,"id":"881d13b3-7abe-4328-8b6a-3c784c6e9b5f","address":"7b2462642d995aa483cc9515c71003878499732f","crypto":{"ciphertext":"c0f96362acf9753e367642d8604a17ebb196d5dc23c62ab4d2260dbc1c4786a2","cipherparams":{"iv":"76fb27c46deeb58593c49d592219b272"},"cipher":"aes-128-ctr","kdf":"pbkdf2","kdfparams":{"dklen":32,"salt":"2cd734efdf9dd9bf775f70b5613e5f3b9c185d274f0dd4aff206a435f905eb5f","c":10240,"prf":"hmac-sha256"},"mac":"ad64f3da70dc8e3993071d73e446c2edd08d36518653977bc522507ebb7e9f57"}}'
)

const keystoreWrongPassphrase = {
  account: account,
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

var exchangeSuccess = {
  account: {},
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
  gasPrice: "0x5a817c800",
  // keyService: new KeyStore(),
  // keystring: '{"version":3,"id":"42a81fda-8d1b-4e61-a8ee-8703bc4137b5","address":"12f0453c1947269842c5646df98905533c1b9519","crypto":{"ciphertext":"5ac005ce89f9483b3415e8057e7410a1c06fb11611f811109df79a462fe868d3","cipherparams":{"iv":"8dccbd0a66094ae251f8ec79559fece2"},"cipher":"aes-128-ctr","kdf":"pbkdf2","kdfparams":{"dklen":32,"salt":"0c6d49adde05b145a29acec30fa9961f277fab5a99f09bfe4d25d6a41a9c5e7e","c":10240,"prf":"hmac-sha256"},"mac":"22f6275e7e7064a71768ece7215e2eea8c4d16971f1079b429c9ddefb9d061a2"}}',
  maxDestAmount: "0x8000000000000000000000000000000000000000000000000000000000000000",
  minConversionRate: "0x5318ac148df660d2f2",
  // nonce: 192,
  password: "123qwe",
  sourceAmount: "0x38d7ea4c68000",
  sourceToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  throwOnFailure: false,
  // type: "keystore",
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

const perfectPrivateKey = {
  account: {
    address: "0x52249ee04a2860c42704c0bbc74bd82cb9b56e98",
    avatar: "url",
    balance: "9371655768903718468",
    keystring: "77bb1696de272658e4e68a1b34a0f49efd23821b6813bc8e4b9ef530fb002aa6",
    manualNonce: 184,
    nonce: 184,
    type: "privateKey",
  },
  address: "0x52249ee04a2860c42704c0bbc74bd82cb9b56e98",
  data: {
    destAmount: "33.987171",
    destTokenSymbol: "KNC",
    sourceAmount: "0.1",
    sourceTokenSymbol: "ETH",
  },
  destAddress: "0x52249ee04a2860c42704c0bbc74bd82cb9b56e98",
  destToken: "0x88c29c3f40b4e15989176f9546b80a1cff4a6b0d",
  ethereum: ethereum,
  formId: "exchange",
  gas: "0xf4240",
  gasPrice: "0x4a817c800",
  keyService: new FakeKeyStore('success'),
  keystring: "77bb1696de272658e4e68a1b34a0f49efd23821b6813bc8e4b9ef530fb002aa6",
  maxDestAmount: "0x8000000000000000000000000000000000000000000000000000000000000000",
  minConversionRate: "0x126caadc48523c926f",
  nonce: 184,
  password: "",
  sourceAmount: "0x16345785d8a0000",
  sourceToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  throwOnFailure: false,
  type: "privateKey",
}


// const perfectKeyStore = {...keystoreWrongPassphrase, password: "huyhoang"}

export default {
  account, ethereum, keystoreWrongPassphrase, trezorReject, 
  perfectKeyStore, trezorCheckTokenBalance, perfectPrivateKey, 
  exchangeSuccess, ledgerAccount, trezorAccount, pKeyAccount, metaMaskAccount
}