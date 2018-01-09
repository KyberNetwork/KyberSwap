import EthereumService from "../instance/ethereum/ethereum.fake"
let ethereum = new EthereumService({ default: 'http' })
import Account from "../../src/js/services/account"
import { KeyStore, Trezor, Ledger } from "../../src/js/services/keys"
import * as BaseKey from "../../src/js/services/keys/baseKey"
import FakeLedger from "../instance/ledger/Ledger.fake"
import FakeTrezor from "../instance/trezor/Trezor.fake"
// import { sealTxByKeystore} from "../../src/js/utils/sealer"

var account = new Account(
  "0xe23d874235087e16e2bded03e8b5c0c984c7172c", 
  "keystore",
  '{"version":3,"id":"93341300-82dc-4a97-938a-5d77414a3d0b","address":"e23d874235087e16e2bded03e8b5c0c984c7172c","crypto":{"ciphertext":"122fdccadf9e7a842bfc55d4ac355b7c2ffafb4676e52c01953b752b7669f444","cipherparams":{"iv":"f086bd941bb59c8cbad01106a6e2c9fb"},"cipher":"aes-128-ctr","kdf":"pbkdf2","kdfparams":{"dklen":32,"salt":"b3e642bcad6b1558d6e9170f4c8a86b9a232cab849170816ddb9ece9fc135737","c":10240,"prf":"hmac-sha256"},"mac":"2e7490163e1842b5d5bba1da63e117203a530837c7d88e9f725bf546430a10f9"}}'
);

var ledgerAccount = new Account(
  "0x08316412fb368e14031473d3517eb38508c90fac",
  "ledger",
  '{"version":3,"id":"ccf770d6-e339-48d1-a1e6-40859d2df9e3","address":"08316412fb368e14031473d3517eb38508c90fac","crypto":{"ciphertext":"81cdeafcc21df5455c1cf6a8d3cb6b712bd142c2795134aef82e946e5b5a0080","cipherparams":{"iv":"fd8ec40ffdf3dbb3ee4c8e66efee36ee"},"cipher":"aes-128-ctr","kdf":"pbkdf2","kdfparams":{"dklen":32,"salt":"85f557f6d4c4257b72fe9ae021b7ad26282dfd5ba9ae5baae824c29974743643","c":10240,"prf":"hmac-sha256"},"mac":"dc7c822fd81c3edc89ace6e13e2b27fb8c0cd0585ce285910fb7280c3a5c5113"}}'
)

var trezorAccount = new Account(
  "0x991ccb2bc8e181ab4a7a0618ca80de60a03663da",
  "trezor",
  '{"version":3,"id":"d0a69514-e337-46de-b3cc-11f797ce2d72","address":"991ccb2bc8e181ab4a7a0618ca80de60a03663da","crypto":{"ciphertext":"6924c9ee442e8d6563789d3e4c598fc7f2da86736694af228880890ac8499383","cipherparams":{"iv":"f76092e78b4ddc6ed593056f82c9e1b7"},"cipher":"aes-128-ctr","kdf":"pbkdf2","kdfparams":{"dklen":32,"salt":"abdb9f641fb89f7c71d42a4fa023eef43436ab07561bffbfa30ded1c8c72705a","c":10240,"prf":"hmac-sha256"},"mac":"8d125e6e0fa23bd30a8295a07b7eaf69b29cc3ad6418710c48428a676c5a93be"}}'
)

var pKeyAccount = new Account(
  "0x5afaab95e1dc68d0a3f00c9db00d52b4a6635b42",
  "privateKey",
  '{"version":3,"id":"b1903bc7-f3fa-4382-ba41-068012839ba2","address":"5afaab95e1dc68d0a3f00c9db00d52b4a6635b42","crypto":{"ciphertext":"5d10b2643cbb6b9a7f68e3e7450e9ce5caa8384e080b959a08d95c346a6f674a","cipherparams":{"iv":"f6b90bc0815f06782d98135f5547e0b6"},"cipher":"aes-128-ctr","kdf":"pbkdf2","kdfparams":{"dklen":32,"salt":"440efbdcf351bcb91240dae28ef3d9b7a2dbff56bc40d4d573d8ad2b39229bff","c":10240,"prf":"hmac-sha256"},"mac":"de8681fe19c316c0ba79a2809c27ff75836c995da78ac2feeaf7ac8bb6548948"}}'
)

var metaMaskAccount = new Account(
  "0x0de0f5606066b7730677bebea24709b70e333eef",
  "metamask",
  '{"version":3,"id":"504ca8f6-27d4-4c09-aaee-1285fe905666","address":"0de0f5606066b7730677bebea24709b70e333eef","crypto":{"ciphertext":"764f7e3fd89290e811ed54fa16da9eec8c5674f8aa1c23eb5525e9e0bc1d3f1c","cipherparams":{"iv":"15c323a2059650fe6d46b2c1d63d9883"},"cipher":"aes-128-ctr","kdf":"pbkdf2","kdfparams":{"dklen":32,"salt":"baf81e268e6083778ea2fa41d72ce71b14627539d064c78b2921d24c35d42be3","c":10240,"prf":"hmac-sha256"},"mac":"b2f206f1c2c2a205043192912b3b8f0aabec1831ec7bcbf9866e111ec38c6c33"}}'
)

const transferSuccess = {
  account: {},
  address:  "0x52249ee04a2860c42704c0bbc74bd82cb9b56e98",
  amount:  "0x38d7ea4c68000",
  data:  {
    amount:  "0.001",
    destAddress: "0x52249ee04A2860c42704c0bbC74bd82cb9b56e98",
    tokenSymbol: "ETH"
  },
  destAddress:  "0x52249ee04A2860c42704c0bbC74bd82cb9b56e98",
  ethereum:  ethereum,
  formId: "transfer",
  gas: "0xf4240",
  gasPrice: "0x5a817c800",
  // keyService: "",
  keystring: '{"version":3,"id":"34ae5306-f3bf-42d3-bb0e-ce2e0fe1821b","address":"52249ee04a2860c42704c0bbc74bd82cb9b56e98","crypto":{"ciphertext":"aa638616d99f6f7a11ba205cd8b6dc09f064511d92361736718ba86c61b50c9d","cipherparams":{"iv":"d6fc865281ac8ed91af38cf933e8b916"},"cipher":"aes-128-ctr","kdf":"pbkdf2","kdfparams":{"dklen":32,"salt":"d5358f4e1403c7c47f86b48f134b9e0fce57b3dd6eac726f0eed9e54d12735fe","c":10240,"prf":"hmac-sha256"},"mac":"086cab9258c953081d0d6f3ed077beca7ae6342229526a3fc8e3614d91e71636"}}',
  // nonce: 311,
  password: "123qwe",
  token: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  // type: "keystore",
}

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
// const signedTransaction = sealTxByKeystore(txParams, keystring, password);


export default {
  keystoreWrongPassphrase, ledgerSignError, perfectKeystore, 
  trezorSignError, ethereum, account, 
  ledgerAccount, trezorAccount, pKeyAccount, metaMaskAccount, transferSuccess
}