var Web3 = require("web3")
var BigNumber = require("bignumber.js")
const constants = {
    ERC20: [{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "minter", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "o_success", "type": "bool" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_recipient", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "createIlliquidToken", "outputs": [{ "name": "o_success", "type": "bool" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_recipient", "type": "address" }, { "name": "_amount", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "o_success", "type": "bool" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "endMintingTime", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_recipient", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "createToken", "outputs": [{ "name": "o_success", "type": "bool" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "illiquidBalance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_recipient", "type": "address" }, { "name": "_amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "o_success", "type": "bool" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "LOCKOUT_PERIOD", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" }], "name": "allowance", "outputs": [{ "name": "o_remaining", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "makeLiquid", "outputs": [], "payable": false, "type": "function" }, { "inputs": [{ "name": "_minter", "type": "address" }, { "name": "_endMintingTime", "type": "uint256" }], "payable": false, "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "_from", "type": "address" }, { "indexed": true, "name": "_recipient", "type": "address" }, { "indexed": false, "name": "_value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "_owner", "type": "address" }, { "indexed": true, "name": "_spender", "type": "address" }, { "indexed": false, "name": "_value", "type": "uint256" }], "name": "Approval", "type": "event" }],
    KYBER_NETWORK: [{ "constant": false, "inputs": [{ "name": "alerter", "type": "address" }], "name": "removeAlerter", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "enabled", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "pendingAdmin", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getOperators", "outputs": [{ "name": "", "type": "address[]" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "src", "type": "address" }, { "name": "srcAmount", "type": "uint256" }, { "name": "dest", "type": "address" }, { "name": "destAddress", "type": "address" }, { "name": "maxDestAmount", "type": "uint256" }, { "name": "minConversionRate", "type": "uint256" }, { "name": "walletId", "type": "address" }, { "name": "hint", "type": "bytes" }], "name": "tradeWithHint", "outputs": [{ "name": "", "type": "uint256" }], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [{ "name": "token", "type": "address" }, { "name": "srcAmount", "type": "uint256" }, { "name": "minConversionRate", "type": "uint256" }], "name": "swapTokenToEther", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "token", "type": "address" }, { "name": "amount", "type": "uint256" }, { "name": "sendTo", "type": "address" }], "name": "withdrawToken", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "maxGasPrice", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "newAlerter", "type": "address" }], "name": "addAlerter", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "kyberNetworkContract", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "user", "type": "address" }], "name": "getUserCapInWei", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "src", "type": "address" }, { "name": "srcAmount", "type": "uint256" }, { "name": "dest", "type": "address" }, { "name": "minConversionRate", "type": "uint256" }], "name": "swapTokenToToken", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "newAdmin", "type": "address" }], "name": "transferAdmin", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "claimAdmin", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "token", "type": "address" }, { "name": "minConversionRate", "type": "uint256" }], "name": "swapEtherToToken", "outputs": [{ "name": "", "type": "uint256" }], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [{ "name": "newAdmin", "type": "address" }], "name": "transferAdminQuickly", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "getAlerters", "outputs": [{ "name": "", "type": "address[]" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "src", "type": "address" }, { "name": "dest", "type": "address" }, { "name": "srcQty", "type": "uint256" }], "name": "getExpectedRate", "outputs": [{ "name": "expectedRate", "type": "uint256" }, { "name": "slippageRate", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "user", "type": "address" }, { "name": "token", "type": "address" }], "name": "getUserCapInTokenWei", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "newOperator", "type": "address" }], "name": "addOperator", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_kyberNetworkContract", "type": "address" }], "name": "setKyberNetworkContract", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "operator", "type": "address" }], "name": "removeOperator", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "field", "type": "bytes32" }], "name": "info", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "src", "type": "address" }, { "name": "srcAmount", "type": "uint256" }, { "name": "dest", "type": "address" }, { "name": "destAddress", "type": "address" }, { "name": "maxDestAmount", "type": "uint256" }, { "name": "minConversionRate", "type": "uint256" }, { "name": "walletId", "type": "address" }], "name": "trade", "outputs": [{ "name": "", "type": "uint256" }], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [{ "name": "amount", "type": "uint256" }, { "name": "sendTo", "type": "address" }], "name": "withdrawEther", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "token", "type": "address" }, { "name": "user", "type": "address" }], "name": "getBalance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "admin", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [{ "name": "_admin", "type": "address" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "trader", "type": "address" }, { "indexed": false, "name": "src", "type": "address" }, { "indexed": false, "name": "dest", "type": "address" }, { "indexed": false, "name": "actualSrcAmount", "type": "uint256" }, { "indexed": false, "name": "actualDestAmount", "type": "uint256" }], "name": "ExecuteTrade", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "newNetworkContract", "type": "address" }, { "indexed": false, "name": "oldNetworkContract", "type": "address" }], "name": "KyberNetworkSet", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "token", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" }, { "indexed": false, "name": "sendTo", "type": "address" }], "name": "TokenWithdraw", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "amount", "type": "uint256" }, { "indexed": false, "name": "sendTo", "type": "address" }], "name": "EtherWithdraw", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "pendingAdmin", "type": "address" }], "name": "TransferAdminPending", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "newAdmin", "type": "address" }, { "indexed": false, "name": "previousAdmin", "type": "address" }], "name": "AdminClaimed", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "newAlerter", "type": "address" }, { "indexed": false, "name": "isAdd", "type": "bool" }], "name": "AlerterAdded", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "newOperator", "type": "address" }, { "indexed": false, "name": "isAdd", "type": "bool" }], "name": "OperatorAdded", "type": "event" }],
    ETH: {
      address:"0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
    }
  }

var rpcUrl  = "https://mainnet.infura.io"
var rpc = new Web3(new Web3.providers.HttpProvider(rpcUrl, 9000))

var kyberAddress = "0xc14f34233071543e979f6a79aa272b0ab1b4947d"
// var kyberAddress = "0x818e6fecd516ecc3849daf6845e3ec868087b755"
var networkContract = new rpc.eth.Contract(constants.KYBER_NETWORK, kyberAddress)

var erc20Contract = new rpc.eth.Contract(constants.ERC20)

async function estimateGas(sourceAmount){

    var from = "0x3cf628d49ae46b49b210f0521fbd9f82b461a9e1"
    
    var sourceToken = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
    var destToken = "0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359"
    var destAddress = "0x3cf628d49ae46b49b210f0521fbd9f82b461a9e1"
    var maxDestAmount = "0x8000000000000000000000000000000000000000000000000000000000000000"
    var minConversionRate = 0
    var walletId = "0x0000000000000000000000000000000000000000"
    var hint = rpc.utils.utf8ToHex("PERM")

    var data = networkContract.methods.tradeWithHint(
        sourceToken, sourceAmount, destToken, destAddress,
        maxDestAmount, minConversionRate, walletId, hint).encodeABI()

    var txObj = {
        from: from,
        to: kyberAddress,
        data: data,
        value: sourceAmount
    }
    try {
        var gas = await rpc.eth.estimateGas(txObj)
        // console.log(gas)
        return gas
    }catch(e){
        console.log(e)
        console.log(sourceAmount)
        return 0
    }
    
}

async function estimateGasFromTokenToEther(sourceAmount){

    var from = "0x3cf628d49ae46b49b210f0521fbd9f82b461a9e1"
    
    var sourceToken = "0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359"
    var destToken = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
    var destAddress = "0x3cf628d49ae46b49b210f0521fbd9f82b461a9e1"
    var maxDestAmount = "0x8000000000000000000000000000000000000000000000000000000000000000"
    var minConversionRate = 0
    var walletId = "0x0000000000000000000000000000000000000000"
    var hint = rpc.utils.utf8ToHex("PERM")

    var data = networkContract.methods.tradeWithHint(
        sourceToken, sourceAmount, destToken, destAddress,
        maxDestAmount, minConversionRate, walletId, hint).encodeABI()

    var txObj = {
        from: from,
        to: kyberAddress,
        data: data,
        value: "0x0"
    }
    try {
        var gas = await rpc.eth.estimateGas(txObj)
        // console.log(gas)
        return gas
    }catch(e){
        console.log(e)
        console.log(sourceAmount)
        return 0
    }
    
}

function toTWei(number, decimal = 18) {    
    var bigNumber = new BigNumber(number.toString())
    return bigNumber.times(Math.pow(10, decimal)).toFixed(0).toString(16)
  }

async function main() {
    var tradeSize = [1, 2, 5, 10, 15, 20, 50, 100, 120, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 700, 900]

    // var tradeSize = [1]
    var gasList = []    
    for (var i = 0; i < tradeSize.length; i++) {
        var amount = toTWei(tradeSize[i])
        var gas = await estimateGas(amount)
        gasList.push([amount, gas])        
    }
    console.log(gasList)
}

main()