//import BigNumber from "bignumber.js"
import BLOCKCHAIN_INFO from "../../../env"
// abis
const ERC20 = [{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "minter", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "o_success", "type": "bool" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_recipient", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "createIlliquidToken", "outputs": [{ "name": "o_success", "type": "bool" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_recipient", "type": "address" }, { "name": "_amount", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "o_success", "type": "bool" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "endMintingTime", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_recipient", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "createToken", "outputs": [{ "name": "o_success", "type": "bool" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "illiquidBalance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_recipient", "type": "address" }, { "name": "_amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "o_success", "type": "bool" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "LOCKOUT_PERIOD", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" }], "name": "allowance", "outputs": [{ "name": "o_remaining", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "makeLiquid", "outputs": [], "payable": false, "type": "function" }, { "inputs": [{ "name": "_minter", "type": "address" }, { "name": "_endMintingTime", "type": "uint256" }], "payable": false, "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "_from", "type": "address" }, { "indexed": true, "name": "_recipient", "type": "address" }, { "indexed": false, "name": "_value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "_owner", "type": "address" }, { "indexed": true, "name": "_spender", "type": "address" }, { "indexed": false, "name": "_value", "type": "uint256" }], "name": "Approval", "type": "event" }]
const KYBER_NETWORK = [{ "constant": false, "inputs": [{ "name": "alerter", "type": "address" }], "name": "removeAlerter", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "enabled", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "pendingAdmin", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getOperators", "outputs": [{ "name": "", "type": "address[]" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "src", "type": "address" }, { "name": "srcAmount", "type": "uint256" }, { "name": "dest", "type": "address" }, { "name": "destAddress", "type": "address" }, { "name": "maxDestAmount", "type": "uint256" }, { "name": "minConversionRate", "type": "uint256" }, { "name": "walletId", "type": "address" }, { "name": "hint", "type": "bytes" }], "name": "tradeWithHint", "outputs": [{ "name": "", "type": "uint256" }], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [{ "name": "token", "type": "address" }, { "name": "srcAmount", "type": "uint256" }, { "name": "minConversionRate", "type": "uint256" }], "name": "swapTokenToEther", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "token", "type": "address" }, { "name": "amount", "type": "uint256" }, { "name": "sendTo", "type": "address" }], "name": "withdrawToken", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "maxGasPrice", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "newAlerter", "type": "address" }], "name": "addAlerter", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "kyberNetworkContract", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "user", "type": "address" }], "name": "getUserCapInWei", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "src", "type": "address" }, { "name": "srcAmount", "type": "uint256" }, { "name": "dest", "type": "address" }, { "name": "minConversionRate", "type": "uint256" }], "name": "swapTokenToToken", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "newAdmin", "type": "address" }], "name": "transferAdmin", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "claimAdmin", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "token", "type": "address" }, { "name": "minConversionRate", "type": "uint256" }], "name": "swapEtherToToken", "outputs": [{ "name": "", "type": "uint256" }], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [{ "name": "newAdmin", "type": "address" }], "name": "transferAdminQuickly", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "getAlerters", "outputs": [{ "name": "", "type": "address[]" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "src", "type": "address" }, { "name": "dest", "type": "address" }, { "name": "srcQty", "type": "uint256" }], "name": "getExpectedRate", "outputs": [{ "name": "expectedRate", "type": "uint256" }, { "name": "slippageRate", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "user", "type": "address" }, { "name": "token", "type": "address" }], "name": "getUserCapInTokenWei", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "newOperator", "type": "address" }], "name": "addOperator", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_kyberNetworkContract", "type": "address" }], "name": "setKyberNetworkContract", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "operator", "type": "address" }], "name": "removeOperator", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "field", "type": "bytes32" }], "name": "info", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "src", "type": "address" }, { "name": "srcAmount", "type": "uint256" }, { "name": "dest", "type": "address" }, { "name": "destAddress", "type": "address" }, { "name": "maxDestAmount", "type": "uint256" }, { "name": "minConversionRate", "type": "uint256" }, { "name": "walletId", "type": "address" }], "name": "trade", "outputs": [{ "name": "", "type": "uint256" }], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [{ "name": "amount", "type": "uint256" }, { "name": "sendTo", "type": "address" }], "name": "withdrawEther", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "token", "type": "address" }, { "name": "user", "type": "address" }], "name": "getBalance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "admin", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [{ "name": "_admin", "type": "address" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "trader", "type": "address" }, { "indexed": false, "name": "src", "type": "address" }, { "indexed": false, "name": "dest", "type": "address" }, { "indexed": false, "name": "actualSrcAmount", "type": "uint256" }, { "indexed": false, "name": "actualDestAmount", "type": "uint256" }], "name": "ExecuteTrade", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "newNetworkContract", "type": "address" }, { "indexed": false, "name": "oldNetworkContract", "type": "address" }], "name": "KyberNetworkSet", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "token", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" }, { "indexed": false, "name": "sendTo", "type": "address" }], "name": "TokenWithdraw", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "amount", "type": "uint256" }, { "indexed": false, "name": "sendTo", "type": "address" }], "name": "EtherWithdraw", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "pendingAdmin", "type": "address" }], "name": "TransferAdminPending", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "newAdmin", "type": "address" }, { "indexed": false, "name": "previousAdmin", "type": "address" }], "name": "AdminClaimed", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "newAlerter", "type": "address" }, { "indexed": false, "name": "isAdd", "type": "bool" }], "name": "AlerterAdded", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "newOperator", "type": "address" }, { "indexed": false, "name": "isAdd", "type": "bool" }], "name": "OperatorAdded", "type": "event" }]
const KYBER_WRAPPER = [{ "constant": true, "inputs": [{ "name": "x", "type": "bytes14" }, { "name": "byteInd", "type": "uint256" }], "name": "getInt8FromByte", "outputs": [{ "name": "", "type": "int8" }], "payable": false, "stateMutability": "pure", "type": "function" }, { "constant": true, "inputs": [{ "name": "reserve", "type": "address" }, { "name": "tokens", "type": "address[]" }], "name": "getBalances", "outputs": [{ "name": "", "type": "uint256[]" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "pricingContract", "type": "address" }, { "name": "tokenList", "type": "address[]" }], "name": "getTokenIndicies", "outputs": [{ "name": "", "type": "uint256[]" }, { "name": "", "type": "uint256[]" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "x", "type": "bytes14" }, { "name": "byteInd", "type": "uint256" }], "name": "getByteFromBytes14", "outputs": [{ "name": "", "type": "bytes1" }], "payable": false, "stateMutability": "pure", "type": "function" }, { "constant": true, "inputs": [{ "name": "network", "type": "address" }, { "name": "sources", "type": "address[]" }, { "name": "dests", "type": "address[]" }, { "name": "qty", "type": "uint256[]" }], "name": "getExpectedRates", "outputs": [{ "name": "", "type": "uint256[]" }, { "name": "", "type": "uint256[]" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "pricingContract", "type": "address" }, { "name": "tokenList", "type": "address[]" }], "name": "getTokenRates", "outputs": [{ "name": "", "type": "uint256[]" }, { "name": "", "type": "uint256[]" }, { "name": "", "type": "int8[]" }, { "name": "", "type": "int8[]" }, { "name": "", "type": "uint256[]" }], "payable": false, "stateMutability": "view", "type": "function" }]

const KYBER_SWAP_ABI = [{"constant":false,"inputs":[],"name":"enableTrade","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"alerter","type":"address"}],"name":"removeAlerter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"}],"name":"listToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"pendingAdmin","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getOperators","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"user","type":"address"},{"name":"concatenatedTokenAddresses","type":"uint256"},{"name":"nonce","type":"uint256"}],"name":"isValidNonce","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"srcToken","type":"address"},{"name":"destToken","type":"address"}],"name":"concatTokenAddresses","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[{"name":"nonce","type":"uint256"}],"name":"validAddressInNonce","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"amount","type":"uint256"},{"name":"sendTo","type":"address"}],"name":"withdrawToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newAlerter","type":"address"}],"name":"addAlerter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"nonces","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"disableTrade","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newAdmin","type":"address"}],"name":"transferAdmin","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"claimAdmin","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newAdmin","type":"address"}],"name":"transferAdminQuickly","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getAlerters","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"srcQty","type":"uint256"},{"name":"feeInPrecision","type":"uint256"}],"name":"deductFee","outputs":[{"name":"actualSrcQty","type":"uint256"},{"name":"feeInSrcTokenWei","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOperator","type":"address"}],"name":"addOperator","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"hash","type":"bytes32"},{"name":"v","type":"uint8"},{"name":"r","type":"bytes32"},{"name":"s","type":"bytes32"},{"name":"user","type":"address"}],"name":"verifySignature","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"user","type":"address"},{"name":"nonce","type":"uint256"},{"name":"srcToken","type":"address"},{"name":"srcQty","type":"uint256"},{"name":"destToken","type":"address"},{"name":"destAddress","type":"address"},{"name":"minConversionRate","type":"uint256"},{"name":"feeInPrecision","type":"uint256"},{"name":"v","type":"uint8"},{"name":"r","type":"bytes32"},{"name":"s","type":"bytes32"}],"name":"executeLimitOrder","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"operator","type":"address"}],"name":"removeOperator","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"MAX_DEST_AMOUNT","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"},{"name":"sendTo","type":"address"}],"name":"withdrawEther","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"tradeEnabled","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"kyberNetworkProxy","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"FEE_PRECISION","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"concatenatedTokenAddresses","type":"uint256"},{"name":"nonce","type":"uint256"}],"name":"invalidateOldOrders","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"admin","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_admin","type":"address"},{"name":"_kyberNetworkProxy","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"user","type":"address"},{"indexed":false,"name":"nonce","type":"uint256"},{"indexed":false,"name":"srcToken","type":"address"},{"indexed":false,"name":"actualSrcQty","type":"uint256"},{"indexed":false,"name":"destToken","type":"address"},{"indexed":false,"name":"destAddress","type":"address"},{"indexed":false,"name":"feeInSrcTokenWei","type":"uint256"}],"name":"LimitOrderExecute","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"user","type":"address"},{"indexed":false,"name":"concatenatedTokenAddresses","type":"uint256"},{"indexed":false,"name":"nonce","type":"uint256"}],"name":"NonceUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"user","type":"address"},{"indexed":false,"name":"concatenatedTokenAddresses","type":"uint256"},{"indexed":false,"name":"nonce","type":"uint256"}],"name":"OldOrdersInvalidated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"token","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"sendTo","type":"address"}],"name":"TokenWithdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"sendTo","type":"address"}],"name":"EtherWithdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"pendingAdmin","type":"address"}],"name":"TransferAdminPending","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newAdmin","type":"address"},{"indexed":false,"name":"previousAdmin","type":"address"}],"name":"AdminClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newAlerter","type":"address"},{"indexed":false,"name":"isAdd","type":"bool"}],"name":"AlerterAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newOperator","type":"address"},{"indexed":false,"name":"isAdd","type":"bool"}],"name":"OperatorAdded","type":"event"}]

// contract datas
// compiled with v0.4.11+commit.68ef5810
const TRANSFER_TOPIC = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
// constants
const MIN_ACCEPT_DELTA = 0.0001
const EPSILON = 1000000000000000
const RATE_EPSILON = 0.002
const MAX_CAP_PERCENT = 0.95
const MAX_CAP_ONE_EXCHANGE_BASE_VALUE = "10000000000000000000" //10 ETH
const MAX_CAP_ONE_EXCHANGE_BASE_RESERVE = 0.5 //50% 



// const NODE_ENDPOINT = "https://kovan.kyber.network"
const ETHER_ADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
// var secondKey = Object.keys(BLOCKCHAIN_INFO.tokens)[1]

var secondKey = "KNC"

const INIT_EXCHANGE_FORM_STATE = {
  isOpenImportAcount: false,
  kyber_enabled: false,
  advanced: false,
  termAgree: true,
  passphrase: false,
  selected: false,
  isSelectToken: false,
  sourceToken: ETHER_ADDRESS,
  sourceTokenSymbol: "ETH",
  sourceAmount: "",
  destAmount: "",
  destToken: BLOCKCHAIN_INFO.tokens[secondKey].address,
  destTokenSymbol: secondKey,
  destAddress: "",
  inputFocus: "source",
  maxCap: "infinity",
  minConversionRate: 0,
  minDestAmount: 0,
  maxDestAmount: 0,
  prevAmount: 0,
  offeredRate: 0,
  isEditRate: false,
  slippageRate: 0,
  blockNo: 0,
  percentChange: 0,

  throwOnFailure: "0x0000000000000000000000000000000000000000",
  gas: 380000,
  max_gas: 380000,

  gas_approve: 0,
  max_gas_approve: 120000,

  //max_gas_total: 430000,

  isFetchingGas: false,
  gasPrice: 20,
  selectedGas: 'f',
  gasPriceSuggest: {
    fastGas: 20,
    standardGas: 20,
    safeLowGas: 20,
    fastTime: 2, //minutes
    standardTime: 5,
    lowTime: 30
  },
  maxGasPrice: 50,
  isEditGasPrice: false,
  step: 2,
  broadcasting: true,
  bcError: "",
  txHash: "",
  tempTx: {},
  txApprove: false,
  confirmApprove: false,
  confirmApproveZero: false,
  isConfirming: false,
  isApproving: false,
  isApprovingZero: false,
  confirmColdWallet: false,
  signError: "",
  broadcastError: "",
  balanceData: {
    sourceName: "Ether",
    sourceSymbol: "ETH",
    sourceDecimal: 18,
    destName: "Kyber",
    destSymbol: "KNC",
    destDecimal: 18,
    sourceAmount: 0,
    destAmount: 0
  },
  errors: {
    selectSameToken: '',
    selectTokenToken: '',
    sourceAmountError: '',
    gasPriceError: '',
    gasError: '',
    passwordError: '',
    signTransaction: '',
    rateError: '',
    rateAmount: '',
    rateSystem: '',
    ethBalanceError: '',
    exchange_enable: ''
  },
  errorNotPossessKgt: '',
  customRateInput: {
    isError: false,
    isDirty: false,
    value: ""
  },
  isAnalize: false,
  isAnalizeComplete: false,
  analizeError: {},
  snapshot: {},
  isBalanceActive: false,
  isAdvanceActive: false,
  isOpenAdvance: false,
  isSelectTokenBalance: false,
  swappingTime: 0
}

const INIT_TRANSFER_FORM_STATE = {
  isOpenImportAcount: false,
  advanced: false,
  termAgree: true,
  passphrase: false,
  selected: false,
  token: ETHER_ADDRESS,
  tokenSymbol: "ETH",
  amount: "",
  destAddress: "",
  throwOnFailure: "0x0000000000000000000000000000000000000000",
  gas: 21000,
  gas_limit: 150000,
  isFetchingGas: false,
  gasPrice: 20,
  selectedGas: 'f',
  gasPriceSuggest: {
    fastGas: 20,
    standardGas: 20,
    safeLowGas: 20,

    fastTime: 2, //minutes
    standardTime: 5,
    lowTime: 30
  },
  maxGasPrice: 50,
  isEditGasPrice: false,
  step: 1,
  broadcasting: true,
  bcError: "",
  txHash: "",
  tempTx: {},
  isConfirming: false,
  confirmColdWallet: false,
  signError: "",
  broadcastError: "",
  balanceData: {
    tokenName: "Ether",
    tokenSymbol: "ETH",
    tokenDecimal: 18,
    prev: 0,
    next: 0
  },
  errors: {
    gasPrice: '',
    destAddress: '',
    amountTransfer: '',
    passwordError: '',
    signTransaction: '',
    ethBalanceError: ''
  },
  snapshot: {},
  isBalanceActive: false,
  isAdvanceActive: false,
  isOpenAdvance: false,
  isSelectTokenBalance: false
}



const LIMIT_ORDER_CONFIG = {
  path: "limit_order",
  maxFee: 0.5,
  maxPercentTriggerRate: 50,
  orderPath: {
    approveZero: 1,
    approveMax: 2,
    wrapETH: 3,
    confirmSubmitOrder: 4,
    submitStatusOrder: 5
  }
}

const SIGN_OFF_WALLETS = ["private_key", "promo", "keystore"]

const INIT_LIMIT_ORDER_STATE = {
  isOpenImportAcount: false,
  kyber_enabled: false,
  advanced: false,
  termAgree: true,
  passphrase: false,
  selected: false,
  isSelectToken: false,
  sourceToken: ETHER_ADDRESS,
  sourceTokenSymbol: "ETH",
  sourceAmount: "",
  destAmount: "",
  destToken: BLOCKCHAIN_INFO.tokens[secondKey].address,
  destTokenSymbol: secondKey,
  destAddress: "",
  inputFocus: "source",
  maxCap: "infinity",
  minConversionRate: 0,
  triggerRate: 0,
  minDestAmount: 0,
  maxDestAmount: 0,
  prevAmount: 0,
  offeredRate: 0,
  isEditRate: false,
  slippageRate: 0,
  blockNo: 0,
  
  orderFee: LIMIT_ORDER_CONFIG.maxFee, 
  isFetchingFee: false,
  orderFeeErr: "",

  // currentPath : 0,
  currentPathIndex : -1,
  orderPath: [],  
  pendingNonce: 0,

  listOrder: [
    {  
      id: "1209",
      source: "KNC",
      dest: "DAI",
      address: "0x3Cf628d49Ae46b49b210F0521Fbd9F82B461A9E1",
      nonce: 1290,
      src_amount: 2000,
      min_rate: 0.5321,
      fee: 0.5,
      status: "active",
      created_time: 1556784881,
      cancel_time: 1556784882
    },
    {  
      id: "1210",
      source: "KNC",
      dest: "OMG",
      address: "0x3Cf628d49Ae46b49b210F0521Fbd9F82B461A9E1",
      nonce: 1290,
      src_amount: 2000,
      min_rate: 0.5321,
      fee: 0.5,
      status: "active",
      created_time: 1556784881,
      cancel_time: 1556784882
    }
  ],

  throwOnFailure: "0x0000000000000000000000000000000000000000",
  gas: 380000,
  max_gas: 380000,

  gas_approve: 0,
  max_gas_approve: 120000,

  //max_gas_total: 430000,

  isFetchingGas: false,
  gasPrice: 20,
  selectedGas: 'f',
  gasPriceSuggest: {
    fastGas: 20,
    standardGas: 20,
    safeLowGas: 20,
    fastTime: 2, //minutes
    standardTime: 5,
    lowTime: 30
  },
  maxGasPrice: 50,
  isEditGasPrice: false,
  step: 2,
  broadcasting: true,
  bcError: "",
  txHash: "",
  tempTx: {},
  txApprove: false,
  confirmApprove: false,
  confirmApproveZero: false,
  isConfirming: false,
  isApproving: false,
  isApprovingZero: false,
  confirmColdWallet: false,
  signError: "",
  broadcastError: "",
  balanceData: {
    sourceName: "Ether",
    sourceSymbol: "ETH",
    sourceDecimal: 18,
    destName: "Kyber",
    destSymbol: "KNC",
    destDecimal: 18,
    sourceAmount: 0,
    destAmount: 0
  },
  errors: {
    selectSameToken: '',
    selectTokenToken: '',
    sourceAmountError: '',
    triggerRateError: '',
    rateETHEqualZero: '',
    balanceError: '',

    gasPriceError: '',
    gasError: '',
    passwordError: '',
    signTransaction: '',
    rateError: '',
    rateAmount: '',
    rateSystem: '',
    ethBalanceError: '',
    exchange_enable: ''
  },
  errorNotPossessKgt: '',
  customRateInput: {
    isError: false,
    isDirty: false,
    value: ""
  },
  isAnalize: false,
  isAnalizeComplete: false,
  analizeError: {},
  snapshot: {},
  isBalanceActive: false,
  isAdvanceActive: false,
  isOpenAdvance: false,
  isSelectTokenBalance: false,
  swappingTime: 0
}


// reserves
const RESERVES = [{ index: 0, name: "Kyber official reserve" }]

const ETH = {
  name: "Ether",
  symbol: "ETH",
  icon: "/img/ether.png",
  address: ETHER_ADDRESS,
  MAX_AMOUNT: 1000
};

const IDLE_TIME_OUT = 900
const TOKEN_CHART_INTERVAL = 300000;

const HISTORY_EXCHANGE = {
  page: 0,
  itemPerPage: 5,
  currentBlock: 0,
  eventsCount: 0,
  isFetching: false,
  logsEth: [],
  logsToken: [],
  logs: []
}

const CONNECTION_CHECKER = {
  count: 0,
  maxCount: 2,
  isCheck: true
}

const LIST_PARAMS_SUPPORTED = [{ key: 'lang', default: 'en' }, { key: 'ref' }]

const CONFIG_ENV_LEDGER_LINK = "https://support.ledgerwallet.com/hc/en-us/articles/115005165269-What-if-Ledger-Wallet-is-not-recognized-on-Linux-"
const LEDGER_SUPPORT_LINK = "https://support.ledgerwallet.com/hc/en-us"

const BASE_HOST = ""

const ASSET_URL = 'https://files.kyber.network/DesignAssets/';

const STORAGE_KEY = "130"
const TRADE_TOPIC = "0xd30ca399cb43507ecec6a629a35cf45eb98cda550c27696dcb0d8c4a3873ce6c"
const PERM_HINT = "PERM"
const CONNECTION_TIMEOUT = 3000
const COMMISSION_ADDR = "0x440bBd6a888a36DE6e2F6A25f65bc4e16874faa9"



module.exports = {
  ERC20, KYBER_NETWORK, KYBER_WRAPPER, EPSILON, ETHER_ADDRESS, ETH, RESERVES,
  INIT_EXCHANGE_FORM_STATE, INIT_TRANSFER_FORM_STATE, ASSET_URL,
  RATE_EPSILON, IDLE_TIME_OUT, HISTORY_EXCHANGE, STORAGE_KEY, CONNECTION_CHECKER,
  MAX_CAP_ONE_EXCHANGE_BASE_VALUE, MAX_CAP_ONE_EXCHANGE_BASE_RESERVE, MAX_CAP_PERCENT, CONFIG_ENV_LEDGER_LINK, LEDGER_SUPPORT_LINK, TRANSFER_TOPIC, BASE_HOST, LIST_PARAMS_SUPPORTED,
  TRADE_TOPIC, PERM_HINT, MIN_ACCEPT_DELTA, CONNECTION_TIMEOUT, COMMISSION_ADDR, INIT_LIMIT_ORDER_STATE, LIMIT_ORDER_CONFIG, SIGN_OFF_WALLETS, KYBER_SWAP_ABI
}
